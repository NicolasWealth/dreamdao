import { useRef } from 'react'
import { useAgentDebate } from '../hooks/useAgentDebate'
import { useCoalition } from '../hooks/useCoalition'
import { useVote } from '../hooks/useVote'
import AgentDebate from '../AgentDebate'
import { CoalitionBar } from '../components/CoalitionBar'
import { VoteGrid } from '../components/VoteGrid'
import TxReceipt from '../components/TxReceipt'
import { MOCK_PROPOSALS } from '../data/mockProposals'

export default function ProposalPage() {
    const { messages, phase, running: debating, runDebate } = useAgentDebate()
    const { coalition, animating, deriveFromDebate } = useCoalition()
    const { agents, result, running: voting, status, useOnChain, setUseOnChain, runVote } = useVote(24)

    const proposal = MOCK_PROPOSALS.find(p => p.id === 'PRP-007') ?? MOCK_PROPOSALS[0]
    const summaryRef = useRef('')

    const handleDebateComplete = async (proposalText: string) => {
        const finalMessages = await runDebate(proposalText)
        summaryRef.current = finalMessages
            .filter(m => m.kind === 'agent')
            .map(m => m.kind === 'agent' ? `${m.agent.name}: ${m.text}` : '')
            .join(' | ')
            .slice(0, 600)
        deriveFromDebate(finalMessages)
    }

    const handleRunVote = () => {
        runVote(coalition, proposal.title, summaryRef.current)
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
                        {[
                            { label: 'Proposal', value: proposal.id },
                            { label: 'Proposer', value: proposal.proposer },
                            { label: 'Risk score', value: `${proposal.riskScore}/100` },
                            { label: 'Treasury impact', value: proposal.treasuryImpact },
                        ].map(({ label, value }) => (
                            <div key={label} className="proposal-meta-block">
                                <div className="proposal-meta-label">{label}</div>
                                <div className="proposal-meta-value">{value}</div>
                            </div>
                        ))}
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

                    {/* On-chain toggle */}
                    <div className="surface-card reveal-in" style={{ ['--enter-delay' as any]: '340ms' }}>
                        <div className="surface-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>
                                    {useOnChain ? '⛓ Somnia Agent votes (on-chain)' : '🖥 Simulated vote'}
                                </p>
                                <p style={{ fontSize: 11, color: 'var(--text-2)' }}>
                                    {useOnChain
                                        ? 'AliceAgent, BobAgent & CarolAgent invoke the Somnia LLM Agent. ~0.15 STT each. Requires MetaMask on Somnia Testnet.'
                                        : 'Coalition-derived results — no on-chain call.'}
                                </p>
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0 }}>
                                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>On-chain</span>
                                <div
                                    onClick={() => setUseOnChain(v => !v)}
                                    style={{
                                        width: 40, height: 22, borderRadius: 11,
                                        background: useOnChain ? 'var(--teal)' : 'var(--bg-2)',
                                        border: '1px solid var(--line-strong)',
                                        position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute', top: 2,
                                        left: useOnChain ? 20 : 2,
                                        width: 16, height: 16, borderRadius: '50%',
                                        background: '#fff', transition: 'left 0.2s',
                                    }} />
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Consensus waiting indicator */}
                    {voting && status && (
                        <div className="surface-card reveal-in" style={{ ['--enter-delay' as any]: '0ms' }}>
                            <div className="surface-inner" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div className="typing-dots"><span /><span /><span /></div>
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 600 }}>{status}</p>
                                    <p style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>
                                        Somnia validator network reaching consensus…
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        className="button-primary reveal-in"
                        style={{ width: '100%', marginTop: '0.25rem', ['--enter-delay' as any]: '360ms' }}
                        disabled={voting}
                        onClick={handleRunVote}
                    >
                        {voting
                            ? `Agents voting on-chain… (${status || 'waiting'})`
                            : useOnChain
                                ? 'Run autonomous vote on Somnia ⛓'
                                : 'Run simulated vote'}
                    </button>

                    {result && (
                        <div className="reveal-in" style={{ ['--enter-delay' as any]: '450ms' }}>
                            <TxReceipt
                                txHash={result.txHash}
                                proposalId={proposal.id}
                                blockNumber={result.blockNumber}
                                somniaRequestId={result.somniaRequestId}
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