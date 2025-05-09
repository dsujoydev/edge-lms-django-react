import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Define role types
type Role = "admin" | "instructor" | "student";

// Define the structure of a navigation item
interface NavItem {
  icon: string;
  label: string;
  href: string;
}

// Define the navigation items object with strict typing
const navItems: Record<Role, NavItem[]> = {
  admin: [
    { icon: "", label: "Overview", href: "/dashboard" },
    { icon: "", label: "Users", href: "/dashboard/users" },
    { icon: "", label: "Courses", href: "/dashboard/courses" },
    { icon: "", label: "Settings", href: "/settings" },
  ],
  instructor: [
    { icon: "", label: "Dashboard", href: "/" },
    { icon: "", label: "My Courses", href: "/dashboard/courses" },
    { icon: "", label: "Calendar", href: "/calendar" },
    { icon: "", label: "Messages", href: "/messages" },
  ],
  student: [
    { icon: "", label: "Dashboard", href: "/" },
    { icon: "", label: "Courses", href: "/courses" },
    { icon: "", label: "Calendar", href: "/calendar" },
    { icon: "", label: "Grades", href: "/grades" },
  ],
};

// Sidebar component

export function Sidebar() {
  const { user } = useAuth();
  const items = user?.user_type ? navItems[user.user_type as Role] : [];
  const navigate = useNavigate();

  return (
    <div className="pb-12 min-h-screen w-40 border-r">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {items.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn("w-full justify-start gap-2", location.pathname === item.href && "bg-accent")}
                onClick={() => navigate(item.href)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
