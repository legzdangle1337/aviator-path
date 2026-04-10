import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LISTING_PACKAGES = [
  { id: "standard", name: "Standard", price: 99, days: 30, featured: false, emailBlast: false, desc: "30-day listing on the job board" },
  { id: "professional", name: "Professional", price: 179, days: 60, featured: true, emailBlast: false, desc: "60-day listing + Featured badge" },
  { id: "premium", name: "Premium", price: 299, days: 90, featured: true, emailBlast: true, desc: "90-day listing + Featured + Email blast" },
];

export default function PostJobPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [companyDetails, setCompanyDetails] = useState({ name: "", website: "", description: "" });
  const [jobDetails, setJobDetails] = useState({
    title: "", location: "", jobType: "major_airline", description: "", requirements: "", benefits: "",
    minTotalHours: "", minPicHours: "", applicationUrl: "", salaryMin: "", salaryMax: "",
  });
  const [selectedPackage, setSelectedPackage] = useState("standard");

  const handleSubmit = () => {
    toast.success("Job listing submitted! Payment integration coming soon.");
    navigate("/jobs");
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      <div className="bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-4">
          <Link to="/jobs" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Jobs
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8 flex-1 w-full">
        <h1 className="text-2xl font-bold text-navy mb-2">Post a Pilot Job</h1>
        <p className="text-muted-foreground mb-8">Reach thousands of qualified pilots looking for their next opportunity</p>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? "bg-navy text-navy-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {step > s ? <Check size={16} /> : s}
              </div>
              <span className={`text-sm hidden sm:block ${step >= s ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {s === 1 ? "Company" : s === 2 ? "Job Details" : "Package"}
              </span>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-navy" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Company */}
        {step === 1 && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Company Details</h2>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Company Name *</label>
              <input
                value={companyDetails.name}
                onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-sky/20"
                placeholder="e.g. SkyWest Airlines"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Website</label>
              <input
                value={companyDetails.website}
                onChange={(e) => setCompanyDetails({ ...companyDetails, website: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-sky/20"
                placeholder="https://www.company.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Company Description</label>
              <textarea
                value={companyDetails.description}
                onChange={(e) => setCompanyDetails({ ...companyDetails, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-sky/20 min-h-[80px]"
                placeholder="Brief description of your company..."
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (!companyDetails.name.trim()) { toast.error("Company name is required"); return; }
                  setStep(2);
                }}
                className="bg-navy text-navy-foreground"
              >
                Next: Job Details →
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Job Details */}
        {step === 2 && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Job Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Job Title *</label>
                <input
                  value={jobDetails.title}
                  onChange={(e) => setJobDetails({ ...jobDetails, title: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none"
                  placeholder="e.g. First Officer"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Location</label>
                <input
                  value={jobDetails.location}
                  onChange={(e) => setJobDetails({ ...jobDetails, location: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none"
                  placeholder="e.g. Denver, CO"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Job Type</label>
                <select
                  value={jobDetails.jobType}
                  onChange={(e) => setJobDetails({ ...jobDetails, jobType: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none"
                >
                  <option value="major_airline">Major Airline</option>
                  <option value="regional_airline">Regional Airline</option>
                  <option value="cfi">CFI / Flight Instructor</option>
                  <option value="charter">Charter / Part 135</option>
                  <option value="cargo">Cargo</option>
                  <option value="corporate">Corporate</option>
                  <option value="military">Military</option>
                  <option value="government">Government</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Application URL *</label>
                <input
                  value={jobDetails.applicationUrl}
                  onChange={(e) => setJobDetails({ ...jobDetails, applicationUrl: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none"
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Min Total Hours</label>
                <input
                  type="number"
                  value={jobDetails.minTotalHours}
                  onChange={(e) => setJobDetails({ ...jobDetails, minTotalHours: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none"
                  placeholder="1500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Min PIC Hours</label>
                <input
                  type="number"
                  value={jobDetails.minPicHours}
                  onChange={(e) => setJobDetails({ ...jobDetails, minPicHours: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Salary Min (annual)</label>
                <input
                  type="number"
                  value={jobDetails.salaryMin}
                  onChange={(e) => setJobDetails({ ...jobDetails, salaryMin: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none"
                  placeholder="65000"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Salary Max (annual)</label>
                <input
                  type="number"
                  value={jobDetails.salaryMax}
                  onChange={(e) => setJobDetails({ ...jobDetails, salaryMax: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none"
                  placeholder="120000"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Job Description *</label>
              <textarea
                value={jobDetails.description}
                onChange={(e) => setJobDetails({ ...jobDetails, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none min-h-[120px]"
                placeholder="Describe the position..."
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Requirements</label>
              <textarea
                value={jobDetails.requirements}
                onChange={(e) => setJobDetails({ ...jobDetails, requirements: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none min-h-[80px]"
                placeholder="List requirements..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Benefits</label>
              <textarea
                value={jobDetails.benefits}
                onChange={(e) => setJobDetails({ ...jobDetails, benefits: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none min-h-[80px]"
                placeholder="List benefits..."
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
              <Button
                onClick={() => {
                  if (!jobDetails.title.trim() || !jobDetails.applicationUrl.trim()) {
                    toast.error("Job title and application URL are required");
                    return;
                  }
                  setStep(3);
                }}
                className="bg-navy text-navy-foreground"
              >
                Next: Select Package →
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Package */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Select a Listing Package</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {LISTING_PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`rounded-xl border-2 p-5 text-left transition-all ${
                    selectedPackage === pkg.id
                      ? "border-navy bg-navy/5"
                      : "border-border bg-card hover:border-sky/30"
                  }`}
                >
                  <div className="text-lg font-bold text-foreground">${pkg.price}</div>
                  <div className="text-sm font-semibold text-foreground mt-1">{pkg.name}</div>
                  <div className="text-xs text-muted-foreground mt-2">{pkg.desc}</div>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check size={12} className="text-emerald-500" /> {pkg.days}-day listing
                    </div>
                    {pkg.featured && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Check size={12} className="text-emerald-500" /> Featured badge
                      </div>
                    )}
                    {pkg.emailBlast && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Check size={12} className="text-emerald-500" /> Email blast to pilots
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>← Back</Button>
              <Button onClick={handleSubmit} className="bg-gold text-gold-foreground hover:opacity-90">
                Submit & Pay ${LISTING_PACKAGES.find((p) => p.id === selectedPackage)?.price}
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
