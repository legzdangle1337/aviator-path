import { Link } from "react-router-dom";
import { MessageSquare, ExternalLink, Youtube, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UpvoteButton } from "./UpvoteButton";
import { formatDistanceToNow } from "date-fns";

interface CommunityPostCardProps {
  post: any;
  isUpvoted: boolean;
}

export function CommunityPostCard({ post, isUpvoted }: CommunityPostCardProps) {
  const profile = post.profile;
  const category = post.community_categories;
  const displayName = profile?.first_name
    ? `${profile.first_name}${profile.last_name ? ` ${profile.last_name[0]}.` : ""}`
    : profile?.username || "Pilot";
  const initials = profile
    ? `${(profile.first_name || "")[0] || ""}${(profile.last_name || "")[0] || ""}`.toUpperCase() || "U"
    : "U";

  const linkIcon = post.link_type === "youtube" ? <Youtube className="h-4 w-4" /> :
    post.link_type === "image" ? <ImageIcon className="h-4 w-4" /> :
    post.link_url ? <ExternalLink className="h-4 w-4" /> : null;

  return (
    <div className="flex gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors">
      <UpvoteButton postId={post.id} count={post.upvote_count || 0} isUpvoted={isUpvoted} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 flex-wrap">
          {category && (
            <Link to={`/community?category=${category.slug}`} className="hover:text-foreground">
              <Badge variant="secondary" className="text-xs font-normal gap-1">
                <span>{category.icon}</span> {category.name}
              </Badge>
            </Link>
          )}
          <span>·</span>
          <div className="flex items-center gap-1">
            <Avatar className="h-4 w-4">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-[8px] bg-primary text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <span>{displayName}</span>
          </div>
          <span>·</span>
          <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
          {post.is_pinned && (
            <>
              <span>·</span>
              <Badge variant="outline" className="text-xs text-[hsl(var(--gold))] border-[hsl(var(--gold))]">📌 Pinned</Badge>
            </>
          )}
        </div>

        <Link to={`/community/${post.id}`} className="block group">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          {post.body && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.body}</p>
          )}
        </Link>

        {post.link_url && (
          <a
            href={post.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
          >
            {linkIcon}
            <span className="truncate max-w-[200px]">
              {(() => { try { return new URL(post.link_url).hostname; } catch { return post.link_url; } })()}
            </span>
          </a>
        )}

        <div className="flex items-center gap-4 mt-2">
          <Link to={`/community/${post.id}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <MessageSquare className="h-4 w-4" />
            <span>{post.comment_count || 0} comments</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
