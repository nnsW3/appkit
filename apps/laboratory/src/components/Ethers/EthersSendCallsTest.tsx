import { Button, Stack, Text, Spacer, Heading } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { useChakraToast } from '../Toast'
import type { Address } from 'viem'
import { vitalikEthAddress } from '../../utils/DataUtil'
import { BrowserProvider, type Eip1193Provider } from 'ethers'
import {
  EIP_5792_RPC_METHODS,
  WALLET_CAPABILITIES,
  getCapabilitySupportedChainInfo
} from '../../utils/EIP5792Utils'
import { W3mFrameProvider } from '@reown/appkit-wallet'

type Provider = W3mFrameProvider | Awaited<ReturnType<(typeof EthereumProvider)['init']>>

export function EthersSendCallsTest() {
  const [loading, setLoading] = useState(false)

  const { chainId } = useAppKitNetwork()
  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider<Eip1193Provider>('eip155')
  const toast = useChakraToast()

  const [atomicBatchSupportedChains, setAtomicBatchSupportedChains] = useState<
    Awaited<ReturnType<typeof getCapabilitySupportedChainInfo>>
  >([])

  const [lastCallsBatchId, setLastCallsBatchId] = useState<string | null>(null)

  useEffect(() => {
    if (address && walletProvider) {
      getCapabilitySupportedChainInfo(
        WALLET_CAPABILITIES.ATOMIC_BATCH,
        walletProvider as Provider,
        address
      ).then(capabilities => setAtomicBatchSupportedChains(capabilities))
    } else {
      setAtomicBatchSupportedChains([])
    }
  }, [address, walletProvider, isConnected])

  const atomicBatchSupportedChainsNames = atomicBatchSupportedChains
    .map(ci => ci.chainName)
    .join(', ')
  const currentChainsInfo = atomicBatchSupportedChains.find(
    chainInfo => chainInfo.chainId === Number(chainId)
  )

  async function onSendCalls() {
    try {
      setLoading(true)
      if (!walletProvider || !address) {
        throw Error('user is disconnected')
      }
      if (!chainId) {
        throw Error('chain not selected')
      }
      const provider = new BrowserProvider(walletProvider, chainId)
      const calls = [
        {
          to: vitalikEthAddress as `0x${string}`,
          data: '0x' as `0x${string}`,
          value: `0x0`
        },
        {
          to: vitalikEthAddress as Address,
          value: '0x00',
          data: '0xdeadbeef'
        }
      ]
      const sendCallsParams = {
        version: '1.0',
        chainId: `0x${BigInt(chainId).toString(16)}`,
        from: address,
        calls
      }
      const batchCallHash = await provider.send(EIP_5792_RPC_METHODS.WALLET_SEND_CALLS, [
        sendCallsParams
      ])

      setLastCallsBatchId(batchCallHash)
      toast({
        title: 'Success',
        description: batchCallHash,
        type: 'success'
      })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send calls',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }
  function isSendCallsSupported(): boolean {
    if (walletProvider instanceof W3mFrameProvider) {
      return true
    }
    if (walletProvider instanceof EthereumProvider) {
      return Boolean(
        walletProvider?.signer?.session?.namespaces?.['eip155']?.methods?.includes(
          EIP_5792_RPC_METHODS.WALLET_SEND_CALLS
        )
      )
    }

    return false
  }

  if (!isConnected || !walletProvider || !address) {
    return (
      <Text fontSize="md" color="yellow">
        Wallet not connected
      </Text>
    )
  }
  if (!isSendCallsSupported()) {
    return (
      <Text fontSize="md" color="yellow">
        Wallet does not support wallet_sendCalls rpc
      </Text>
    )
  }
  if (atomicBatchSupportedChains.length === 0) {
    return (
      <Text fontSize="md" color="yellow">
        Account does not support atomic batch feature
      </Text>
    )
  }

  return currentChainsInfo ? (
    <Stack direction={['column', 'column']}>
      <Button
        data-testid="send-calls-button"
        onClick={onSendCalls}
        isDisabled={loading}
        maxWidth={'50%'}
      >
        Send Batch Calls to Vitalik
      </Button>
      <Spacer />
      {lastCallsBatchId && (
        <>
          <Heading size="xs">Last batch call ID:</Heading>
          <Text data-testid="send-calls-id">{lastCallsBatchId}</Text>
        </>
      )}
    </Stack>
  ) : (
    <Text fontSize="md" color="yellow">
      Switch to {atomicBatchSupportedChainsNames} to test atomic batch feature
    </Text>
  )
}
