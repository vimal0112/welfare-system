import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ExternalLink } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;

export function SchemeDetailsPage({
  schemeId,
  onBack,
}: {
  schemeId: number | null;
  onBack: () => void;
}) {
  const [scheme, setScheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [documents, setDocuments] = useState("");
  const [notes, setNotes] = useState("");
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const stored = localStorage.getItem("user");
    if (!stored) return {};
    try {
      const user = JSON.parse(stored);
      return {
        "X-User-Role": String(user.role || "").toUpperCase(),
        "X-User-Id": String(user.id || "")
      };
    } catch {
      return {};
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setCurrentRole(user?.role ? String(user.role).toLowerCase() : null);
      } catch {
        setCurrentRole(null);
      }
    } else {
      setCurrentRole(null);
    }

    if (schemeId === null) {
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`${API_BASE}/api/schemes/${schemeId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Scheme not found");
        }
        return res.json();
      })
      .then((data) => {
        setScheme(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load scheme:", err);
        setLoading(false);
      });
  }, [schemeId]);

  if (loading) {
    return <p className="p-6">Loading scheme details...</p>;
  }

  if (!scheme) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground mb-4">
          Scheme details not found.
        </p>
        <Button variant="outline" onClick={onBack}>
          ← Back to Schemes
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Button variant="outline" onClick={onBack}>
        ← Back to Schemes
      </Button>

      <Card className="p-6">
        <h1 className="text-2xl mb-2">{scheme.schemeName}</h1>
        <p className="text-muted-foreground mb-4">
          {scheme.category} CATEGORY
        </p>

        <p className="mb-6">{scheme.description}</p>

        <Section title="Eligibility">
          {scheme.schemeDetails?.eligibility}
        </Section>

        <Section title="Benefits">
          {scheme.schemeDetails?.benefits}
        </Section>

        <Section title="Documents Required">
          {scheme.schemeDetails?.documentsRequired}
        </Section>

        <Section title="Application Process">
          {scheme.schemeDetails?.applicationProcess}
        </Section>

        <div className="mt-6 flex gap-3">
          <Button
            className="bg-accent"
            onClick={() =>
              window.open(
                scheme.schemeDetails?.officialWebsite,
                "_blank"
              )
            }
          >
            Official Website
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
          {currentRole === "user" && (
            <Button
              variant="outline"
              onClick={() => {
                setShowApplyModal(true);
                setSubmitError(null);
              }}
            >
              Apply Now
            </Button>
          )}
        </div>
      </Card>

      {showApplyModal && currentRole === "user" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <Card className="w-full max-w-lg p-6 shadow-xl">
            <div className="mb-4">
              <h3 className="text-xl mb-1">Submit Application</h3>
              <p className="text-sm text-muted-foreground">
                {scheme.schemeName}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="income">Annual Income</Label>
                <Input
                  id="income"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  placeholder="Enter annual income"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="documents">Documents Submitted</Label>
                <Input
                  id="documents"
                  value={documents}
                  onChange={(e) => setDocuments(e.target.value)}
                  placeholder="e.g., Aadhaar, Income Certificate"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full mt-2 p-3 border border-border rounded-md min-h-[100px] bg-background"
                  placeholder="Any additional details..."
                />
              </div>
            </div>

            {submitError && (
              <div className="mt-4 text-sm text-destructive">
                {submitError}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowApplyModal(false);
                  setSubmitError(null);
                }}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary"
                disabled={isSubmitting}
                onClick={async () => {
                  if (!schemeId) return;
                  if (currentRole !== "user") {
                    setSubmitError("Only citizens can submit applications.");
                    return;
                  }
                  setIsSubmitting(true);
                  setSubmitError(null);

                  try {
                    const payload = {
                      schemeId,
                      applicationData: JSON.stringify({
                        address,
                        annualIncome,
                        documents,
                        notes
                      })
                    };

                    const response = await fetch(`${API_BASE}/api/applications`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        ...getAuthHeaders()
                      },
                      body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                      const msg = await response.text();
                      throw new Error(msg || "Failed to submit application");
                    }

                    setShowApplyModal(false);
                    setAddress("");
                    setAnnualIncome("");
                    setDocuments("");
                    setNotes("");
                  } catch (err: any) {
                    setSubmitError(err?.message || "Failed to submit application");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 p-4 bg-muted/50 rounded-lg">
      <h3 className="mb-1">{title}</h3>
      <p className="text-muted-foreground">
        {children ?? "Not available"}
      </p>
    </div>
  );
}
