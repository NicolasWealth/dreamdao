import { useState, useCallback } from 'react'
import type { CoalitionState } from './useCoalition'

export type VoteOutcome = 'for' | 'against' | 'abstain'

export interface VoteAgent {
    id: string
    outcome: VoteOutcome
    revealed: boolean
}

export interface VoteResult {
    for: number
    against: number
    abstain: number
    passed: boolean
    txHash: string
}

function mockTxHash(): string {
    return '0x' + Array.from(
        { length: 64 },
        () => '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('')
}

export function useVote(totalAgents = 24) {
    const [agents, setAgents] = useState<VoteAgent[]>(() =>
        Array.from({ length: totalAgents }, (_, i) => ({
            id: String.fromCharCode(65 + (i % 26)) + 'A',
            outcome: 'for',
            revealed: false
        }))
    )
    const [result, setResult] = useState<VoteResult | null>(null)
    const [running, setRunning] = useState(false)

    const runVote = useCallback((coalition: CoalitionState) => {
        setRunning(true)
        setResult(null)

        const outcomes: VoteOutcome[] = Array.from({ length: totalAgents }, () => {
            const r = Math.random() * 100
            if (r < coalition.support) return 'for'
            if (r < coalition.support + coalition.oppose) return 'against'
            return 'abstain'
        })

        // reset all to unrevealed
        setAgents(prev => prev.map((a, i) => ({ ...a, outcome: outcomes[i], revealed: false })))

        let i = 0
        const tick = () => {
            if (i >= totalAgents) {
                const forCount = outcomes.filter(o => o === 'for').length
                const againstCount = outcomes.filter(o => o === 'against').length
                const abstainCount = outcomes.filter(o => o === 'abstain').length
                setResult({
                    for: forCount,
                    against: againstCount,
                    abstain: abstainCount,
                    passed: forCount > againstCount,
                    txHash: mockTxHash()
                })
                setRunning(false)
                return
            }
            setAgents(prev => prev.map((a, idx) =>
                idx === i ? { ...a, revealed: true } : a
            ))
            i++
            setTimeout(tick, 80)
        }
        setTimeout(tick, 300)
    }, [totalAgents])

    return { agents, result, running, runVote }
}