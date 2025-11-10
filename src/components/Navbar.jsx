import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

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
    if (link.id === "resume") return;
    
    // For contact, redirect to email
    if (link.id === "contact") {
      window.location.href = "mailto:rohan.gottipati@gmail.com";
      return;
    }
    
    // For all other pages, ScrollToTop component will handle scrolling
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-30 bg-black shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-center px-6 py-4">
        {/* Desktop Navigation - Centered */}
        <ul className="hidden md:flex gap-8 justify-center items-center">
          {navLinks.map((link) =>
            link.id === "resume" ? (
              <li key={link.id}>
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
              </li>
            ) : link.id === "contact" ? (
              <li key={link.id}>
                <button
                  onClick={() => handleNavClick(link)}
                  className="text-gray-300 hover:text-blue-800 font-medium transition-colors duration-300"
                >
                  {link.title}
                </button>
              </li>
            ) : (
              <li key={link.id}>
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
              </li>
            )
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white absolute right-6"
          onClick={() => setOpen((o) => !o)}
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
        </button>

        {/* Mobile Menu */}
        {open && (
          <div className="absolute top-full left-0 w-full bg-black shadow-lg md:hidden">
            <ul className="flex flex-col gap-4 p-4">
              {navLinks.map((link) =>
                link.id === "resume" ? (
                  <li key={link.id}>
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
                  </li>
                ) : link.id === "contact" ? (
                  <li key={link.id}>
                    <button
                      onClick={() => handleNavClick(link)}
                      className="text-gray-300 hover:text-blue-800 font-medium transition-colors duration-300"
                    >
                      {link.title}
                    </button>
                  </li>
                ) : (
                  <li key={link.id}>
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
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
// Accessibility improvements
// Dark mode implementation
// Keyboard navigation
