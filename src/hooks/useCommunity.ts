import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useCommunityCategories() {
  return useQuery({
    queryKey: ["community-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_categories")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });
}

async function enrichPostsWithProfiles(posts: any[]) {
  if (!posts.length) return posts;
  const userIds = [...new Set(posts.map((p) => p.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, avatar_url, username")
    .in("id", userIds);
  const profileMap = new Map((profiles || []).map((p) => [p.id, p]));
  return posts.map((p) => ({ ...p, profile: profileMap.get(p.user_id) || null }));
}

async function enrichCommentsWithProfiles(comments: any[]) {
  if (!comments.length) return comments;
  const userIds = [...new Set(comments.map((c) => c.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, avatar_url, username")
    .in("id", userIds);
  const profileMap = new Map((profiles || []).map((p) => [p.id, p]));
  return comments.map((c) => ({ ...c, profile: profileMap.get(c.user_id) || null }));
}

export function useCommunityPosts(categorySlug?: string, sort: "newest" | "top" = "newest") {
  return useQuery({
    queryKey: ["community-posts", categorySlug, sort],
    queryFn: async () => {
      let query = supabase
        .from("community_posts")
        .select(`*, community_categories(name, slug, icon)`);

      if (categorySlug) {
        const { data: cat } = await supabase
          .from("community_categories")
          .select("id")
          .eq("slug", categorySlug)
          .single();
        if (cat) query = query.eq("category_id", cat.id);
      }

      if (sort === "top") {
        query = query.order("upvote_count", { ascending: false });
      } else {
        query = query.order("is_pinned", { ascending: false }).order("created_at", { ascending: false });
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return enrichPostsWithProfiles(data || []);
    },
  });
}

export function useCommunityPost(postId: string | undefined) {
  return useQuery({
    queryKey: ["community-post", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select(`*, community_categories(name, slug, icon)`)
        .eq("id", postId!)
        .single();
      if (error) throw error;
      const enriched = await enrichPostsWithProfiles([data]);
      return enriched[0];
    },
    enabled: !!postId,
  });
}

export function useCommunityComments(postId: string | undefined) {
  return useQuery({
    queryKey: ["community-comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_comments")
        .select(`*`)
        .eq("post_id", postId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return enrichCommentsWithProfiles(data || []);
    },
    enabled: !!postId,
  });
}

export function useUserUpvotes(postIds: string[]) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["community-upvotes", user?.id, postIds],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("community_upvotes")
        .select("post_id, comment_id")
        .eq("user_id", user.id)
        .in("post_id", postIds);
      if (error) throw error;
      return data;
    },
    enabled: !!user && postIds.length > 0,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (post: { title: string; body?: string; category_id: string; link_url?: string; link_type?: string }) => {
      const { data, error } = await supabase
        .from("community_posts")
        .insert({ ...post, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (comment: { post_id: string; body: string; parent_comment_id?: string }) => {
      const { data, error } = await supabase
        .from("community_comments")
        .insert({ ...comment, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["community-comments", vars.post_id] });
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      queryClient.invalidateQueries({ queryKey: ["community-post"] });
    },
  });
}

export function useToggleUpvote() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, commentId, isUpvoted }: { postId?: string; commentId?: string; isUpvoted: boolean }) => {
      if (isUpvoted) {
        let query = supabase.from("community_upvotes").delete().eq("user_id", user!.id);
        if (postId) query = query.eq("post_id", postId);
        if (commentId) query = query.eq("comment_id", commentId);
        const { error } = await query;
        if (error) throw error;

        if (postId) {
          const { data: post } = await supabase.from("community_posts").select("upvote_count").eq("id", postId).single();
          if (post) {
            await supabase.from("community_posts").update({ upvote_count: Math.max(0, (post.upvote_count || 0) - 1) }).eq("id", postId);
          }
        }
      } else {
        const { error } = await supabase.from("community_upvotes").insert({
          user_id: user!.id,
          post_id: postId || null,
          comment_id: commentId || null,
        });
        if (error) throw error;

        if (postId) {
          const { data: post } = await supabase.from("community_posts").select("upvote_count").eq("id", postId).single();
          if (post) {
            await supabase.from("community_posts").update({ upvote_count: (post.upvote_count || 0) + 1 }).eq("id", postId);
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      queryClient.invalidateQueries({ queryKey: ["community-post"] });
      queryClient.invalidateQueries({ queryKey: ["community-upvotes"] });
    },
  });
}
