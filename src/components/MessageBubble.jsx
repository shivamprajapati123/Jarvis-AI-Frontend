import { Check, Copy, ExternalLink, Square, Volume2, X } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { cancelSpeech, isSpeechActive, speakText, subscribeSpeechState } from "../utils/speech"
function MessageBubble({ role, content, images }) {
  const isUser = role === "user"
  const isGeneratedImage = content?.startsWith("Generated image for:")
  const [lightBox, setLightBox] = useState(null)
  const [copiedCode, setCopiedCode] = useState("")
  const [failedImages, setFailedImages] = useState({})
  const [isSpeaking, setIsSpeaking] = useState(isSpeechActive)

  React.useEffect(() => subscribeSpeechState(setIsSpeaking), [])

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => {
      setCopiedCode("")
    }, 2000)
  }


  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`message-bubble w-fit max-w-[92vw] md:max-w-[72%]
  px-4 py-2.5 rounded-2xl
  break-words overflow-hidden
  leading-relaxed
        ${isUser
          ? "bg-gradient-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm"
          : " text-slate-200 rounded-tl-sm"
        }`}>


        {images.length > 0 && (
          <div className={`my-3 flex gap-3 ${isGeneratedImage ? "flex-col" : "flex-wrap"}`}>
            {images.map((img) => (
              failedImages[img] ? (
                <div key={img} className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-400">
                  The image provider could not load this image.
                  <a href={img} target="_blank" rel="noreferrer" className="ml-1 text-indigo-400 underline">
                    Try opening it directly
                  </a>
                </div>
              ) : (
                <img
                  key={img}
                  src={img}
                  alt="AI-generated image"
                  onClick={() => setLightBox(img)}
                  loading="eager"
                  decoding="async"
                  onError={() => setFailedImages((current) => ({ ...current, [img]: true }))}
                  className={`${isGeneratedImage ? "max-h-[320px] w-full max-w-sm object-contain" : "h-28 w-40 object-cover"} rounded-xl border border-white/10 cursor-zoom-in hover:opacity-95 transition`}
                />
              )
            ))}
          </div>
        )}


        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className='text-2xl font-bold mt-5 mb-3'>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className='text-xl font-semibold mt-4 mb-2'>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className='text-lg font-semibold mt-3 mb-2'>{children}</h3>
            ),
            p: ({ children }) => (
              <p className='mb-3 whitespace-pre-wrap break-words'>{children}</p>
            ),
            ul: ({ children }) => (
              <ul className='list-disc pl-5 space-y-1 my-2'>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className='list-decimal pl-5 space-y-1 my-2'>{children}</ol>
            ),
            table: ({ children }) => (
              <div className='overflow-x-auto my-4'>
                <table className='min-w-full border border-white/10'>
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (

              <th className='border border-white/10 bg-white/5 px-3 py-2 text-left'>
                {children}
              </th>

            ),
            td: ({ children }) => (

              <td className='border border-white/10 px-3 py-2'>
                {children}
              </td>

            ),

            a: ({ href, children }) => {
              const downloadHref = href?.startsWith("/api/agent/download/") && import.meta.env.VITE_SERVER_URL
                ? new URL(href, import.meta.env.VITE_SERVER_URL).toString()
                : href

              return (
              <a href={downloadHref}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 underline inline-flex items-center gap-1"
              >
                {children}
                <ExternalLink size={14} />
              </a>
              )
            },
            code: ({ className, children }) => {
              const value = String(children).trim()
              

              if (!className) {
                return (
                  <code className='px-1.5 py-0.5 rounded bg-white/10 text-indigo-200'>
                    {value}
                  </code>
                )

              }

              const language = className.replace("language-", "")

              return (
                <div className='my-4 overflow-hidden rounded-xl border border-white/10 bg-[#111318]'>
                  <div className='flex items-center justify-between bg-[#1b1d24] border-b border-white/10 px-4 py-2'>
                    <span className='uppercase text-xs text-slate-400'>
                      {language}
                    </span>
                    <button className='flex items-center gap-1 text-xs' 
                    onClick={() => copyCode(value)}>
                      {
                        copiedCode == value ?
                          <>
                            <Check size={14}/>
                            Copied
                          </> :
                          <><Copy size={14} />Copy</>
                      }
                    </button>
                  </div>


                  <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    wrapLongLines
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: "16px",
                      background: "#0d1117",
                      fontSize: "13px",
                    }}

                  >
                    {value}
                  </SyntaxHighlighter>


                </div>
              )
            },
          img:({src})=>{
            if(!src)return null;
            return (
              <img
                src={src}
                alt="Image in assistant response"
                onClick={() => setLightBox(src)}
                loading="eager"
                decoding="async"
                onError={() => setFailedImages((current) => ({ ...current, [src]: true }))}
                className="max-h-[min(65vh,560px)] w-full max-w-xl rounded-xl object-contain border border-white/10 cursor-zoom-in hover:opacity-95 transition"
              />
            )
          }





          }}
        >
          {content}
        </Markdown>
        {!isUser && (
          <button
            type="button"
            onClick={() => {
              if (isSpeaking) {
                cancelSpeech()
                return
              }
              const started = speakText(content)
              if (!started) setIsSpeaking(false)
            }}
            className="mt-1 inline-flex items-center gap-1 rounded-md p-1 text-slate-500 transition hover:bg-white/[0.06] hover:text-slate-200"
            aria-label={isSpeaking ? "Speaking response" : "Speak response"}
            title={isSpeaking ? "Stop speaking" : "Speak response"}
          >
            {isSpeaking ? <Square size={13} /> : <Volume2 size={14} />}
          </button>
        )}



      </div>
      {lightBox &&
        <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6'>
          <button
            className='absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2'
            onClick={() => setLightBox(null)}
          >
            <X />
          </button>
          <img
            src={lightBox}
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"

          />

        </div>}
    </div>
  )
}

export default MessageBubble
