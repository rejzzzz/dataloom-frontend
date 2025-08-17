import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, User, LogOut, Sparkles } from "lucide-react";
import { isAuthenticated, getRemainingRequests, logout } from "@/lib/api";
import { ROUTES } from "@/constants/routes";

const Dashboard: React.FC = () => {
    const [session, setSession] = useState<any>(null);
    const [remainingRequests, setRemainingRequests] = useState<number>(10);
    const navigate = useNavigate();

    useEffect(() => {
        // Check authentication
        if (!isAuthenticated()) {
            navigate(ROUTES.LOGIN);
            return;
        }

        try {
            const raw = localStorage.getItem("userSession");
            if (raw) setSession(JSON.parse(raw));
        } catch (e) {
            // ignore
        }

        // Update remaining requests
        setRemainingRequests(getRemainingRequests());
    }, [navigate]);

    const handleLogout = async () => {
        await logout();
        navigate(ROUTES.LOGIN);
    };

    const handleStartGenerating = () => {
        // Navigate directly to schema generation page
        navigate(ROUTES.SCHEMA_GENERATION);
    };

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6 text-center">
                        <p>Loading your dashboard...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between py-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Welcome back to DataLoom
                        </p>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>

                {/* User Info Card */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Account Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Name</p>
                                <p className="font-medium">
                                    {session.providerUid || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">User ID</p>
                                <p className="font-mono text-sm">
                                    {session.userId}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    Session Created
                                </p>
                                <p className="text-sm">
                                    {new Date(
                                        session.$createdAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    Session Expires
                                </p>
                                <p className="text-sm">
                                    {new Date(session.expire).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Usage Stats Card */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="w-5 h-5" />
                            Usage Statistics
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {remainingRequests}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Requests Remaining
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Resets at midnight UTC
                                </div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {10 - remainingRequests}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Requests Used Today
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Schema + Data generation
                                </div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">
                                    10
                                </div>
                                <div className="text-sm text-gray-600">
                                    Daily Limit
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Combined limit
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions Card */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                onClick={handleStartGenerating}
                                className="flex items-center gap-2"
                                size="lg"
                            >
                                <Sparkles className="w-5 h-5" />
                                Start Generating Data
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    window.open(
                                        "https://github.com/your-repo",
                                        "_blank"
                                    )
                                }
                                size="lg"
                            >
                                View Documentation
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Rate Limit Warning */}
                {remainingRequests <= 2 && remainingRequests > 0 && (
                    <Card className="shadow-lg border-orange-200 bg-orange-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className="bg-orange-100 text-orange-800"
                                >
                                    Warning
                                </Badge>
                                <p className="text-sm text-orange-800">
                                    You have {remainingRequests} request
                                    {remainingRequests === 1 ? "" : "s"}{" "}
                                    remaining today. Your limit will reset at
                                    midnight UTC.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {remainingRequests === 0 && (
                    <Card className="shadow-lg border-red-200 bg-red-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className="bg-red-100 text-red-800"
                                >
                                    Limit Reached
                                </Badge>
                                <p className="text-sm text-red-800">
                                    You have reached your daily limit of 10
                                    requests. Your limit will reset at midnight
                                    UTC.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
