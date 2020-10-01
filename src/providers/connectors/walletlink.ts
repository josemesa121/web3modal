import { IAbstractConnectorOptions, getChainId } from '../../helpers';

const INFURA_URL = 'https://mainnet.infura.io/v3/';

export interface IWalletLinkConnectorOptions
  extends IAbstractConnectorOptions {
  appName: string;
  appLogoUrl: string;
  infuraId: string;
  chainId: number;
}

const ConnectToWalletLink = (
  WalletLinkProvider: any,
  opts: IWalletLinkConnectorOptions,
) => {
  return new Promise(async (resolve, reject) => {
    let infuraId = '';
    let chainId = 1;

    console.log('wallet connect'); // t
    if (opts) {
      infuraId = opts.infuraId || infuraId;
      chainId = opts.chainId || chainId;
      chainId =
        opts.network && getChainId(opts.network) ? getChainId(opts.network) : 1;
    }

    const provider = new WalletLinkProvider({
      jsonRpcUrl: `${INFURA_URL}${infuraId}`,
      chainId,
    });

    try {
      await provider.enable();
      resolve(provider);
    } catch (e) {
      reject(e);
    }
    // const walletLink = new Wallet({
    //   appName,
    //   appLogoUrl
    // });
    // const provider = walletLink.makeWeb3Provider(networkUrl, chainId);

  });
};

export default ConnectToWalletLink;