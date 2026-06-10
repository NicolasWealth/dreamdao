import {
    encodeFunctionData,
    decodeFunctionResult,
    createPublicClient,
    createWalletClient,
    custom,
    http,
    parseAbi,
    type Hash,
    type Chain,
} from 'viem'

// ── Somnia Testnet chain definition ──────────────────────────────────────────
export const somniaTestnet: Chain = {
    id: 50312,
    name: 'Somnia Testnet',
    nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://api.infra.testnet.somnia.network'] },
        public: { http: ['https://api.infra.testnet.somnia.network'] },
    },
    blockExplorers: {
        default: { name: 'Shannon Explorer', url: 'https://shannon-explorer.somnia.network' },
    },
}

// ── Contract addresses ────────────────────────────────────────────────────────
const PLATFORM_ADDRESS = '0x037Bb9C718F3f7fe5eCBDB0b600D607b52706776' as const
const LLM_AGENT_ADDRESS = '0x69d783A96f432e690DdBAF574c34FF00411dFb82' as const

// ── ABIs ─────────────────────────────────────────────────────────────────────
const PLATFORM_ABI = parseAbi([
    'function createRequest(address agentAddress, bytes calldata payload, uint256 deposit) returns (uint256 requestId)',
    'event RequestCreated(uint256 indexed requestId, address indexed agent)',
    'event RequestFulfilled(uint256 indexed requestId, bytes result)',
])

const INFER_STRING_ABI = parseAbi([
    'function inferString(string prompt, string system, bool chainOfThought, string[] allowedValues) returns (string response)',
])

// ── Deposit: 0.15 STT ────────────────────────────────────────────────────────
const DEPOSIT = BigInt('150000000000000000')

export interface AgentProfile {
    name: string
    riskTolerance: number
    security: number
    growth: number
    community: number
}

export interface SomniaVoteResult {
    vote: 'for' | 'against' | 'abstain'
    txHash: Hash
    requestId: bigint
    blockNumber: bigint
}

export async function somniaAgentVote(
    agent: AgentProfile,
    proposal: string,
    debateSummary: string
): Promise<SomniaVoteResult> {

    if (!window.ethereum) throw new Error('No wallet detected. Connect MetaMask.')

    const walletClient = createWalletClient({
        chain: somniaTestnet,
        transport: custom(window.ethereum),
    })

    const publicClient = createPublicClient({
        chain: somniaTestnet,
        transport: http('https://api.infra.testnet.somnia.network'),
    })

    const [address] = await walletClient.getAddresses()

    try {
        await walletClient.switchChain({ id: somniaTestnet.id })
    } catch {
        await walletClient.addChain({ chain: somniaTestnet })
        await walletClient.switchChain({ id: somniaTestnet.id })
    }

    const systemPrompt =
        `You are ${agent.name}, an autonomous DAO governance AI agent. ` +
        `Risk tolerance: ${agent.riskTolerance}/100. Security priority: ${agent.security}/100. ` +
        `Growth focus: ${agent.growth}/100. Community focus: ${agent.community}/100. ` +
        `You must vote on behalf of your human owner based solely on your profile values.`

    const userPrompt =
        `Proposal: ${proposal}\n\n` +
        `Agent debate summary: ${debateSummary}\n\n` +
        `Based on your profile, cast your final vote. Reply with exactly one of: for, against, abstain`

    const agentPayload = encodeFunctionData({
        abi: INFER_STRING_ABI,
        functionName: 'inferString',
        args: [
            userPrompt,
            systemPrompt,
            false,
            ['for', 'against', 'abstain'],
        ],
    })

    const txHash = await walletClient.writeContract({
        address: PLATFORM_ADDRESS,
        abi: PLATFORM_ABI,
        functionName: 'createRequest',
        args: [LLM_AGENT_ADDRESS, agentPayload, DEPOSIT],
        account: address,
    })

    const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
        timeout: 30_000,
    })

    let requestId = BigInt(0)
    for (const log of receipt.logs) {
        try {
            if (log.address.toLowerCase() === PLATFORM_ADDRESS.toLowerCase()) {
                requestId = BigInt(log.topics[1] ?? '0x0')
                break
            }
        } catch { /* skip */ }
    }

    const resultBytes = await pollForFulfillment(publicClient, requestId, receipt.blockNumber)

    const decoded = decodeFunctionResult({
        abi: INFER_STRING_ABI,
        functionName: 'inferString',
        data: resultBytes,
    })

    const raw = String(decoded).toLowerCase().trim()
    const vote: 'for' | 'against' | 'abstain' =
        raw === 'for' ? 'for' :
            raw === 'against' ? 'against' :
                'abstain'

    return { vote, txHash, requestId, blockNumber: receipt.blockNumber }
}

async function pollForFulfillment(
    client: ReturnType<typeof createPublicClient>,
    requestId: bigint,
    fromBlock: bigint,
    maxAttempts = 40,
    intervalMs = 3000
): Promise<`0x${string}`> {
    for (let i = 0; i < maxAttempts; i++) {
        const logs = await client.getLogs({
            address: PLATFORM_ADDRESS,
            event: parseAbi(['event RequestFulfilled(uint256 indexed requestId, bytes result)'])[0],
            args: { requestId },
            fromBlock,
        })
        if (logs.length > 0 && logs[0].data) {
            return logs[0].data as `0x${string}`
        }
        await new Promise(r => setTimeout(r, intervalMs))
    }
    throw new Error(`Somnia Agent: no fulfillment after ${maxAttempts} attempts for requestId ${requestId}`)
}