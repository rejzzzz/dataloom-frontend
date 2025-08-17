import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Database, Menu, X, LogOut, User } from "lucide-react";
import { isAuthenticated, logout } from "@/lib/api";
import { ROUTES } from "@/constants/routes";

const navLinkBase = "text-sm font-medium transition-colors";

const Navbar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path: string) => location.pathname === path;
    const [menuOpen, setMenuOpen] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        setAuthenticated(isAuthenticated());
    }, [location.pathname]);

    const handleLogout = async () => {
        await logout();
        setAuthenticated(false);
        navigate(ROUTES.LOGIN);
    };

    return (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl">
            <header className="rounded-2xl bg-white/80 backdrop-blur-lg shadow-lg shadow-indigo-200 border border-gray-200 px-6 md:px-10 py-2 flex items-center justify-between">
                {/* Logo Section */}
                <Link
                    to={ROUTES.HOME}
                    className="flex items-center gap-2 group"
                >
                    <div className="p-2 rounded-md bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow">
                        <Database className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                        DataLoom
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {authenticated ? (
                        <>
                            <Link
                                to={ROUTES.SCHEMA_GENERATION}
                                className={`${navLinkBase} ${
                                    isActive(ROUTES.SCHEMA_GENERATION)
                                        ? "text-indigo-600"
                                        : "text-gray-600 hover:text-indigo-500"
                                } flex items-center gap-1`}
                            >
                                <Database className="w-4 h-4" />
                                Generate
                            </Link>
                            <Link
                                to={ROUTES.DASHBOARD}
                                className={`${navLinkBase} ${
                                    isActive(ROUTES.DASHBOARD)
                                        ? "text-indigo-600"
                                        : "text-gray-600 hover:text-indigo-500"
                                } flex items-center gap-1`}
                            >
                                <User className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className={`${navLinkBase} text-gray-600 hover:text-indigo-500 flex items-center gap-1`}
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to={ROUTES.LOGIN}
                                className={`${navLinkBase} ${
                                    isActive(ROUTES.LOGIN)
                                        ? "text-indigo-600"
                                        : "text-gray-600 hover:text-indigo-500"
                                }`}
                            >
                                Login
                            </Link>
                            <Link
                                to={ROUTES.SIGNUP}
                                className={`${navLinkBase} ${
                                    isActive(ROUTES.SIGNUP)
                                        ? "text-indigo-600"
                                        : "text-gray-600 hover:text-indigo-500"
                                }`}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-gray-700 hover:text-indigo-600 focus:outline-none"
                >
                    {menuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </header>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="mt-2 rounded-xl bg-white/90 backdrop-blur-lg shadow-lg border border-gray-200 p-4 flex flex-col gap-4 md:hidden">
                    {authenticated ? (
                        <>
                            <Link
                                to={ROUTES.SCHEMA_GENERATION}
                                className={`${navLinkBase} ${
                                    isActive(ROUTES.SCHEMA_GENERATION)
                                        ? "text-indigo-600"
                                        : "text-gray-700 hover:text-indigo-500"
                                } flex items-center gap-1`}
                            >
                                <Database className="w-4 h-4" />
                                Generate
                            </Link>
                            <Link
                                to={ROUTES.DASHBOARD}
                                className={`${navLinkBase} ${
                                    isActive(ROUTES.DASHBOARD)
                                        ? "text-indigo-600"
                                        : "text-gray-700 hover:text-indigo-500"
                                } flex items-center gap-1`}
                            >
                                <User className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className={`${navLinkBase} text-gray-700 hover:text-indigo-500 flex items-center gap-1 text-left`}
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to={ROUTES.LOGIN}
                                className={`${navLinkBase} ${
                                    isActive(ROUTES.LOGIN)
                                        ? "text-indigo-600"
                                        : "text-gray-700 hover:text-indigo-500"
                                }`}
                            >
                                Login
                            </Link>
                            <Link
                                to={ROUTES.SIGNUP}
                                className={`${navLinkBase} ${
                                    isActive(ROUTES.SIGNUP)
                                        ? "text-indigo-600"
                                        : "text-gray-700 hover:text-indigo-500"
                                }`}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar;
