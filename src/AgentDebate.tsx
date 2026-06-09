import React, { useEffect, useRef, useState } from 'react'
import type { ChatMessage } from './hooks/useAgentDebate'
import { useAgentDebate } from './hooks/useAgentDebate'

interface AgentDebateProps {
    messages?: ChatMessage[]
    phase?: string
    running?: boolean
    onStart?: (proposal: string) => void
}

const AgentDebate: React.FC<AgentDebateProps> = ({ 
    messages: pMessages, 
    phase: pPhase, 
    running: pRunning, 
    onStart 
}) => {
    const [proposal, setProposal] = useState('')
    const feedRef = useRef<HTMLDivElement>(null)
    const localDebate = useAgentDebate()

    const messages = pMessages ?? localDebate.messages
    const phase = pPhase ?? localDebate.phase
    const running = pRunning ?? localDebate.running


    useEffect(() => {
        const feed = feedRef.current

        if (feed) {
            feed.scrollTop = feed.scrollHeight
        }
    }, [messages, phase, running])

    const handleRunDebate = () => {
        if (proposal.trim()) {
            if (onStart) {
                onStart(proposal)
            } else {
                localDebate.runDebate(proposal)
            }
        }
    }

    return (
        <section className="debate-panel" aria-label="Agent debate chat">
            <header className="debate-header">
                <div>
                    <p className="eyebrow">DreamDAO governance</p>
                    <h1>Agent Debate</h1>
                </div>
                <div className="agent-count">3 agents</div>
            </header>

            <div ref={feedRef} className="chat-feed" aria-live="polite">
                {messages.length === 0 && !running && (
                    <div className="empty-feed">
                        <p>Enter a proposal, then start the debate.</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message chat-message-${msg.kind}`}
                    >
                        {msg.kind === 'agent' ? (
                            <>
                                <div className="message-meta">
                                    <span className="agent-name">{msg.agent.name}</span>
                                    <time>{new Date(msg.timestamp).toLocaleTimeString()}</time>
                                </div>
                                <p>{msg.text}</p>
                                <dl className="agent-traits">
                                    <div>
                                        <dt>Risk</dt>
                                        <dd>{msg.agent.riskTolerance}</dd>
                                    </div>
                                    <div>
                                        <dt>Security</dt>
                                        <dd>{msg.agent.security}</dd>
                                    </div>
                                    <div>
                                        <dt>Growth</dt>
                                        <dd>{msg.agent.growth}</dd>
                                    </div>
                                    <div>
                                        <dt>Community</dt>
                                        <dd>{msg.agent.community}</dd>
                                    </div>
                                </dl>
                            </>
                        ) : (
                            <p>{msg.text}</p>
                        )}
                    </div>
                ))}

                {running && (
                    <div className="chat-message chat-message-system">
                        <p>{phase}</p>
                        <div className="typing-dots" aria-hidden="true">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
            </div>

            {running && (
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', padding: '8px 0' }}>
                    Agents deliberating…
                </div>
            )}

            <form
                className="debate-composer"
                onSubmit={(event) => {
                    event.preventDefault()
                    handleRunDebate()
                }}
            >
                <input
                    type="text"
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    placeholder="Enter a proposal..."
                    aria-label="Proposal"
                />
                <button type="submit" disabled={running || !proposal.trim()}>
                    {running ? 'Debating...' : 'Start debate'}
                </button>
            </form>
        </section>
    )
}

export default AgentDebate
