import React from 'react'
import type { VoteResult as VoteResultType } from '../hooks/useVote'

interface VoteResultProps {
    result: VoteResultType
}

export const VoteResult: React.FC<VoteResultProps> = ({ result }) => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mt-6 shadow-2xl text-center">
            <h2 className={`text-4xl font-black mb-4 ${result.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.passed ? 'PROPOSAL PASSED' : 'PROPOSAL REJECTED'}
            </h2>
            
            <div className="flex justify-center gap-8 mb-6">
                <div className="flex flex-col">
                    <span className="text-3xl font-bold text-emerald-500">{result.for}</span>
                    <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">For</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-bold text-rose-500">{result.against}</span>
                    <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Against</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-bold text-slate-500">{result.abstain}</span>
                    <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Abstain</span>
                </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg inline-block text-left border border-slate-800">
                <span className="text-xs text-slate-500 uppercase font-bold block mb-1">On-Chain Execution</span>
                <span className="font-mono text-blue-400 text-sm break-all">{result.txHash}</span>
            </div>
        </div>
    )
}
