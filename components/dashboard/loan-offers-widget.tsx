import { LoanOffer } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Percent, Calendar, Banknote } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoanOffersWidgetProps {
    offers: LoanOffer[]
    onSelect: (offerId: string) => void
    onViewMore?: (offerId: string) => void
}

export function LoanOffersWidget({ offers, onSelect }: LoanOffersWidgetProps) {
    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Personalized Offers</h3>
                <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                    {offers.length} Options Found
                </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                {offers.map((offer) => (
                    <div
                        key={offer.id}
                        className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => onSelect(offer.id)}
                    >
                        {/* Selection Highlight */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-slate-900">{offer.provider}</span>
                                {offer.tags.map(tag => (
                                    <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <p className="text-2xl font-bold text-slate-900">
                                ₹{offer.amount.toLocaleString()}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Percent className="w-4 h-4" />
                                    <span>Interest</span>
                                </div>
                                <span className="font-semibold text-emerald-600">{offer.interestRate}%</span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>Tenure</span>
                                </div>
                                <span className="font-semibold text-slate-900">{offer.tenureMonths} Months</span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Banknote className="w-4 h-4" />
                                    <span>EMI</span>
                                </div>
                                <span className="font-semibold text-slate-900">₹{offer.emi.toLocaleString()}</span>
                            </div>
                        </div>

                        <Button
                            className="w-full mt-5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
                        >
                            Select Offer
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
