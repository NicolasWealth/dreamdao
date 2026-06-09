import { useAgentDebate } from '../hooks/useAgentDebate'
import { useCoalition } from '../hooks/useCoalition'
import { useVote } from '../hooks/useVote'
import AgentDebate from '../AgentDebate'
import { CoalitionBar } from '../components/CoalitionBar'
import { VoteGrid } from '../components/VoteGrid'
import { mockSomniaTx } from '../lib/somniaClient'
import TxReceipt from '../components/TxReceipt'

export default function ProposalPage() {
    const { messages, phase, running: debating, runDebate } = useAgentDebate()
    const { coalition, animating, deriveFromDebate } = useCoalition()
    const { agents, result, running: voting, runVote } = useVote(24)

    const tx = result ? mockSomniaTx('0x4F2a...9c1d', 'PRP-007', result.passed ? 'for' : 'against') : null

    const handleDebateComplete = async (proposal: string) => {
        const finalMessages = await runDebate(proposal)
        // use returned array — not stale state closure
        deriveFromDebate(finalMessages)
    }

    return (
        <div className="w-full max-w-4xl mx-auto pb-16">
            <AgentDebate
                messages={messages}
                phase={phase}
                running={debating}
                onStart={handleDebateComplete}
            />

            {/* coalition section — show after debate */}
            {messages.length > 0 && (
                <CoalitionBar coalition={coalition} animating={animating} />
            )}

            {/* vote section — show after coalitions form */}
            {!animating && coalition.support > 0 && (
                <>
                    <VoteGrid agents={agents} />
                    <button
                        className="mt-6 w-full py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                        disabled={voting}
                        onClick={() => runVote(coalition)}
                    >
                        {voting ? 'Agents voting…' : 'Run autonomous vote'}
                    </button>
                    {result && tx && (
                        <TxReceipt
                            tx={tx}
                            proposalId="PRP-007"
                            voteCount={{ for: result.for, against: result.against, abstain: result.abstain }}
                            passed={result.passed}
                        />
                    )}
                </>
            )}
        </div>
    )
}