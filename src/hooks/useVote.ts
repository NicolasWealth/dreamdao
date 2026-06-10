import { useState, useCallback, useRef } from 'react'
import type { CoalitionState } from './useCoalition'
import { somniaAgentVote, type AgentProfile, type SomniaVoteResult } from '../lib/somniaAgent'
import type { Hash } from 'viem'

export type VoteOutcome = 'for' | 'against' | 'abstain'

export interface VoteAgent {
    id: string
    name: string
    outcome: VoteOutcome
    revealed: boolean
    txHash?: Hash
    somniaRequestId?: bigint
}

export interface VoteResult {
    for: number
    against: number
    abstain: number
    passed: boolean
    txHash: Hash
    blockNumber: bigint
    somniaRequestId: bigint
}

const VOTING_AGENTS: AgentProfile[] = [
    { name: 'AliceAgent', riskTolerance: 20, security: 90, growth: 30, community: 70 },
    { name: 'BobAgent', riskTolerance: 85, security: 30, growth: 90, community: 60 },
    { name: 'CarolAgent', riskTolerance: 50, security: 60, growth: 60, community: 80 },
]

function coalitionOutcome(coalition: CoalitionState): VoteOutcome {
    const r = Math.random() * 100
    if (r < coalition.support) return 'for'
    if (r < coalition.support + coalition.oppose) return 'against'
    return 'abstain'
}

export function useVote(totalAgents = 24) {
    const [agents, setAgents] = useState<VoteAgent[]>(() =>
        Array.from({ length: totalAgents }, (_, i) => ({
            id: `${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) || ''}`,
            name: i < VOTING_AGENTS.length ? VOTING_AGENTS[i].name : `Agent${i + 1}`,
            outcome: 'for',
            revealed: false,
        }))
    )
    const [result, setResult] = useState<VoteResult | null>(null)
    const [running, setRunning] = useState(false)
    const [status, setStatus] = useState('')
    const [useOnChain, setUseOnChain] = useState(true)
    const abortRef = useRef(false)

    const runVote = useCallback(async (
        coalition: CoalitionState,
        proposal: string,
        debateSummary: string
    ) => {
        setRunning(true)
        setResult(null)
        abortRef.current = false

        setAgents(prev => prev.map(a => ({ ...a, revealed: false, txHash: undefined })))

        const outcomes: VoteOutcome[] = new Array(totalAgents).fill('abstain')
        let firstTxHash: Hash = '0x0000000000000000000000000000000000000000000000000000000000000000'
        let firstBlock = BigInt(0)
        let firstRequestId = BigInt(0)

        if (useOnChain) {
            for (let i = 0; i < VOTING_AGENTS.length; i++) {
                if (abortRef.current) break
                const agent = VOTING_AGENTS[i]
                setStatus(`${agent.name} invoking Somnia LLM Agent… (waiting for consensus)`)

                try {
                    const somniaResult: SomniaVoteResult = await somniaAgentVote(
                        agent, proposal, debateSummary
                    )
                    outcomes[i] = somniaResult.vote

                    if (i === 0) {
                        firstTxHash = somniaResult.txHash
                        firstBlock = somniaResult.blockNumber
                        firstRequestId = somniaResult.requestId
                    }

                    setAgents(prev => prev.map((a, idx) =>
                        idx === i
                            ? { ...a, outcome: somniaResult.vote, revealed: true, txHash: somniaResult.txHash }
                            : a
                    ))
                    setStatus(`${agent.name} voted ${somniaResult.vote.toUpperCase()} on-chain ✓`)
                    await new Promise(r => setTimeout(r, 500))

                } catch (err) {
                    console.error(`Somnia Agent vote failed for ${agent.name}:`, err)
                    outcomes[i] = coalitionOutcome(coalition)
                    setAgents(prev => prev.map((a, idx) =>
                        idx === i ? { ...a, outcome: outcomes[i], revealed: true } : a
                    ))
                    setStatus(`${agent.name}: on-chain fallback used`)
                    await new Promise(r => setTimeout(r, 300))
                }
            }
        }

        setStatus('Remaining agents casting votes…')
        for (let i = VOTING_AGENTS.length; i < totalAgents; i++) {
            if (abortRef.current) break
            outcomes[i] = coalitionOutcome(coalition)
            setAgents(prev => prev.map((a, idx) =>
                idx === i ? { ...a, outcome: outcomes[i], revealed: true } : a
            ))
            await new Promise(r => setTimeout(r, 70))
        }

        const forCount = outcomes.filter(o => o === 'for').length
        const againstCount = outcomes.filter(o => o === 'against').length
        const abstainCount = outcomes.filter(o => o === 'abstain').length

        setResult({
            for: forCount,
            against: againstCount,
            abstain: abstainCount,
            passed: forCount > againstCount,
            txHash: firstTxHash,
            blockNumber: firstBlock,
            somniaRequestId: firstRequestId,
        })

        setStatus('')
        setRunning(false)
    }, [totalAgents, useOnChain])

    const abort = useCallback(() => { abortRef.current = true }, [])

    return { agents, result, running, status, useOnChain, setUseOnChain, runVote, abort }
}