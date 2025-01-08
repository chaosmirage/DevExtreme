import { domAdapter } from '@ts/core/m_dom_adapter';
import type { InfernoNode } from 'inferno';
import { render } from 'inferno';

export function renderToDOMNode(input: InfernoNode): HTMLElement {
  const container = domAdapter.createElement('div');
  render(input, container);

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return container.children[0] as any;
}
