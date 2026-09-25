import axios from "axios";

const api=axios.create({
    baseURL:import.meta.env.VITE_SERVER_URL,
    withCredentials:true
})

const isTransientAuthError = (error) =>
    !error.response ||
    [502, 503, 504].includes(error.response.status) ||
    error.code === "ECONNABORTED"

export const loginWithRetry = async (token) => {
    const maxAttempts = 4

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
            return await api.post("/api/auth/login", { token }, {
                timeout: 30000
            })
        } catch (error) {
            if (attempt === maxAttempts || !isTransientAuthError(error)) {
                throw error
            }

            await new Promise((resolve) => {
                setTimeout(resolve, 1000 * 2 ** (attempt - 1))
            })
        }
    }
}

export default api
