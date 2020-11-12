import { IAbstractConnectorOptions, getChainId } from '../../helpers';
import { environment } from '../../../../../environments/environment';

const INFURA_URL = 'https://rinkeby.infura.io/v3/';

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
    console.log('==============================');
    console.log(environment);
    console.log(resolve);
    console.log(reject);
    console.log(opts.network && getChainId(opts.network) ? getChainId(opts.network) : 1);
    console.log(opts);
    console.log(opts.network);

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

    const provider = walletlink.makeWeb3Provider(
      `${INFURA_URL}${infuraId}`,
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