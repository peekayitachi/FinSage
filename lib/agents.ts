import { AgentType, LoanDetails, LoanState, Message, LoanOffer } from './types';
import { MOCK_OFFERS } from './mock-data';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

// Types for Gemini JSON response
interface GeminiResponse {
    message: string;
    extracted_fields?: Partial<LoanDetails>;
    is_data_collection_complete?: boolean;
}

export * from './types';
export * from './mock-data';

type AgentResponse = {
    messages: Message[];
    updatedDetails?: Partial<LoanDetails>;
    nextAgent?: AgentType;
    updateStepStatus?: { id: AgentType; status: 'active' | 'completed' | 'pending' }[];
    offers?: LoanOffer[];
};

export async function handleAgentLogic(state: LoanState, userMessage: string | null): Promise<AgentResponse> {
    const { currentAgent, loanDetails } = state;
    const messages: Message[] = [];

    // --- MASTER / SALES AGENT (Gemini Powered) ---
    if (currentAgent === 'MASTER' || currentAgent === 'SALES') {

        // 1. Initial Start (No user message yet, just switching to Sales)
        if (currentAgent === 'MASTER') {
            return {
                messages: [{
                    id: Date.now().toString(),
                    type: 'ai',
                    content: "Hello! I am FinSage, your intelligent loan assistant. I can help you get a personalized loan offer in minutes. To begin, could you please tell me your full name?",
                    timestamp: new Date()
                }],
                nextAgent: 'SALES',
                updateStepStatus: [{ id: 'MASTER', status: 'completed' }, { id: 'SALES', status: 'active' }]
            };
        }

        // 2. Sales Conversation Loop
        // 2. Sales Conversation Loop
        if (userMessage) {
            let geminiSuccess = false;
            let parsedResponse: GeminiResponse | null = null;
            let aiText = "";

            // Attempt Gemini AI
            try {
                const prompt = `
          You are FinSage, a Loan Sales Agent.
          Goal: Collect missing details: Name, Amount, Purpose, Monthly Income, City, Employment Type.
          Current: ${JSON.stringify(loanDetails)}
          User Input: "${userMessage}"
          Output JSON: { "message": "response", "extracted_fields": { ... }, "is_data_collection_complete": boolean }
        `;
                const result = await model.generateContent(prompt);
                const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                parsedResponse = JSON.parse(text);
                geminiSuccess = true;
            } catch (e) {
                console.warn("Gemini API Failed, switching to fallback logic", e);
            }

            // Process Response (AI or Fallback)
            if (geminiSuccess && parsedResponse) {
                messages.push({
                    id: 'ai_' + Date.now(),
                    type: 'ai',
                    content: parsedResponse.message,
                    timestamp: new Date()
                });

                // Check for completion
                if (parsedResponse.is_data_collection_complete) {
                    // Additional transition logic
                    let nextAgent: AgentType = 'OFFER';
                    let stepUpdates: { id: AgentType; status: 'active' | 'completed' | 'pending' }[] = [
                        { id: 'SALES', status: 'completed' },
                        { id: 'OFFER', status: 'active' }
                    ];

                    if (!parsedResponse.message.toLowerCase().includes('offer')) {
                        messages.push({
                            id: 'ai_trans_' + Date.now(),
                            type: 'ai',
                            content: "Perfect! I have everything I need. Connecting to our partner network to find the best rates for you...",
                            timestamp: new Date(Date.now() + 500)
                        });
                    }

                    return {
                        messages,
                        updatedDetails: parsedResponse.extracted_fields,
                        nextAgent,
                        updateStepStatus: stepUpdates
                    };
                }
                return { messages, updatedDetails: parsedResponse.extracted_fields };
            }

            // --- FALLBACK LOGIC (Rule Based) ---
            else {
                const updates: Partial<LoanDetails> = {};
                let completed = false;

                // Keep existing values or update if new
                const currentName = loanDetails.name;
                const currentAmount = loanDetails.amount;
                const currentPurpose = loanDetails.purpose;
                const currentIncome = loanDetails.monthlyIncome;
                const currentCity = loanDetails.city;
                const currentEmpType = loanDetails.employmentType;

                // Simple State Machine
                if (!currentName) {
                    updates.name = userMessage;
                    aiText = `Nice to meet you, ${userMessage}. How much loan amount are you looking for?`;
                } else if (!currentAmount) {
                    const nums = userMessage.match(/\d+/g);
                    const val = nums ? parseInt(nums.join('')) : 0;
                    // If user enters "5 lakhs", simplistic parser might fail, let's assume valid number entered or default 5L for demo robustness
                    updates.amount = val > 0 ? val : 500000;
                    aiText = `Got it, ₹${updates.amount?.toLocaleString()}. What is the purpose of this loan? (e.g., Home Renovation)`;
                } else if (!currentPurpose) {
                    updates.purpose = userMessage;
                    aiText = "Understood. And what is your monthly income?";
                } else if (!currentIncome) {
                    const nums = userMessage.match(/\d+/g);
                    updates.monthlyIncome = nums ? parseInt(nums.join('')) : 50000;
                    aiText = "Which city do you currently reside in?";
                } else if (!currentCity) {
                    updates.city = userMessage;
                    aiText = "Thanks! Lastly, are you Salaried or Self-Employed?";
                } else if (!currentEmpType) {
                    updates.employmentType = userMessage.toLowerCase().includes('self') ? 'Self-Employed' : 'Salaried';
                    aiText = "Perfect! I have all the details. Connecting to our partner network to find the best rates for you...";
                    completed = true;
                } else {
                    aiText = "I have your details. Let me fetch the offers.";
                    completed = true;
                }

                messages.push({
                    id: 'ai_fb_' + Date.now(),
                    type: 'ai',
                    content: aiText,
                    timestamp: new Date()
                });

                if (completed) {
                    return {
                        messages,
                        updatedDetails: updates,
                        nextAgent: 'OFFER',
                        updateStepStatus: [
                            { id: 'SALES', status: 'completed' },
                            { id: 'OFFER', status: 'active' }
                        ]
                    };
                }
                return { messages, updatedDetails: updates };
            }
        }
    }

    // --- OFFER AGENT (Transition) ---
    if (currentAgent === 'OFFER') {
        // Simulate a slight delay or simple "thinking" response before showing widgets
        // We can use Gemini here too to generate a "Hype" message about the offers
        const prompt = `
       You are an intelligent Loan Offer Engine.
       The user wants a loan of ₹${loanDetails.amount} for ${loanDetails.purpose}.
       Generate a short, exciting message (1 sentence) announcing that you have found 3 great pre-approved offers for them.
       Do NOT list the offers in text, just announce them.
     `;

        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();

            return {
                messages: [{
                    id: 'ai_offer_' + Date.now(),
                    type: 'ai',
                    content: text,
                    timestamp: new Date(),
                    widget: 'loan-offers'
                }],
                offers: MOCK_OFFERS,
                nextAgent: 'VERIFICATION',
                updateStepStatus: [{ id: 'OFFER', status: 'completed' }]
            };
        } catch (e) {
            return {
                messages: [{
                    id: 'ai_offer_' + Date.now(),
                    type: 'ai',
                    content: "Great news! I've found these exclusive offers for you.",
                    timestamp: new Date(),
                    widget: 'loan-offers'
                }],
                offers: MOCK_OFFERS,
                nextAgent: 'VERIFICATION',
                updateStepStatus: [{ id: 'OFFER', status: 'completed' }]
            };
        }
    }

    // --- VERIFICATION AGENT ---
    if (currentAgent === 'VERIFICATION') {
        // Triggered after offer selection usually
        messages.push({
            id: 'ai_verif_' + Date.now(),
            type: 'ai',
            content: "To unlock this offer, we just need to verify your identity. Please upload your PAN and Aadhaar card below for instant KYC.",
            timestamp: new Date(),
            widget: 'document-upload'
        });
        return {
            messages,
            updateStepStatus: [{ id: 'VERIFICATION', status: 'active' }]
        };
    }

    return { messages: [] };
}
