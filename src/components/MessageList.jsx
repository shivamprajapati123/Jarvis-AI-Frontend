import { ArrowDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPendingPrompt } from '../redux/messageSlice'
import MessageBubble from './MessageBubble'
import LoadingAnimation from './LoadingAnimation'

function MessageList() {
    const {selectedConversation}=useSelector(state=>state.conversation)
    const {messages,isLoading}=useSelector(state=>state.message)
    const {userData}=useSelector(state=>state.user)
    const dispatch=useDispatch()
   const listRef=useRef(null)
   const bottemRef=useRef(null)
   const latestAssistantRef=useRef(null)
   const [showScrollButton, setShowScrollButton]=useState(false)
   
   const updateScrollButton = () => {
    const list = listRef.current
    if (!list) return
    setShowScrollButton(list.scrollHeight - list.scrollTop - list.clientHeight > 80)
   }

   useEffect(()=>{
      requestAnimationFrame(()=>{
        if (isLoading) {
          bottemRef?.current?.scrollIntoView({ behavior:"smooth", block:"end" })
        } else if (messages.length > 0 && messages[messages.length - 1]?.role === "assistant") {
          latestAssistantRef?.current?.scrollIntoView({ behavior:"smooth", block:"start" })
        }
        updateScrollButton()
      })
   },[messages,isLoading])


  return (
    <div ref={listRef} onScroll={updateScrollButton} className='message-list relative flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
      
      {messages.length==0 || !selectedConversation ?(
        <div className="jarvis-empty-state h-full flex flex-col items-center justify-center gap-4 text-center">
           <div className="jarvis-reactor" aria-hidden="true">
             <div className="jarvis-reactor__orbit jarvis-reactor__orbit--outer" />
             <div className="jarvis-reactor__orbit jarvis-reactor__orbit--inner" />
             <div className="jarvis-reactor__core">
               <span />
             </div>
           </div>
           <div className='welcome-copy flex max-w-[min(92vw,560px)] flex-col items-center gap-2'>
               {userData && (
                 <div className="mb-1 flex flex-col items-center gap-1.5">
                   <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-200/80">
                     Welcome back
                   </p>
                   <p className="max-w-[88vw] truncate text-[15px] font-medium tracking-wide text-slate-200">
                     {userData?.name || userData?.email || "User"}
                   </p>
                   <p className="text-[10px] font-semibold tracking-[0.34em] text-slate-500">
                     JARVIS AI
                   </p>
                 </div>
               )}
               <div className="mt-1 h-px w-12 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
               <div className="jarvis-status"><span /> READY WHEN YOU ARE</div>
               <h1 className='text-[clamp(1.35rem,4vw,1.75rem)] font-semibold text-slate-100 tracking-tight'>What will we create?</h1>
               <p className='text-[14px] font-medium text-slate-400 tracking-tight'>Your ideas, with a little more momentum.</p>
               <p className='max-w-[340px] text-[13px] text-slate-500 leading-relaxed'>Choose a starting point, or tell Jarvis what is on your mind.</p>
           </div>
           <div className='prompt-grid mt-2'>
            {[
              ["Explore", "Today's news and highlights", "◎"],
              ["Coding", "A fun fact about programming", "</>"],
              ["Weather", "India's current temperature", "☀"],
            ].map(([label, text, icon])=>(
              <button key={text} onClick={()=>dispatch(setPendingPrompt(
                label === "Explore"
                  ? "What are today's top news headlines?"
                  : label === "Coding"
                    ? "Tell me a fun and useful programming fact."
                    : "What is the current temperature and weather condition in India?"
              ))} className='jarvis-prompt'>
                <span className="prompt-icon">{icon}</span>
                <span><strong>{label}</strong><small>{text}</small></span>
              </button>
            ))}
           </div>
        </div>
      ):
      <div className='message-stack space-y-5'>

        {messages?.map((msg,i)=>(
            <div
              key={msg?._id || `${msg?.role}-${i}`}
              ref={msg?.role === "assistant" && i === messages.length - 1 ? latestAssistantRef : null}
            >
               <MessageBubble role={msg?.role} content={msg?.content} images={msg.images || []} /> 
            </div>
        ))}

        {isLoading && <LoadingAnimation/>}

        
      </div>
      }
      <div ref={bottemRef}/>
      {showScrollButton && (
        <button
          type="button"
          onClick={() => bottemRef?.current?.scrollIntoView({ behavior:"smooth", block:"end" })}
          className="sticky bottom-4 left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/[0.16] bg-[#171a22]/95 text-slate-200 shadow-lg shadow-black/30 backdrop-blur transition hover:border-indigo-400/60 hover:bg-indigo-500/20"
          aria-label="Scroll to latest message"
        >
          <ArrowDown size={18} />
        </button>
      )}
    </div>
  )
}

export default MessageList
