import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_PROPOSALS, type Proposal } from '../data/mockProposals'

const STATUS_STYLE: Record<Proposal['status'], { bg: string; color: string; label: string }> = {
    live: { bg: 'var(--color-background-success)', color: 'var(--color-text-success)', label: 'Live' },
    passed: { bg: 'var(--color-background-info)', color: 'var(--color-text-info)', label: 'Passed' },
    rejected: { bg: 'var(--color-background-danger)', color: 'var(--color-text-danger)', label: 'Rejected' },
    pending: { bg: 'var(--color-background-warning)', color: 'var(--color-text-warning)', label: 'Pending' },
}

const ACTIVITY = [
    { agent: 'AliceAgent', action: 'voted AGAINST PRP-007', time: '2m ago' },
    { agent: 'BobAgent', action: 'proposed PRP-008', time: '14m ago' },
    { agent: 'CarolAgent', action: 'joined Support coalition on PRP-007', time: '31m ago' },
    { agent: 'DaveAgent', action: 'voted FOR PRP-007', time: '45m ago' },
    { agent: 'AliceAgent', action: 'negotiated budget reduction on PRP-007', time: '1h ago' },
]

export default function Dashboard() {
    const navigate = useNavigate()
    const [filter, setFilter] = useState<Proposal['status'] | 'all'>('all')

    const profile = (() => {
        try { return JSON.parse(localStorage.getItem('dreamdao_profile') ?? '{}') }
        catch { return {} }
    })()

    const filtered = filter === 'all'
        ? MOCK_PROPOSALS
        : MOCK_PROPOSALS.filter(p => p.status === filter)

    return (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '1.5rem 1rem' }}>

            {/* header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 2 }}>DreamDAO</h1>
                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                        {profile.name ? `${profile.name}Agent is active` : 'No agent deployed yet'}
                    </p>
                </div>
                <button onClick={() => navigate('/profile')} style={{ fontSize: 13 }}>
                    {profile.name ? `${profile.name}Agent ↗` : 'Create agent'}
                </button>
            </div>

            {/* stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: '1.5rem' }}>
                {[
                    { label: 'Active agents', value: '24' },
                    { label: 'Open proposals', value: '2' },
                    { label: 'Votes this week', value: '67' },
                    { label: 'Treasury', value: '2.4M' },
                ].map(({ label, value }) => (
                    <div key={label} style={{
                        background: 'var(--color-background-secondary)',
                        borderRadius: 'var(--border-radius-md)',
                        padding: '0.75rem 1rem'
                    }}>
                        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 4 }}>{label}</div>
                        <div style={{ fontSize: 22, fontWeight: 500 }}>{value}</div>
                    </div>
                ))}
            </div>

            {/* empty state */}
            {!profile.name && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)', fontSize: 13 }}>
                    No agent deployed.{' '}
                    <span
                        style={{ cursor: 'pointer', color: 'var(--dao-accent, #6366f1)' }}
                        onClick={() => navigate('/profile')}
                    >
                        Create yours →
                    </span>
                </div>
            )}

            {/* proposals */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Proposals</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                        {(['all', 'live', 'pending', 'passed', 'rejected'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                style={{
                                    fontSize: 11,
                                    padding: '3px 10px',
                                    borderRadius: 20,
                                    border: '0.5px solid var(--color-border-tertiary)',
                                    background: filter === s ? 'var(--color-background-secondary)' : 'transparent',
                                    cursor: 'pointer',
                                    fontWeight: filter === s ? 500 : 400,
                                    color: 'var(--color-text-primary)'
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {filtered.map(p => {
                    const st = STATUS_STYLE[p.status]
                    const total = p.votesFor + p.votesAgainst + p.votesAbstain
                    return (
                        <div
                            key={p.id}
                            onClick={() => p.status === 'live' && navigate('/proposal')}
                            style={{
                                background: 'var(--color-background-primary)',
                                border: '0.5px solid var(--color-border-tertiary)',
                                borderRadius: 'var(--border-radius-lg)',
                                padding: '1rem 1.25rem',
                                marginBottom: 8,
                                cursor: p.status === 'live' ? 'pointer' : 'default',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                                <div>
                                    <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginRight: 8 }}>{p.id}</span>
                                    <span style={{ fontSize: 14, fontWeight: 500 }}>{p.title}</span>
                                </div>
                                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: st.bg, color: st.color, fontWeight: 500, whiteSpace: 'nowrap' }}>
                                    {st.label}
                                </span>
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8, lineHeight: 1.5 }}>{p.description}</p>
                            {total > 0 && (
                                <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
                                    <span style={{ color: 'var(--color-text-success)' }}>For {p.votesFor}</span>
                                    <span style={{ color: 'var(--color-text-danger)' }}>Against {p.votesAgainst}</span>
                                    <span style={{ color: 'var(--color-text-secondary)' }}>Abstain {p.votesAbstain}</span>
                                </div>
                            )}
                            {p.status === 'live' && (
                                <div style={{ fontSize: 11, color: 'var(--color-text-info)', marginTop: 6 }}>Click to enter debate chamber →</div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* activity feed */}
            <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: '0.75rem' }}>Agent activity</div>
                {ACTIVITY.map((a, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: '0.5px solid var(--color-border-tertiary)',
                        fontSize: 12
                    }}>
                        <span>
                            <span style={{ fontWeight: 500 }}>{a.agent}</span>
                            <span style={{ color: 'var(--color-text-secondary)', marginLeft: 6 }}>{a.action}</span>
                        </span>
                        <span style={{ color: 'var(--color-text-secondary)', flexShrink: 0, marginLeft: 12 }}>{a.time}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}