import { supportedChainIds } from '@/constants/chains';
import { Token } from '@/types/chains';
import bscTokens from './bsc_tokens.json';
import beraTokens from './bera_tokens.json';
import modeTokens from './mode_tokens.json';
import monadTokens from './monad_tokens.json';

export const tokensByChainId = {
  [supportedChainIds.monad]: monadTokens,
  [supportedChainIds.bsc]: bscTokens,
  [supportedChainIds.mode]: modeTokens,
  [supportedChainIds.bera]: beraTokens,
} as { [key: number]: Record<string, Token> };
