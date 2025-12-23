import { LoanOffer, AgentStep } from './types';

export const MOCK_OFFERS: LoanOffer[] = [
    {
        id: 'offer_1',
        provider: 'FinSage Prime',
        amount: 500000,
        interestRate: 10.5,
        tenureMonths: 36,
        emi: 16264,
        processingFee: 4999,
        tags: ['Best Value', 'Instant Disbursal']
    },
    {
        id: 'offer_2',
        provider: 'HDFC Bank',
        amount: 500000,
        interestRate: 11.2,
        tenureMonths: 48,
        emi: 12985,
        processingFee: 2500,
        tags: ['Low Processing Fee']
    },
    {
        id: 'offer_3',
        provider: 'ICICI Bank',
        amount: 600000,
        interestRate: 10.9,
        tenureMonths: 60,
        emi: 13000,
        processingFee: 3000,
        tags: ['Higher Amount']
    }
];

export const INITIAL_GREETING = "Welcome to FinSage! I'm your AI loan assistant, powered by the FinSage Agent Network. I'm here to find you the best personal loan offers from our partner NBFCs. To get started, may I know your name?";

export const AGENT_STEPS_INITIAL: AgentStep[] = [
    { id: 'MASTER', name: 'Master Agent', description: 'Orchestrating workflow', status: 'active' },
    { id: 'SALES', name: 'Sales Agent', description: 'Understanding needs', status: 'pending' },
    { id: 'OFFER', name: 'Offer Agent', description: 'Fetching best rates', status: 'pending' },
    { id: 'VERIFICATION', name: 'Verification Agent', description: 'Validating documents', status: 'pending' },
    { id: 'UNDERWRITING', name: 'Underwriting Agent', description: 'Risk assessment', status: 'pending' },
    { id: 'SANCTION', name: 'Sanction Agent', description: 'Generating approval', status: 'pending' },
];
