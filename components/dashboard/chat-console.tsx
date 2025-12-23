"use client"

import { useState, useRef, useEffect, useReducer } from "react"
import { Paperclip, Mic, Send, Bot, User, Upload, FileText, CheckCircle2, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LoanState, Message, LoanDetails, AgentType, MOCK_OFFERS, handleAgentLogic, LoanOffer } from "@/lib/agents" // Fixed imports in next step if broken
import { LoanOffersWidget } from "@/components/dashboard/loan-offers-widget"
import { SanctionLetterModal } from "@/components/dashboard/sanction-letter-modal"

// Re-export type locally to fix import issues if needed, or rely on correct relative path
import { AGENT_STEPS_INITIAL } from "@/lib/mock-data"

interface ChatConsoleProps {
  onSanctionOffer: (offer: LoanOffer) => void
  onStepChange: (step: number) => void
  onAgentStateChange: (agentId: AgentType, status: 'active' | 'completed' | 'pending') => void
  onLoanDetailsUpdate: (details: LoanDetails) => void
}

const initialState: LoanState = {
  currentAgent: 'MASTER',
  agentStatus: 'IDLE',
  messages: [],
  loanDetails: {
    intentDetected: false,
    amount: 0,
    purpose: '',
    monthlyIncome: 0,
    employmentType: null,
    city: '',
    name: '',
    pan: '',
    aadhaar: ''
  },
  offers: [],
  selectedOfferId: null,
  agentSteps: AGENT_STEPS_INITIAL,
  isTyping: false
};

export function ChatConsole({ onSanctionOffer, onStepChange, onAgentStateChange, onLoanDetailsUpdate }: ChatConsoleProps) {
  // Using Local State for simplicity in this demo, but structured like a Redux store
  const [state, setState] = useState<LoanState>(initialState)
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize Chat
  useEffect(() => {
    // Start the conversation
    runAgentLogic(null);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [state.messages, state.isTyping])

  // Core Logic Runner
  const runAgentLogic = async (userMsg: string | null) => {
    setState(prev => ({ ...prev, isTyping: true }));

    // Simulate network delay for "Agent Thinking"
    await new Promise(resolve => setTimeout(resolve, 800));

    const response = await handleAgentLogic(state, userMsg);

    setState(prev => {
      const newState = { ...prev };

      // Update basic fields
      if (response.updatedDetails) {
        newState.loanDetails = { ...newState.loanDetails, ...response.updatedDetails };
        onLoanDetailsUpdate(newState.loanDetails);
      }

      if (response.nextAgent) {
        newState.currentAgent = response.nextAgent;
      }

      if (response.offers) {
        newState.offers = response.offers;
      }

      // Append Messages
      if (response.messages.length > 0) {
        newState.messages = [...newState.messages, ...response.messages];
      }

      newState.isTyping = false;
      return newState;
    });

    // Handle Side Effects (Step Changes)
    if (response.updateStepStatus) {
      response.updateStepStatus.forEach(update => {
        onAgentStateChange(update.id, update.status);
      });

      // Map Agent to Stepper Number roughly
      const agentStepMap: Record<AgentType, number> = {
        'MASTER': 1,
        'SALES': 1,
        'OFFER': 2,
        'VERIFICATION': 3,
        'UNDERWRITING': 3,
        'SANCTION': 4
      };
      if (response.nextAgent) {
        onStepChange(agentStepMap[response.nextAgent] || 1);
      }
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));
    setInputValue("");

    // Trigger Agent Response
    runAgentLogic(inputValue);
  };

  const handleDocumentUpload = () => {
    setState(prev => ({ ...prev, isTyping: true }));

    setTimeout(() => {
      const successMsg: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: "Documents Verified Successfully! I've confirmed your identity.",
        timestamp: new Date(),
        widget: 'verification-success'
      };

      const offerMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Our Underwriting Agent has approved your profile. Here is your final Sanction Letter.",
        timestamp: new Date(),
        widget: 'sanction-letter'
      };

      setState(prev => ({
        ...prev,
        isTyping: false,
        messages: [...prev.messages, successMsg, offerMsg],
        currentAgent: 'SANCTION'
      }));

      onAgentStateChange('VERIFICATION', 'completed');
      onAgentStateChange('UNDERWRITING', 'completed');
      onAgentStateChange('SANCTION', 'active');
      onStepChange(4);

    }, 2500);
  };

  const handleOfferSelect = (offerId: string) => {
    const selectedOffer = state.offers.find(o => o.id === offerId);
    if (!selectedOffer) return;

    setState(prev => ({ ...prev, selectedOfferId: offerId }));

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `I select the offer from ${selectedOffer.provider}.`,
      timestamp: new Date()
    };

    setState(prev => ({ ...prev, messages: [...prev.messages, userMsg], isTyping: true }));

    // Handoff to Verification
    setTimeout(() => {
      const nextStateUpdates = {
        nextAgent: 'VERIFICATION' as AgentType,
        updateStepStatus: [{ id: 'OFFER', status: 'completed' }, { id: 'VERIFICATION', status: 'active' }]
      };
      handleAgentLogic({ ...state, currentAgent: 'VERIFICATION' }, null).then(res => {
        setState(prev => ({
          ...prev,
          currentAgent: 'VERIFICATION',
          messages: [...prev.messages, ...res.messages],
          isTyping: false
        }));
        onAgentStateChange('OFFER', 'completed');
        onAgentStateChange('VERIFICATION', 'active');
        onStepChange(3);
      });
    }, 1000);
  };

  // Render Helpers
  const renderWidget = (msg: Message) => {
    if (msg.widget === 'loan-offers' && state.offers.length > 0) {
      return <LoanOffersWidget offers={state.offers} onSelect={handleOfferSelect} />;
    }
    if (msg.widget === 'document-upload') {
      return (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-900 mb-1">Upload Documents</p>
            <p className="text-xs text-slate-500 mb-4">PAN Card & Aadhaar (PDF, JPG, PNG)</p>
            <div className="flex gap-2 justify-center">
              <Button size="sm" variant="outline" className="gap-2" onClick={handleDocumentUpload}>
                <FileText className="w-4 h-4" /> PAN Card
              </Button>
              <Button size="sm" variant="outline" className="gap-2" onClick={handleDocumentUpload}>
                <FileText className="w-4 h-4" /> Aadhaar
              </Button>
            </div>
          </div>
        </div>
      );
    }
    if (msg.widget === 'verification-success') {
      return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-900">Identity Verified</p>
            <p className="text-xs text-emerald-700">PAN & Aadhaar validated successfully</p>
          </div>
        </div>
      );
    }
    if (msg.widget === 'sanction-letter') {
      const offer = state.offers.find(o => o.id === state.selectedOfferId) || state.offers[0];
      return (
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => onSanctionOffer(offer)}>
          View Sanction Letter
        </Button>
      );
    }
    return null;
  };

  return (
    <main className="flex-1 flex flex-col bg-white border-r border-slate-200 relative">
      {/* Dynamic Header */}
      <header className="px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
              {/* Icon changes based on agent */}
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                {state.currentAgent === 'MASTER' ? "Master Orchestrator" :
                  state.currentAgent === 'SALES' ? "Sales Agent" :
                    state.currentAgent === 'OFFER' ? "Offer Engine" :
                      state.currentAgent === 'VERIFICATION' ? "Verification Agent" : "System"}
                {state.isTyping && <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />}
              </h2>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs text-slate-500">Active • {state.currentAgent} Workflow</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {state.messages.map((message) => (
          <div key={message.id} className={cn("flex gap-3", message.type === "user" ? "flex-row-reverse" : "fade-in-up")}>
            <Avatar className={cn("h-9 w-9 shrink-0", message.type === "ai" ? "bg-slate-100" : "bg-slate-900")}>
              <AvatarFallback className={cn(message.type === "ai" ? "bg-slate-100 text-slate-700" : "bg-slate-900 text-white")}>
                {message.type === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </AvatarFallback>
            </Avatar>

            <div className={cn("max-w-[75%] space-y-3", message.type === "user" ? "items-end" : "")}>
              <div
                className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                  message.type === "ai"
                    ? "bg-slate-50 text-slate-700 rounded-tl-md border border-slate-100"
                    : "bg-slate-900 text-white rounded-tr-md"
                )}
              >
                {message.content}
              </div>

              {/* Render Widgets */}
              {message.widget && renderWidget(message)}

              <p className="text-[10px] text-slate-400 px-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {state.isTyping && (
          <div className="flex gap-3 animate-pulse">
            <Avatar className="h-9 w-9 bg-slate-100">
              <AvatarFallback className="bg-slate-100 text-slate-700">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-slate-50 px-4 py-3 rounded-2xl rounded-tl-md border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={state.isTyping}
            placeholder="Type your message..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none py-2"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!inputValue.trim() || state.isTyping}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 h-10 w-10 transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </main>
  )
}
