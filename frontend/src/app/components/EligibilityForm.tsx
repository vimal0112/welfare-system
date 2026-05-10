import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "./ui/radio-group";
import {
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;

interface EligibilityFormProps {
  onBack: () => void;
}

export function EligibilityForm({ onBack }: EligibilityFormProps) {
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [eligibleSchemes, setEligibleSchemes] = useState<any[]>([]);
  const [eligibilityScore, setEligibilityScore] = useState<number | null>(null);
  const [eligibilityStatus, setEligibilityStatus] = useState<string>("");


  const [formData, setFormData] = useState({
    fullName: "",          
    age: "",
    gender: "",
    state: "",
    income: "",            
    category: "",
    employment: "",
    maritalStatus: "",     
    annual_income: "",
    disability: "NO",
    is_minority: "NO",
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const isStepValid = () => {
    if (step === 1) {
      return (
        formData.fullName.trim() !== "" &&
        formData.age !== "" &&
        formData.gender !== ""
      );
    }

    if (step === 2) {
      return (
        formData.state.trim() !== "" &&
        formData.maritalStatus !== ""
      );
    }

    if (step === 3) {
      return (
        formData.annual_income !== "" &&
        formData.category !== ""
      );
    }

    if (step === 4) {
      return (
        formData.employment !== "" &&
        formData.disability !== "" &&
        formData.is_minority !== ""
      );
    }

    return true;
  };


  const handleNext = () => {
    if (!isStepValid()) {
      alert("Please fill all required fields before continuing.");
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    }
  };


  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      let parsedUser: any = null;
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          parsedUser = JSON.parse(storedUser);
        } catch (error) {
          console.warn("Failed to parse user from storage:", error);
        }
      }
      const userId = parsedUser?.id ?? parsedUser?.userId ?? null;

      if (!userId) {
        alert("Please login again to check eligibility.");
        return;
      }

      const response = await fetch(
        `${API_BASE}/api/welfare/check-eligibility`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            age: Number(formData.age),
            gender: formData.gender,
            category: formData.category,
            state: formData.state,
            occupation: formData.employment,
            annual_income: Number(formData.annual_income),
            disability: formData.disability,
            is_minority: formData.is_minority,
            userId,
          }),
        }
      );

      if (!response.ok) {
        alert("Eligibility check failed");
        return;
      }

      const data = await response.json();

      console.log("Eligibility API response:", data);

      setEligibleSchemes(
        Array.isArray(data.recommended_schemes)
          ? data.recommended_schemes
          : []
      );
      setShowResults(true);
      setEligibilityScore(data.eligibility_score);
      setEligibilityStatus(data.eligibility_status);

      try {
        localStorage.setItem(
          userId ? `latestEligibilityResult:${userId}` : "latestEligibilityResult:guest",
          JSON.stringify({
            eligibility_score: data.eligibility_score,
            eligibility_status: data.eligibility_status,
            recommended_schemes: Array.isArray(data.recommended_schemes)
              ? data.recommended_schemes
              : [],
            checked_at: new Date().toISOString(),
          })
        );
      } catch (storageError) {
        console.warn("Unable to persist eligibility result:", storageError);
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  /* ================= RESULTS (UNCHANGED STYLE) ================= */
  if (showResults) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="p-8 shadow-lg text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-accent/10 p-4 rounded-full">
              <CheckCircle2 className="h-16 w-16 text-accent" />
            </div>
          </div>

          <h2 className="text-2xl mb-3">Eligibility Check Complete!</h2>

          <div className="space-y-3 mb-6">
            {eligibleSchemes.length === 0 && (
              <p className="text-muted-foreground">
                No schemes matched your eligibility.
              </p>
            )}

            {eligibleSchemes.length === 0 ? (
              <p className="text-muted-foreground text-center">
                No schemes matched your eligibility criteria.
              </p>
            ) : (
              eligibleSchemes.map((scheme) => (
                <Card
                  key={scheme.scheme_name}
                  className="p-4 text-left bg-accent/5 border-accent/20"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="mb-1">{scheme.scheme_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {scheme.reason}
                      </p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                  </div>
                </Card>
              ))
            )}

          </div>
          {eligibilityScore !== null && (
            <div className="bg-accent/5 p-6 rounded-xl mb-6 text-center">
              <p className="text-muted-foreground mb-1">Eligibility Score</p>
              <h3 className="text-4xl text-accent mb-1">
                {(eligibilityScore * 100).toFixed(2)}%
              </h3>
              <p className="text-sm text-muted-foreground">
                Status: {eligibilityStatus}
              </p>
            </div>
          )}


          <Button onClick={onBack} variant="outline" size="lg">
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  /* ================= ORIGINAL FORM UI ================= */
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Button onClick={onBack} variant="ghost" className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <Card className="p-8 shadow-lg">
        <div className="mb-8">
          <h2 className="text-2xl mb-2">Eligibility Check</h2>
          <p className="text-muted-foreground mb-4">
            Complete the form to check your eligibility for government welfare schemes
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg border-b border-border pb-2">Personal Information</h3>

            <div>
              <Label>Full Name *</Label>
              <Input
                placeholder="Enter your Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="mt-2 h-12"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Age *</Label>
                <Input
                  placeholder="Enter your Age"
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className="mt-2 h-12"
                />
              </div>

              <div>
                <Label>Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(v) =>
                    setFormData({ ...formData, gender: v })
                  }
                >
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Select Gender"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg border-b border-border pb-2">Location Details</h3>

            <div>
              <Label>State *</Label>
              <Input
                placeholder="Enter your State"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="mt-2 h-12"
              />
            </div>

            <div>
              <Label>Marital Status *</Label>
              <Select
                value={formData.maritalStatus}
                onValueChange={(v) =>
                  setFormData({ ...formData, maritalStatus: v })
                }
              >
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue placeholder="Select Marital Status"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg border-b border-border pb-2">Financial Information</h3>

            <div>
              <Label>Annual Household Income *</Label>
              <Input
                type="number"
                placeholder="Enter annual income (e.g. 250000)"
                value={formData.annual_income}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    annual_income: e.target.value,
                  })
                }
                className="mt-2 h-12"
              />
            </div>


            <div>
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) =>
                  setFormData({ ...formData, category: v })
                }
              >
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue placeholder="Select Category"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="obc">OBC</SelectItem>
                  <SelectItem value="sc">SC</SelectItem>
                  <SelectItem value="st">ST</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg border-b border-border pb-2">
              Occupation Details
            </h3>

            {/* Occupation */}
            <div>
              <Label>Occupation *</Label>
              <Select
                value={formData.employment}
                onValueChange={(v) =>
                  setFormData({ ...formData, employment: v })
                }
              >
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue placeholder="Select occupation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Farmer">Farmer</SelectItem>
                  <SelectItem value="Government Employee">Government Employee</SelectItem>
                  <SelectItem value="Private Employee">Private Employee</SelectItem>
                  <SelectItem value="Unemployed">Unemployed</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Senior Citizen">Senior Citizen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Disability */}
            <div>
              <Label>Disability *</Label>
              <RadioGroup
                value={formData.disability}
                onValueChange={(v) =>
                  setFormData({ ...formData, disability: v })
                }
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="disability-yes" value="YES" />
                  <Label htmlFor="disability-yes">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="disability-no" value="NO" />
                  <Label htmlFor="disability-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Minority */}
            <div>
              <Label>Minority *</Label>
              <RadioGroup
                value={formData.is_minority}
                onValueChange={(v) =>
                  setFormData({ ...formData, is_minority: v })
                }
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="minority-yes" value="YES" />
                  <Label htmlFor="minority-yes">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="minority-no" value="NO" />
                  <Label htmlFor="minority-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}


        {/* NAVIGATION */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-border">
          {step > 1 && (
            <Button onClick={handlePrevious} variant="outline" size="lg" className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          )}

          {step < totalSteps ? (
            <Button onClick={handleNext} disabled={!isStepValid()}size="lg" className="flex-1 bg-primary hover:bg-primary/90">
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              size="lg" className="flex-1 bg-accent hover:bg-accent/90"
            >
              Submit & Check Eligibility
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
