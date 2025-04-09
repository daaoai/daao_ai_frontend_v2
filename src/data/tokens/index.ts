import { supportedChainIds } from '@/constants/chains';
import { Token } from '@/types/chains';
import monadTokens from './monad_tokens.json';
import modeTokens from './mode_tokens.json';
import bscTokens from './bsc_tokens.json';

export const tokensByChainId = {
  [supportedChainIds.monad]: monadTokens,
  [supportedChainIds.bsc]: bscTokens,
  [supportedChainIds.mode]: modeTokens,
} as { [key: number]: Record<string, Token> };
