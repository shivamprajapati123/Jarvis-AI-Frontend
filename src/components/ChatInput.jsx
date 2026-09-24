import { Code2, FileText, Globe, ImageIcon, MessageSquare, Mic, MicOff, Paperclip, Presentation, Send, Square, Volume2, X, Zap } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import sendMessage from '../features/sendMessage'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, clearPendingPrompt, setArtifacts, setIsLoading, setMessages, setPendingPrompt } from '../redux/messageSlice'
import { createConversation } from '../features/createConversation'
import { addConversation, setConvTitle, setSelectedConversation } from '../redux/conversationSlice'
import { updateConversation } from '../features/updateConversation'
import { useRef } from 'react'
import { cancelSpeech, getSpeechVoices, isSpeechActive, selectSpeechVoice, speakText, subscribeSpeechState } from "../utils/speech"


function ChatInput() {
  const [value, setValue] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("Auto")
  const { selectedConversation } = useSelector(state => state.conversation)
  const { messages, isLoading, pendingPrompt, sendPendingPrompt } = useSelector(state => state.message)
  const [selectedFile, setSelectedFile] = useState(null)
  const [listening, setListening] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)
  const [availableVoices, setAvailableVoices] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(isSpeechActive)
  const recognitionRef = useRef(null)
  const voiceModeRef = useRef(false)
  const speakingRef = useRef(false)
  const speechTimerRef = useRef(null)
  const fileRef = useRef(null)
  const textareaRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => subscribeSpeechState(setIsSpeaking), [])

  useEffect(() => {
    const loadVoices = () => setAvailableVoices(getSpeechVoices())
    loadVoices()
    window.speechSynthesis?.addEventListener("voiceschanged", loadVoices)
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", loadVoices)
  }, [])

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let transcript = ""

      for (let index = event.resultIndex; index < event.results.length; index++) {
        transcript += event.results[index][0].transcript
      }

      if (speakingRef.current) {
        speakingRef.current = false
        window.speechSynthesis?.cancel()
      }
      setValue((current) => `${current} ${transcript}`.trim())
      if (voiceModeRef.current && event.results[event.results.length - 1].isFinal) {
        clearTimeout(speechTimerRef.current)
        speechTimerRef.current = setTimeout(() => {
          voiceModeRef.current = false
          setVoiceMode(false)
          setListening(false)
          recognition.stop()
        }, 3000)
      }
    }

    recognition.onerror = (event) => {
      if (event.error === "no-speech" || event.error === "aborted") return

      voiceModeRef.current = false
      setVoiceMode(false)
      setListening(false)
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        alert("Brave blocked speech recognition. Allow microphone access and disable Shields for localhost.")
      } else if (event.error === "network") {
        alert("Brave could not reach its speech service. Disable Shields for localhost and enable Brave's Google speech services, then try again.")
      } else {
        alert(`Speech recognition failed: ${event.error}`)
      }
    }

    recognition.onend = () => {
      setListening(false)
      if (voiceModeRef.current && !speakingRef.current) {
        try {
          recognition.start()
        } catch {
          // Recognition may already be restarting.
        }
      }
    }

    recognitionRef.current = recognition
    return () => {
      recognition.stop()
      clearTimeout(speechTimerRef.current)
    }
  }, [])

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("speech recognition not supported")
      return
    }

    const nextVoiceMode = !voiceMode
    voiceModeRef.current = nextVoiceMode
    setVoiceMode(nextVoiceMode)

    if (!nextVoiceMode) {
      clearTimeout(speechTimerRef.current)
      recognitionRef.current.stop()
      setListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setListening(true)
      } catch (error) {
        voiceModeRef.current = false
        setVoiceMode(false)
        setListening(false)
        alert(`Could not start speech recognition: ${error.message}`)
      }
    }

  }








  const handleSendMessage = async (promptValue = value) => {
    if (!promptValue.trim() || isLoading) return
    dispatch(setIsLoading(true))
    let conversation = selectedConversation
    if (!conversation) {
      dispatch(setMessages([]))
      const conv = await createConversation()
      dispatch(setSelectedConversation(conv))

      dispatch(addConversation(conv))
      conversation = conv
    }

    if (conversation.title == "New Chat") {
      await updateConversation({ id: conversation?._id, title: promptValue.trim() })
      dispatch(setConvTitle({ conversationId: conversation?._id, title: promptValue.slice(0, 40) }))
    }


    console.log(selectedFile)
    const formData = new FormData()
    formData.append("prompt", promptValue.trim())
    formData.append("conversationId", conversation?._id)
    formData.append("agent", selectedAgent.toLowerCase())
    if (selectedFile) {
      formData.append("file", selectedFile)
    }



    dispatch(addMessage({ role: "user", content: promptValue.trim() }))
    setValue("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "28px"
      textareaRef.current.style.overflowY = "hidden"
    }
    const data = await sendMessage(formData)
    dispatch(setIsLoading(false))
    setSelectedFile(null)
    if (!data) return
    dispatch(setArtifacts(data.artifacts || []))
    dispatch(addMessage({ role: "assistant", content: data.answer, images: data.images }))
    if (voiceModeRef.current && data.answer) {
      speakingRef.current = true
      speakText(data.answer, {
        voice: selectSpeechVoice(availableVoices),
        rate: 1,
        pitch: 1,
        onstart: () => {
          setListening(true)
          try {
            recognitionRef.current?.start()
          } catch {
            // Recognition may already be active.
          }
        },
        onend: () => {
          speakingRef.current = false
        },
      })
    }
    console.log(data)
  }

  useEffect(() => {
    if (!sendPendingPrompt || !pendingPrompt || isLoading) return
    handleSendMessage(pendingPrompt)
    dispatch(clearPendingPrompt())
  }, [sendPendingPrompt, pendingPrompt, isLoading, dispatch])

  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto"
    },

    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat"
    },

    {
      id: "coding",
      icon: Code2,
      label: "Coding"
    },

    {
      id: "pdf",
      icon: FileText,
      label: "PDF"
    },

    {
      id: "ppt",
      icon: Presentation,
      label: "PPT"
    },

    {
      id: "vision",
      icon: ImageIcon,
      label: "Vision"
    },

    {
      id: "search",
      icon: Globe,
      label: "Search"
    }

  ]

  return (
    <div className='chat-composer w-full overflow-hidden px-3 md:px-5 py-2.5 border-t border-white/[0.06] bg-[#0d0f14]'>
      <div className='composer-panel flex flex-col gap-1.5 bg-white/[0.03] border border-white/[0.07] focus-within:border-indigo-500/70 focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-2xl px-3.5 pt-2.5 pb-2 transition-colors duration-150'>

        <div className='flex w-full items-center gap-2 pr-2 flex-wrap'>
          {agents.map((agent) => {
            const isActive = selectedAgent === agent.label
            const Icon = agent.icon
            return (
              <div
                onClick={() => setSelectedAgent(agent.label)}
                className={`
            flex-shrink-0
            cursor-pointer
            inline-flex
            items-center
            gap-1.5
            px-2.5
            py-1.5
            rounded-full
            text-xs
            font-medium
            border
            transition-all

            ${isActive
                    ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.45)]"
                    : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"
                  }
          `}>

                <Icon size={14}
                  className={
                    isActive
                      ? "text-white"
                      : "text-slate-500"
                  } />

                {agent.label}

                </div>
            )

          })}
        </div>

        {
          selectedFile && <div className='my-3'>

            <div className='inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2'>
              {
                selectedFile?.type === "application/pdf" ? <FileText size={16}

                  className="text-red-400"
                /> : selectedFile.type.startsWith("image/") && <img src={URL.createObjectURL(selectedFile)} className="h-10 w-10 rounded-xl object-cover mt-3"
                />
              }

              <div>
                <p className='text-xs text-white'>
                  {selectedFile?.name}
                </p>
                <p className='text-[10px] text-slate-500'>
                  {Math.ceil(selectedFile.size)}KB
                </p>

              </div>
              <button className='ml-2' onClick={() => { setSelectedFile(null); fileRef.current.value = "" }}><X size={14} className='text-slate-500 hover:text-white' /></button>
            </div>


          </div>
        }


        <textarea
          ref={textareaRef}
          placeholder='Ask Anything...'
          onChange={(e) => {
            setValue(e.target.value)
            e.target.style.height = "28px"
            const nextHeight = Math.min(e.target.scrollHeight, 120)
            e.target.style.height = `${nextHeight}px`
            e.target.style.overflowY = e.target.scrollHeight > 120 ? "auto" : "hidden"
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          value={value}
          className="w-full min-h-7 h-7 bg-transparent outline-none resize-none py-1 text-[14px] text-slate-200 placeholder:text-slate-600 leading-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
          rows={1}
        />
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1'>
            <button
              type="button"
              onClick={() => {
                if (isSpeaking) {
                  cancelSpeech()
                  return
                }
                const started = speakText(messages?.filter((message) => message.role === "assistant").at(-1)?.content)
                if (!started) setIsSpeaking(false)
              }}
              aria-pressed={isSpeaking}
              className={`flex h-8 items-center justify-center gap-1 rounded-lg px-2 text-[11px] transition hover:bg-white/[0.05] ${isSpeaking ? "text-red-400" : "text-slate-600 hover:text-slate-300"}`}
              title={isSpeaking ? "Stop speaking" : "Speak latest response"}
              aria-label={isSpeaking ? "Stop speaking" : "Speak latest response"}
            >
              {isSpeaking ? <Square size={13} /> : <Volume2 size={15} />}
            </button>

            <input type="file" accept='.pdf,image/*' hidden ref={fileRef} onChange={(e) => {
              const file = e.target.files[0]
              if (file) {
                setSelectedFile(file)
              }
            }} />

            <button className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer' onClick={() => fileRef.current.click()}>
              <Paperclip size={16} />
            </button>
            <button
              onClick={toggleMic}
              aria-pressed={voiceMode}
              aria-label={voiceMode ? "Turn off voice input" : "Turn on voice input"}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer ${voiceMode ?"bg-indigo-500 text-white":"text-slate-600 hover:bg-white/[0.05]" }`}>
             {listening ? <Mic size={16} /> : <MicOff size={16}/>}
            </button>
          </div>
          <button
            disabled={!value && isLoading}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150 ${value.trim() ? "bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white" : "bg-white/[0.05] text-slate-600 cursor-not-allowed"}`}>
          <Send size={15} />
        </button>
      </div>
    </div>
    </div >
  )
}

export default ChatInput
