import { describe, it, expect } from 'vitest'
import { transformPayloadToFlowData } from './transformers'

describe('transformers', () => {
  describe('transformPayloadToFlowData', () => {
    it('should transform payload to flow data format', () => {
      const payload = [
        {
          id: 1,
          parentId: -1,
          type: 'trigger',
          data: { type: 'conversationOpened' },
        },
        {
          id: 'node1',
          name: 'Test Node',
          type: 'sendMessage',
          parentId: 1,
          data: { payload: [{ type: 'text', text: 'Hello' }] },
        },
      ]

      const result = transformPayloadToFlowData(payload)

      expect(result.nodes).toHaveLength(2)
      expect(result.edges).toHaveLength(1)
      expect(result.nodes[0].id).toBe('1')
      expect(result.nodes[0].data.label).toBe('trigger')
      expect(result.nodes[1].data.title).toBe('Test Node')
      expect(result.edges[0].source).toBe('1')
      expect(result.edges[0].target).toBe('node1')
    })

    it('should handle nodes without parentId', () => {
      const payload = [
        {
          id: 1,
          type: 'trigger',
          data: {},
        },
      ]

      const result = transformPayloadToFlowData(payload)

      expect(result.nodes).toHaveLength(1)
      expect(result.edges).toHaveLength(0)
    })

    it('should assign positions to nodes', () => {
      const payload = [
        {
          id: 1,
          type: 'trigger',
          data: {},
        },
      ]

      const result = transformPayloadToFlowData(payload)

      expect(result.nodes[0].position).toBeDefined()
      expect(result.nodes[0].position.x).toBeGreaterThanOrEqual(0)
      expect(result.nodes[0].position.y).toBeGreaterThanOrEqual(0)
    })
  })
})

