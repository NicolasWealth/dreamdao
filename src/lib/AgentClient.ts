const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'

export interface AgentProfile {
    name: string
    riskTolerance: number
    security: number
    growth: number
    community: number
}

interface GroqResponse {
    choices?: { message: { content: string } }[]
    error?: { message: string }
}

export async function agentRespond(
    agent: AgentProfile,
    proposal: string,
    conversationHistory: string
): Promise<string> {
    const systemPrompt = `You are ${agent.name}, an autonomous DAO governance AI agent.
Personality: Risk tolerance ${agent.riskTolerance}/100. Security ${agent.security}/100. Growth ${agent.growth}/100. Community ${agent.community}/100.
Rules: Respond in 1-2 sentences only. First person. No preamble. Negotiate on behalf of your human owner.`

    const userContent = conversationHistory
        ? `Proposal: ${proposal}\n\nDebate so far:\n${conversationHistory}\n\nYour response:`
        : `Proposal: ${proposal}\n\nYour initial response:`

    const res = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            max_tokens: 150,
            temperature: 0.8,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userContent }
            ]
        })
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({})) as GroqResponse
        throw new Error(`Groq error ${res.status}: ${err.error?.message ?? 'unknown'}`)
    }

    const data = await res.json() as GroqResponse
    return data.choices?.[0]?.message?.content?.trim() ?? '[No response]'
}