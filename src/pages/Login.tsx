import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login: React.FC = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!form.email || !form.password) {
            setError("Both fields are required");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${backendUrl}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (res.ok && data.session) {
                // Store session token as per backend documentation
                localStorage.setItem("sessionToken", data.session.secret);
                localStorage.setItem(
                    "userSession",
                    JSON.stringify(data.session)
                );
                setError("");
                navigate("/dashboard");
            } else {
                setError(data.error || data.message || "Login failed");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err?.message || "Network error occurred");
        }

        setLoading(false);
    };

    return (
        <>
            <div className="flex min-h-screen bg-[#1e1e2d]">
                <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
                    <div className="w-[97%] h-[97%] rounded-2xl overflow-hidden bg-black/10 flex items-center justify-center">
                        <img
                            src="/dune.jpeg"
                            alt="Dune"
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-center p-12">
                    <div className="w-full max-w-md space-y-8">
                        <div>
                            <h2 className="text-4xl font-bold text-white">
                                Login to your account
                            </h2>
                            <p className="mt-10 text-gray-400">
                                Don't have an account?{" "}
                                <Link
                                    to="/signup"
                                    className="font-medium text-purple-400 hover:text-purple-300"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                        <form
                            className="space-y-6 mt-10"
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="Email"
                                    className="w-full appearance-none rounded-lg border border-gray-700 bg-[#2b2b3e] px-3 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="w-full appearance-none rounded-lg border border-gray-700 bg-[#2b2b3e] px-3 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                                    value={form.password}
                                    onChange={handleChange}
                                />
                                <div
                                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-gray-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        {showPassword ? (
                                            <>
                                                <path
                                                    fillRule="evenodd"
                                                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                                    clipRule="evenodd"
                                                />
                                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </>
                                        ) : (
                                            <>
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path
                                                    fillRule="evenodd"
                                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                    clipRule="evenodd"
                                                />
                                            </>
                                        )}
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-[#6c5dd3] px-4 py-3 font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </div>
                            {error && (
                                <div className="text-red-400 text-sm">
                                    {error}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
