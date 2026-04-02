import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const API_BASE = "http://localhost:8080";

interface Scheme {
  id: number;
  schemeName: string;
  category: string;
  description: string;
  minAge: number;
  maxIncome: number;
  occupation: string;
  disabilityRequired: string;
  minorityRequired: string;
  schemeDetails?: {
    eligibility: string;
    benefits: string;
    documentsRequired: string;
    applicationProcess: string;
    officialWebsite: string;
    helplineNumber: string;
  };
}

const ITEMS_PER_PAGE = 4;

export function Schemes({
  onViewDetails,
}: {
  onViewDetails: (id: number) => void;
}) {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NONE");

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch(`${API_BASE}/api/schemes`)
      .then((res) => res.json())
      .then((data) => {
        setSchemes(data);
        setFilteredSchemes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching schemes:", err);
        setLoading(false);
      });
  }, []);

  /* ================= DYNAMIC CATEGORIES ================= */
  const categories = [
    "ALL",
    ...Array.from(
      new Set(
        schemes
          .map((s) => s.category)
          .filter((c) => c && c !== "ANY")
      )
    ),
  ];

  /* ================= FILTER ================= */
  const handleFilterChange = (value: string) => {
    setCategoryFilter(value);
    setVisibleCount(ITEMS_PER_PAGE);
    setSortBy("NONE");

    if (value === "ALL") {
      setFilteredSchemes(schemes);
    } else {
      setFilteredSchemes(
        schemes.filter((scheme) => scheme.category === value)
      );
    }
  };

  /* ================= SORT ================= */
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setVisibleCount(ITEMS_PER_PAGE);

    const sorted = [...filteredSchemes];

    if (value === "NAME") {
      sorted.sort((a, b) =>
        a.schemeName.localeCompare(b.schemeName)
      );
    }

    if (value === "AGE") {
      sorted.sort((a, b) => a.minAge - b.minAge);
    }

    if (value === "INCOME") {
      sorted.sort((a, b) => a.maxIncome - b.maxIncome);
    }

    setFilteredSchemes(sorted);
  };

  if (loading) {
    return <p className="p-6 text-muted-foreground">Loading schemes...</p>;
  }

  const visibleSchemes = filteredSchemes.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSchemes.length;

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl mb-2">Government Welfare Schemes</h1>
          <p className="text-muted-foreground">
            Browse all available welfare schemes
          </p>
        </div>

        {/* FILTER & SORT (shadcn UI) */}
        <div className="flex gap-3 flex-wrap">
          {/* FILTER */}
          <Select value={categoryFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="h-11 w-[200px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* SORT */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="h-11 w-[200px]">
              <SelectValue placeholder="Sort schemes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">Default</SelectItem>
              <SelectItem value="NAME">Scheme Name</SelectItem>
              <SelectItem value="AGE">Minimum Age</SelectItem>
              <SelectItem value="INCOME">Maximum Income</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* SCHEME CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visibleSchemes.map((scheme) => (
          <Card
            key={scheme.id}
            className="p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="mb-1">{scheme.schemeName}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {scheme.category} CATEGORY
            </p>

            <p className="text-sm mb-4 leading-relaxed">
              {scheme.description}
            </p>

            <div className="space-y-2 mb-4 p-3 bg-muted/50 rounded-lg">
              <div>
                <span className="text-sm">Eligibility: </span>
                <span className="text-sm text-muted-foreground">
                  {scheme.schemeDetails?.eligibility ?? "As per guidelines"}
                </span>
              </div>
              <div>
                <span className="text-sm">Benefit: </span>
                <span className="text-sm text-primary">
                  {scheme.schemeDetails?.benefits ?? "Refer official notice"}
                </span>
              </div>
            </div>

            <Button
              className="w-full"
              variant="outline"
              onClick={() => onViewDetails(scheme.id)}
            >
              View Details
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Card>
        ))}
      </div>

      {/* VIEW MORE */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() =>
              setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
            }
          >
            View More
          </Button>
        </div>
      )}
    </div>
  );
}
