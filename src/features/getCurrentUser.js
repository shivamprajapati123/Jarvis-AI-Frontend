
import api from "../../utils/axios"

const getCurrentUser=async () => {
    
    try {
        const {data}=await api.get("/api/me")
        return data
    } catch (error) {
        // Silently return null for unauthenticated users
        return null
    }
}

export default getCurrentUser