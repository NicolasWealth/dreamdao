import type { Hash } from 'viem'

interface Props {
    txHash: Hash
    proposalId: string
    blockNumber: bigint
    somniaRequestId: bigint
    voteCount: { for: number; against: number; abstain: number }
    passed: boolean
}

const EXPLORER = 'https://shannon-explorer.somnia.network'

function short(hash: string) {
    return `${hash.slice(0, 10)}…${hash.slice(-8)}`
}

export default function TxReceipt({ txHash, proposalId, blockNumber, somniaRequestId, voteCount, passed }: Props) {
    const rows: [string, string][] = [
        ['Proposal', proposalId],
        ['Block', blockNumber.toLocaleString()],
        ['Request ID', somniaRequestId.toString()],
        ['For', String(voteCount.for)],
        ['Against', String(voteCount.against)],
        ['Abstain', String(voteCount.abstain)],
        ['Network', 'Somnia Testnet (Chain 50312)'],
        ['Status', 'Confirmed'],
    ]

    return (
        <div className="receipt-card reveal-in" style={{ marginTop: '1rem' }}>
            <div className="receipt-header">
                <div>
                    <p className="eyebrow" style={{ marginBottom: 4 }}>On-chain result</p>
                    <p style={{ fontSize: 15, fontWeight: 700 }}>Somnia Agent execution receipt</p>
                </div>
                <span className={`chip ${passed ? 'chip-passed' : 'chip-rejected'}`}>
                    {passed ? '✓ Passed' : '✗ Rejected'}
                </span>
            </div>

            <table className="receipt-table">
                <tbody>
                    {rows.map(([label, value]) => (
                        <tr key={label} className="receipt-row">
                            <td className="receipt-label">{label}</td>
                            <td className={`receipt-value ${label === 'For' ? 'result-pass' : label === 'Against' ? 'result-fail' : ''}`}>
                                {value}
                            </td>
                        </tr>
                    ))}
                    <tr className="receipt-row">
                        <td className="receipt-label">TX hash</td>
                        <td className="receipt-value mono">{short(txHash)}</td>
                    </tr>
                </tbody>
            </table>

            <div style={{ display: 'flex', gap: 10, marginTop: '1rem', flexWrap: 'wrap' }}>
                <a className="receipt-link" href={`${EXPLORER}/tx/${txHash}`} target="_blank" rel="noreferrer">
                    View TX on Somnia Explorer ↗
                </a>
                <a className="receipt-link" href={`${EXPLORER}/block/${blockNumber}`} target="_blank" rel="noreferrer" style={{ opacity: 0.7 }}>
                    View block ↗
                </a>
            </div>

            <div style={{
                marginTop: '1rem',
                padding: '10px 14px',
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 12,
                color: 'var(--teal)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
            }}>
                <span style={{ fontSize: 16 }}>⛓</span>
                <span>
                    <strong>Powered by Somnia Agents.</strong> This vote was cast by a deterministic
                    on-chain LLM — verified by validator consensus, auditable forever.
                </span>
            </div>
        </div>
    )
}