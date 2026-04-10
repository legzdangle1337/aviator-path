import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LenderTable } from "@/components/financing/LenderTable";
import { LoanCalculator } from "@/components/financing/LoanCalculator";
import { ROICalculator } from "@/components/financing/ROICalculator";
import { FinancingFAQ } from "@/components/financing/FinancingFAQ";
import { FinancingGuides } from "@/components/financing/FinancingGuides";
import { DollarSign, TrendingUp, GraduationCap } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function FinancingPage() {
  return (
    <>
      <Helmet>
        <title>Flight Training Financing — Compare Loans & Calculate ROI | AviatorPath</title>
        <meta name="description" content="Compare flight training loans from Stratus, Sallie Mae, AOPA, Meritize & Earnest. Use our loan calculator and pilot career ROI tool to plan your aviation career." />
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-secondary">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[hsl(var(--navy))] to-[hsl(var(--primary))] text-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Flight Training Financing
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
              Compare loans, calculate your true training cost, and understand the real return on an aviation career
            </p>
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <DollarSign className="h-5 w-5 text-[hsl(var(--gold))]" />
                <span>5 Lenders Compared</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <TrendingUp className="h-5 w-5 text-[hsl(var(--gold))]" />
                <span>ROI Calculator</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <GraduationCap className="h-5 w-5 text-[hsl(var(--gold))]" />
                <span>Expert Guides</span>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-12">
          <LenderTable />
          <LoanCalculator />
          <ROICalculator />
          <FinancingFAQ />
          <FinancingGuides />
        </div>
      </main>
      <Footer />
    </>
  );
}
