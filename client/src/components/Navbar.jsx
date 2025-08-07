import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/MattyLogo.png";

export default function Navbar() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => dispatch(logout());

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setIsOpen(false)}
      className={`px-4 py-2 rounded-full transition-all font-medium ${
        location.pathname === to
          ? "bg-indigo-500 text-white"
          : "text-gray-200 hover:bg-indigo-600 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md shadow-lg border-b border-black/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Matty logo"
            className="h-8 w-8 object-contain filter invert"
          />
          <span className="text-white text-xl font-semibold">Matty</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              {navLink("/login", "Login")}
              {navLink("/register", "Sign Up")}
            </>
          ) : (
            <>
              {navLink("/editor", "Design Editor")}
              {navLink("/dashboard", "My Designs")}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col space-y-2 bg-black/20 backdrop-blur">
          {!user ? (
            <>
              {navLink("/login", "Login")}
              {navLink("/register", "Sign Up")}
            </>
          ) : (
            <>
              {navLink("/editor", "Design Editor")}
              {navLink("/dashboard", "My Designs")}
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
