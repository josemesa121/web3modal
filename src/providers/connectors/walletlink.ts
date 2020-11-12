import { IAbstractConnectorOptions } from '../../helpers';

export interface IWalletLinkConnectorOptions
  extends IAbstractConnectorOptions {
  appName: string;
  appLogoUrl: string;
  chainId: number;
  darkMode: boolean;
  infuraId: string;
}

const ConnectToWalletLink = (
  WalletLink: any,
  opts: IWalletLinkConnectorOptions,
) => {
  return new Promise(async (resolve, reject) => {
    let infuraId = '';
    let chainId = 1;
    let darkMode = false;
    let appName = null;
    let appLogoUrl = null;

    if (opts) {
      infuraId = opts.infuraId || infuraId;
      darkMode = opts.darkMode || darkMode;
      chainId = opts.chainId || chainId;
      appName = opts.appName;
      appLogoUrl = opts.appLogoUrl;
    }

    const walletlink = new WalletLink({
      appName,
      appLogoUrl,
      darkMode,
    });

    let networkType = 'rinkeby';
    if (chainId === 4){
      networkType = 'mainnet'
    }

    console.log('==============================');
    console.log(networkType);

    const provider = walletlink.makeWeb3Provider(
      `https://${networkType}.infura.io/v3/${infuraId}`,
      chainId,
    );

    try {
      await provider.enable();
      resolve(provider);
    } catch (e) {
      reject(e);
    }
  });
};

export default ConnectToWalletLink;