import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "Audio Narratives", path: "/audio" },
    { name: "Archive", path: "/archive" },
    { name: "Oxford", path: "/oxford" },
    { name: "British Museum", path: "/british-museum" },
    { name: "Met Museum", path: "/met-museum" },
<<<<<<< HEAD
    { name: "Restitution", path: "/restitution" },
=======
    { name: "SMB", path: "/smb" },
>>>>>>> experiment-audio
    { name: "Survival", path: "/survival" },
    { name: "Epilogue", path: "/epilogue" },
    { name: "Context", path: "/context" },
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
        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-xs md:text-sm">
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