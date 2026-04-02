import { useEffect, useMemo, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

interface ApplicationSummary {
  id: number;
  applicantName: string;
  schemeName: string;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface DashboardData {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  recentApplications: ApplicationSummary[];
}

interface ApplicationDetail {
  id: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string | null;
  updatedAt: string | null;
  remarks: string | null;
  officerId: number | null;
  applicationData: string | null;
  citizen?: {
    id: number;
    fullName: string;
    email: string;
    mobile: string;
  };
  scheme?: {
    id: number;
    schemeName: string;
  };
}

type ParsedApplicationData = {
  address?: string;
  annualIncome?: string;
  documents?: string;
  notes?: string;
};

function parseApplicationData(raw: string | null): ParsedApplicationData | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed as ParsedApplicationData;
    }
    return null;
  } catch {
    return null;
  }
}

const API_BASE = import.meta.env.VITE_API_URL;

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

export function OfficerDashboard({ view = "dashboard" }: { view?: "dashboard" | "applications" }) {
  const [selectedTab, setSelectedTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedApplication, setSelectedApplication] = useState<ApplicationSummary | null>(null);
  const [selectedApplicationDetail, setSelectedApplicationDetail] = useState<ApplicationDetail | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [remarks, setRemarks] = useState("");

  const filteredApplications = useMemo(() => {
    return applications.filter(app =>
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(app.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.schemeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [applications, searchQuery]);

  const pendingCount = dashboard?.pendingCount ?? 0;
  const approvedCount = dashboard?.approvedCount ?? 0;
  const rejectedCount = dashboard?.rejectedCount ?? 0;
  const recentApplications = dashboard?.recentApplications ?? [];

  const loadDashboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/officer/dashboard`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to load dashboard");
      }

      const data = await response.json();
      setDashboard(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard");
    }
  };

  const loadApplications = async (status: "pending" | "approved" | "rejected") => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const url =
        status === "pending"
          ? `${API_BASE}/api/officer/applications/pending`
          : `${API_BASE}/api/officer/applications?status=${status.toUpperCase()}`;

      const response = await fetch(url, { headers });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to load applications");
      }

      const data = await response.json();
      setApplications(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  const loadApplicationDetail = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/officer/application/${id}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to load application details");
      }
      const data = await response.json();
      setSelectedApplicationDetail(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load application details");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    loadApplications(selectedTab);
  }, [selectedTab]);

  const handleAction = (app: ApplicationSummary, action: "approve" | "reject") => {
    setSelectedApplication(app);
    setActionType(action);
    setShowActionModal(true);
  };

  const handleSubmitAction = async () => {
    if (!selectedApplication || !actionType) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/officer/application/${selectedApplication.id}/${actionType}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
          },
          body: JSON.stringify({ remarks })
        }
      );

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Action failed");
      }

      setShowActionModal(false);
      setSelectedApplication(null);
      setActionType(null);
      setRemarks("");
      setShowDetailModal(false);
      setSelectedApplicationDetail(null);

      await loadDashboard();
      await loadApplications(selectedTab);
    } catch (err: any) {
      setError(err?.message || "Action failed");
    }
  };

  const handleView = async (app: ApplicationSummary) => {
    setSelectedApplicationDetail(null);
    setSelectedApplication(app);
    setShowDetailModal(true);
    await loadApplicationDetail(app.id);
  };

  const StatusBadge = ({ status }: { status: "PENDING" | "APPROVED" | "REJECTED" }) => {
    const styles = {
      PENDING: "bg-[#FFA726]/10 text-[#FFA726] border-[#FFA726]/20",
      APPROVED: "bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20",
      REJECTED: "bg-destructive/10 text-destructive border-destructive/20"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs border ${styles[status]}`}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
    );
  };

  const parsedApplicationData = selectedApplicationDetail
    ? parseApplicationData(selectedApplicationDetail.applicationData)
    : null;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl mb-2">
          {view === "dashboard" ? "Officer Dashboard" : "Applications"}
        </h1>
        <p className="text-muted-foreground">
          {view === "dashboard"
            ? "Overview of application status and recent submissions"
            : "Review and process welfare scheme applications"}
        </p>
      </div>

      {view === "dashboard" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Applications</p>
                  <p className="text-3xl">{pendingCount}</p>
                </div>
                <div className="bg-[#FFA726]/10 p-3 rounded-lg">
                  <Clock className="h-8 w-8 text-[#FFA726]" />
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Approved</p>
                  <p className="text-3xl">{approvedCount}</p>
                </div>
                <div className="bg-[#4CAF50]/10 p-3 rounded-lg">
                  <CheckCircle2 className="h-8 w-8 text-[#4CAF50]" />
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rejected</p>
                  <p className="text-3xl">{rejectedCount}</p>
                </div>
                <div className="bg-destructive/10 p-3 rounded-lg">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
              </div>
            </Card>
          </div>

          {/* Recently Submitted */}
          <Card className="p-6 shadow-sm">
            <h3 className="text-lg mb-4">Recently Submitted Applications</h3>
            {recentApplications.length === 0 ? (
              <p className="text-muted-foreground">No recent applications.</p>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between border-b border-border pb-3 last:border-b-0">
                    <div>
                      <p className="text-sm">{app.applicantName}</p>
                      <p className="text-xs text-muted-foreground">
                        #{app.id} • {app.schemeName}
                      </p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      {view === "applications" && (
        <>
          {/* Search and Filter */}
          <Card className="p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by name, ID, or scheme..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={selectedTab === "pending" ? "default" : "outline"}
                  onClick={() => setSelectedTab("pending")}
                  className={selectedTab === "pending" ? "bg-[#FFA726] hover:bg-[#FFA726]/90" : ""}
                >
                  Pending ({pendingCount})
                </Button>
                <Button
                  variant={selectedTab === "approved" ? "default" : "outline"}
                  onClick={() => setSelectedTab("approved")}
                  className={selectedTab === "approved" ? "bg-[#4CAF50] hover:bg-[#4CAF50]/90" : ""}
                >
                  Approved ({approvedCount})
                </Button>
                <Button
                  variant={selectedTab === "rejected" ? "default" : "outline"}
                  onClick={() => setSelectedTab("rejected")}
                >
                  Rejected ({rejectedCount})
                </Button>
              </div>
            </div>
          </Card>

          {/* Applications Table */}
          <Card className="shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 text-sm">Application ID</th>
                    <th className="text-left p-4 text-sm">Applicant Name</th>
                    <th className="text-left p-4 text-sm">Scheme</th>
                    <th className="text-left p-4 text-sm">Submitted Date</th>
                    <th className="text-left p-4 text-sm">Status</th>
                    <th className="text-left p-4 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">{app.id}</td>
                      <td className="p-4">{app.applicantName}</td>
                      <td className="p-4">{app.schemeName}</td>
                      <td className="p-4">{app.submittedAt ? app.submittedAt.split("T")[0] : "-"}</td>
                      <td className="p-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleView(app)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {app.status === "PENDING" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAction(app, "approve")}
                                className="text-[#4CAF50] border-[#4CAF50]/30 hover:bg-[#4CAF50]/10"
                              >
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAction(app, "reject")}
                                className="text-destructive border-destructive/30 hover:bg-destructive/10"
                              >
                                <ThumbsDown className="h-4 w-4" />
                              </Button>
                            </>
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
                  <FileCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No applications found</p>
                </div>
              )}
            </div>
          </Card>
        </>
      )}

      {error && (
        <Card className="p-4 border border-destructive/40 text-destructive">
          {error}
        </Card>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <Card className="w-full max-w-2xl p-6 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl mb-1">Application Details</h3>
                <p className="text-sm text-muted-foreground">#{selectedApplication.id}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedApplicationDetail(null);
                }}
              >
                Close
              </Button>
            </div>

            {!selectedApplicationDetail ? (
              <p className="text-muted-foreground">Loading details...</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="text-sm mb-2">Citizen Details</h4>
                    <p className="text-sm">Name: {selectedApplicationDetail.citizen?.fullName || "-"}</p>
                    <p className="text-sm">Email: {selectedApplicationDetail.citizen?.email || "-"}</p>
                    <p className="text-sm">Mobile: {selectedApplicationDetail.citizen?.mobile || "-"}</p>
                  </Card>

                  <Card className="p-4">
                    <h4 className="text-sm mb-2">Scheme Details</h4>
                    <p className="text-sm">Name: {selectedApplicationDetail.scheme?.schemeName || "-"}</p>
                    <p className="text-sm">Scheme ID: {selectedApplicationDetail.scheme?.id ?? "-"}</p>
                  </Card>
                </div>

                <Card className="p-4">
                  <h4 className="text-sm mb-2">Submitted Application</h4>
                  {parsedApplicationData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Address</p>
                        <p>{parsedApplicationData.address || "-"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Annual Income</p>
                        <p>{parsedApplicationData.annualIncome || "-"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Documents</p>
                        <p>{parsedApplicationData.documents || "-"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Notes</p>
                        <p>{parsedApplicationData.notes || "-"}</p>
                      </div>
                    </div>
                  ) : selectedApplicationDetail.applicationData ? (
                    <pre className="text-xs whitespace-pre-wrap bg-muted/40 p-3 rounded-md">
                      {selectedApplicationDetail.applicationData}
                    </pre>
                  ) : (
                    <p className="text-sm text-muted-foreground">No submission data captured.</p>
                  )}
                </Card>

                <div className="flex items-center justify-between">
                  <StatusBadge status={selectedApplicationDetail.status} />
                  {selectedApplicationDetail.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleAction(selectedApplication, "approve")}
                        className="text-[#4CAF50] border-[#4CAF50]/30 hover:bg-[#4CAF50]/10"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleAction(selectedApplication, "reject")}
                        className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <Card className="w-full max-w-md p-6 shadow-xl">
            <div className="mb-4">
              <h3 className="text-xl mb-2">
                {actionType === "approve" ? "Approve Application" : "Reject Application"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Application ID: {selectedApplication.id} - {selectedApplication.applicantName}
              </p>
            </div>

            <div className="mb-6">
              <Label htmlFor="remarks">Remarks / Notes *</Label>
              <textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full mt-2 p-3 border border-border rounded-md min-h-[100px] bg-background"
                placeholder={`Enter reason for ${actionType}...`}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedApplication(null);
                  setActionType(null);
                  setRemarks("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitAction}
                disabled={!remarks.trim()}
                className={`flex-1 ${
                  actionType === "approve"
                    ? "bg-[#4CAF50] hover:bg-[#4CAF50]/90"
                    : "bg-destructive hover:bg-destructive/90"
                }`}
              >
                Confirm {actionType === "approve" ? "Approval" : "Rejection"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}


