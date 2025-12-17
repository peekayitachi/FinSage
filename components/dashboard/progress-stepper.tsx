import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, label: "Identity" },
  { id: 2, label: "Eligibility" },
  { id: 3, label: "Verification" },
  { id: 4, label: "Sanction" },
]

interface ProgressStepperProps {
  currentStep: number
}

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-8 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                    step.id < currentStep
                      ? "bg-emerald-500 text-white"
                      : step.id === currentStep
                        ? "bg-slate-900 text-white ring-4 ring-slate-200"
                        : "bg-slate-100 text-slate-400",
                  )}
                >
                  {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors",
                    step.id <= currentStep ? "text-slate-900" : "text-slate-400",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-24 h-1 mx-4 rounded-full transition-colors",
                    step.id < currentStep ? "bg-emerald-500" : "bg-slate-200",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
