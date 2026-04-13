import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "Audio Narratives", path: "/audio" },
    { name: "Archive", path: "/archive" },
    { name: "Survival", path: "/survival" },
    { name: "Epilogue", path: "/epilogue" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Left: Exhibition Title */}
        <Link to="/" className="text-sm font-semibold tracking-wide">
          Benin Exhibition
        </Link>

        {/* Right: Navigation Links */}
        <div className="flex gap-6 text-sm">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition ${
                location.pathname === link.path
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

      </div>
    </nav>
  );
}