import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface Props {
  onClick: () => void;
  className?: string;
}

export function AdminEditButton({ onClick, className = "" }: Props) {
  const { isAdmin } = useIsAdmin();
  if (!isAdmin) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      className={`h-7 w-7 opacity-60 hover:opacity-100 ${className}`}
      onClick={onClick}
    >
      <Pencil className="h-3.5 w-3.5" />
    </Button>
  );
}
