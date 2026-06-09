import { useState, useCallback } from 'react'
import { agentRespond, type AgentProfile } from '../lib/AgentClient'

export interface DebateMessage {
    kind: 'agent'
    agent: AgentProfile
    text: string
    timestamp: number
}

export interface SystemMessage {
    kind: 'system'
    text: string
    timestamp: number
}

export type ChatMessage = DebateMessage | SystemMessage

const DEFAULT_AGENTS: AgentProfile[] = [
    { name: 'AliceAgent', riskTolerance: 20, security: 90, growth: 30, community: 70 },
    { name: 'BobAgent', riskTolerance: 85, security: 30, growth: 90, community: 60 },
    { name: 'CarolAgent', riskTolerance: 50, security: 60, growth: 60, community: 80 },
]

export function useAgentDebate() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [phase, setPhase] = useState('Ready')
    const [running, setRunning] = useState(false)

    const runDebate = useCallback(async (proposal: string, rounds = 2): Promise<ChatMessage[]> => {
        setRunning(true)
        setPhase(`Testing Grok call with ${DEFAULT_AGENTS[0].name}`)
        setMessages([])
        let history = ''
        const collected: ChatMessage[] = []

        try {
            const [firstAgent, ...remainingAgents] = DEFAULT_AGENTS
            const firstText = await agentRespond(firstAgent, proposal, history)
            const firstMessage: DebateMessage = {
                kind: 'agent',
                agent: firstAgent,
                text: firstText,
                timestamp: Date.now(),
            }

            collected.push(firstMessage)
            setMessages([firstMessage])
            history += `${firstAgent.name}: ${firstText}\n`
            setPhase('Grok call worked. Expanding to three agents')
            await new Promise(r => setTimeout(r, 400))

            for (let round = 0; round < rounds; round++) {
                const agents = round === 0 ? remainingAgents : DEFAULT_AGENTS

                for (const agent of agents) {
                    setPhase(`${agent.name} is responding`)
                    const text = await agentRespond(agent, proposal, history)
                    const msg: DebateMessage = { kind: 'agent', agent, text, timestamp: Date.now() }
                    collected.push(msg)
                    setMessages(prev => [...prev, msg])
                    history += `${agent.name}: ${text}\n`
                    await new Promise(r => setTimeout(r, 400))
                }
            }
        } catch (error) {
            const text = error instanceof Error ? error.message : 'Unable to run debate'
            const errMsg: ChatMessage = {
                kind: 'system',
                text: `Grok API test failed: ${text}`,
                timestamp: Date.now(),
            }
            collected.push(errMsg)
            setMessages(prev => [...prev, errMsg])
        } finally {
            setPhase('Ready')
            setRunning(false)
        }

        return collected
    }, [])

    return { messages, phase, running, runDebate }
}
