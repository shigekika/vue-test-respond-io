<template>
  <div
    ref="nodeElement"
    :class="['custom-node', `custom-node--${nodeType}`, { 'custom-node--readonly': isReadOnly, 'custom-node--focused': isFocused }]"
    @click="!isReadOnly && handleNodeClick()"
    @keydown.enter="!isReadOnly && handleNodeClick()"
    @keydown.space.prevent="!isReadOnly && handleNodeClick()"
    @focus="handleFocus"
    @blur="handleBlur"
    :tabindex="isReadOnly ? -1 : 0"
    :role="isReadOnly ? 'presentation' : 'button'"
    :aria-label="isReadOnly ? `Connector node: ${data.title || data.label}` : `Node: ${data.title || data.label}. Press Enter or Space to open details.`"
  >
    <div class="custom-node__header">
      <div class="custom-node__icon">{{ icon }}</div>
      <div class="custom-node__content">
        <div class="custom-node__title">{{ data.title || data.label }}</div>
        <div v-if="data.description" class="custom-node__description">
          {{ truncatedDescription }}
        </div>
        <div v-if="nodeType === 'dateTime' && businessHoursTimezone" class="custom-node__timezone">
          {{ businessHoursTimezone }}
        </div>
      </div>
    </div>
    <div v-if="nodeType === 'sendMessage' && allMessages.length > 0" class="custom-node__messages">
      <div
        v-for="(message, index) in allMessages"
        :key="index"
        class="custom-node__message"
      >
        <span class="message-label">Message:</span>
        <span class="message-text">{{ truncateText(message) }}</span>
      </div>
    </div>
    <div v-if="nodeType === 'addComment' && commentContent" class="custom-node__comment">
      <span class="comment-text">{{ commentContent }}</span>
    </div>
    <Handle 
      v-if="!isReadOnly" 
      type="target" 
      position="top"
      :connectable="true"
      style="background: #3b82f6;"
    />
    <Handle 
      v-if="!isReadOnly" 
      type="source" 
      position="bottom"
      :connectable="true"
      style="background: #3b82f6;"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, inject } from 'vue'
import { Handle } from '@vue-flow/core'
import { getNodeIcon } from '../../utils/helpers'
import { useFlowChartStore } from '../../stores/flowChartStore'
import { useRouter } from 'vue-router'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    default: 'default',
  },
})

const store = useFlowChartStore()
const router = useRouter()
const nodeElement = ref(null)
const keyboardNavigation = inject('keyboardNavigation', null)

const nodeType = computed(() => props.data.nodeType || props.type)
const icon = computed(() => getNodeIcon(nodeType.value))
const isReadOnly = computed(() => nodeType.value === 'dateTimeConnector')
const isFocused = ref(false)

const DESCRIPTION_MAX_LENGTH = 50

const truncateText = (text) => {
  if (!text) return ''
  const str = String(text)
  if (str.length <= DESCRIPTION_MAX_LENGTH) {
    return str
  }
  return str.substring(0, DESCRIPTION_MAX_LENGTH) + '...'
}

const truncatedDescription = computed(() => {
  return truncateText(props.data.description)
})

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}

const allMessages = computed(() => {
  if (nodeType.value === 'sendMessage' && props.data?.nodeData?.payload) {
    const payload = props.data.nodeData.payload
    if (!Array.isArray(payload)) return []
    
    const messages = []
    
    payload.forEach(item => {
      if (item?.type === 'text' && item.text && String(item.text).trim()) {
        messages.push(String(item.text).trim())
      } else if (item?.type === 'attachment' && item.attachment) {
        if (item.filename) {
          messages.push(item.filename)
        } else {
          try {
            const url = new URL(item.attachment)
            const filename = url.pathname.split('/').pop()
            messages.push(filename || item.attachment)
          } catch {
            const parts = String(item.attachment).split('/')
            const filename = parts[parts.length - 1] || item.attachment
            messages.push(filename.split('?')[0] || filename)
          }
        }
      }
    })
    
    return messages
  }
  return []
})

const commentContent = computed(() => {
  if (nodeType.value === 'addComment' && props.data.nodeData?.comment) {
    const comment = props.data.nodeData.comment.trim()
    return comment.length > DESCRIPTION_MAX_LENGTH ? comment.substring(0, DESCRIPTION_MAX_LENGTH) + '...' : comment
  }
  return null
})

const businessHoursTimezone = computed(() => {
  if (nodeType.value === 'dateTime' && props.data.nodeData?.timezone) {
    const tz = props.data.nodeData.timezone
    const timezoneMap = {
      'UTC': 'UTC',
      'America/New_York': 'America/New_York',
      'America/Los_Angeles': 'America/Los_Angeles',
      'Europe/London': 'Europe/London',
      'Asia/Singapore': 'Asia/Singapore',
    }
    return `Business Hours - ${timezoneMap[tz] || tz}`
  }
  return null
})

const handleNodeClick = () => {
  if (!isReadOnly.value) {
    store.selectNode(props.id)
    router.push({ name: 'node-details', params: { id: props.id } })
  }
}

onMounted(() => {
  if (nodeElement.value && !isReadOnly.value && keyboardNavigation) {
    keyboardNavigation.registerNodeElement(props.id, nodeElement.value)
  }
})

onUnmounted(() => {
  if (!isReadOnly.value && keyboardNavigation) {
    keyboardNavigation.unregisterNodeElement(props.id)
  }
})
</script>

<style scoped>
@import '../../styles/CustomNode.css';
</style>

