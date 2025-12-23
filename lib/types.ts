
export type AgentType = 'MASTER' | 'SALES' | 'OFFER' | 'VERIFICATION' | 'UNDERWRITING' | 'SANCTION';

export type AgentStatus = 'IDLE' | 'THINKING' | 'WORKING' | 'COMPLETED' | 'WAITING_FOR_USER';

export interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  widget?: 'document-upload' | 'verification-success' | 'loan-offers' | 'sanction-letter';
  data?: any; // For holding widget data
}

export interface LoanDetails {
  intentDetected: boolean;
  amount: number;
  purpose: string;
  monthlyIncome: number;
  employmentType: 'Salaried' | 'Self-Employed' | null;
  city: string;
  name: string;
  pan: string;
  aadhaar: string;
}

export interface LoanOffer {
  id: string;
  provider: string;
  amount: number;
  interestRate: number;
  tenureMonths: number;
  emi: number;
  processingFee: number;
  tags: string[];
}

export interface AgentStep {
  id: AgentType;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface LoanState {
  currentAgent: AgentType;
  agentStatus: AgentStatus;
  messages: Message[];
  loanDetails: LoanDetails;
  offers: LoanOffer[];
  selectedOfferId: string | null;
  agentSteps: AgentStep[];
  isTyping: boolean;
}
