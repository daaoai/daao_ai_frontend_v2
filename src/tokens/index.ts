import { supportedChainIds } from '@/constants/chains';
import { Token } from '@/types/chains';
import monadTokens from './10143_tokens.json';
import modeTokens from './34443_tokens.json';
import bscTokens from './56_tokens.json';

export const tokensByChainId = {
  [supportedChainIds.monad]: monadTokens,
  [supportedChainIds.bsc]: bscTokens,
  [supportedChainIds.mode]: modeTokens,
} as { [key: number]: Record<string, Token> };
