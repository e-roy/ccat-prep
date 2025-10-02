import { useState } from "react";
import { useRouter } from "@/lib/router";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Brain, Volume2, Settings, Menu, History, Github } from "lucide-react";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: "landing" | "listen" | "settings" | "history";
}

const navigationItems: NavigationItem[] = [
  {
    id: "quiz",
    label: "Quiz",
    icon: Brain,
    route: "landing",
  },
  {
    id: "history",
    label: "History",
    icon: History,
    route: "history",
  },
  {
    id: "listen",
    label: "Listen",
    icon: Volume2,
    route: "listen",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    route: "settings",
  },
];

export default function Navigation() {
  const { currentRoute, navigate } = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (
    route: "landing" | "listen" | "settings" | "history"
  ) => {
    navigate(route);
    setIsMobileMenuOpen(false);
  };

  const handleGitHubStar = () => {
    window.open("https://github.com/your-username/ccat-prep-tool", "_blank");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-[20vw] md:flex-col md:fixed md:inset-y-0 md:z-50">
        <div className="flex flex-col flex-grow pt-5 bg-sidebar border-r border-border overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-sidebar-foreground">
              CCAT Prep
            </h1>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.route)}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-sidebar-foreground"
                    }`}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive
                          ? "text-sidebar-primary-foreground"
                          : "text-muted-foreground group-hover:text-sidebar-foreground"
                      }`}
                    />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* GitHub Star Button - At the very bottom */}
            <div className="px-2 pb-4">
              <button
                onClick={handleGitHubStar}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors text-muted-foreground hover:bg-accent hover:text-sidebar-foreground"
              >
                <Github className="mr-3 flex-shrink-0 h-5 w-5 text-muted-foreground group-hover:text-sidebar-foreground" />
                Star on GitHub
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-background border-b border-border px-4 py-2">
        <div className="flex items-center">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="w-4 h-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>CCAT Prep</SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <nav className="mt-6 space-y-2 px-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.route;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.route)}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left transition-colors ${
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-sidebar-foreground"
                      }`}
                    >
                      <Icon
                        className={`mr-3 flex-shrink-0 h-5 w-5 ${
                          isActive
                            ? "text-sidebar-primary-foreground"
                            : "text-muted-foreground group-hover:text-sidebar-foreground"
                        }`}
                      />
                      {item.label}
                    </button>
                  );
                })}

                {/* GitHub Star Button - Mobile */}
                <button
                  onClick={handleGitHubStar}
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left transition-colors text-muted-foreground hover:bg-accent hover:text-sidebar-foreground"
                >
                  <Github className="mr-3 flex-shrink-0 h-5 w-5 text-muted-foreground group-hover:text-sidebar-foreground" />
                  Star on GitHub
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}
