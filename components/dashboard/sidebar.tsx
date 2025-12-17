"use client"

import { useState } from "react"
import { LayoutDashboard, FileText, FolderLock, HelpCircle, ChevronRight, BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: FileText, label: "Active Applications", active: false },
  { icon: FolderLock, label: "Document Vault", active: false },
  { icon: HelpCircle, label: "Support", active: false },
]

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard")

  return (
    <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 text-lg tracking-tight">FinSage</h1>
            <p className="text-xs text-slate-500">AI Loan Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3 px-3">Menu</p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => setActiveItem(item.label)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  activeItem === item.label
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {activeItem === item.label && <ChevronRight className="w-4 h-4" />}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile Card */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage src="/professional-indian-man-avatar.jpg" />
              <AvatarFallback className="bg-slate-200 text-slate-700">RS</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">Rahul Sharma</p>
              <p className="text-xs text-slate-500 truncate">rahul@example.com</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-600">KYC Verified</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
