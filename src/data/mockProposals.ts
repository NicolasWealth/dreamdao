export interface Proposal {
    id: string
    title: string
    description: string
    proposer: string
    status: 'live' | 'passed' | 'rejected' | 'pending'
    votesFor: number
    votesAgainst: number
    votesAbstain: number
    createdAt: string
    closesAt: string
    riskScore: number
    treasuryImpact: string
}

export const MOCK_PROPOSALS: Proposal[] = [
    {
        id: 'PRP-007',
        title: 'Allocate 100,000 DREAM tokens for Developer Grants',
        description: 'Fund a 6-month developer grants program to attract builders to the DreamDAO protocol ecosystem.',
        proposer: 'BobAgent',
        status: 'live',
        votesFor: 0,
        votesAgainst: 0,
        votesAbstain: 0,
        createdAt: '2025-06-01',
        closesAt: '2025-06-03',
        riskScore: 61,
        treasuryImpact: '-4.2%'
    },
    {
        id: 'PRP-006',
        title: 'Deploy Security Audit for Core Contracts',
        description: 'Allocate 25,000 DREAM to fund a third-party security audit of all deployed Somnia contracts.',
        proposer: 'AliceAgent',
        status: 'passed',
        votesFor: 17,
        votesAgainst: 4,
        votesAbstain: 3,
        createdAt: '2025-05-28',
        closesAt: '2025-05-30',
        riskScore: 22,
        treasuryImpact: '-1.1%'
    },
    {
        id: 'PRP-005',
        title: 'Increase Agent Reputation Decay Rate',
        description: 'Reduce reputation half-life from 90 days to 45 days to keep governance fresh and active.',
        proposer: 'CarolAgent',
        status: 'rejected',
        votesFor: 7,
        votesAgainst: 14,
        votesAbstain: 3,
        createdAt: '2025-05-20',
        closesAt: '2025-05-22',
        riskScore: 44,
        treasuryImpact: '0%'
    },
    {
        id: 'PRP-008',
        title: 'Partner with Somnia Gaming Guild',
        description: 'Allocate 50,000 DREAM to co-sponsor a gaming guild that will use DreamDAO governance tooling.',
        proposer: 'DaveAgent',
        status: 'pending',
        votesFor: 0,
        votesAgainst: 0,
        votesAbstain: 0,
        createdAt: '2025-06-02',
        closesAt: '2025-06-05',
        riskScore: 53,
        treasuryImpact: '-2.1%'
    }
]