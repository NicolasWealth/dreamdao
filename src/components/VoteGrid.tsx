import type { VoteAgent } from '../hooks/useVote'

interface VoteGridProps {
    agents: VoteAgent[]
}

const LABELS: Record<VoteAgent['outcome'], string> = {
    for: 'FOR',
    against: 'AGN',
    abstain: 'ABS',
}

export function VoteGrid({ agents }: VoteGridProps) {
    return (
        <section className="surface-card vote-card">
            <div className="surface-inner">
                <div className="vote-header">
                    <div>
                        <p className="eyebrow">Autonomous ballot</p>
                        <h2 className="section-title" style={{ fontSize: '1.45rem' }}>FOR / AGN / ABS dot grid</h2>
                    </div>

                    <div className="vote-legend" aria-label="Outcome legend">
                        <span className="vote-legend-item"><span className="vote-legend-dot for" /> FOR</span>
                        <span className="vote-legend-item"><span className="vote-legend-dot against" /> AGN</span>
                        <span className="vote-legend-item"><span className="vote-legend-dot abstain" /> ABS</span>
                    </div>
                </div>

                <div className="vote-grid">
                    {agents.map(agent => {
                        const revealedClass = agent.revealed ? `vote-cell-${agent.outcome}` : 'vote-cell-hidden'

                        return (
                            <div key={agent.id} className={`vote-cell ${revealedClass}`}>
                                <span className="vote-dot" aria-hidden="true" />
                                <span className="vote-cell-id">{agent.id}</span>
                                <span className="vote-cell-outcome">
                                    {agent.revealed ? LABELS[agent.outcome] : '...'}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
