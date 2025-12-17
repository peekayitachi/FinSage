"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ChatConsole } from "@/components/dashboard/chat-console"
import { FinancialInsightsPanel } from "@/components/dashboard/financial-insights-panel"
import { ProgressStepper } from "@/components/dashboard/progress-stepper"
import { SanctionLetterModal } from "@/components/dashboard/sanction-letter-modal"

export default function Dashboard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showSanctionModal, setShowSanctionModal] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Top Progress Stepper */}
      <ProgressStepper currentStep={currentStep} />

      {/* Main Dashboard Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center Chat Console */}
        <ChatConsole onSanctionOffer={() => setShowSanctionModal(true)} onStepChange={setCurrentStep} />

        {/* Right Financial Insights Panel */}
        <FinancialInsightsPanel />
      </div>

      {/* Sanction Letter Modal */}
      <SanctionLetterModal isOpen={showSanctionModal} onClose={() => setShowSanctionModal(false)} />
    </div>
  )
}
