export const JARVIS_VOICE_ID = "jarvis"
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

export const speakText = (text) => {
  if (!text || typeof window === "undefined" || !window.speechSynthesis) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(
    text.replace(/[*#`_[\]]/g, ""),
  )
  utterance.voice = selectSpeechVoice()
  utterance.rate = 0.86
  utterance.pitch = 0.62
  window.speechSynthesis.speak(utterance)
  return true
}

export const cancelSpeech = () => {
  if (typeof window !== "undefined") window.speechSynthesis?.cancel()
}
