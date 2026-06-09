export interface SomniaTx {
    hash: string
    blockNumber: number
    from: string
    to: string
    timestamp: string
    explorerUrl: string
    status: 'confirmed'
}

const SOMNIA_EXPLORER = 'https://shannon-explorer.somnia.network/tx'
const DAO_CONTRACT = '0x4F2a8dE3f1bA7C9E0a2b5D8c6F1e4A9B3C7D2E5'

export function mockSomniaTx(
    voterAddress: string,
    _proposalId: string,
    _vote: 'for' | 'against' | 'abstain'
): SomniaTx {
    const hash = '0x' + Array.from(
        { length: 64 },
        () => '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('')

    const blockNumber = 4_280_000 + Math.floor(Math.random() * 10_000)
    const now = new Date().toISOString()

    return {
        hash,
        blockNumber,
        from: voterAddress,
        to: DAO_CONTRACT,
        timestamp: now,
        explorerUrl: `${SOMNIA_EXPLORER}/${hash}`,
        status: 'confirmed'
    }
}

export function formatTxShort(hash: string): string {
    return `${hash.slice(0, 10)}…${hash.slice(-8)}`
}