"use client"

import { X, Download, CheckCircle2, Stamp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SanctionLetterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SanctionLetterModal({ isOpen, onClose }: SanctionLetterModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-300">
        {/* Glassmorphism Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Loan Sanctioned!</h2>
                  <p className="text-sm text-slate-300">Pre-Approved Offer</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sanction Letter Content */}
          <div className="p-6">
            {/* Letter Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="font-semibold text-slate-900">FinSage Finance Ltd.</span>
              </div>
              <p className="text-xs text-slate-500">CIN: U65100MH2024PLC123456</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Sanction Letter</h3>
                <p className="text-xs text-slate-500 mt-1">Ref: FSL/2024/PL/{Date.now().toString().slice(-6)}</p>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-500">Dear</p>
                  <p className="font-semibold text-slate-900">Mr. Rahul Sharma</p>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  We are pleased to inform you that your personal loan application has been
                  <span className="font-semibold text-emerald-600"> approved</span>. Please find the sanctioned terms
                  below:
                </p>

                <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-200">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">Loan Amount</p>
                    <p className="text-lg font-bold text-slate-900">₹5,00,000</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">Interest Rate</p>
                    <p className="text-lg font-bold text-emerald-600">10.5% p.a.</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">Tenure</p>
                    <p className="text-lg font-bold text-slate-900">36 Months</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">Monthly EMI</p>
                    <p className="text-lg font-bold text-slate-900">₹16,264</p>
                  </div>
                </div>

                {/* Digital Signature */}
                <div className="flex items-end justify-between pt-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Authorized Signatory</p>
                    <div className="flex items-center gap-2">
                      <Stamp className="w-8 h-8 text-blue-600" />
                      <div className="border-b-2 border-dashed border-slate-300 w-32 pb-1">
                        <p className="text-xs italic text-slate-400">Digital Signature</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-700 mt-2">FinSage Finance Ltd.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Date</p>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date().toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <Button variant="outline" className="flex-1 rounded-xl h-11 bg-transparent" onClick={onClose}>
              Review Later
            </Button>
            <Button className="flex-1 rounded-xl h-11 bg-slate-900 hover:bg-slate-800 gap-2">
              <Download className="w-4 h-4" />
              Accept & Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
