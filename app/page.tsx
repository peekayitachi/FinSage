"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ChatConsole } from "@/components/dashboard/chat-console"
import { FinancialInsightsPanel } from "@/components/dashboard/financial-insights-panel"
import { ProgressStepper } from "@/components/dashboard/progress-stepper"
import { SanctionLetterModal } from "@/components/dashboard/sanction-letter-modal"
import { AGENT_STEPS_INITIAL } from "@/lib/mock-data"
import { AgentType, LoanDetails, LoanOffer, AgentStep } from "@/lib/agents"

export default function Dashboard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showSanctionModal, setShowSanctionModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<LoanOffer | null>(null)

  // Lifted State
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>(AGENT_STEPS_INITIAL)
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({
    intentDetected: false,
    amount: 0,
    purpose: '',
    monthlyIncome: 0,
    employmentType: null,
    city: '',
    name: '',
    pan: '',
    aadhaar: ''
  })

  // Handlers
  const handleAgentStateChange = (agentId: AgentType, status: 'active' | 'completed' | 'pending') => {
    setAgentSteps((prev: AgentStep[]) => prev.map((step: AgentStep) =>
      step.id === agentId ? { ...step, status } : step
    ))
  }

  const handleLoanDetailsUpdate = (details: LoanDetails) => {
    setLoanDetails(details)
  }

  const handleSanctionOffer = (offer: LoanOffer) => {
    setSelectedOffer(offer)
    setShowSanctionModal(true)
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Top Progress Stepper */}
      <ProgressStepper currentStep={currentStep} />

      {/* Main Dashboard Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center Chat Console */}
        <ChatConsole
          onSanctionOffer={handleSanctionOffer}
          onStepChange={setCurrentStep}
          onAgentStateChange={handleAgentStateChange}
          onLoanDetailsUpdate={handleLoanDetailsUpdate}
        />

        {/* Right Financial Insights Panel */}
        <FinancialInsightsPanel
          agentSteps={agentSteps}
          loanDetails={loanDetails}
          estimatedEmi={selectedOffer?.emi}
          estimatedRate={selectedOffer?.interestRate}
        />
      </div>

      {/* Sanction Letter Modal */}
      <SanctionLetterModal
        isOpen={showSanctionModal}
        onClose={() => setShowSanctionModal(false)}
        data={selectedOffer ? {
          amount: selectedOffer.amount,
          interestRate: selectedOffer.interestRate,
          tenure: selectedOffer.tenureMonths,
          emi: selectedOffer.emi
        } : undefined}
      />
    </div>
  )
}
