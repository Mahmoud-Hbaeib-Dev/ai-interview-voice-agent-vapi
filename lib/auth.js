import { CONFIG } from "./config.js";

/**
 * Validate JWT token with Jobite backend
 * @param {string} token - JWT token from Jobite platform
 * @returns {Promise<Object|null>} Company data or null if invalid
 */
export async function validateJobiteToken(token) {
    try {
        if (!token) {
            console.error("No token provided");
            return null;
        }

        // Call Jobite backend to validate token and get user/company info
        const response = await fetch(
            `${CONFIG.JOBITE_API_URL}/api/v1/auth/validate-token`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            console.error("Token validation failed:", response.status);
            return null;
        }

        const userData = await response.json();

        // Log the exact structure we receive
        console.log("=== Token Validation Data ===");
        console.log("Raw user data:", JSON.stringify(userData, null, 2));
        console.log("ID:", userData.id);
        console.log("Email:", userData.email);
        console.log("Role:", userData.role);
        console.log("Company Name:", userData.companyName);
        console.log("========================");

        return userData;
    } catch (error) {
        console.error("Error validating token:", error);
        return null;
    }
}

/**
 * Get token from URL parameters or localStorage
 * @returns {string|null} JWT token
 */
export function getTokenFromUrl() {
    if (typeof window === "undefined") return null;

    // First try to get from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    if (urlToken) {
        // Store token in localStorage for future use
        localStorage.setItem("jobite_token", urlToken);

        // Clean URL by removing token parameter
        const cleanUrl = new URL(window.location);
        cleanUrl.searchParams.delete("token");
        window.history.replaceState({}, "", cleanUrl.toString());

        return urlToken;
    }

    // If no URL token, try localStorage
    return localStorage.getItem("jobite_token");
}

/**
 * Clear stored token
 */
export function clearToken() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("jobite_token");
    }
}

/**
 * Check if user has valid token
 * @returns {Promise<Object|null>} User data or null
 */
export async function getCurrentUser() {
    const token = getTokenFromUrl();
    if (!token) return null;

    return await validateJobiteToken(token);
}

/**
 * Redirect to Jobite login if not authenticated
 */
export function redirectToJobiteLogin() {
    if (typeof window !== "undefined") {
        // Redirect back to Jobite platform
        window.location.href = "http://localhost:5173/auth";
    }
}