export const JARVIS_VOICE_ID = "jarvis"
const speechStateListeners = new Set()
let speechActive = false

const setSpeechActive = (active) => {
  speechActive = active
  speechStateListeners.forEach((listener) => listener(active))
}

export const isSpeechActive = () => speechActive

export const subscribeSpeechState = (listener) => {
  speechStateListeners.add(listener)
  return () => speechStateListeners.delete(listener)
}
const JARVIS_PATTERNS = [
  "Microsoft George",
  "Daniel",
  "Google UK English Male",
  "Microsoft David",
  "Alex",
]

export const getSpeechVoices = () =>
  typeof window === "undefined" ? [] : window.speechSynthesis?.getVoices() || []

export const selectSpeechVoice = (voices = getSpeechVoices()) => {
  return voices.find((voice) =>
    JARVIS_PATTERNS.some((pattern) => voice.name.includes(pattern)),
  ) || voices.find((voice) => voice.lang?.startsWith("en")) || voices[0]
}

export const speakText = (text, options = {}) => {
  if (!text || typeof window === "undefined" || !window.speechSynthesis) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(
    text.replace(/[*#`_[\]]/g, ""),
  )
  utterance.voice = options.voice || selectSpeechVoice()
  utterance.rate = options.rate ?? 0.86
  utterance.pitch = options.pitch ?? 0.62
  utterance.onstart = () => {
    setSpeechActive(true)
    options.onstart?.()
  }
  utterance.onend = () => {
    setSpeechActive(false)
    options.onend?.()
  }
  utterance.onerror = () => {
    setSpeechActive(false)
    options.onerror?.()
  }
  setSpeechActive(true)
  window.speechSynthesis.speak(utterance)
  return true
}

export const cancelSpeech = () => {
  if (typeof window !== "undefined") window.speechSynthesis?.cancel()
  setSpeechActive(false)
}
