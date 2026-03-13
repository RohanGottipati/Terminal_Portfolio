import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navLinks = [
  { id: "home", title: "Home", to: "/" },
  { id: "projects", title: "Projects", to: "/projects" },
  { id: "experience", title: "Experience", to: "/experience" },
  { id: "contact", title: "Contact", to: "/contact" },
  { id: "resume", title: "Resume", to: "/resume" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (link) => {
    setOpen(false);

    // For resume, navigate to resume page
    if (link.id === "resume") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }

    // For contact, redirect to email
    if (link.id === "contact") {
      window.location.href = "mailto:rohan.gottipati@gmail.com";
      return;
    }

    // For all other pages, force scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  const NavLinkItem = ({ link }) => {
    if (link.id === "contact") {
      return (
        <button
          onClick={() => handleNavClick(link)}
          className="text-gray-300 hover:text-blue-800 font-medium transition-colors duration-300"
        >
          {link.title}
        </button>
      );
    }
    return (
      <NavLink
        to={link.to}
        className={({ isActive }) =>
          isActive
            ? "text-blue-800 font-medium"
            : "text-gray-300 hover:text-blue-800 font-medium transition-colors duration-300"
        }
        onClick={() => handleNavClick(link)}
      >
        {link.title}
      </NavLink>
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-30 bg-black/20 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-center px-6 py-4">
        {/* Desktop Navigation - Centered */}
        <ul className="hidden md:flex gap-8 justify-center items-center">
          {navLinks.map((link) => (
            <li key={link.id}>
              <NavLinkItem link={link} />
            </li>
          ))}
        </ul>

        {/* Mobile Menu - Sheet */}
        <div className="md:hidden absolute right-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                aria-label="Toggle menu"
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <path
                    d={open
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-gray-800 w-64">
              <ul className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <NavLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
