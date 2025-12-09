import { expect, afterEach } from 'vitest'
import { cleanup } from '@vue/test-utils'
import { vi } from 'vitest'

vi.mock('@vue-flow/core', () => ({
  VueFlow: {
    name: 'VueFlow',
    template: '<div class="vue-flow-mock"><slot /></div>',
  },
  Background: {
    name: 'Background',
    template: '<div class="background-mock"></div>',
  },
  Controls: {
    name: 'Controls',
    template: '<div class="controls-mock"></div>',
  },
  Handle: {
    name: 'Handle',
    template: '<div class="handle-mock"></div>',
  },
  useVueFlow: () => ({}),
}))

afterEach(() => {
  cleanup()
})

