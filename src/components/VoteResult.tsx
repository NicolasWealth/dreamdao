import type { VoteResult as VoteResultType } from '../hooks/useVote'

interface VoteResultProps {
    result: VoteResultType
}

export const VoteResult = ({ result }: VoteResultProps) => {
    const rows = [
        { label: 'For', value: result.for.toString(), className: 'proposal-stat-for' },
        { label: 'Against', value: result.against.toString(), className: 'proposal-stat-against' },
        { label: 'Abstain', value: result.abstain.toString(), className: 'proposal-stat-abstain' },
    ]

    return (
        <section className="surface-card receipt-card">
            <div className="surface-inner">
                <div className="receipt-header">
                    <div>
                        <p className="eyebrow">Vote result</p>
                        <h2 className="section-title" style={{ fontSize: '1.45rem' }}>
                            {result.passed ? 'Proposal passed' : 'Proposal rejected'}
                        </h2>
                    </div>
                    <span className={`receipt-status ${result.passed ? '' : 'is-rejected'}`}>
                        {result.passed ? 'Winning majority' : 'Failed quorum'}
                    </span>
                </div>

                <div className="stat-grid" style={{ marginBottom: '1rem' }}>
                    {rows.map(row => (
                        <article key={row.label} className="stat-card">
                            <div className="stat-label">{row.label}</div>
                            <div className={`stat-value ${row.className}`}>{row.value}</div>
                        </article>
                    ))}
                </div>

                <div className="receipt-table">
                    <div className="receipt-row" style={{ display: 'grid', gridTemplateColumns: '0.38fr 1fr' }}>
                        <div className="receipt-label">On-chain execution</div>
                        <div className="receipt-value mono">{result.txHash}</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
