import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { mockMatchMedia } from '@/test/setup';

import { useReducedMotion } from './use-reduced-motion';

describe('useReducedMotion', () => {
  it('devolve false quando o usuário não pediu movimento reduzido', () => {
    mockMatchMedia(false);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);
  });

  it('devolve true quando o usuário prefere movimento reduzido', () => {
    mockMatchMedia(true);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);
  });
});
