import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { transformPayloadToFlowData } from '../utils/transformers'
import { generateId } from '../utils/helpers'

export const useFlowChartStore = defineStore('flowChart', () => {
  const payloadData = ref(null)
  const isLoading = ref(false)
  const selectedNodeId = ref(null)
  const history = ref([])
  const historyIndex = ref(-1)

  const flowData = computed(() => {
    if (!payloadData.value) return { nodes: [], edges: [] }
    const transformed = transformPayloadToFlowData(payloadData.value)
    return {
      nodes: transformed.nodes.map(node => ({
        ...node,
        position: node.position ? { x: node.position.x, y: node.position.y } : { x: 0, y: 0 }
      })),
      edges: transformed.edges
    }
  })

  const setPayloadData = (data) => {
    payloadData.value = data
    addToHistory(data)
  }

  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const addToHistory = (data) => {
    history.value = history.value.slice(0, historyIndex.value + 1)
    history.value.push(JSON.parse(JSON.stringify(data)))
    historyIndex.value = history.value.length - 1
  }

  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  const undo = () => {
    if (canUndo.value) {
      historyIndex.value--
      const previousData = history.value[historyIndex.value]
      payloadData.value = previousData
    }
  }

  const redo = () => {
    if (canRedo.value) {
      historyIndex.value++
      const nextData = history.value[historyIndex.value]
      payloadData.value = nextData
    }
  }

  const createNode = (nodeData) => {
    const currentPayload = payloadData.value || []
    const newNode = {
      id: generateId(),
      name: nodeData.title,
      type: nodeData.type,
      parentId: nodeData.parentId || null,
      data: {
        ...nodeData.data,
      },
    }

    if (nodeData.description) {
      newNode.description = nodeData.description
    }

    const updatedPayload = [...currentPayload, newNode]
    setPayloadData(updatedPayload)
    return newNode
  }

  const updateNode = (nodeId, updates) => {
    const currentPayload = payloadData.value || []
    const updatedPayload = currentPayload.map((node) =>
      node.id === nodeId || node.id === nodeId.toString()
        ? { ...node, ...updates }
        : node
    )
    setPayloadData(updatedPayload)
  }

  const deleteNode = (nodeId) => {
    const currentPayload = payloadData.value || []
    const updatedPayload = currentPayload
      .filter(
        (node) => node.id !== nodeId && node.id !== nodeId.toString() && node.parentId !== nodeId && node.parentId !== nodeId.toString()
      )
      .map((node) => {
        if (node.parentId?.toString() === nodeId || node.parentId === nodeId) {
          const { parentId, ...rest } = node
          return { ...rest, parentId: null }
        }
        return node
      })
    setPayloadData(updatedPayload)
  }

  const originalPositions = ref(new Map())
  const isDragging = ref(false)

  const getAllChildNodeIds = (parentId) => {
    const children = []
    const currentPayload = payloadData.value || []
    
    const findChildren = (pid) => {
      currentPayload.forEach((node) => {
        const nodeParentId = node.parentId?.toString()
        const pidStr = pid?.toString()
        if (nodeParentId === pidStr && node.id?.toString() !== pidStr) {
          const childId = node.id?.toString()
          children.push(childId)
          findChildren(node.id)
        }
      })
    }
    
    findChildren(parentId)
    return children
  }

  const updateNodePositionImmediate = (nodeId, position) => {
    const currentPayload = payloadData.value || []
    
    const originalPos = originalPositions.value.get(nodeId)
    if (!originalPos) {
      const updatedPayload = currentPayload.map((node) => {
        if (node.id === nodeId || node.id === nodeId.toString()) {
          return {
            ...node,
            position,
          }
        }
        return node
      })
      payloadData.value = updatedPayload
      return
    }
    
    const deltaX = position.x - originalPos.x
    const deltaY = position.y - originalPos.y
    
    const childNodeIds = getAllChildNodeIds(nodeId)
    
    const updatedPayload = currentPayload.map((node) => {
      const nodeIdStr = node.id?.toString()
      
      if (nodeIdStr === nodeId || node.id === nodeId) {
        return {
          ...node,
          position,
        }
      }
      
      if (childNodeIds.includes(nodeIdStr)) {
        const childOriginalPos = originalPositions.value.get(nodeIdStr)
        if (childOriginalPos) {
          return {
            ...node,
            position: {
              x: childOriginalPos.x + deltaX,
              y: childOriginalPos.y + deltaY,
            },
          }
        } else if (node.position) {
          return {
            ...node,
            position: {
              x: node.position.x + deltaX,
              y: node.position.y + deltaY,
            },
          }
        }
      }
      
      return node
    })
    
    payloadData.value = updatedPayload
  }

  const startNodeDrag = (nodeId) => {
    if (!isDragging.value) {
      isDragging.value = true
      originalPositions.value.clear()
    }
    
    const currentPayload = payloadData.value || []
    
    const node = currentPayload.find(
      (n) => n.id === nodeId || n.id === nodeId.toString()
    )
    if (node && !originalPositions.value.has(nodeId)) {
      originalPositions.value.set(nodeId, node.position ? { ...node.position } : null)
    }
    
    const childNodeIds = getAllChildNodeIds(nodeId)
    childNodeIds.forEach((childId) => {
      if (!originalPositions.value.has(childId)) {
        const childNode = currentPayload.find(
          (n) => n.id?.toString() === childId || n.id === childId
        )
        if (childNode) {
          originalPositions.value.set(childId, childNode.position ? { ...childNode.position } : null)
        }
      }
    })
  }

  const endNodeDrag = (nodeId = null) => {
    if (nodeId) {
      originalPositions.value.delete(nodeId)
      const childNodeIds = getAllChildNodeIds(nodeId)
      childNodeIds.forEach((childId) => {
        originalPositions.value.delete(childId)
      })
      
      if (originalPositions.value.size === 0 && isDragging.value) {
        isDragging.value = false
        if (payloadData.value) {
          addToHistory(JSON.parse(JSON.stringify(payloadData.value)))
        }
      }
    } else {
      if (isDragging.value) {
        isDragging.value = false
        if (payloadData.value) {
          addToHistory(JSON.parse(JSON.stringify(payloadData.value)))
        }
        originalPositions.value.clear()
      }
    }
  }

  const updateNodePosition = (nodeId, position) => {
    if (isDragging.value) {
      updateNodePositionImmediate(nodeId, position)
    } else {
      const currentPayload = payloadData.value || []
      const updatedPayload = currentPayload.map((node) => {
        if (node.id === nodeId || node.id === nodeId.toString()) {
          return {
            ...node,
            position,
          }
        }
        return node
      })
      setPayloadData(updatedPayload)
    }
  }

  const selectNode = (nodeId) => {
    selectedNodeId.value = nodeId
  }

  const clearSelection = () => {
    selectedNodeId.value = null
  }

  const createEdge = (sourceId, targetId) => {
    const currentPayload = payloadData.value || []
    const updatedPayload = currentPayload.map((node) => {
      if (node.id?.toString() === targetId || node.id === targetId) {
        return {
          ...node,
          parentId: sourceId,
        }
      }
      return node
    })
    setPayloadData(updatedPayload)
  }

  const deleteEdge = (edgeId) => {
    const match = edgeId.match(/^edge-(.+)-(.+)$/)
    if (match) {
      const [, sourceId, targetId] = match
      const currentPayload = payloadData.value || []
      const updatedPayload = currentPayload.map((node) => {
        if ((node.id?.toString() === targetId || node.id === targetId) && 
            (node.parentId?.toString() === sourceId || node.parentId === sourceId)) {
          const { parentId, ...rest } = node
          return { ...rest, parentId: null }
        }
        return node
      })
      setPayloadData(updatedPayload)
    }
  }

  return {
    payloadData,
    flowData,
    isLoading,
    selectedNodeId,
    setPayloadData,
    setLoading,
    createNode,
    updateNode,
    deleteNode,
    updateNodePosition,
    startNodeDrag,
    endNodeDrag,
    selectNode,
    clearSelection,
    createEdge,
    deleteEdge,
    canUndo,
    canRedo,
    undo,
    redo,
  }
})

