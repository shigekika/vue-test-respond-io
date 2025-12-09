export function transformPayloadToFlowData(payload) {
  const nodes = []
  const edges = []

  const positions = {
    trigger: { x: 400, y: 50 },
    dateTime: { x: 400, y: 200 },
    dateTimeConnector: { x: 300, y: 350 },
    sendMessage: { x: 400, y: 350 },
    addComment: { x: 500, y: 350 },
  }

  const nodePositions = new Map()
  const nodeMap = new Map()

  payload.forEach((item, index) => {
    const nodeId = item.id?.toString() || `node-${index}`
    nodeMap.set(nodeId, { ...item, nodeId })
  })

  const calculatePosition = (item, nodeId, fallbackIndex = 0) => {
    if (item.position) {
      return item.position
    }

    if (item.parentId === undefined || item.parentId === -1) {
      return { x: 400, y: 50 }
    }

    const parentId = item.parentId?.toString()
    let parentPosition = nodePositions.get(parentId)

    if (!parentPosition) {
      const parentItem = nodeMap.get(parentId)
      if (parentItem) {
        parentPosition = calculatePosition(parentItem, parentId, fallbackIndex)
        nodePositions.set(parentId, parentPosition)
      }
    }

    if (parentPosition) {
      const isSuccess = item.data?.connectorType === 'success'
      const isFailure = item.data?.connectorType === 'failure'

      if (isSuccess || isFailure) {
        return {
          x: isSuccess ? parentPosition.x - 200 : parentPosition.x + 200,
          y: parentPosition.y + 100,
        }
      } else {
        const siblings = payload.filter(
          (p) => p.parentId?.toString() === parentId && 
          p.id?.toString() !== nodeId &&
          !p.data?.connectorType
        )
        const siblingIndex = siblings.findIndex((s) => {
          const sId = s.id?.toString()
          return payload.findIndex((p) => p.id?.toString() === sId) < 
                 payload.findIndex((p) => p.id?.toString() === nodeId)
        })

        return {
          x: parentPosition.x + (siblingIndex >= 0 ? siblingIndex * 250 : 0),
          y: parentPosition.y + 150,
        }
      }
    }

    return { x: 400, y: 50 + fallbackIndex * 150 }
  }

  payload.forEach((item, index) => {
    const nodeId = item.id?.toString() || `node-${index}`
    if (!nodePositions.has(nodeId)) {
      const position = calculatePosition(item, nodeId, index)
      nodePositions.set(nodeId, position)
    }
  })

  payload.forEach((item, index) => {
    const nodeId = item.id?.toString() || `node-${index}`
    const nodeType = mapNodeType(item.type)
    const position = nodePositions.get(nodeId) || { x: 400, y: 50 + index * 150 }

    const node = {
      id: nodeId,
      type: nodeType,
      position,
      data: {
        label: item.name || item.type || 'Node',
        title: item.name || '',
        description: item.description || '',
        nodeType: item.type,
        nodeData: item.data || {},
        originalId: item.id,
      },
    }

    nodes.push(node)

    if (item.parentId !== undefined && item.parentId !== null && item.parentId !== -1) {
      const parentId = item.parentId?.toString() || `node-${payload.findIndex((p) => p.id === item.parentId)}`
      const edgeId = `edge-${parentId}-${nodeId}`
      if (!edges.find(e => e.id === edgeId)) {
        edges.push({
          id: edgeId,
          source: parentId,
          target: nodeId,
          type: 'smoothstep',
          animated: true,
        })
      }
    }
  })

  return { nodes, edges }
}

export function transformFlowDataToPayload(flowData) {
  return flowData
}

function mapNodeType(type) {
  const typeMap = {
    trigger: 'trigger',
    sendMessage: 'sendMessage',
    addComment: 'addComment',
    dateTime: 'dateTime',
    dateTimeConnector: 'dateTimeConnector',
  }
  return typeMap[type] || 'default'
}
