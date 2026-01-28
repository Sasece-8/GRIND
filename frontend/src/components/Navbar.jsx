import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown, Briefcase } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white/5 backdrop-blur-xl border-b border-white/5 shadow-lg px-6 py-4 flex justify-between items-center fixed w-full top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-white font-sans tracking-tight">
        GRIND
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
          Home
        </Link>
        <Link to="/courses" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
          Courses
        </Link>

        {!user ? (
          <>
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-indigo-500/20">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-2 rounded-full transition-all group"
              >
                <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] rounded-full">
                  <div className="bg-gray-900 rounded-full p-1">
                    <User size={14} className="text-white" />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{user.username || "User"}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-white/5 mb-1">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate">{user.email || user.username}</p>
                  </div>

                  <Link
                    to={user.role === "educator" ? "/educator/profile" : "/student/profile"}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={16} />
                    My Profile
                  </Link>
                  {user.role === "educator" && (
                    <Link
                      to="/educator/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Briefcase size={16} />
                      Dashboard
                    </Link>
                  )}

                  <div className="h-px bg-white/5 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
