import { Keypair, PublicKey } from "@solana/web3.js";
import type { PropsWithChildren } from "react";

export interface ExtraTWClassProps {
  className?: string;
}

export type ComponentProps = PropsWithChildren<ExtraTWClassProps>;

export interface InitializeProps {
  initializer: PublicKey;
  mintA: PublicKey;
  mintB: PublicKey;
  initializerAmount: Number;
  takerAmount: Number;
}


export interface CancelProps {
  initializer: PublicKey;
  mintA: PublicKey;
}

export interface TokenMetaDataProps {  
  name: string;          
  symbol: string;        
  decimal: number;       
  uri: string;           
  logo: string;          
  publickey: string;     
} 