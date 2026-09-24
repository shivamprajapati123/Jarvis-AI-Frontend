import api from "../../utils/axios"

export const deleteConversation=async (id) => {
    try {
        await api.delete(`/api/chat/delete-conversation/${id}`)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
