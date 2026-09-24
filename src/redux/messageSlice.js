import { createSlice } from "@reduxjs/toolkit";

const messageSlice=createSlice({
    name:"message",
    initialState:{
      messages:[],
      artifacts:[],
      pendingPrompt:"",
      sendPendingPrompt:false,
      isLoading:false
      
    },
    reducers:{
       setMessages:(state,action)=>{
        state.messages=action.payload
       },
        addMessage:(state,action)=>{
        state.messages.push(action.payload)
       },
       setArtifacts:(state,action)=>{
        state.artifacts=action.payload
       },
       setPendingPrompt:(state,action)=>{
        state.pendingPrompt=action.payload
        state.sendPendingPrompt=true
       },
       clearPendingPrompt:(state)=>{
        state.pendingPrompt=""
        state.sendPendingPrompt=false
       },
       setIsLoading:(state,action)=>{
        state.isLoading=action.payload
       }
      

    }
   
})

export const {setMessages,addMessage,setArtifacts,setPendingPrompt,clearPendingPrompt,setIsLoading}=messageSlice.actions 
export default messageSlice.reducer
