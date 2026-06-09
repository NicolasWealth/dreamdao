import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_PROPOSALS, type Proposal } from '../data/mockProposals'

const STATUS_META: Record<Proposal['status'], { label: string; className: string }> = {
    live: { label: 'Live', className: 'chip-live' },
    passed: { label: 'Passed', className: 'chip-passed' },
    rejected: { label: 'Rejected', className: 'chip-rejected' },
    pending: { label: 'Pending', className: 'chip-pending' },
}

const FILTERS = ['all', 'live', 'pending', 'passed', 'rejected'] as const

export default function Dashboard() {
    const navigate = useNavigate()
    const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')

    const profile = (() => {
        try {
            return JSON.parse(localStorage.getItem('dreamdao_profile') ?? '{}') as { name?: string }
        } catch {
            return {}
        }
    })()

    const filtered = filter === 'all'
        ? MOCK_PROPOSALS
        : MOCK_PROPOSALS.filter(proposal => proposal.status === filter)

    const stats = useMemo(() => {
        const liveCount = MOCK_PROPOSALS.filter(proposal => proposal.status === 'live').length
        const activeCount = MOCK_PROPOSALS.filter(proposal => proposal.status === 'live' || proposal.status === 'pending').length
        const votesRecorded = MOCK_PROPOSALS.reduce((sum, proposal) => (
            sum + proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
        ), 0)
        const treasuryMotion = MOCK_PROPOSALS
            .filter(proposal => proposal.status !== 'rejected')
            .slice(0, 1)
            .map(proposal => proposal.treasuryImpact)[0] ?? '0%'

        return [
            { label: 'Agent deployed', value: profile.name ? `${profile.name}Agent` : 'None', note: profile.name ? 'Connected and ready' : 'Create one now' },
            { label: 'Live proposals', value: String(liveCount), note: `${activeCount} governance items in motion` },
            { label: 'Votes recorded', value: String(votesRecorded), note: 'Autonomous voting history' },
            { label: 'Treasury motion', value: treasuryMotion, note: 'Budget pressure on active motions' },
        ]
    }, [profile.name])

    return (
        <div className="page-stack">
            <section className="surface-card hero-card reveal-in" style={{ ['--enter-delay' as any]: '40ms' }}>
                <div className="surface-inner">
                    <div className="hero-top">
                        <div>
                            <p className="eyebrow">Governance command</p>
                            <h1 className="section-title">DreamDAO dashboard</h1>
                            <p className="section-copy">
                                {profile.name
                                    ? `${profile.name}Agent is active and tracking the live coalition rail.`
                                    : 'Deploy an agent to unlock the governance cockpit, proposal intelligence, and autonomous votes.'}
                            </p>
                        </div>
                        <span className="chip chip-live">Somnia network</span>
                    </div>

                    {!profile.name ? (
                        <div className="hero-callout" style={{ marginTop: '1rem' }}>
                            No agent deployed.{' '}
                            <button className="button-pill" style={{ minHeight: 'auto', padding: '0.4rem 0.7rem', marginLeft: '0.35rem' }} onClick={() => navigate('/profile')}>
                                Create yours -&gt;
                            </button>
                        </div>
                    ) : (
                        <div className="hero-meta">
                            <span className="chip">{profile.name}Agent</span>
                            <span className="chip">Autonomy online</span>
                            <span className="chip">{filtered.length} proposal cards</span>
                        </div>
                    )}

                    <div className="hero-actions">
                        <button className="button-primary" onClick={() => navigate('/proposal')}>
                            Open live proposal
                        </button>
                        <button className="button-secondary" onClick={() => navigate('/profile')}>
                            {profile.name ? 'Edit agent' : 'Create agent'}
                        </button>
                    </div>
                </div>
            </section>

            <div className="stat-grid">
                {stats.map((stat, index) => (
                    <article
                        key={stat.label}
                        className="stat-card reveal-in"
                        style={{ ['--enter-delay' as any]: `${80 + index * 70}ms` }}
                    >
                        <div className="stat-label">{stat.label}</div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-note">{stat.note}</div>
                    </article>
                ))}
            </div>

            {!profile.name && (
                <section className="surface-card reveal-in" style={{ ['--enter-delay' as any]: '180ms' }}>
                    <div className="surface-inner">
                        <div className="empty-state">
                            No agent is deployed yet. Use the profile builder to create one, then the dashboard will light up with live governance activity.
                        </div>
                    </div>
                </section>
            )}

            <section className="surface-card reveal-in" style={{ ['--enter-delay' as any]: '240ms' }}>
                <div className="surface-inner">
                    <div className="section-head" style={{ marginBottom: '0.95rem' }}>
                        <div>
                            <p className="eyebrow">Proposal stream</p>
                            <h2 className="section-title" style={{ fontSize: '1.55rem' }}>Active motions</h2>
                        </div>
                        <div className="nav-links" style={{ justifyContent: 'flex-end' }}>
                            {FILTERS.map(value => (
                                <button
                                    key={value}
                                    className={`button-pill ${filter === value ? 'nav-link-active' : ''}`}
                                    style={{ minHeight: 'auto', padding: '0.5rem 0.8rem' }}
                                    onClick={() => setFilter(value)}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="proposal-list">
                        {filtered.map((proposal, index) => {
                            const meta = STATUS_META[proposal.status]
                            const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain

                            return (
                                <article
                                    key={proposal.id}
                                    className="surface-card proposal-card reveal-in"
                                    role={proposal.status === 'live' ? 'button' : undefined}
                                    tabIndex={proposal.status === 'live' ? 0 : -1}
                                    onClick={() => proposal.status === 'live' && navigate('/proposal')}
                                    onKeyDown={(event) => {
                                        if (proposal.status === 'live' && (event.key === 'Enter' || event.key === ' ')) {
                                            navigate('/proposal')
                                        }
                                    }}
                                    style={{
                                        cursor: proposal.status === 'live' ? 'pointer' : 'default',
                                        ['--enter-delay' as any]: `${320 + index * 80}ms`,
                                    }}
                                >
                                    <div className="proposal-row">
                                        <div>
                                            <div className="proposal-meta">
                                                <span>{proposal.id}</span>
                                                <span>{proposal.proposer}</span>
                                                <span>Closes {proposal.closesAt}</span>
                                            </div>
                                            <h3 className="proposal-title">{proposal.title}</h3>
                                            <p className="proposal-desc">{proposal.description}</p>
                                        </div>
                                        <span className={`chip ${meta.className}`}>{meta.label}</span>
                                    </div>

                                    <div className="proposal-footer">
                                        <div className="proposal-meta">
                                            <span>Risk {proposal.riskScore}/100</span>
                                            <span>Treasury {proposal.treasuryImpact}</span>
                                        </div>
                                        <div className="proposal-stats">
                                            <span className="proposal-stat-for">For {proposal.votesFor || totalVotes}</span>
                                            <span className="proposal-stat-against">Against {proposal.votesAgainst}</span>
                                            <span className="proposal-stat-abstain">Abstain {proposal.votesAbstain}</span>
                                        </div>
                                    </div>

                                    {proposal.status === 'live' && (
                                        <div className="proposal-meta" style={{ color: 'var(--cyan)', marginTop: '0.15rem' }}>
                                            Click to enter debate chamber -&gt;
                                        </div>
                                    )}
                                </article>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>
    )
}
