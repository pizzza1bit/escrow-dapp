// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import DynamicEscrowIDL from '@/program/idl/dynamic_escrow.json'
import type { DynamicEscrow } from '@/program//types/dynamic_escrow.ts'

export { DynamicEscrow, DynamicEscrowIDL }

export const DYNAMICESCROW_PROGRAM_ID = new PublicKey(DynamicEscrowIDL.address)

export function getDynamicEscrowProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...DynamicEscrowIDL, address: address ? address.toBase58() : DynamicEscrowIDL.address } as DynamicEscrow, provider)
}

export function getDynamicEscrowProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the DynamicEscrow program on devnet and testnet.
      return DYNAMICESCROW_PROGRAM_ID;
    case 'mainnet-beta':
    default:
      return DYNAMICESCROW_PROGRAM_ID;
  }
}
