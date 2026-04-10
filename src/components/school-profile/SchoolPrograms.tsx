import { Check, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type School = Tables<"schools">;

const CERTS = ["PPL", "Instrument", "Commercial", "CFI", "CFII", "MEI", "ATP"];

export function SchoolPrograms({ school }: { school: School }) {
  return (
    <section id="programs" className="scroll-mt-20">
      <h2 className="text-2xl font-bold text-foreground mb-6">Certificates & Ratings Offered</h2>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {CERTS.map(cert => (
          <div key={cert} className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-foreground">{cert}</span>
          </div>
        ))}
      </div>

      {(school.cfi_pay_model || school.cfi_starting_pay) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-2">CFI Opportunity at This School</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            {school.cfi_pay_model && <p><span className="font-medium text-foreground">Pay Model:</span> {school.cfi_pay_model}</p>}
            {school.cfi_starting_pay && <p><span className="font-medium text-foreground">Starting Pay:</span> ${school.cfi_starting_pay}/hr</p>}
            {school.student_to_cfi_ratio && <p><span className="font-medium text-foreground">Student:CFI Ratio:</span> {Number(school.student_to_cfi_ratio)}:1</p>}
          </div>
        </div>
      )}
    </section>
  );
}
