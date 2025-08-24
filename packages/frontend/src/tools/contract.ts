interface ContractAddresses {
  ethereum: {
    crossChainSwap: string;
    crossChainBridge: string;
    tokenManager: string;
    mockUSDC: string;
  };
  aptos: {
    crossChainSwap: string;
    crossChainBridge: string;
    tokenRegistry: string;
  };
}

export const CONTRACT_ADDRESSES: ContractAddresses = {
  ethereum: {
    crossChainSwap: '0x1B361EEEf61b67e66cF7e8C0309cb03EDc34F4F8',
    crossChainBridge: '0x4f1e1b041A9Fc9347731E893d1c06e6c8FbceDb0',
    tokenManager: '0x2A809295cc916E85cF998eA8f8559cfeB85f2e28',
    mockUSDC: '0x7a265Db61E004f4242fB322fa72F8a52D2B06664',
  },
  aptos: {
    crossChainSwap:
      '0x5ac6a79cde1c926bf2021727adf74f7eedcca438be6a5be0d4629ef638ba9a98',
    crossChainBridge:
      '0x5ac6a79cde1c926bf2021727adf74f7eedcca438be6a5be0d4629ef638ba9a98::cross_chain_bridge',
    tokenRegistry:
      '0x5ac6a79cde1c926bf2021727adf74f7eedcca438be6a5be0d4629ef638ba9a98',
  },
};

export const NETWORK_CONFIG = {
  ethereum: {
    chainId: 11155111, // Sepolia
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
  aptos: {
    network: 'testnet',
    name: 'Aptos Testnet',
    rpcUrl: 'https://fullnode.testnet.aptoslabs.com/v1',
    blockExplorer: 'https://explorer.aptoslabs.com',
  },
};
