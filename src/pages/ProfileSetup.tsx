import { useState } from 'react'
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
    community: 65
}

const SLIDERS: { key: keyof Omit<Profile, 'name'>; label: string; desc: string }[] = [
    { key: 'riskTolerance', label: 'Risk tolerance', desc: 'How much treasury risk your agent accepts' },
    { key: 'security', label: 'Security priority', desc: 'Weight given to protocol safety proposals' },
    { key: 'growth', label: 'Growth focus', desc: 'Bias toward ecosystem expansion proposals' },
    { key: 'community', label: 'Community weight', desc: 'Priority on community reward proposals' },
]

export default function ProfileSetup() {
    const [profile, setProfile] = useState<Profile>(DEFAULTS)
    const [saved, setSaved] = useState(false)
    const navigate = useNavigate()

    const set = (key: keyof Profile, value: string | number) => {
        setProfile(prev => ({ ...prev, [key]: value }))
        setSaved(false)
    }

    const handleSave = () => {
        localStorage.setItem('dreamdao_profile', JSON.stringify(profile))
        setSaved(true)
        setTimeout(() => navigate('/'), 800)
    }

    const agentName = profile.name ? `${profile.name}Agent` : 'YourAgent'

    return (
        <div style={{ maxWidth: 560, margin: '2rem auto', padding: '0 1rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>Create your governance agent</h1>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    Your agent will debate, negotiate, and vote on your behalf — autonomously.
                </p>
            </div>

            <div style={{
                background: 'var(--color-background-primary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-lg)',
                padding: '1rem 1.25rem',
                marginBottom: '1rem'
            }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Agent name</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={profile.name}
                        onChange={e => set('name', e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <span style={{
                        fontSize: 13,
                        fontWeight: 500,
                        padding: '6px 12px',
                        background: 'var(--color-background-secondary)',
                        borderRadius: 'var(--border-radius-md)',
                        color: 'var(--color-text-primary)',
                        whiteSpace: 'nowrap'
                    }}>
                        {agentName}
                    </span>
                </div>
            </div>

            <div style={{
                background: 'var(--color-background-primary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-lg)',
                padding: '1rem 1.25rem',
                marginBottom: '1rem'
            }}>
                {SLIDERS.map(({ key, label, desc }) => (
                    <div key={key} style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <div>
                                <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
                                <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginLeft: 8 }}>{desc}</span>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{profile[key]}</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={profile[key]}
                            onChange={e => set(key, Number(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>
                ))}
            </div>

            <div style={{
                background: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-md)',
                padding: '0.75rem 1rem',
                fontSize: 12,
                color: 'var(--color-text-secondary)',
                marginBottom: '1rem',
                fontFamily: 'var(--font-mono)'
            }}>
                {JSON.stringify({ ...profile, name: agentName }, null, 2)}
            </div>

            <button
                className="btn-primary"
                onClick={handleSave}
                disabled={!profile.name}
                style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: 14,
                    fontWeight: 500,
                    background: saved ? '#1D9E75' : undefined
                }}
            >
                {saved ? 'Saved — redirecting…' : 'Deploy my agent'}
            </button>
        </div>
    )
}