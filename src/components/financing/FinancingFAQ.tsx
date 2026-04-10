import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "Can I get federal loans for flight school?",
    a: "Federal student loans (Stafford, PLUS) are only available if your flight school is an accredited college or university offering an aviation degree program under Part 141. Standalone Part 61 schools and most Part 141-only schools do not qualify for federal aid. However, you may be eligible for the GI Bill if you're a veteran, or Pell Grants at qualifying institutions.",
  },
  {
    q: "Do I need a cosigner for Stratus Financial?",
    a: "In most cases, no. Stratus Financial is one of the few lenders that doesn't require a cosigner for most applicants. They evaluate your potential future pilot earnings as part of their underwriting, which is unique in the aviation lending space. However, having a cosigner may improve your rate.",
  },
  {
    q: "What if I don't finish my training?",
    a: "This depends on your lender. Most private lenders require repayment regardless of whether you complete training. Some schools offer refund policies for unused portions. It's critical to read your loan agreement carefully and understand the school's refund policy before signing. Stratus and Meritize may offer modified repayment if you withdraw early.",
  },
  {
    q: "Can I refinance flight training debt?",
    a: "Yes. Once you have steady income as a pilot, you can refinance through lenders like Earnest, SoFi, or traditional banks. Many pilots refinance after reaching a regional airline to get lower rates. Your improved income and credit profile as a working pilot typically qualifies you for significantly better terms.",
  },
  {
    q: "Which lender is best for my situation?",
    a: "It depends on your school type and credit profile. For Part 61 schools, Stratus or AOPA Finance are your best options. For Part 141 accredited programs, Sallie Mae offers the lowest rates with a cosigner. If you have limited credit history, Meritize considers academic and military merit. Use our comparison table above to match your situation.",
  },
];

export function FinancingFAQ() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[hsl(var(--navy))] flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-[hsl(var(--gold))]" />
          Frequently Asked Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-[hsl(var(--navy))]">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
