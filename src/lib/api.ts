const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Get stored session token
export const getSessionToken = (): string | null => {
    try {
        return localStorage.getItem("sessionToken");
    } catch (error) {
        console.error("Error accessing localStorage:", error);
        return null;
    }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    try {
        const token = getSessionToken();
        return !!token && token.length > 0;
    } catch (error) {
        console.error("Error checking authentication:", error);
        return false;
    }
};

// Make authenticated API request
export const makeAuthenticatedRequest = async (endpoint: string, data: any) => {
    const token = getSessionToken();

    if (!token) {
        throw new Error("No authentication token found. Please log in.");
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    // Handle different response status codes
    if (response.status === 401) {
        // Token expired or invalid, clear storage and redirect to login
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("userSession");
        throw new Error("Session expired. Please log in again.");
    }

    if (response.status === 429) {
        // Rate limit exceeded
        const error = await response.json();
        throw new Error(`Rate limit exceeded: ${error.error}`);
    }

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Request failed");
    }

    return response.json();
};

// Generate schema with authentication
export const generateSchema = async (
    description: string,
    modelType: string = "claude",
    columnCount: number = 5
) => {
    return makeAuthenticatedRequest("/api/generate-schema", {
        description,
        model_type: modelType,
        column_count: columnCount,
    });
};

// Generate data with authentication
export const generateData = async (
    schema: any[],
    count: number = 10,
    modelType: string = "claude"
) => {
    return makeAuthenticatedRequest("/api/generate-data", {
        schema,
        count,
        model_type: modelType,
    });
};

// Rate limit tracking utilities
export const updateRequestCount = () => {
    let dailyRequestCount = parseInt(
        localStorage.getItem("dailyRequestCount") || "0"
    );
    const today = new Date().toDateString();
    const lastRequestDate = localStorage.getItem("lastRequestDate");

    // Reset counter if it's a new day
    if (lastRequestDate !== today) {
        dailyRequestCount = 0;
        localStorage.setItem("lastRequestDate", today);
    }

    dailyRequestCount++;
    localStorage.setItem("dailyRequestCount", dailyRequestCount.toString());

    // Show warning when approaching limit
    if (dailyRequestCount >= 8) {
        return `You have ${10 - dailyRequestCount} requests remaining today.`;
    }

    return null;
};

export const getRemainingRequests = (): number => {
    const dailyRequestCount = parseInt(
        localStorage.getItem("dailyRequestCount") || "0"
    );
    const today = new Date().toDateString();
    const lastRequestDate = localStorage.getItem("lastRequestDate");

    // Reset counter if it's a new day
    if (lastRequestDate !== today) {
        return 10;
    }

    return Math.max(0, 10 - dailyRequestCount);
};

// Logout function
export const logout = async () => {
    try {
        const sessionToken = getSessionToken();
        if (sessionToken) {
            await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    session_id: sessionToken,
                }),
            });
        }
    } catch (error) {
        console.error("Logout error:", error);
    } finally {
        // Clear local storage regardless of API call success
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("userSession");
        localStorage.removeItem("dailyRequestCount");
        localStorage.removeItem("lastRequestDate");
    }
};
