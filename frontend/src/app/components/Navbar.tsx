import { Building2, User, Menu, LogOut, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";


interface NavbarProps {
  onMenuClick: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  onViewProfile?: () => void;
}

interface LoggedUser {
  fullName?: string;
  email?: string;
}

export function Navbar({
  onMenuClick,
  onLogout,
  isAuthenticated = false,
  onViewProfile,
}: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load logged-in user from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setLoggedUser(JSON.parse(userStr));
      }
    }
  }, [isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="text-primary-foreground hover:bg-primary-foreground/10 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="bg-primary-foreground/10 p-2 rounded-lg">
                <Building2 className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg leading-tight">
                  Government Welfare Advisory System
                </h1>
                <p className="text-xs text-primary-foreground/70 hidden sm:block">
                  Empowering Citizens
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
                >
                  <User className="h-5 w-5" />
                </Button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-xl z-50">
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <UserCircle className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {loggedUser?.fullName || "User"}
                          </p>
                          <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                            {loggedUser?.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onViewProfile?.(); 
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-foreground transition-colors"
                      >
                        <UserCircle className="h-4 w-4" />
                        <span>View Profile</span>
                      </button>



                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          localStorage.removeItem("user");
                          onLogout?.();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
