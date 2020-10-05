import * as ethUtil from 'ethereumjs-util';
import {IChainData} from './types';
import supportedChains from './chains';
import {apiGetAccountNonce, apiGetGasPrices} from './api';
import {convertAmountToRawNumber, convertStringToHex} from './bignumber';

export function capitalize(string: string): string {
  return string
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function ellipseText(
  text: string = '',
  maxLength: number = 9999
): string {
  if (text.length <= maxLength) {
    return text;
  }
  const _maxLength = maxLength - 3;
  let ellipse = false;
  let currentLength = 0;
  return text
      .split(' ')
      .filter(word => {
        currentLength += word.length;
        if (ellipse || currentLength >= _maxLength) {
          ellipse = true;
          return false;
        } else {
          return true;
        }
      })
      .join(' ') + '...';
}

export function ellipseAddress(
  address: string = '',
  width: number = 10
): string {
  return `${address.slice(0, width)}...${address.slice(-width)}`;
}

export function padLeft(n: string, width: number, z?: string): string {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export function sanitizeHex(hex: string): string {
  hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
  if (hex === '') {
    return '';
  }
  hex = hex.length % 2 !== 0 ? '0' + hex : hex;
  return '0x' + hex;
}

export function removeHexPrefix(hex: string): string {
  return hex.toLowerCase().replace('0x', '');
}

export function getDataString(func: string, arrVals: any[]): string {
  let val = '';
  for (let i = 0; i < arrVals.length; i++) {
    val += padLeft(arrVals[i], 64);
  }
  return func + val;
}

export function getChainData(chainId: number): IChainData {
  const chainData = supportedChains.filter(
    (chain: any) => chain.chain_id === chainId
  )[0];

  if (!chainData) {
    throw new Error('ChainId missing or not supported');
  }

  const API_KEY = process.env.REACT_APP_INFURA_ID;

  if (
    chainData.rpc_url.includes('infura.io') &&
    chainData.rpc_url.includes('%API_KEY%') &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace('%API_KEY%', API_KEY);

    return {
      ...chainData,
      rpc_url: rpcUrl
    };
  }

  return chainData;
}

export function hashPersonalMessage(msg: string): string {
  const buffer = Buffer.from(msg);
  const result = ethUtil.hashPersonalMessage(buffer);
  return ethUtil.bufferToHex(result);
}

export function recoverPublicKey(sig: string, hash: string): string {
  const sigParams = ethUtil.fromRpcSig(sig);
  const hashBuffer = Buffer.from(hash.replace('0x', ''), 'hex');
  const result = ethUtil.ecrecover(
    hashBuffer,
    sigParams.v,
    sigParams.r,
    sigParams.s
  );
  return ethUtil.bufferToHex(ethUtil.publicToAddress(result));
}

export function recoverPersonalSignature(sig: string, msg: string): string {
  const hash = hashPersonalMessage(msg);
  return recoverPublicKey(sig, hash);
}

export async function formatTestTransaction(address: string, chainId: number) {
  // from
  const from = address;

  // to
  const to = address;

  // nonce
  const _nonce = await apiGetAccountNonce(address, chainId);
  const nonce = sanitizeHex(convertStringToHex(_nonce));

  // gasPrice
  const gasPrices = await apiGetGasPrices();
  const _gasPrice = gasPrices.slow.price;
  const gasPrice = sanitizeHex(
    convertStringToHex(convertAmountToRawNumber(_gasPrice, 9))
  );

  // gasLimit
  const _gasLimit = 21000;
  const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));

  // value
  const _value = 0;
  const value = sanitizeHex(convertStringToHex(_value));

  // data
  const data = '0x';

  // test transaction
  return {
    from,
    to,
    nonce,
    gasPrice,
    gasLimit,
    value,
    data
  };
}

export function isObject(obj: any): boolean {
  return typeof obj === 'object' && !!Object.keys(obj).length;
}
