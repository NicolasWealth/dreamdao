import type { CoalitionState } from '../hooks/useCoalition'

interface CoalitionBarProps {
    coalition: CoalitionState
    animating: boolean
}

export function CoalitionBar({ coalition, animating }: CoalitionBarProps) {
    const segments = [
        { label: 'Support', value: coalition.support, className: 'coalition-support' },
        { label: 'Oppose', value: coalition.oppose, className: 'coalition-oppose' },
        { label: 'Undecided', value: coalition.undecided, className: 'coalition-undecided' },
    ]

    return (
        <section className="surface-card coalition-card">
            <div className="surface-inner">
                <div className="section-head" style={{ marginBottom: '1rem' }}>
                    <div>
                        <p className="eyebrow">Coalition pulse</p>
                        <h2 className="section-title" style={{ fontSize: '1.45rem' }}>Coalition formation</h2>
                    </div>
                    <span className="chip chip-live">Sentiment synced</span>
                </div>

                <div className="coalition-track" aria-label="Coalition balance">
                    {segments.map(segment => (
                        <div
                            key={segment.label}
                            className={`coalition-segment ${segment.className}`}
                            style={{ width: `${segment.value}%` }}
                        >
                            {segment.value >= 12 ? <span>{segment.label} {segment.value}%</span> : null}
                        </div>
                    ))}
                </div>

                <div className="legend-grid">
                    {segments.map(segment => (
                        <div key={segment.label} className="legend-chip">
                            <div>
                                <strong>{segment.label}</strong>
                                <div className="legend-copy">Current share of the coalition rail.</div>
                            </div>
                            <span className="chip">{segment.value}%</span>
                        </div>
                    ))}
                </div>

                <div className="note-list">
                    {coalition.notes.map((note, idx) => (
                        <div key={idx} className="note-item">
                            <span className="note-dot" aria-hidden="true" />
                            <span>{note}</span>
                        </div>
                    ))}
                </div>

                {animating && (
                    <div className="coalition-thinking">
                        <div className="typing-dots" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                        </div>
                        Agents negotiating...
                    </div>
                )}
            </div>
        </section>
    )
}
