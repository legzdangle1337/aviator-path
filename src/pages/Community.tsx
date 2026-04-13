import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCommunityCategories, useCommunityPosts, useUserUpvotes } from "@/hooks/useCommunity";
import { CommunityPostCard } from "@/components/community/CommunityPostCard";
import { CreatePostForm } from "@/components/community/CreatePostForm";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Users, TrendingUp, Clock } from "lucide-react";

export default function CommunityPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || undefined;
  const [sort, setSort] = useState<"newest" | "top">("newest");

  const { data: categories, isLoading: catLoading } = useCommunityCategories();
  const { data: posts, isLoading: postsLoading } = useCommunityPosts(activeCategory, sort);
  const postIds = posts?.map((p) => p.id) || [];
  const { data: upvotes } = useUserUpvotes(postIds);

  const upvotedPostIds = new Set(upvotes?.map((u) => u.post_id).filter(Boolean) || []);

  const setCategory = (slug?: string) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  const activeLabel = categories?.find((c) => c.slug === activeCategory);

  return (
    <>
      <Helmet>
        <title>Community | Aviator Path — Connect with Student Pilots</title>
        <meta name="description" content="Join the Aviator Path community. Ask questions, share experiences, and connect with fellow student pilots on their journey to the airlines." />
      </Helmet>
      <Navbar />

      <main className="min-h-screen bg-[hsl(var(--surface))]">
        {/* Hero */}
        <div className="bg-[hsl(var(--navy))] text-white py-10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-7 w-7 text-[hsl(var(--gold))]" />
              <h1 className="text-2xl md:text-3xl font-bold">Community</h1>
            </div>
            <p className="text-white/70 max-w-xl">
              Ask questions, share your journey, and connect with fellow student pilots and aviation professionals.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar — categories */}
            <aside className="lg:w-56 shrink-0">
              <div className="lg:sticky lg:top-20 space-y-2">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Categories</h2>
                <button
                  onClick={() => setCategory(undefined)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    !activeCategory ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                  )}
                >
                  All Posts
                </button>
                {catLoading
                  ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-9 w-full rounded-lg" />)
                  : categories?.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.slug)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                          activeCategory === cat.slug
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
              </div>
            </aside>

            {/* Main feed */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* Create post */}
              <CreatePostForm
                defaultCategory={
                  activeCategory
                    ? categories?.find((c) => c.slug === activeCategory)?.id
                    : undefined
                }
              />

              {/* Sort */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSort("newest")}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                    sort === "newest" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Clock className="h-3 w-3" /> Newest
                </button>
                <button
                  onClick={() => setSort("top")}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                    sort === "top" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <TrendingUp className="h-3 w-3" /> Top
                </button>
                {activeLabel && (
                  <Badge variant="secondary" className="ml-auto">
                    {activeLabel.icon} {activeLabel.name}
                  </Badge>
                )}
              </div>

              {/* Posts */}
              {postsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 bg-card border border-border rounded-lg space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                ))
              ) : posts?.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No posts yet</p>
                  <p className="text-sm mt-1">Be the first to start a conversation!</p>
                </div>
              ) : (
                posts?.map((post) => (
                  <CommunityPostCard
                    key={post.id}
                    post={post}
                    isUpvoted={upvotedPostIds.has(post.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
