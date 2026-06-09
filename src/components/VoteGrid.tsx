import React from 'react'
import type { VoteAgent } from '../hooks/useVote'

interface VoteGridProps {
    agents: VoteAgent[]
}

export const VoteGrid: React.FC<VoteGridProps> = ({ agents }) => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-white">Agent Voting Grid</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {agents.map((agent) => {
                    let bgColor = 'bg-slate-800'
                    let textColor = 'text-slate-600'
                    
                    if (agent.revealed) {
                        if (agent.outcome === 'for') {
                            bgColor = 'bg-emerald-500/20 border-emerald-500/50'
                            textColor = 'text-emerald-400'
                        } else if (agent.outcome === 'against') {
                            bgColor = 'bg-rose-500/20 border-rose-500/50'
                            textColor = 'text-rose-400'
                        } else {
                            bgColor = 'bg-slate-600/50 border-slate-500/50'
                            textColor = 'text-slate-300'
                        }
                    }

                    return (
                        <div 
                            key={agent.id} 
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border border-transparent transition-all duration-300 ${bgColor}`}
                        >
                            <span className="text-xs font-bold text-slate-400 mb-1">{agent.id}</span>
                            <span className={`text-sm font-black uppercase ${textColor}`}>
                                {agent.revealed ? agent.outcome : '?'}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
