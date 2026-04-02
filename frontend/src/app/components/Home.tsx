import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { FileCheck, BookOpen, TrendingUp, Clock } from "lucide-react";

const API_BASE = "http://localhost:8080";

interface HomeProps {
  onNavigate: (view: string) => void;
}

interface Scheme {
  id: number;
  schemeName: string;
  category: string;
  maxIncome: number;
  description: string;
}

export function Home({ onNavigate }: HomeProps) {
  const [recentSchemes, setRecentSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/welfare/recent`)
      .then((res) => res.json())
      .then((data) => {
        setRecentSchemes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load recent schemes", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl mb-3">Welcome to Your Welfare Portal</h1>
        <p className="text-primary-foreground/90 text-lg max-w-3xl">
          Access personalized government schemes, check your eligibility, and
          track your applications all in one place.
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => onNavigate("eligibility")}
          >
            <div className="bg-accent/10 p-3 rounded-lg w-fit mb-3 group-hover:bg-accent/20 transition-colors">
              <FileCheck className="h-7 w-7 text-accent" />
            </div>
            <h3 className="mb-2">Check Eligibility</h3>
            <p className="text-sm text-muted-foreground">
              Find schemes you qualify for
            </p>
          </Card>

          <Card
            className="p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => onNavigate("schemes")}
          >
            <div className="bg-primary/10 p-3 rounded-lg w-fit mb-3 group-hover:bg-primary/20 transition-colors">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-2">Browse Schemes</h3>
            <p className="text-sm text-muted-foreground">
              Explore all welfare programs
            </p>
          </Card>

          <Card
            className="p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => onNavigate("dashboard")}
          >
            <div className="bg-secondary/30 p-3 rounded-lg w-fit mb-3 group-hover:bg-secondary/40 transition-colors">
              <TrendingUp className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-2">View Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              See your personalized insights
            </p>
          </Card>

          <Card
            className="p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => onNavigate("history")}
          >
            <div className="bg-[#FFA726]/10 p-3 rounded-lg w-fit mb-3 group-hover:bg-[#FFA726]/20 transition-colors">
              <Clock className="h-7 w-7 text-[#FFA726]" />
            </div>
            <h3 className="mb-2">Track Applications</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your application status
            </p>
          </Card>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Getting Started */}
        <Card className="p-6 shadow-sm">
          <h3 className="mb-3">Getting Started</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="bg-accent/10 p-1 rounded-full mt-0.5">
                <div className="bg-accent rounded-full w-2 h-2" />
              </div>
              <div>
                <p className="mb-1">Complete your profile</p>
                <p className="text-sm text-muted-foreground">
                  Add your details to get personalized recommendations
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="bg-accent/10 p-1 rounded-full mt-0.5">
                <div className="bg-accent rounded-full w-2 h-2" />
              </div>
              <div>
                <p className="mb-1">Check your eligibility</p>
                <p className="text-sm text-muted-foreground">
                  Take our quick assessment to find matching schemes
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="bg-accent/10 p-1 rounded-full mt-0.5">
                <div className="bg-accent rounded-full w-2 h-2" />
              </div>
              <div>
                <p className="mb-1">Apply for benefits</p>
                <p className="text-sm text-muted-foreground">
                  Submit applications directly through the portal
                </p>
              </div>
            </li>
          </ul>

          <Button
            onClick={() => onNavigate("eligibility")}
            className="w-full mt-4 bg-accent hover:bg-accent/90"
          >
            Start Eligibility Check
          </Button>
        </Card>

        {/* Recent Updates (FROM DB) */}
        <Card className="p-6 shadow-sm">
          <h3 className="mb-3">Recent Updates</h3>

          <div className="space-y-4">
            {loading && (
              <p className="text-sm text-muted-foreground">
                Loading updates...
              </p>
            )}

            {!loading && recentSchemes.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No recent updates available.
              </p>
            )}

            {recentSchemes.map((scheme, index) => (
              <div
                key={scheme.id}
                className={`pb-4 ${
                  index !== recentSchemes.length - 1
                    ? "border-b border-border"
                    : ""
                }`}
              >
                <p className="text-sm text-muted-foreground mb-1">
                  Category: {scheme.category}
                </p>
                <p className="mb-1">{scheme.schemeName}</p>
                <p className="text-sm text-muted-foreground mb-1">
                  {scheme.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  Max Income: ₹{scheme.maxIncome}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
