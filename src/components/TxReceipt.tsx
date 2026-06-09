import type { SomniaTx } from '../lib/somniaClient'
import { formatTxShort } from '../lib/somniaClient'

interface Props {
    tx: SomniaTx
    proposalId: string
    voteCount: { for: number; against: number; abstain: number }
    passed: boolean
}

export default function TxReceipt({ tx, proposalId, voteCount, passed }: Props) {
    const rows: [string, string][] = [
        ['Proposal', proposalId],
        ['Result', passed ? 'Passed ✓' : 'Rejected ✗'],
        ['For / Against / Abstain', `${voteCount.for} / ${voteCount.against} / ${voteCount.abstain}`],
        ['Tx hash', formatTxShort(tx.hash)],
        ['Block', tx.blockNumber.toLocaleString()],
        ['Timestamp', new Date(tx.timestamp).toLocaleTimeString()],
        ['Status', tx.status],
    ]

    return (
        <div style={{
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-lg)',
            padding: '1rem 1.25rem',
            marginTop: '1rem',
            background: 'var(--color-background-primary)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Somnia transaction</span>
                <span style={{
                    fontSize: 11,
                    padding: '3px 10px',
                    borderRadius: 20,
                    background: passed ? 'var(--color-background-success)' : 'var(--color-background-danger)',
                    color: passed ? 'var(--color-text-success)' : 'var(--color-text-danger)',
                    fontWeight: 500
                }}>
                    {passed ? 'Proposal passed' : 'Proposal rejected'}
                </span>
            </div>

            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                <tbody>
                    {rows.map(([label, value]) => (
                        <tr key={label} style={{ borderTop: '0.5px solid var(--color-border-tertiary)' }}>
                            <td style={{ padding: '6px 0', color: 'var(--color-text-secondary)', width: '40%' }}>{label}</td>
                            <td style={{ padding: '6px 0', fontFamily: label === 'Tx hash' ? 'var(--font-mono)' : undefined }}>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <a
                href={tx.explorerUrl}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'block', marginTop: '0.75rem', fontSize: 12, color: 'var(--color-text-info)' }}
            >
                View on Somnia Explorer ↗
            </a>
        </div>
    )
}