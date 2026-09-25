import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type NavItem = { name: string; path: string };
type NavGroup = { name: string; items: NavItem[] };

const groups: NavGroup[] = [
  { name: "Listen", items: [{ name: "Audio Narratives", path: "/audio" }] },
  { name: "Explore", items: [{ name: "Atlas", path: "/atlas" }, { name: "Archive", path: "/archive" }] },
  {
    name: "Museums",
    items: [
      { name: "Oxford", path: "/oxford" },
      { name: "British Museum", path: "/british-museum" },
      { name: "Met Museum", path: "/met-museum" },
      { name: "SMB", path: "/smb" },
    ],
  },
  {
    name: "Context",
    items: [
      { name: "Restitution", path: "/restitution" },
      { name: "Survival", path: "/survival" },
      { name: "1897 Context Images", path: "/context" },
      { name: "Epilogue", path: "/epilogue" },
    ],
  },
  { name: "About", items: [{ name: "Author", path: "/about" }] },
];

const isCurrentPath = (pathname: string, path: string) =>
  pathname === path || (path === "/" && pathname === "/home");

function NavLink({ item, onNavigate, mobile = false }: { item: NavItem; onNavigate: () => void; mobile?: boolean }) {
  const location = useLocation();
  const active = isCurrentPath(location.pathname, item.path);
  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      className={`block rounded-sm transition-colors ${mobile ? "px-3 py-2.5 text-sm" : "px-3 py-2 text-sm"} ${
        active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {item.name}
    </Link>
  );
}

export default function Navbar() {
  const location = useLocation();
  const [openDesktopGroup, setOpenDesktopGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileGroups, setOpenMobileGroups] = useState<string[]>([]);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpenDesktopGroup(null);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenDesktopGroup(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenDesktopGroup(null);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const isGroupActive = (group: NavGroup) => group.items.some((item) => isCurrentPath(location.pathname, item.path));
  const toggleMobileGroup = (name: string) => {
    setOpenMobileGroups((current) => current.includes(name) ? current.filter((group) => group !== name) : [...current, name]);
  };

  return (
    <nav ref={navRef} className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur" aria-label="Primary navigation">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <Link to="/" className="shrink-0 text-sm font-semibold tracking-wide" onClick={() => setMobileOpen(false)}>Benin Exhibition</Link>

        <div className="hidden min-w-0 items-center justify-end gap-1 lg:flex">
          <Link
            to="/"
            className={`rounded-sm px-3 py-2 text-sm transition-colors ${isCurrentPath(location.pathname, "/") ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            aria-current={isCurrentPath(location.pathname, "/") ? "page" : undefined}
          >Home</Link>
          {groups.map((group) => {
            const isOpen = openDesktopGroup === group.name;
            const active = isGroupActive(group);
            return (
              <div key={group.name} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDesktopGroup(isOpen ? null : group.name)}
                  onMouseEnter={() => setOpenDesktopGroup(group.name)}
                  className={`inline-flex items-center gap-1 rounded-sm px-3 py-2 text-sm transition-colors ${active || isOpen ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                  aria-expanded={isOpen}
                  aria-haspopup="menu"
                >
                  {group.name}<ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="absolute right-0 top-full mt-1 min-w-48 rounded-md border border-border bg-popover p-1.5 shadow-lg" role="menu" onMouseLeave={() => setOpenDesktopGroup(null)}>
                    {group.items.map((item) => <NavLink key={item.path} item={item} onNavigate={() => setOpenDesktopGroup(null)} />)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button type="button" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden" onClick={() => setMobileOpen((current) => !current)} aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? "Close navigation" : "Open navigation"}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div id="mobile-navigation" className="border-t border-border px-4 pb-4 pt-2 lg:hidden sm:px-6">
          <Link to="/" onClick={() => setMobileOpen(false)} className={`block rounded-sm px-3 py-2.5 text-sm ${isCurrentPath(location.pathname, "/") ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground"}`}>Home</Link>
          <div className="mt-1 space-y-1">
            {groups.map((group) => {
              const isOpen = openMobileGroups.includes(group.name);
              const active = isGroupActive(group);
              return (
                <div key={group.name}>
                  <button type="button" onClick={() => toggleMobileGroup(group.name)} className={`flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left text-sm transition-colors ${active ? "font-medium text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`} aria-expanded={isOpen}>
                    {group.name}<ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && <div className="ml-3 border-l border-border pl-2">{group.items.map((item) => <NavLink key={item.path} item={item} mobile onNavigate={() => setMobileOpen(false)} />)}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
