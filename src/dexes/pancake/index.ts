import { supportedDexesTypes } from '@/constants/dex';
import { KodiakDex } from '../kodiakDex';

export class PancakeDex extends KodiakDex {
  constructor(chainId: number) {
    super(chainId, supportedDexesTypes.pancake);
  }
}
