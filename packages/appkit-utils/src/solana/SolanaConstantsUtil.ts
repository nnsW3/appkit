import { PublicKey } from '@solana/web3.js'
import { type CaipNetwork, ConstantsUtil } from '@reown/appkit-common'

export const SolConstantsUtil = {
  UNIVERSAL_PROVIDER_RELAY_URL: 'wss://relay.walletconnect.org',
  HASH_PREFIX: 'SPL Name Service',
  /**
   * The `.sol` TLD
   */
  ROOT_DOMAIN_ACCOUNT: new PublicKey('58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx'),
  /**
   * The Solana Name Service program ID
   */
  NAME_PROGRAM_ID: new PublicKey('namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX'),
  /**
   * The reverse look up class
   */
  REVERSE_LOOKUP_CLASS: new PublicKey('33m47vH6Eav6jr5Ry86XjhRft2jRBLDnDgPSHoquXi2Z'),
  /**
   * Mainnet program ID
   */
  WALLET_ID: '@w3m/solana_wallet',
  CAIP_CHAIN_ID: '@w3m/solana_caip_chain',
  ERROR_CODE_UNRECOGNIZED_CHAIN_ID: 4902,
  ERROR_CODE_DEFAULT: 5000,
  DEFAULT_CHAIN: {
    id: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
    chainId: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
    name: 'Solana',
    chainNamespace: ConstantsUtil.CHAIN.SOLANA,
    currency: 'SOL',
    explorerUrl: 'https://solscan.io',
    rpcUrl: `${ConstantsUtil.BLOCKCHAIN_API_RPC_URL}/v1`
  } as CaipNetwork,
  CHAIN_IDS: {
    Mainnet: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
    Devnet: 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
    Testnet: 'solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z',
    Deprecated_Mainnet: 'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ',
    Deprecated_Devnet: 'solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K'
  },
  LAMPORTS_PER_SOL: 1_000_000_000
} as const
