import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateComment } from "@/hooks/useCommunity";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id: string | null;
  body: string;
  upvote_count: number;
  created_at: string;
  profile: { first_name: string | null; last_name: string | null; avatar_url: string | null; username: string | null } | null;
}

interface CommentThreadProps {
  comments: Comment[];
  postId: string;
}

function buildTree(comments: Comment[]): (Comment & { children: Comment[] })[] {
  const map = new Map<string, Comment & { children: Comment[] }>();
  const roots: (Comment & { children: Comment[] })[] = [];

  comments.forEach((c) => map.set(c.id, { ...c, children: [] }));
  comments.forEach((c) => {
    const node = map.get(c.id)!;
    if (c.parent_comment_id && map.has(c.parent_comment_id)) {
      map.get(c.parent_comment_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

function CommentNode({ comment, postId, depth = 0 }: { comment: Comment & { children: Comment[] }; postId: string; depth?: number }) {
  const { user } = useAuth();
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const createComment = useCreateComment();

  const profile = comment.profile;
  const displayName = profile?.first_name
    ? `${profile.first_name}${profile.last_name ? ` ${profile.last_name[0]}.` : ""}`
    : profile?.username || "Pilot";
  const initials = `${(profile?.first_name || "")[0] || ""}${(profile?.last_name || "")[0] || ""}`.toUpperCase() || "U";

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await createComment.mutateAsync({
        post_id: postId,
        body: replyText.trim(),
        parent_comment_id: comment.id,
      });
      setReplyText("");
      setReplying(false);
      toast.success("Reply added!");
    } catch {
      toast.error("Failed to add reply");
    }
  };

  return (
    <div className={depth > 0 ? "ml-6 border-l-2 border-border pl-4" : ""}>
      <div className="py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <Avatar className="h-5 w-5">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="text-[8px] bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">{displayName}</span>
          <span>·</span>
          <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
        </div>
        <p className="text-sm text-foreground whitespace-pre-wrap">{comment.body}</p>
        <div className="mt-1">
          {user ? (
            <button
              onClick={() => setReplying(!replying)}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <MessageSquare className="h-3 w-3" /> Reply
            </button>
          ) : null}
        </div>

        {replying && (
          <div className="mt-2 space-y-2">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleReply} disabled={createComment.isPending}>
                {createComment.isPending ? "Posting..." : "Reply"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setReplying(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>

      {comment.children.map((child: any) => (
        <CommentNode key={child.id} comment={child} postId={postId} depth={depth + 1} />
      ))}
    </div>
  );
}

export function CommentThread({ comments, postId }: CommentThreadProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const createComment = useCreateComment();
  const tree = buildTree(comments);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await createComment.mutateAsync({ post_id: postId, body: newComment.trim() });
      setNewComment("");
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  return (
    <div className="space-y-4">
      {user ? (
        <div className="space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
          />
          <Button onClick={handleSubmit} disabled={createComment.isPending || !newComment.trim()}>
            {createComment.isPending ? "Posting..." : "Comment"}
          </Button>
        </div>
      ) : (
        <div className="text-center py-4 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground text-sm mb-2">Sign in to join the conversation</p>
          <Button asChild variant="outline" size="sm">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      )}

      <div className="divide-y divide-border">
        {tree.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No comments yet. Be the first!</p>
        ) : (
          tree.map((comment) => (
            <CommentNode key={comment.id} comment={comment} postId={postId} />
          ))
        )}
      </div>
    </div>
  );
}
