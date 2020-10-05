const ConnectToInjected = async () => {
  let provider = null;
  let anyWindow = window as any;

  if (anyWindow.ethereum) {
    provider = anyWindow.ethereum;
    try {
      await anyWindow.ethereum.enable();
    } catch (error) {
      throw new Error('User Rejected');
    }
  } else if (anyWindow.web3) {
    provider = anyWindow.web3.currentProvider;
  } else {
    throw new Error('No Web3 Provider found');
  }
  return provider;
};

export default ConnectToInjected;
