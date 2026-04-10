import { MapPin, ExternalLink } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type School = Tables<"schools">;

export function SchoolLocation({ school }: { school: School }) {
  const address = `${school.address ? school.address + ", " : ""}${school.city}, ${school.state} ${school.zip || ""}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <section id="location" className="scroll-mt-20">
      <h2 className="text-2xl font-bold text-foreground mb-6">Location</h2>
      <div className="rounded-xl overflow-hidden border">
        <iframe
          src={embedUrl}
          className="w-full h-[300px]"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map of ${school.name}`}
        />
      </div>
      <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <span>{address}</span>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-accent flex items-center gap-1 hover:underline ml-auto">
          Get Directions <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </section>
  );
}
