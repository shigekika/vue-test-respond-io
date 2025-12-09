<template>
  <div class="flow-chart-view">
    <div class="toolbar">
      <div class="toolbar-left">
        <h1 class="app-title">Flow Chart App</h1>
      </div>
      <div class="toolbar-right">
        <button
          v-if="store.canUndo"
          class="toolbar-btn"
          @click="store.undo"
          :title="`Undo (${isMac ? 'Cmd' : 'Ctrl'}+Z)`"
          aria-label="Undo"
        >
          <span class="toolbar-btn-content">
            <span class="toolbar-btn-text">↶ Undo</span>
            <span class="toolbar-btn-hotkey">{{ isMac ? '⌘' : 'Ctrl'}}+Z</span>
          </span>
        </button>
        <button
          v-if="store.canRedo"
          class="toolbar-btn"
          @click="store.redo"
          :title="`Redo (${isMac ? 'Cmd' : 'Ctrl'}+Y)`"
          aria-label="Redo"
        >
          <span class="toolbar-btn-content">
            <span class="toolbar-btn-text">↷ Redo</span>
            <span class="toolbar-btn-hotkey">{{ isMac ? '⌘' : 'Ctrl'}}+Y</span>
          </span>
        </button>
        <button
          class="toolbar-btn toolbar-btn--primary"
          @click="openCreateDialog"
          aria-label="Create new node"
        >
          + Create New Node
        </button>
      </div>
    </div>

    <div v-if="store.isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading flow chart...</p>
    </div>

    <div v-else class="canvas-container">
      <FlowChartCanvas />
    </div>

    <CreateNodeDialog
      :is-open="isCreateDialogOpen"
      @close="closeCreateDialog"
      @created="handleNodeCreated"
    />

    <NodeDetailsDrawer
      :node-id="selectedNodeId"
      :is-open="isDrawerOpen"
      @close="closeDrawer"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FlowChartCanvas from '../components/FlowChartCanvas.vue'
import CreateNodeDialog from '../components/CreateNodeDialog.vue'
import NodeDetailsDrawer from '../components/NodeDetailsDrawer.vue'
import { useFlowChartStore } from '../stores/flowChartStore'
import { usePayloadQuery } from '../composables/usePayloadQuery'

const route = useRoute()
const router = useRouter()
const store = useFlowChartStore()

const isMac = computed(() => {
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0 || 
         navigator.userAgent.toUpperCase().indexOf('MAC') >= 0
})

usePayloadQuery()

const isCreateDialogOpen = ref(false)
const selectedNodeId = computed(() => route.params.id || null)
const isDrawerOpen = computed(() => !!selectedNodeId.value)

const openCreateDialog = () => {
  isCreateDialogOpen.value = true
}

const closeCreateDialog = () => {
  isCreateDialogOpen.value = false
}

const handleNodeCreated = () => {
  closeCreateDialog()
}

const closeDrawer = () => {
  if (route.name === 'node-details') {
    router.push({ name: 'flowchart' })
  }
}

const handleKeyDown = (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
    event.preventDefault()
    if (store.canUndo) {
      store.undo()
    }
  }
  if (
    ((event.ctrlKey || event.metaKey) && event.key === 'y') ||
    ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z')
  ) {
    event.preventDefault()
    if (store.canRedo) {
      store.redo()
    }
  }
  if (event.key === 'Escape' && isDrawerOpen.value) {
    closeDrawer()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      store.selectNode(newId)
    } else {
      store.clearSelection()
    }
  }
)
</script>

<style scoped>
@import '../styles/FlowChartView.css';
</style>

