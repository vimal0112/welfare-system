
import { useEffect, useMemo, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Users,
  FileText,
  TrendingUp,
  Shield,
  Plus,
  Edit,
  Trash2,
  Search,
} from "lucide-react";
import { SelectItem } from "./ui/select";

interface Scheme {
  id: number;
  schemeName: string;
  category: string;
  description?: string;
  minAge?: number;
  maxAge?: number | null;
  maxIncome?: number;
  gender?: string;
  location?: string;
  occupation?: string;
  disabilityRequired?: string;
  minorityRequired?: string;
  schemeDetails?: {
    eligibility?: string;
    benefits?: string;
    documentsRequired?: string;
    applicationProcess?: string;
    officialWebsite?: string;
    helplineNumber?: string;
  };
}

interface User {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  role: string;
  active: boolean;
}

interface AdminStats {
  totalUsers: number;
  totalSchemes: number;
  totalApplications: number;
  totalOfficers: number;
}

interface AdminApplication {
  id: number;
  applicantName: string;
  schemeName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string | null;
  officerId: number | null;
}

const UNASSIGNED = "__UNASSIGNED__";

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

export function AdminDashboard({ view = "overview" }: { view?: "overview" | "schemes" | "officers" | "users" | "applications" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [officers, setOfficers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [assignSelections, setAssignSelections] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const [viewingScheme, setViewingScheme] = useState<Scheme | null>(null);
  const [showOfficerModal, setShowOfficerModal] = useState(false);

  const [schemeForm, setSchemeForm] = useState({
    schemeName: "",
    category: "",
    description: "",
    minAge: "",
    maxAge: "",
    maxIncome: "",
    gender: "ANY",
    location: "ANY",
    occupation: "ANY",
    disabilityRequired: "ANY",
    minorityRequired: "ANY",
    eligibility: "",
    benefits: "",
    documentsRequired: "",
    applicationProcess: "",
    officialWebsite: "",
    helplineNumber: "",
  });

  const [officerForm, setOfficerForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
  });


  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) =>
      scheme.schemeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [schemes, searchQuery]);

  const filteredOfficers = useMemo(() => {
    return officers.filter((officer) =>
      officer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      officer.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [officers, searchQuery]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/dashboard`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to load dashboard");
      }
      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard");
    }
  };

  const loadSchemes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/admin/schemes`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to load schemes");
      }
      const data = await response.json();
      setSchemes(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load schemes");
    } finally {
      setIsLoading(false);
    }
  };

  const loadOfficers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/admin/users?role=OFFICER`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to load officers");
      }
      const data = await response.json();
      setOfficers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load officers");
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/admin/users`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to load users");
      }
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/admin/applications`, {
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
    loadStats();
  }, []);

  useEffect(() => {
    setError(null);
    if (view === "overview") {
      loadApplications();
      loadUsers();
    }
    if (view === "schemes") loadSchemes();
    if (view === "officers") loadOfficers();
    if (view === "users") loadUsers();
    if (view === "applications") {
      loadApplications();
      loadOfficers();
    }
  }, [view]);
  const handleOpenCreateScheme = () => {
    setEditingScheme(null);
    setSchemeForm({
      schemeName: "",
      category: "",
      description: "",
      minAge: "",
      maxAge: "",
      maxIncome: "",
      gender: "ANY",
      location: "ANY",
      occupation: "ANY",
      disabilityRequired: "ANY",
      minorityRequired: "ANY",
      eligibility: "",
      benefits: "",
      documentsRequired: "",
      applicationProcess: "",
      officialWebsite: "",
      helplineNumber: "",
    });
    setShowSchemeModal(true);
  };

  const handleOpenEditScheme = (scheme: Scheme) => {
    setEditingScheme(scheme);
    setSchemeForm({
      schemeName: scheme.schemeName || "",
      category: scheme.category || "",
      description: scheme.description || "",
      minAge: scheme.minAge?.toString() || "",
      maxAge: scheme.maxAge?.toString() || "",
      maxIncome: scheme.maxIncome?.toString() || "",
      gender: scheme.gender || "ANY",
      location: scheme.location || "ANY",
      occupation: scheme.occupation || "ANY",
      disabilityRequired: scheme.disabilityRequired || "ANY",
      minorityRequired: scheme.minorityRequired || "ANY",
      eligibility: scheme.schemeDetails?.eligibility || "",
      benefits: scheme.schemeDetails?.benefits || "",
      documentsRequired: scheme.schemeDetails?.documentsRequired || "",
      applicationProcess: scheme.schemeDetails?.applicationProcess || "",
      officialWebsite: scheme.schemeDetails?.officialWebsite || "",
      helplineNumber: scheme.schemeDetails?.helplineNumber || "",
    });
    setShowSchemeModal(true);
  };

  const handleSaveScheme = async () => {
    const payload = {
      schemeName: schemeForm.schemeName,
      category: schemeForm.category,
      description: schemeForm.description,
      minAge: schemeForm.minAge ? Number(schemeForm.minAge) : null,
      maxAge: schemeForm.maxAge ? Number(schemeForm.maxAge) : null,
      maxIncome: schemeForm.maxIncome ? Number(schemeForm.maxIncome) : null,
      gender: schemeForm.gender,
      location: schemeForm.location,
      occupation: schemeForm.occupation,
      disabilityRequired: schemeForm.disabilityRequired,
      minorityRequired: schemeForm.minorityRequired,
    };
    const detailsPayload = {
      eligibility: schemeForm.eligibility,
      benefits: schemeForm.benefits,
      documentsRequired: schemeForm.documentsRequired,
      applicationProcess: schemeForm.applicationProcess,
      officialWebsite: schemeForm.officialWebsite,
      helplineNumber: schemeForm.helplineNumber,
    };

    try {
      const url = editingScheme
        ? `${API_BASE}/api/admin/schemes/${editingScheme.id}`
        : `${API_BASE}/api/admin/schemes`;
      const method = editingScheme ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to save scheme");
      }
      const savedScheme = await response.json();

      const hasDetails =
        detailsPayload.eligibility ||
        detailsPayload.benefits ||
        detailsPayload.documentsRequired ||
        detailsPayload.applicationProcess ||
        detailsPayload.officialWebsite ||
        detailsPayload.helplineNumber;

      if (hasDetails) {
        const detailsResponse = await fetch(
          `${API_BASE}/api/admin/schemes/${savedScheme.id}/details`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeaders(),
            },
            body: JSON.stringify(detailsPayload),
          }
        );
        if (!detailsResponse.ok) {
          const msg = await detailsResponse.text();
          throw new Error(msg || "Failed to save scheme details");
        }
      }

      setShowSchemeModal(false);
      await loadSchemes();
      await loadStats();
    } catch (err: any) {
      setError(err?.message || "Failed to save scheme");
    }
  };

  const handleDeleteScheme = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/schemes/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to delete scheme");
      }
      await loadSchemes();
      await loadStats();
    } catch (err: any) {
      setError(err?.message || "Failed to delete scheme");
    }
  };

  const handleCreateOfficer = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/officer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(officerForm),
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to create officer");
      }
      setShowOfficerModal(false);
      setOfficerForm({ fullName: "", email: "", mobile: "", password: "" });
      await loadOfficers();
      await loadStats();
    } catch (err: any) {
      setError(err?.message || "Failed to create officer");
    }
  };

  const handleUpdateUserRole = async (userId: number, role: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/user/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to update role");
      }
      await loadUsers();
      await loadOfficers();
      await loadStats();
    } catch (err: any) {
      setError(err?.message || "Failed to update role");
    }
  };

  const handleToggleUserStatus = async (userId: number, active: boolean) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/user/${userId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ active }),
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to update status");
      }
      await loadUsers();
      await loadOfficers();
    } catch (err: any) {
      setError(err?.message || "Failed to update status");
    }
  };

  const handleAssignOfficerFor = async (applicationId: number, officerId: number) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/admin/application/${applicationId}/assign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ officerId }),
        }
      );
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to assign officer");
      }
      await loadApplications();
    } catch (err: any) {
      setError(err?.message || "Failed to assign officer");
    }
  };

  const StatusBadge = ({ active }: { active: boolean }) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs border ${
          active
            ? "bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20"
            : "bg-muted text-muted-foreground border-border"
        }`}
      >
        {active ? "Active" : "Inactive"}
      </span>
    );
  };

  const getApplicationStatusClass = (status: AdminApplication["status"]) => {
    if (status === "APPROVED") {
      return "bg-[#4CAF50]/10 text-[#2E7D32] border-[#4CAF50]/20";
    }
    if (status === "REJECTED") {
      return "bg-destructive/10 text-destructive border-destructive/20";
    }
    return "bg-[#FFA726]/10 text-[#F57C00] border-[#FFA726]/20";
  };

  const statusCounts = useMemo(() => {
    const counts = { PENDING: 0, APPROVED: 0, REJECTED: 0 };
    applications.forEach((app) => {
      counts[app.status] += 1;
    });
    return counts;
  }, [applications]);

  const unassignedCount = useMemo(
    () => applications.filter((app) => !app.officerId).length,
    [applications]
  );

  const userStatusCounts = useMemo(() => {
    const active = users.filter((user) => user.active).length;
    const inactive = users.length - active;
    return { active, inactive };
  }, [users]);

  const recentApplications = useMemo(
    () => applications.slice(0, 5),
    [applications]
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2">System Administration</h1>
          <p className="text-muted-foreground">Manage schemes, officers, users, and applications</p>
        </div>
      </div>

      {error && (
        <Card className="p-4 border border-destructive/40 text-destructive">
          {error}
        </Card>
      )}

      {view === "overview" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                  <p className="text-3xl">{stats ? stats.totalUsers : "--"}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Schemes</p>
                  <p className="text-3xl">{stats ? stats.totalSchemes : "--"}</p>
                </div>
                <div className="bg-[#A8C2CC]/20 p-3 rounded-lg">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Applications</p>
                  <p className="text-3xl">{stats ? stats.totalApplications : "--"}</p>
                </div>
                <div className="bg-accent/10 p-3 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Officers</p>
                  <p className="text-3xl">{stats ? stats.totalOfficers : "--"}</p>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 shadow-sm">
              <h3 className="mb-4">Application Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Pending</span>
                  <span className="text-[#FFA726]">{statusCounts.PENDING}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Approved</span>
                  <span className="text-[#4CAF50]">{statusCounts.APPROVED}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rejected</span>
                  <span className="text-destructive">{statusCounts.REJECTED}</span>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Unassigned applications: {unassignedCount}
              </div>
            </Card>

            <Card className="p-6 shadow-sm">
              <h3 className="mb-4">User Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Active Users</span>
                  <span className="text-[#4CAF50]">{userStatusCounts.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Inactive Users</span>
                  <span className="text-muted-foreground">{userStatusCounts.inactive}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-sm">
              <h3 className="mb-4">Recent Applications</h3>
              {recentApplications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent applications.</p>
              ) : (
                <div className="space-y-3 text-sm">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between">
                      <div>
                        <p>{app.applicantName}</p>
                        <p className="text-xs text-muted-foreground">#{app.id} • {app.schemeName}</p>
                      </div>
                      <span className="text-xs">{app.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
      {view === "schemes" && (
        <>
          <Card className="p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search schemes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button onClick={handleOpenCreateScheme} className="bg-accent hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Add New Scheme
              </Button>
            </div>
          </Card>

          <Card className="shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 text-sm">Scheme ID</th>
                    <th className="text-left p-4 text-sm">Scheme Name</th>
                    <th className="text-left p-4 text-sm">Category</th>
                    <th className="text-left p-4 text-sm">Min Age</th>
                    <th className="text-left p-4 text-sm">Max Income</th>
                    <th className="text-center p-4 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchemes.map((scheme) => (
                    <tr key={scheme.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">{scheme.id}</td>
                      <td className="p-4">{scheme.schemeName}</td>
                      <td className="p-4">{scheme.category}</td>
                      <td className="p-4">{scheme.minAge ?? "-"}</td>
                      <td className="p-4">{scheme.maxIncome ?? "-"}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleOpenEditScheme(scheme)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setViewingScheme(scheme)}>
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteScheme(scheme.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {isLoading && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Loading schemes...</p>
                </div>
              )}

              {!isLoading && filteredSchemes.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No schemes found</p>
                </div>
              )}
            </div>
          </Card>
        </>
      )}
      {view === "officers" && (
        <>
          <Card className="p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search officers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button onClick={() => setShowOfficerModal(true)} className="bg-accent hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Add New Officer
              </Button>
            </div>
          </Card>

          <Card className="shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 text-sm">Officer ID</th>
                    <th className="text-left p-4 text-sm">Name</th>
                    <th className="text-left p-4 text-sm">Email</th>
                    <th className="text-left p-4 text-sm">Status</th>
                    <th className="text-left p-4 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOfficers.map((officer) => (
                    <tr key={officer.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">{officer.id}</td>
                      <td className="p-4">{officer.fullName}</td>
                      <td className="p-4">{officer.email}</td>
                      <td className="p-4">
                        <StatusBadge active={officer.active} />
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleUserStatus(officer.id, !officer.active)}
                          >
                            {officer.active ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {isLoading && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Loading officers...</p>
                </div>
              )}

              {!isLoading && filteredOfficers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No officers found</p>
                </div>
              )}
            </div>
          </Card>

        </>
      )}

      {view === "applications" && (
        <>
          <Card className="p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 text-sm">Application ID</th>
                    <th className="text-left p-4 text-sm">Applicant</th>
                    <th className="text-left p-4 text-sm">Scheme</th>
                    <th className="text-left p-4 text-sm">Status</th>
                    <th className="text-left p-4 text-sm">Officer</th>
                    <th className="text-left p-4 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications
                    .filter((app) =>
                      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      app.schemeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      String(app.id).includes(searchQuery)
                    )
                    .map((app) => (
                      <tr key={app.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4">{app.id}</td>
                        <td className="p-4">{app.applicantName}</td>
                        <td className="p-4">{app.schemeName}</td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs border ${getApplicationStatusClass(app.status)}`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <Select
                            value={
                              assignSelections[app.id] ??
                              (app.officerId ? String(app.officerId) : UNASSIGNED)
                            }
                            onValueChange={(value) => {
                              if (value === UNASSIGNED) {
                                const next = { ...assignSelections };
                                delete next[app.id];
                                setAssignSelections(next);
                                return;
                              }
                              setAssignSelections({ ...assignSelections, [app.id]: value });
                            }}
                          >
                            <SelectTrigger className="h-9 w-[200px]">
                              <SelectValue placeholder="Unassigned" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                              {officers.map((officer) => (
                                <SelectItem key={officer.id} value={String(officer.id)}>
                                  {officer.fullName} (#{officer.id})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4">
                          {(() => {
                            const selected =
                              assignSelections[app.id] ??
                              (app.officerId ? String(app.officerId) : UNASSIGNED);
                            const isAssigned = !!app.officerId;
                            const isSameAsCurrent =
                              isAssigned && selected === String(app.officerId);
                            const canAssign = !!selected && selected !== UNASSIGNED && !isSameAsCurrent;

                            return (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!canAssign}
                            onClick={() => {
                              if (!canAssign) return;
                              handleAssignOfficerFor(app.id, Number(selected));
                            }}
                          >
                            {isSameAsCurrent ? "Assigned" : "Assign"}
                          </Button>
                            );
                          })()}
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

              {!isLoading && applications.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No applications found</p>
                </div>
              )}
            </div>
          </Card>
        </>
      )}

      {view === "users" && (
        <>
          <Card className="p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 text-sm">User ID</th>
                    <th className="text-left p-4 text-sm">Name</th>
                    <th className="text-left p-4 text-sm">Email</th>
                    <th className="text-left p-4 text-sm">Role</th>
                    <th className="text-left p-4 text-sm">Status</th>
                    <th className="text-left p-4 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">{user.id}</td>
                      <td className="p-4">{user.fullName}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.role}</td>
                      <td className="p-4">
                        <StatusBadge active={user.active} />
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateUserRole(user.id, user.role === "USER" ? "OFFICER" : "USER")}
                          >
                            {user.role === "USER" ? "Make Officer" : "Make User"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.id, !user.active)}
                          >
                            {user.active ? "Block" : "Unblock"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {isLoading && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Loading users...</p>
                </div>
              )}

              {!isLoading && filteredUsers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No users found</p>
                </div>
              )}
            </div>
          </Card>
        </>
      )}
      {showSchemeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <Card className="w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl">{editingScheme ? "Edit Scheme" : "Add New Scheme"}</h3>
              <Button variant="outline" onClick={() => setShowSchemeModal(false)}>
                Close
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="schemeName">Scheme Name *</Label>
                <Input
                  id="schemeName"
                  className="mt-2"
                  placeholder="Enter scheme name"
                  value={schemeForm.schemeName}
                  onChange={(e) => setSchemeForm({ ...schemeForm, schemeName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="schemeCategory">Category *</Label>
                <Input
                  id="schemeCategory"
                  className="mt-2"
                  placeholder="Enter category"
                  value={schemeForm.category}
                  onChange={(e) => setSchemeForm({ ...schemeForm, category: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="minAge">Min Age</Label>
                <Input
                  id="minAge"
                  className="mt-2"
                  type="number"
                  value={schemeForm.minAge}
                  onChange={(e) => setSchemeForm({ ...schemeForm, minAge: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="maxAge">Max Age</Label>
                <Input
                  id="maxAge"
                  className="mt-2"
                  type="number"
                  value={schemeForm.maxAge}
                  onChange={(e) => setSchemeForm({ ...schemeForm, maxAge: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="maxIncome">Income Limit</Label>
                <Input
                  id="maxIncome"
                  className="mt-2"
                  type="number"
                  value={schemeForm.maxIncome}
                  onChange={(e) => setSchemeForm({ ...schemeForm, maxIncome: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  className="mt-2"
                  value={schemeForm.gender}
                  onChange={(e) => setSchemeForm({ ...schemeForm, gender: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  className="mt-2"
                  value={schemeForm.location}
                  onChange={(e) => setSchemeForm({ ...schemeForm, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  className="mt-2"
                  value={schemeForm.occupation}
                  onChange={(e) => setSchemeForm({ ...schemeForm, occupation: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="disability">Disability Required</Label>
                <Input
                  id="disability"
                  className="mt-2"
                  value={schemeForm.disabilityRequired}
                  onChange={(e) => setSchemeForm({ ...schemeForm, disabilityRequired: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="minority">Minority Required</Label>
                <Input
                  id="minority"
                  className="mt-2"
                  value={schemeForm.minorityRequired}
                  onChange={(e) => setSchemeForm({ ...schemeForm, minorityRequired: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="schemeDescription">Description</Label>
                <textarea
                  id="schemeDescription"
                  className="w-full mt-2 p-3 border border-border rounded-md min-h-[100px] bg-background"
                  placeholder="Enter scheme description"
                  value={schemeForm.description}
                  onChange={(e) => setSchemeForm({ ...schemeForm, description: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="eligibility">Eligibility (Details)</Label>
                <textarea
                  id="eligibility"
                  className="w-full mt-2 p-3 border border-border rounded-md min-h-[80px] bg-background"
                  placeholder="Eligibility requirements"
                  value={schemeForm.eligibility}
                  onChange={(e) => setSchemeForm({ ...schemeForm, eligibility: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="benefits">Benefits</Label>
                <textarea
                  id="benefits"
                  className="w-full mt-2 p-3 border border-border rounded-md min-h-[80px] bg-background"
                  placeholder="Benefits provided by the scheme"
                  value={schemeForm.benefits}
                  onChange={(e) => setSchemeForm({ ...schemeForm, benefits: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="documentsRequired">Documents Required</Label>
                <textarea
                  id="documentsRequired"
                  className="w-full mt-2 p-3 border border-border rounded-md min-h-[80px] bg-background"
                  placeholder="List required documents"
                  value={schemeForm.documentsRequired}
                  onChange={(e) => setSchemeForm({ ...schemeForm, documentsRequired: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="applicationProcess">Application Process</Label>
                <textarea
                  id="applicationProcess"
                  className="w-full mt-2 p-3 border border-border rounded-md min-h-[80px] bg-background"
                  placeholder="Steps to apply"
                  value={schemeForm.applicationProcess}
                  onChange={(e) => setSchemeForm({ ...schemeForm, applicationProcess: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="officialWebsite">Official Website</Label>
                <Input
                  id="officialWebsite"
                  className="mt-2"
                  placeholder="https://example.gov"
                  value={schemeForm.officialWebsite}
                  onChange={(e) => setSchemeForm({ ...schemeForm, officialWebsite: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="helplineNumber">Helpline Number</Label>
                <Input
                  id="helplineNumber"
                  className="mt-2"
                  placeholder="1800-000-000"
                  value={schemeForm.helplineNumber}
                  onChange={(e) => setSchemeForm({ ...schemeForm, helplineNumber: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowSchemeModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button className="flex-1 bg-accent hover:bg-accent/90" onClick={handleSaveScheme}>
                {editingScheme ? "Save Changes" : "Create Scheme"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {viewingScheme && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <Card className="w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl mb-1">{viewingScheme.schemeName}</h3>
                <p className="text-sm text-muted-foreground">Scheme Details</p>
              </div>
              <Button variant="outline" onClick={() => setViewingScheme(null)}>
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p>{viewingScheme.category || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Occupation</p>
                <p>{viewingScheme.occupation || "ANY"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Min Age</p>
                <p>{viewingScheme.minAge ?? "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Max Age</p>
                <p>{viewingScheme.maxAge ?? "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Max Income</p>
                <p>{viewingScheme.maxIncome ?? "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p>{viewingScheme.gender || "ANY"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p>{viewingScheme.location || "ANY"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Disability Required</p>
                <p>{viewingScheme.disabilityRequired || "ANY"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Minority Required</p>
                <p>{viewingScheme.minorityRequired || "ANY"}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{viewingScheme.description || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Eligibility</p>
                <p>{viewingScheme.schemeDetails?.eligibility || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Benefits</p>
                <p>{viewingScheme.schemeDetails?.benefits || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documents Required</p>
                <p>{viewingScheme.schemeDetails?.documentsRequired || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Application Process</p>
                <p>{viewingScheme.schemeDetails?.applicationProcess || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Official Website</p>
                <p>{viewingScheme.schemeDetails?.officialWebsite || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Helpline Number</p>
                <p>{viewingScheme.schemeDetails?.helplineNumber || "-"}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showOfficerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <Card className="w-full max-w-md p-6 shadow-xl">
            <h3 className="text-xl mb-4">Add New Officer</h3>
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="officerName">Full Name *</Label>
                <Input
                  id="officerName"
                  className="mt-2"
                  placeholder="Enter officer name"
                  value={officerForm.fullName}
                  onChange={(e) => setOfficerForm({ ...officerForm, fullName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="officerEmail">Email *</Label>
                <Input
                  id="officerEmail"
                  type="email"
                  className="mt-2"
                  placeholder="Enter email address"
                  value={officerForm.email}
                  onChange={(e) => setOfficerForm({ ...officerForm, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="officerPhone">Phone Number *</Label>
                <Input
                  id="officerPhone"
                  type="tel"
                  className="mt-2"
                  placeholder="Enter phone number"
                  value={officerForm.mobile}
                  onChange={(e) => setOfficerForm({ ...officerForm, mobile: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="officerPassword">Password *</Label>
                <Input
                  id="officerPassword"
                  type="password"
                  className="mt-2"
                  placeholder="Set password"
                  value={officerForm.password}
                  onChange={(e) => setOfficerForm({ ...officerForm, password: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowOfficerModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button className="flex-1 bg-accent hover:bg-accent/90" onClick={handleCreateOfficer}>
                Add Officer
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
