import { 
  Home, 
  FileCheck, 
  BookOpen, 
  History, 
  HelpCircle, 
  X, 
  LayoutDashboard,
  ClipboardCheck,
  Users
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  userRole: "user" | "officer" | "admin";
}

const getNavItems = (role: "user" | "officer" | "admin") => {
  if (role === "user") {
    return [
      { id: "home", label: "Home", icon: Home },
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "eligibility", label: "Eligibility Check", icon: FileCheck },
      { id: "schemes", label: "Schemes", icon: BookOpen },
      { id: "track-applications", label: "Track Applications", icon: ClipboardCheck },
      { id: "history", label: "History", icon: History },
      { id: "help", label: "Help", icon: HelpCircle },
    ];
  }
  
  if (role === "officer") {
    return [
      { id: "officer-dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "applications", label: "Applications", icon: ClipboardCheck },
      { id: "schemes", label: "Schemes", icon: BookOpen },
      { id: "help", label: "Help", icon: HelpCircle },
    ];
  }
  
  // Admin
  return [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-schemes", label: "Schemes", icon: BookOpen },
    { id: "admin-officers", label: "Officers", icon: Users },
    { id: "admin-applications", label: "Applications", icon: FileCheck },
    { id: "admin-users", label: "Users", icon: Users },
    { id: "help", label: "Help", icon: HelpCircle },
  ];
};

export function Sidebar({ isOpen, onClose, currentView, onNavigate, userRole }: SidebarProps) {
  const navItems = getNavItems(userRole);
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border shadow-sm z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-border">
            <h2>Navigation</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
