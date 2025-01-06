import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import {bscTestnet, bsc} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Deploy Token',
  projectId: '15787e2949e99efd12dc95c5e03cd127',
  chains: [
    // mainnet,
    bsc,
    bscTestnet,
  ],
  transports: {
    [bscTestnet.id]: http("https://bsc-testnet-rpc.publicnode.com"),
    [bsc.id]: http("https://bsc-mainnet.infura.io/v3/113f8fe63628446cb141f8e6618518ce"),
  },
});