"use client"

import { useState, useRef, useEffect } from "react"
import { Paperclip, Mic, Send, Bot, User, Upload, FileText, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  type: "ai" | "user"
  content: string
  timestamp: Date
  widget?: "document-upload" | "verification-success"
}

const initialMessages: Message[] = [
  {
    id: "1",
    type: "ai",
    content:
      "Welcome to FinSage! I'm your AI loan assistant, powered by our intelligent agent network. I'll guide you through the entire loan process seamlessly. To get started, could you please share your loan requirements?",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "2",
    type: "user",
    content: "I need a personal loan of ₹5,00,000 for home renovation.",
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: "3",
    type: "ai",
    content:
      "Excellent! A ₹5,00,000 personal loan for home renovation is well within our lending parameters. Based on our preliminary assessment, you may qualify for competitive rates. Let me verify your identity first. Please upload your PAN card and Aadhaar for instant verification.",
    timestamp: new Date(Date.now() - 180000),
    widget: "document-upload",
  },
]

interface ChatConsoleProps {
  onSanctionOffer: () => void
  onStepChange: (step: number) => void
}

export function ChatConsole({ onSanctionOffer, onStepChange }: ChatConsoleProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "Thank you for providing that information. Our Verification Agent is now analyzing your documents. This typically takes just a few moments...",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
      onStepChange(2)
    }, 1500)
  }

  const handleDocumentUpload = () => {
    setIsTyping(true)

    setTimeout(() => {
      const verificationMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content:
          "Documents received and verified successfully! Your identity has been confirmed. Based on your profile, I'm pleased to offer you a pre-approved loan. Click below to view your personalized sanction letter.",
        timestamp: new Date(),
        widget: "verification-success",
      }
      setMessages((prev) => [...prev, verificationMessage])
      setIsTyping(false)
      onStepChange(3)

      setTimeout(() => {
        onSanctionOffer()
        onStepChange(4)
      }, 2000)
    }, 2000)
  }

  return (
    <main className="flex-1 flex flex-col bg-white border-r border-slate-200">
      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Master Agent</h2>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs text-slate-500">Active • AI-Orchestrated Workflow</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex gap-3", message.type === "user" ? "flex-row-reverse" : "")}>
            <Avatar className={cn("h-9 w-9 shrink-0", message.type === "ai" ? "bg-slate-100" : "bg-slate-900")}>
              <AvatarFallback
                className={cn(message.type === "ai" ? "bg-slate-100 text-slate-700" : "bg-slate-900 text-white")}
              >
                {message.type === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </AvatarFallback>
            </Avatar>

            <div className={cn("max-w-[70%] space-y-3", message.type === "user" ? "items-end" : "")}>
              <div
                className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                  message.type === "ai"
                    ? "bg-slate-50 text-slate-700 rounded-tl-md"
                    : "bg-slate-900 text-white rounded-tr-md",
                )}
              >
                {message.content}
              </div>

              {/* Document Upload Widget */}
              {message.widget === "document-upload" && (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-6 h-6 text-slate-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-900 mb-1">Upload Documents</p>
                    <p className="text-xs text-slate-500 mb-4">PAN Card & Aadhaar (PDF, JPG, PNG)</p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 rounded-lg bg-transparent"
                        onClick={handleDocumentUpload}
                      >
                        <FileText className="w-4 h-4" />
                        PAN Card
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 rounded-lg bg-transparent"
                        onClick={handleDocumentUpload}
                      >
                        <FileText className="w-4 h-4" />
                        Aadhaar
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Success Widget */}
              {message.widget === "verification-success" && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-900">Identity Verified</p>
                    <p className="text-xs text-emerald-700">PAN & Aadhaar validated successfully</p>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-400 px-1">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <Avatar className="h-9 w-9 bg-slate-100">
              <AvatarFallback className="bg-slate-100 text-slate-700">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-slate-50 px-4 py-3 rounded-2xl rounded-tl-md">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI is processing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-200 focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none py-2"
          />
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 h-10 w-10"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </main>
  )
}
