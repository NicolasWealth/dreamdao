import { useState, useCallback } from 'react'
import type { ChatMessage } from './useAgentDebate'

export interface CoalitionState {
    support: number
    oppose: number
    undecided: number
    notes: string[]
}

export function useCoalition() {
    const [coalition, setCoalition] = useState<CoalitionState>({
        support: 0,
        oppose: 0,
        undecided: 100,
        notes: []
    })
    const [animating, setAnimating] = useState(false)

    const deriveFromDebate = useCallback((messages: ChatMessage[]) => {
        setAnimating(true)

        const stages: CoalitionState[] = [
            { support: 38, oppose: 29, undecided: 33, notes: ['Agents analyzing proposal impact on treasury.'] },
            { support: 54, oppose: 25, undecided: 21, notes: ['AliceAgent coalition forming around risk-reduction amendment.', 'BobAgent rallying growth-focused agents.'] },
            { support: 63, oppose: 21, undecided: 16, notes: ['AliceAgent coalition forming around risk-reduction amendment.', 'BobAgent rallying growth-focused agents.', 'CarolAgent compromise gaining traction among undecided agents.'] },
        ]

        // derive final support bias from message content
        const fullText = messages.map(m => m.text).join(' ').toLowerCase()
        const supportSignals = (fullText.match(/support|agree|accept|yes|compromise|good/g) ?? []).length
        const opposeSignals = (fullText.match(/reject|oppose|risk|no|concern|dangerous/g) ?? []).length
        const supportBias = supportSignals > opposeSignals ? 5 : -5

        const finalStage: CoalitionState = {
            support: Math.min(80, Math.max(40, 63 + supportBias)),
            oppose: Math.max(10, 21 - Math.floor(supportBias / 2)),
            undecided: 0,
            notes: [
                ...stages[2].notes,
                `Debate sentiment: ${supportSignals} support signals vs ${opposeSignals} oppose signals.`,
                'All undecided agents have joined a coalition.'
            ]
        }
        finalStage.undecided = 100 - finalStage.support - finalStage.oppose

        const sequence = [...stages, finalStage]
        let i = 0
        const tick = () => {
            if (i >= sequence.length) { setAnimating(false); return }
            setCoalition(sequence[i])
            i++
            setTimeout(tick, 1600)
        }
        tick()
    }, [])

    return { coalition, animating, deriveFromDebate }
}