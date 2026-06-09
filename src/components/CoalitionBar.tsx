import React from 'react'
import type { CoalitionState } from '../hooks/useCoalition'

interface CoalitionBarProps {
    coalition: CoalitionState
    animating: boolean
}

export const CoalitionBar: React.FC<CoalitionBarProps> = ({ coalition, animating }) => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-white">Coalition Formation</h3>
            
            <div className="h-8 flex rounded-lg overflow-hidden w-full mb-4">
                <div 
                    className="bg-emerald-500 transition-all duration-1000 ease-in-out flex items-center justify-center text-xs font-bold text-emerald-950"
                    style={{ width: `${coalition.support}%` }}
                >
                    {coalition.support > 5 && `${coalition.support}%`}
                </div>
                <div 
                    className="bg-rose-500 transition-all duration-1000 ease-in-out flex items-center justify-center text-xs font-bold text-rose-950"
                    style={{ width: `${coalition.oppose}%` }}
                >
                    {coalition.oppose > 5 && `${coalition.oppose}%`}
                </div>
                <div 
                    className="bg-slate-700 transition-all duration-1000 ease-in-out flex items-center justify-center text-xs font-bold text-slate-300"
                    style={{ width: `${coalition.undecided}%` }}
                >
                    {coalition.undecided > 5 && `${coalition.undecided}%`}
                </div>
            </div>

            <div className="flex gap-4 text-sm font-semibold mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-emerald-400">Support</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <span className="text-rose-400">Oppose</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <span className="text-slate-400">Undecided</span>
                </div>
            </div>

            <div className="space-y-2">
                {coalition.notes.map((note, idx) => (
                    <div key={idx} className="text-slate-300 text-sm italic border-l-2 border-slate-600 pl-3">
                        {note}
                    </div>
                ))}
            </div>

            {animating && (
                <div className="mt-4 flex gap-2 text-slate-400 text-sm animate-pulse">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    Agents negotiating...
                </div>
            )}
        </div>
    )
}
