import { useEffect, useMemo, useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Eye } from "lucide-react";

interface Application {
  id: number;
  schemeId: number;
  schemeName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string | null;
  updatedAt: string | null;
  remarks?: string | null;
  officerId?: number | null;
  officerName?: string | null;
}

const API_BASE = "http://localhost:8080";

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const stored = localStorage.getItem("user");
  if (!stored) return headers;
  try {
    const user = JSON.parse(stored);
    if (user?.role) {
      headers["X-User-Role"] = String(user.role).toUpperCase();
    }
    if (user?.id !== undefined && user?.id !== null) {
      headers["X-User-Id"] = String(user.id);
    }
    return headers;
  } catch {
    return headers;
  }
}

export function TrackApplications({ onViewSchemeDetails }: { onViewSchemeDetails?: (id: number) => void }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadApplications = async () => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setError("Please login to view applications.");
      return;
    }
    let userId: number | null = null;
    try {
      const user = JSON.parse(stored);
      userId = user?.id ?? null;
    } catch {
      setError("Please login to view applications.");
      return;
    }
    if (!userId) {
      setError("Please login to view applications.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/applications/user/${userId}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to load applications");
      }
      const data = await response.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) =>
      String(app.id).includes(searchQuery) ||
      String(app.schemeId).includes(searchQuery) ||
      app.schemeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [applications, searchQuery]);

  const StatusBadge = ({ status }: { status: Application["status"] }) => {
    const styles = {
      PENDING: "bg-[#FFA726]/10 text-[#FFA726] border-[#FFA726]/20",
      APPROVED: "bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20",
      REJECTED: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs border ${styles[status]}`}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2">Track Applications</h1>
          <p className="text-muted-foreground">Monitor the status of your submitted applications</p>
        </div>
        <Button variant="outline" onClick={loadApplications}>
          Refresh
        </Button>
      </div>

      <Card className="p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by application ID, scheme ID or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {error && (
        <Card className="p-4 border border-destructive/40 text-destructive">
          {error}
        </Card>
      )}

      <Card className="shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 text-sm">Application ID</th>
                <th className="text-left p-4 text-sm">Scheme</th>
                <th className="text-left p-4 text-sm">Status</th>
                <th className="text-left p-4 text-sm">Submitted</th>
                <th className="text-left p-4 text-sm">Updated</th>
                <th className="text-left p-4 text-sm">Remarks</th>
                <th className="text-left p-4 text-sm">Officer</th>
                <th className="text-left p-4 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">{app.id}</td>
                  <td className="p-4">
                    <div>
                      <p>{app.schemeName}</p>
                      <p className="text-xs text-muted-foreground">ID: {app.schemeId}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="p-4">{app.submittedAt ? app.submittedAt.split("T")[0] : "-"}</td>
                  <td className="p-4">{app.updatedAt ? app.updatedAt.split("T")[0] : "-"}</td>
                  <td className="p-4">{app.remarks || "-"}</td>
                  <td className="p-4">
                    {app.officerName ? `${app.officerName} (#${app.officerId})` : "Not assigned"}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(app);
                          setShowDetailModal(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {app.status === "REJECTED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewSchemeDetails?.(app.schemeId)}
                          disabled={!onViewSchemeDetails}
                        >
                          Re-apply
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Loading applications...</p>
            </div>
          )}

          {!isLoading && filteredApplications.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No applications found</p>
            </div>
          )}
        </div>
      </Card>

      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <Card className="w-full max-w-lg p-6 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl mb-1">Application Details</h3>
                <p className="text-sm text-muted-foreground">#{selectedApplication.id}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedApplication(null);
                }}
              >
                Close
              </Button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Scheme</p>
                <p>{selectedApplication.schemeName} (ID: {selectedApplication.schemeId})</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <StatusBadge status={selectedApplication.status} />
              </div>
              <div>
                <p className="text-muted-foreground">Submitted</p>
                <p>{selectedApplication.submittedAt ? selectedApplication.submittedAt.split("T")[0] : "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p>{selectedApplication.updatedAt ? selectedApplication.updatedAt.split("T")[0] : "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Remarks</p>
                <p>{selectedApplication.remarks || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Assigned Officer</p>
                <p>
                  {selectedApplication.officerName
                    ? `${selectedApplication.officerName} (ID: ${selectedApplication.officerId})`
                    : "Not assigned"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
