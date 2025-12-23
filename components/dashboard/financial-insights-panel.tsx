"use client"

import { CheckCircle2, Clock, Shield, Lock, TrendingUp, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AgentStep, LoanDetails } from "@/lib/types"

interface FinancialInsightsPanelProps {
  agentSteps: AgentStep[]
  loanDetails: LoanDetails
  estimatedEmi?: number
  estimatedRate?: number
}

// Default values to prevent crashes if props are missing during dev
const defaultSteps: AgentStep[] = []
const defaultDetails: LoanDetails = {
  intentDetected: false,
  amount: 0,
  purpose: '',
  monthlyIncome: 0,
  employmentType: null,
  city: '',
  name: '',
  pan: '',
  aadhaar: ''
}

export function FinancialInsightsPanel({
  agentSteps = defaultSteps,
  loanDetails = defaultDetails,
  estimatedEmi,
  estimatedRate
}: FinancialInsightsPanelProps) {
  return (
    <aside className="w-[320px] bg-slate-50 p-4 overflow-y-auto">
      <div className="space-y-4">
        {/* Agent Logic Trace */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Agent Logic Trace
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {agentSteps.map((step, index) => (
                <div key={step.id || step.name} className="flex gap-3">
                  {/* Vertical Line Connector */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.status === "completed"
                          ? "bg-emerald-100"
                          : step.status === "active"
                            ? "bg-blue-100"
                            : "bg-slate-100"
                        }`}
                    >
                      {step.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : step.status === "active" ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    {index < agentSteps.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 mt-1 ${step.status === "completed" ? "bg-emerald-200" : "bg-slate-200"
                          }`}
                      />
                    )}
                  </div>
                  <div className="pb-4">
                    <p
                      className={`text-sm font-medium ${step.status === "active" ? "text-blue-700" : "text-slate-900"}`}
                    >
                      {step.name}
                    </p>
                    <p className="text-xs text-slate-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Loan Estimator */}
        <Card className="border-0 shadow-sm rounded-xl bg-gradient-to-br from-slate-900 to-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Dynamic Loan Estimator
            </CardTitle>
            <p className="text-xs text-slate-400">Live Quote • Updates in real-time</p>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Amount</span>
                <span className="text-lg font-bold text-white">
                  {loanDetails.amount ? `₹${loanDetails.amount.toLocaleString()}` : '---'}
                </span>
              </div>
              <div className="h-px bg-slate-700" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Interest Rate</span>
                <span className="text-lg font-semibold text-emerald-400">
                  {estimatedRate ? `${estimatedRate}% p.a.` : '10.5% p.a.'}
                </span>
              </div>
              <div className="h-px bg-slate-700" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Tenure</span>
                <span className="text-sm font-medium text-white">
                  {/* We could make this dynamic too, but keeping it simple for now */}
                  36 Months
                </span>
              </div>
              <div className="h-px bg-slate-700" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">EMI</span>
                <span className="text-lg font-bold text-white">
                  {estimatedEmi ? `₹${estimatedEmi.toLocaleString()}` : '---'}
                </span>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-400">* Final terms subject to verification and approval</p>
            </div>
          </CardContent>
        </Card>

        {/* Trust & Security */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-600" />
              Trust & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">256-bit Encryption</p>
                  <p className="text-xs text-slate-500">Bank-grade security</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">RBI Compliant</p>
                  <p className="text-xs text-slate-500">Regulated lending partner</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
