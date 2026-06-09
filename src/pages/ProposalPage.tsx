import { useAgentDebate } from '../hooks/useAgentDebate'
import { useCoalition } from '../hooks/useCoalition'
import { useVote } from '../hooks/useVote'
import AgentDebate from '../AgentDebate'
import { CoalitionBar } from '../components/CoalitionBar'
import { VoteGrid } from '../components/VoteGrid'
import TxReceipt from '../components/TxReceipt'
import { MOCK_PROPOSALS } from '../data/mockProposals'
import { mockSomniaTx } from '../lib/somniaClient'

export default function ProposalPage() {
    const { messages, phase, running: debating, runDebate } = useAgentDebate()
    const { coalition, animating, deriveFromDebate } = useCoalition()
    const { agents, result, running: voting, runVote } = useVote(24)

    const proposal = MOCK_PROPOSALS.find(item => item.id === 'PRP-007') ?? MOCK_PROPOSALS[0]
    const tx = result ? mockSomniaTx('0x4F2a...9c1d', proposal.id, result.passed ? 'for' : 'against') : null

    const handleDebateComplete = async (proposalText: string) => {
        const finalMessages = await runDebate(proposalText)
        deriveFromDebate(finalMessages)
    }

    return (
        <div className="page-stack">
            <section className="surface-card proposal-hero reveal-in" style={{ ['--enter-delay' as any]: '35ms' }}>
                <div className="surface-inner">
                    <div className="proposal-hero-grid">
                        <div>
                            <p className="eyebrow">Live proposal</p>
                            <h1 className="section-title">{proposal.title}</h1>
                            <p className="section-copy">{proposal.description}</p>
                        </div>

                        <span className="chip chip-live">Debate live</span>
                    </div>

                    <div className="proposal-metadata">
                        <div className="proposal-meta-block">
                            <div className="proposal-meta-label">Proposal</div>
                            <div className="proposal-meta-value">{proposal.id}</div>
                        </div>
                        <div className="proposal-meta-block">
                            <div className="proposal-meta-label">Proposer</div>
                            <div className="proposal-meta-value">{proposal.proposer}</div>
                        </div>
                        <div className="proposal-meta-block">
                            <div className="proposal-meta-label">Risk score</div>
                            <div className="proposal-meta-value">{proposal.riskScore}/100</div>
                        </div>
                        <div className="proposal-meta-block">
                            <div className="proposal-meta-label">Treasury impact</div>
                            <div className="proposal-meta-value">{proposal.treasuryImpact}</div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="reveal-in" style={{ ['--enter-delay' as any]: '130ms' }}>
                <AgentDebate
                    messages={messages}
                    phase={phase}
                    running={debating}
                    onStart={handleDebateComplete}
                />
            </div>

            {messages.length > 0 && (
                <div className="reveal-in" style={{ ['--enter-delay' as any]: '220ms' }}>
                    <CoalitionBar coalition={coalition} animating={animating} />
                </div>
            )}

            {!animating && coalition.support > 0 && (
                <>
                    <div className="reveal-in" style={{ ['--enter-delay' as any]: '290ms' }}>
                        <VoteGrid agents={agents} />
                    </div>
                    <button
                        className="button-primary reveal-in"
                        style={{ width: '100%', marginTop: '0.25rem', ['--enter-delay' as any]: '360ms' }}
                        disabled={voting}
                        onClick={() => runVote(coalition)}
                    >
                        {voting ? 'Agents voting...' : 'Run autonomous vote'}
                    </button>
                    {result && tx && (
                        <div className="reveal-in" style={{ ['--enter-delay' as any]: '450ms' }}>
                            <TxReceipt
                                tx={tx}
                                proposalId={proposal.id}
                                voteCount={{ for: result.for, against: result.against, abstain: result.abstain }}
                                passed={result.passed}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
