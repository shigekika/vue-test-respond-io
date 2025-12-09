<template>
  <div 
    class="flow-chart-canvas"
    tabindex="0"
    @keydown="handleKeyboardNavigation"
    role="application"
    aria-label="Flow chart canvas. Use arrow keys to navigate between nodes, Enter or Space to open node details."
  >
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :node-types="nodeTypes"
      :default-edge-options="{ type: 'smoothstep', animated: true }"
      :fit-view-on-init="true"
      :connect-on-click="false"
      @nodes-change="onNodesChange"
      @edges-change="onEdgesChange"
      @connect="onConnect"
      @node-click="onNodeClick"
      class="vue-flow-container"
    >
      <Background pattern-color="#e2e8f0" :gap="16" />
      <Controls 
        :show-zoom="true"
        :show-fit-view="true"
        :show-interactive="true"
      />
    </VueFlow>
  </div>
</template>

<script setup>
import { computed, ref, onUnmounted, onMounted, nextTick, provide } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import CustomNode from './nodes/CustomNode.vue'
import { useFlowChartStore } from '../stores/flowChartStore'
import { useRouter } from 'vue-router'

const store = useFlowChartStore()
const router = useRouter()
const { updateNode, getNodes, getViewport } = useVueFlow()

const nodeTypes = {
  default: CustomNode,
  trigger: CustomNode,
  sendMessage: CustomNode,
  addComment: CustomNode,
  dateTime: CustomNode,
  dateTimeConnector: CustomNode,
}

const nodes = computed(() => {
  return store.flowData.nodes.map(node => ({
    id: node.id,
    type: node.type,
    position: node.position, 
    data: {
      ...node.data,
      nodeData: node.data.nodeData ? JSON.parse(JSON.stringify(node.data.nodeData)) : {},
    }
  }))
})
const edges = computed(() => store.flowData.edges)

const dragTimeout = ref(null)
const currentlyDragging = ref(new Set())

const focusedNodeId = ref(null)
const nodeElements = ref(new Map()) 

const onNodesChange = (changes) => {
  changes.forEach((change) => {
    if (change.type === 'position' && change.position) {
      const nodeId = change.id
      
      if (!currentlyDragging.value.has(nodeId)) {
        store.startNodeDrag(nodeId)
        currentlyDragging.value.add(nodeId)
      }
      
      store.updateNodePosition(nodeId, change.position)
      
      if (dragTimeout.value) {
        clearTimeout(dragTimeout.value)
      }
      
      dragTimeout.value = setTimeout(() => {
        if (currentlyDragging.value.has(nodeId)) {
          store.endNodeDrag(nodeId)
          currentlyDragging.value.delete(nodeId)
        }
      }, 150)
    }
  })
}


const onEdgesChange = (changes) => {
  changes.forEach((change) => {
    if (change.type === 'remove') {
      store.deleteEdge(change.id)
    }
  })
}

const onConnect = (connection) => {
  if (connection.source && connection.target) {
    store.createEdge(connection.source, connection.target)
  }
}

const onNodeClick = (event) => {
  const nodeId = event.node.id
  store.selectNode(nodeId)
  router.push({ name: 'node-details', params: { id: nodeId } })
}

const registerNodeElement = (nodeId, element) => {
  if (element) {
    nodeElements.value.set(nodeId, element)
  }
}

const unregisterNodeElement = (nodeId) => {
  nodeElements.value.delete(nodeId)
}

const findNearestNode = (currentNodeId, direction) => {
  const currentNodes = store.flowData.nodes
  if (!currentNodes.length) return null
  
  const currentNode = currentNodes.find(n => n.id === currentNodeId)
  if (!currentNode) return currentNodes[0]?.id || null
  
  const currentPos = currentNode.position
  let nearestNode = null
  let minDistance = Infinity
  
  currentNodes.forEach(node => {
    if (node.id === currentNodeId || node.data?.nodeType === 'dateTimeConnector') return
    
    const nodePos = node.position
    let distance = Infinity
    let isInDirection = false
    
    switch (direction) {
      case 'ArrowUp':
        if (nodePos.y < currentPos.y) {
          distance = Math.abs(nodePos.x - currentPos.x) + (currentPos.y - nodePos.y)
          isInDirection = true
        }
        break
      case 'ArrowDown':
        if (nodePos.y > currentPos.y) {
          distance = Math.abs(nodePos.x - currentPos.x) + (nodePos.y - currentPos.y)
          isInDirection = true
        }
        break
      case 'ArrowLeft':
        if (nodePos.x < currentPos.x) {
          distance = Math.abs(nodePos.y - currentPos.y) + (currentPos.x - nodePos.x)
          isInDirection = true
        }
        break
      case 'ArrowRight':
        if (nodePos.x > currentPos.x) {
          distance = Math.abs(nodePos.y - currentPos.y) + (nodePos.x - currentPos.x)
          isInDirection = true
        }
        break
    }
    
    if (isInDirection && distance < minDistance) {
      minDistance = distance
      nearestNode = node
    }
  })
  
  return nearestNode?.id || null
}

const handleKeyboardNavigation = (event) => {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    return
  }
  
  const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
  
  if (arrowKeys.includes(event.key)) {
    event.preventDefault()
    
    if (!focusedNodeId.value) {
      const firstNode = store.flowData.nodes.find(n => n.data?.nodeType !== 'dateTimeConnector')
      if (firstNode) {
        focusNode(firstNode.id)
      }
      return
    }
    
    const nextNodeId = findNearestNode(focusedNodeId.value, event.key)
    if (nextNodeId) {
      focusNode(nextNodeId)
    }
  }
}

const focusNode = (nodeId) => {
  focusedNodeId.value = nodeId
  nextTick(() => {
    const element = nodeElements.value.get(nodeId)
    if (element) {
      element.focus()
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  })
}

provide('keyboardNavigation', {
  registerNodeElement,
  unregisterNodeElement,
  focusNode,
})

onMounted(() => {
  nextTick(() => {
    const firstNode = store.flowData.nodes.find(n => n.data?.nodeType !== 'dateTimeConnector')
    if (firstNode) {
      focusNode(firstNode.id)
    }
    
    setTimeout(() => {
      const controlButtons = document.querySelectorAll('.vue-flow__controls-button')
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || 
                    navigator.userAgent.toUpperCase().indexOf('MAC') >= 0
      const modKey = isMac ? '⌘' : 'Ctrl'
      
      const tooltips = [
        { label: 'Zoom In', hotkey: `${modKey}+Plus` },
        { label: 'Zoom Out', hotkey: `${modKey}+Minus` },
        { label: 'Fit View', hotkey: '' },
        { label: 'Lock/Unlock', hotkey: '' }
      ]
      controlButtons.forEach((button, index) => {
        if (tooltips[index]) {
          const tooltip = tooltips[index]
          const tooltipText = tooltip.hotkey 
            ? `${tooltip.label} • ${tooltip.hotkey}`
            : tooltip.label
          button.setAttribute('data-tooltip', tooltipText)
          button.setAttribute('title', tooltip.hotkey ? `${tooltip.label} (${tooltip.hotkey})` : tooltip.label)
        }
      })
    }, 100)
  })
})

onUnmounted(() => {
  if (dragTimeout.value) {
    clearTimeout(dragTimeout.value)
  }
})
</script>

<style>
@import '../styles/FlowChartCanvas.css';
</style>

