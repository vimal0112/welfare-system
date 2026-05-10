import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Users,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface DashboardProps {
  onNavigateToEligibility: () => void;
  onViewSchemeDetails: (id: number) => void; 
}

type RecommendedSchemeCard = {
  id: number; 
  name: string;
  description?: string;
  status?: "eligible" | "review" | "not-eligible" | "recommended" | "new";
};

type HistoryItem = {
  id: number;
  scheme: string;
  date: string;
  status: "Approved" | "Under Review" | "Pending";
};

const API_BASE = import.meta.env.VITE_API_URL;

export function Dashboard({
  onNavigateToEligibility,
  onViewSchemeDetails, 
}: DashboardProps) {
  const [recommendedSchemes, setRecommendedSchemes] = useState<
    RecommendedSchemeCard[]
  >([]);
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
  const [schemeCount, setSchemeCount] = useState<number | null>(null);
  const [eligibilityScore, setEligibilityScore] = useState<number | null>(null);
  const [eligibilityStatus, setEligibilityStatus] = useState<string | null>(
    null
  );
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [hasEligibilityResult, setHasEligibilityResult] = useState(false);
  const [showAllRecommended, setShowAllRecommended] = useState(false);

  useEffect(() => {
    let hasStoredResult = false;
    let parsedUser: any = null;

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser);
      } catch {}
    }

    const userId = parsedUser?.id ?? null;
    const eligibilityKey = userId
      ? `latestEligibilityResult:${userId}`
      : "latestEligibilityResult:guest";

    const stored = localStorage.getItem(eligibilityKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        if (typeof parsed.eligibility_score === "number") {
          setEligibilityScore(parsed.eligibility_score);
          hasStoredResult = true;
        }

        if (typeof parsed.eligibility_status === "string") {
          setEligibilityStatus(parsed.eligibility_status);
          hasStoredResult = true;
        }

        if (Array.isArray(parsed.recommended_schemes)) {
          const cards = parsed.recommended_schemes
            .map((scheme: any) => {
              const rawId =
                scheme.scheme_id ?? scheme.schemeId ?? scheme.id ?? null;
              const parsedId =
                typeof rawId === "number"
                  ? rawId
                  : rawId
                  ? Number(rawId)
                  : null;

              return {
                id: Number.isFinite(parsedId as number) ? (parsedId as number) : 0,
                name: scheme.scheme_name || scheme.schemeName || "Recommended Scheme",
                description:
                  scheme.reason ||
                  "Recommended based on your eligibility profile.",
                status: "recommended" as const,
              };
            })
            .filter((scheme: RecommendedSchemeCard) => scheme.id > 0);

          setRecommendedSchemes(cards);
          hasStoredResult = true;
        }
      } catch {}
    }

    const loadData = async () => {
      try {
        const [historyRes, schemesRes] = await Promise.all([
          userId
            ? fetch(`${API_BASE}/api/welfare/history?userId=${userId}`)
            : Promise.resolve(null),
          fetch(`${API_BASE}/api/schemes`),
        ]);

        if (historyRes && historyRes.ok) {
          const history = await historyRes.json();
          if (Array.isArray(history)) {
            const items: HistoryItem[] = history.map((entry: any) => {
              let status: HistoryItem["status"] = "Pending";
              if (entry.eligibility_status === "ELIGIBLE") status = "Approved";
              else if (entry.eligibility_status === "PARTIALLY_ELIGIBLE")
                status = "Under Review";

              return {
                id: entry.id,
                scheme: "Eligibility Check",
                date: entry.checkedAt || entry.checked_at || "",
                status,
              };
            });

            setRecentHistory(items.slice(0, 5));
            setHistoryCount(history.length);

            if (!hasStoredResult && history.length > 0) {
              setEligibilityScore(history[0].eligibility_score);
              setEligibilityStatus(history[0].eligibility_status);
              hasStoredResult = true;
            }
          }
        }

        if (schemesRes.ok) {
          const schemes = await schemesRes.json();
          if (Array.isArray(schemes)) {
            setSchemeCount(schemes.length);
          }
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setHasEligibilityResult(hasStoredResult);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const eligibilityPercent = useMemo(() => {
    if (eligibilityScore === null || Number.isNaN(eligibilityScore)) return 0;
    return Math.max(0, Math.min(100, Math.round(eligibilityScore * 100)));
  }, [eligibilityScore]);

  const eligibleCount = useMemo(() => {
    return recommendedSchemes.filter(
      (scheme) =>
        scheme.status === "recommended" || scheme.status === "eligible"
    ).length;
  }, [recommendedSchemes]);

  const eligibilitySubtitle = useMemo(() => {
    if (eligibilityScore === null) {
      return "You haven't checked eligibility yet. Please run the eligibility check.";
    }
    if (schemeCount !== null && eligibleCount > 0) {
      return `You qualify for ${eligibleCount} out of ${schemeCount} schemes`;
    }
    return eligibilityStatus
      ? `Status: ${eligibilityStatus}`
      : "Eligibility score is based on your latest check";
  }, [eligibilityScore, eligibilityStatus, schemeCount, eligibleCount]);

  const visibleRecommendedSchemes = useMemo(() => {
    if (showAllRecommended) return recommendedSchemes;
    return recommendedSchemes.slice(0, 4);
  }, [recommendedSchemes, showAllRecommended]);

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-8 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl mb-2">
              Welcome to Government Welfare Advisory System
            </h1>
            <p className="text-primary-foreground/90 max-w-2xl">
              Discover government schemes tailored for you. Check your eligibility and access benefits designed to support citizens like you.
            </p>
          </div>
          <Button
            onClick={onNavigateToEligibility}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md whitespace-nowrap"
          >
            Check Eligibility
          </Button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-1">Eligibility Score</p>
              <h3 className="text-3xl mb-2">
                {eligibilityScore === null ? "--" : `${eligibilityPercent}%`}
              </h3>
              <Progress value={eligibilityPercent} className="h-2" />
            </div>
            <div className="bg-accent/10 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {eligibilitySubtitle}
          </p>
        </Card>

        <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-1">Available Schemes</p>
              <h3 className="text-3xl mb-2">
                {schemeCount === null ? "--" : schemeCount}
              </h3>
            </div>
            <div className="bg-secondary/20 p-3 rounded-full">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Explore all government welfare programs
          </p>
        </Card>

        <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-1">Eligibility Check Count</p>
              <h3 className="text-3xl mb-2">
                {loading ? "--" : historyCount.toLocaleString()}
              </h3>
            </div>
            <div className="bg-secondary/20 p-3 rounded-full">
              <Users className="h-8 w-8 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Eligibility checks recorded for your account
          </p>
        </Card>
      </div>

      {/* Recommended Schemes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Recommended Schemes for You</h2>
          <span className="text-sm text-muted-foreground">
            {recommendedSchemes.length} schemes
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visibleRecommendedSchemes.map((scheme) => (
            <Card
              key={scheme.id}
              className="p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="mb-1">{scheme.name}</h3>
                  {scheme.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {scheme.description}
                    </p>
                  )}
                </div>
                <Badge className="bg-accent text-accent-foreground ml-2">
                  Recommended
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Personalized based on your profile
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewSchemeDetails(scheme.id)}
                  disabled={!scheme.id}
                >
                  Apply Now
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {recommendedSchemes.length > 4 && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowAllRecommended((prev) => !prev)}
            >
              {showAllRecommended ? "View Less" : "View More"}
              <ChevronRight
                className={`ml-1 h-4 w-4 transition-transform ${
                  showAllRecommended ? "rotate-90" : ""
                }`}
              />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
