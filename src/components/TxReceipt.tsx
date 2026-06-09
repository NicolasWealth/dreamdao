import type { SomniaTx } from '../lib/somniaClient'
import { formatTxShort } from '../lib/somniaClient'

interface Props {
    tx: SomniaTx
    proposalId: string
    voteCount: { for: number; against: number; abstain: number }
    passed: boolean
}

export default function TxReceipt({ tx, proposalId, voteCount, passed }: Props) {
    const rows: { label: string; value: string; tone?: 'pass' | 'fail' }[] = [
        { label: 'Proposal', value: proposalId },
        { label: 'Result', value: passed ? 'Passed' : 'Rejected', tone: passed ? 'pass' : 'fail' },
        { label: 'Votes', value: `${voteCount.for} / ${voteCount.against} / ${voteCount.abstain}` },
        { label: 'Tx hash', value: formatTxShort(tx.hash) },
        { label: 'Block', value: tx.blockNumber.toLocaleString() },
        { label: 'From', value: tx.from },
        { label: 'To', value: tx.to },
        { label: 'Timestamp', value: new Date(tx.timestamp).toLocaleString() },
        { label: 'Status', value: tx.status },
    ]

    return (
        <section className="surface-card receipt-card">
            <div className="surface-inner">
                <div className="receipt-header">
                    <div>
                        <p className="eyebrow">Somnia receipt</p>
                        <h2 className="section-title" style={{ fontSize: '1.45rem' }}>On-chain execution</h2>
                    </div>
                    <span className={`receipt-status ${passed ? '' : 'is-rejected'}`}>
                        {passed ? 'Proposal passed' : 'Proposal rejected'}
                    </span>
                </div>

                <table className="receipt-table">
                    <tbody>
                        {rows.map(({ label, value, tone }) => (
                            <tr key={label} className="receipt-row">
                                <td className="receipt-label">{label}</td>
                                <td className={`receipt-value ${label === 'Tx hash' || label === 'From' || label === 'To' ? 'mono' : ''} ${tone ? `result-${tone}` : ''}`}>
                                    {value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <a
                    className="receipt-link"
                    href={tx.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    View on Somnia Explorer -&gt;
                </a>
            </div>
        </section>
    )
}
