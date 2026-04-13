import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToggleUpvote } from "@/hooks/useCommunity";
import { toast } from "sonner";

interface UpvoteButtonProps {
  postId?: string;
  commentId?: string;
  count: number;
  isUpvoted: boolean;
}

export function UpvoteButton({ postId, commentId, count, isUpvoted }: UpvoteButtonProps) {
  const { user } = useAuth();
  const toggleUpvote = useToggleUpvote();

  const handleClick = () => {
    if (!user) {
      toast.error("Sign in to upvote");
      return;
    }
    toggleUpvote.mutate({ postId, commentId, isUpvoted });
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors text-sm",
        isUpvoted
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <ChevronUp className={cn("h-5 w-5", isUpvoted && "text-primary")} />
      <span className="font-semibold text-xs">{count}</span>
    </button>
  );
}
