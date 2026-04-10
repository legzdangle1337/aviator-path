import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";

type School = Tables<"schools">;

export function SchoolClaimCta({ school }: { school: School }) {
  return (
    <section className="border-t pt-8 text-center">
      <p className="text-muted-foreground mb-2">Are you affiliated with {school.name}?</p>
      <p className="text-sm text-muted-foreground mb-4">Claim this profile to manage your information, respond to reviews, and access student leads.</p>
      <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">Claim Profile</Button>
    </section>
  );
}
