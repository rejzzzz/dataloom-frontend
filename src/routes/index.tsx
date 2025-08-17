import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/NotFound";
import { ROUTES } from "@/constants/routes";

// Lazy load heavy components for better performance
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const SchemaGeneration = lazy(() => import("@/pages/SchemaGeneration"));
const DataGeneration = lazy(() => import("@/pages/DataGeneration"));

import Loading from "@/components/ui/loading";

// Loading component for lazy-loaded routes
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading page..." />
    </div>
);

// Wrapper for lazy-loaded components with Layout
const LazyPageWithLayout = ({ children }: { children: React.ReactNode }) => (
    <Layout>
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </Layout>
);

// Auth routes (no layout needed)
const AuthRoutes = () => (
    <>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />
    </>
);

// Protected routes (with layout)
const ProtectedRoutes = () => (
    <>
        <Route
            path={ROUTES.DASHBOARD}
            element={
                <LazyPageWithLayout>
                    <Dashboard />
                </LazyPageWithLayout>
            }
        />
        <Route
            path={ROUTES.SCHEMA_GENERATION}
            element={
                <LazyPageWithLayout>
                    <SchemaGeneration />
                </LazyPageWithLayout>
            }
        />
        <Route
            path={ROUTES.DATA_GENERATION}
            element={
                <LazyPageWithLayout>
                    <DataGeneration />
                </LazyPageWithLayout>
            }
        />
    </>
);

// Main routes component
const AppRoutes = () => (
    <Routes>
        {/* Public routes */}
        <Route
            path={ROUTES.HOME}
            element={
                <Layout>
                    <Index />
                </Layout>
            }
        />

        {/* Auth routes */}
        {AuthRoutes()}

        {/* Protected routes */}
        {ProtectedRoutes()}

        {/* Catch-all route */}
        <Route
            path="*"
            element={
                <Layout>
                    <NotFound />
                </Layout>
            }
        />
    </Routes>
);

export default AppRoutes;
