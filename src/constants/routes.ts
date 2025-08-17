// Route constants for better maintainability and type safety
export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    SIGNUP: "/signup",
    DASHBOARD: "/dashboard",
    SCHEMA_GENERATION: "/schema-generation",
    DATA_GENERATION: "/data-generation",
} as const;

// Type for route values
export type RouteValue = (typeof ROUTES)[keyof typeof ROUTES];
