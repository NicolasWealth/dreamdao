import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Profile {
    name: string
    riskTolerance: number
    security: number
    growth: number
    community: number
}

const DEFAULTS: Profile = {
    name: '',
    riskTolerance: 40,
    security: 70,
    growth: 60,
    community: 65,
}

const SLIDERS: { key: keyof Omit<Profile, 'name'>; label: string; desc: string }[] = [
    { key: 'riskTolerance', label: 'Risk tolerance', desc: 'How much treasury risk your agent can accept.' },
    { key: 'security', label: 'Security priority', desc: 'Weight given to safety-first proposals.' },
    { key: 'growth', label: 'Growth focus', desc: 'Bias toward ecosystem expansion.' },
    { key: 'community', label: 'Community weight', desc: 'Priority on reward and participation proposals.' },
]

export default function ProfileSetup() {
    const [profile, setProfile] = useState<Profile>(DEFAULTS)
    const [saved, setSaved] = useState(false)
    const navigate = useNavigate()

    const agentName = profile.name ? `${profile.name}Agent` : 'YourAgent'

    const preview = useMemo(() => JSON.stringify({
        name: agentName,
        riskTolerance: profile.riskTolerance,
        security: profile.security,
        growth: profile.growth,
        community: profile.community,
    }, null, 2), [agentName, profile])

    const set = (key: keyof Profile, value: string | number) => {
        setProfile(previous => ({ ...previous, [key]: value }))
        setSaved(false)
    }

    const handleSave = () => {
        localStorage.setItem('dreamdao_profile', JSON.stringify(profile))
        setSaved(true)
        setTimeout(() => navigate('/'), 800)
    }

    return (
        <div className="profile-layout">
            <section className="surface-card profile-card reveal-in" style={{ ['--enter-delay' as any]: '50ms' }}>
                <div className="surface-inner">
                    <div className="profile-header">
                        <div>
                            <p className="eyebrow">Agent setup</p>
                            <h1 className="section-title">Create your governance agent</h1>
                            <p className="section-copy">
                                Your agent will debate, negotiate, and vote on your behalf - autonomously.
                            </p>
                        </div>
                        <span className="chip chip-live">Profile builder</span>
                    </div>

                    <div className="profile-field">
                        <div className="profile-label-row">
                            <div>
                                <p className="profile-label">Agent name</p>
                                <p className="profile-desc">This becomes the visible persona across the dashboard and debate pages.</p>
                            </div>
                            <span className="profile-value">{agentName}</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={profile.name}
                            onChange={event => set('name', event.target.value)}
                        />
                    </div>

                    <div className="profile-field" style={{ marginBottom: 0 }}>
                        {SLIDERS.map(({ key, label, desc }) => (
                            <div key={key} className="profile-field" style={{ marginBottom: 0 }}>
                                <div className="profile-label-row">
                                    <div>
                                        <p className="profile-label">{label}</p>
                                        <p className="profile-desc">{desc}</p>
                                    </div>
                                    <span className="profile-value">{profile[key]}</span>
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={profile[key]}
                                    onChange={event => set(key, Number(event.target.value))}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="hero-actions" style={{ marginTop: '1.1rem' }}>
                        <button className="button-primary" onClick={handleSave} disabled={!profile.name}>
                            {saved ? 'Saved - redirecting...' : 'Deploy my agent'}
                        </button>
                    </div>
                </div>
            </section>

            <section className="surface-card reveal-in" style={{ ['--enter-delay' as any]: '180ms' }}>
                <div className="surface-inner">
                    <div className="section-head" style={{ marginBottom: '0.9rem' }}>
                        <div>
                            <p className="eyebrow">Configuration preview</p>
                            <h2 className="section-title" style={{ fontSize: '1.45rem' }}>JSON payload</h2>
                        </div>
                        <span className="chip">Live preview</span>
                    </div>

                    <pre className="code-preview">{preview}</pre>
                </div>
            </section>
        </div>
    )
}
