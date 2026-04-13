import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCommunityPost, useCommunityComments, useUserUpvotes } from "@/hooks/useCommunity";
import { UpvoteButton } from "@/components/community/UpvoteButton";
import { CommentThread } from "@/components/community/CommentThread";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function YouTubeEmbed({ url }: { url: string }) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (!match) return null;
  return (
    <div className="aspect-video rounded-lg overflow-hidden mt-3">
      <iframe
        src={`https://www.youtube.com/embed/${match[1]}`}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video"
      />
    </div>
  );
}

function ImageEmbed({ url }: { url: string }) {
  return (
    <div className="mt-3 rounded-lg overflow-hidden">
      <img src={url} alt="Post attachment" className="max-h-[500px] w-auto rounded-lg" />
    </div>
  );
}

export default function CommunityPostPage() {
  const { postId } = useParams();
  const { data: post, isLoading } = useCommunityPost(postId);
  const { data: comments, isLoading: commentsLoading } = useCommunityComments(postId);
  const { data: upvotes } = useUserUpvotes(postId ? [postId] : []);

  const isUpvoted = upvotes?.some((u) => u.post_id === postId) || false;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[hsl(var(--surface))]">
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[hsl(var(--surface))] flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium">Post not found</p>
            <Link to="/community" className="text-primary hover:underline mt-2 inline-block">Back to Community</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const profile = post.profile as any;
  const category = post.community_categories as any;
  const displayName = profile?.first_name
    ? `${profile.first_name}${profile.last_name ? ` ${profile.last_name[0]}.` : ""}`
    : profile?.username || "Pilot";
  const initials = `${(profile?.first_name || "")[0] || ""}${(profile?.last_name || "")[0] || ""}`.toUpperCase() || "U";

  return (
    <>
      <Helmet>
        <title>{post.title} | Community | Aviator Path</title>
      </Helmet>
      <Navbar />

      <main className="min-h-screen bg-[hsl(var(--surface))]">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link to="/community" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Community
          </Link>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex gap-4">
              <UpvoteButton postId={post.id} count={post.upvote_count || 0} isUpvoted={isUpvoted} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 flex-wrap">
                  {category && (
                    <Link to={`/community?category=${category.slug}`}>
                      <Badge variant="secondary" className="text-xs gap-1">
                        <span>{category.icon}</span> {category.name}
                      </Badge>
                    </Link>
                  )}
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-[8px] bg-primary text-primary-foreground">{initials}</AvatarFallback>
                    </Avatar>
                    <span>{displayName}</span>
                  </div>
                  <span>·</span>
                  <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                </div>

                <h1 className="text-xl font-bold text-foreground mb-3">{post.title}</h1>

                {post.body && (
                  <div className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">{post.body}</div>
                )}

                {post.link_url && post.link_type === "youtube" && <YouTubeEmbed url={post.link_url} />}
                {post.link_url && post.link_type === "image" && <ImageEmbed url={post.link_url} />}
                {post.link_url && post.link_type === "link" && (
                  <a
                    href={post.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {post.link_url}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="mt-6 bg-card border border-border rounded-lg p-6">
            <h2 className="font-semibold text-foreground mb-4">
              {post.comment_count || 0} Comment{(post.comment_count || 0) !== 1 ? "s" : ""}
            </h2>
            {commentsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <CommentThread comments={comments || []} postId={post.id} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
