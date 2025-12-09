<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isOpen" class="drawer-overlay" @click.self="close">
        <div class="drawer-content" role="dialog" aria-labelledby="drawer-title">
          <div class="drawer-header">
            <h2 id="drawer-title">Node Details</h2>
            <button class="drawer-close" @click="close" aria-label="Close drawer">
              ×
            </button>
          </div>

          <div v-if="node" class="drawer-body">
            <div class="form-group">
              <label for="node-title">Title *</label>
              <input
                id="node-title"
                v-model="editableData.title"
                type="text"
                required
                :class="{ 'error': errors.title }"
                @blur="validateTitle"
                placeholder="Enter node title"
              />
              <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
            </div>

            <div class="form-group">
              <label for="node-description">Description</label>
              <textarea
                id="node-description"
                v-model="editableData.description"
                :class="{ 'error': errors.description }"
                @blur="validateDescription"
                placeholder="Enter node description"
                rows="3"
              />
              <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
            </div>

            <div v-if="nodeType === 'sendMessage'" class="node-type-section">
              <h3>Message Content</h3>
              
              <div class="text-items">
                <div
                  v-for="(item, index) in textItems"
                  :key="index"
                  class="text-item"
                >
                  <textarea
                    v-model="item.text"
                    :class="{ 'error': errors[`text-${index}`] }"
                    @blur="validateTextItem(index)"
                    placeholder="Enter message text"
                    rows="3"
                  />
                  <button
                    type="button"
                    class="btn-remove"
                    @click="removeTextItem(index)"
                    aria-label="Remove text"
                  >
                    Remove
                  </button>
                  <span v-if="errors[`text-${index}`]" class="error-message">
                    {{ errors[`text-${index}`] }}
                  </span>
                </div>
                <button type="button" class="btn-add" @click="addTextItem">
                  + Add Text
                </button>
              </div>

              <div class="attachments-section">
                <h4>Attachments</h4>
                <div class="attachments-grid">
                  <div
                    v-for="(attachment, index) in attachments"
                    :key="index"
                    class="attachment-preview"
                  >
                    <img
                      v-if="isImage(getAttachmentUrl(attachment))"
                      :src="getAttachmentUrl(attachment)"
                      :alt="getAttachmentDisplayName(attachment)"
                      @error="handleImageError"
                      @load="handleImageLoad"
                      class="attachment-image"
                    />
                    <div v-if="!isImage(getAttachmentUrl(attachment))" class="attachment-placeholder">
                      <span>📎</span>
                      <span class="attachment-url">{{ getAttachmentDisplayName(attachment) }}</span>
                    </div>
                    <button
                      type="button"
                      class="btn-remove-attachment"
                      @click="removeAttachment(index)"
                      aria-label="Remove attachment"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div class="upload-section">
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleFileUpload"
                    style="display: none"
                  />
                  <button type="button" class="btn-upload" @click="triggerFileUpload">
                    + Upload Attachment
                  </button>
                </div>
              </div>
            </div>

            <div v-if="nodeType === 'addComment'" class="node-type-section">
              <h3>Comment</h3>
              <textarea
                v-model="editableData.comment"
                :class="{ 'error': errors.comment }"
                @blur="validateComment"
                placeholder="Enter comment"
                rows="4"
              />
              <span v-if="errors.comment" class="error-message">{{ errors.comment }}</span>
            </div>

            <div v-if="nodeType === 'dateTime'" class="node-type-section">
              <div class="business-hours-header">
                <h3>
                  <span class="icon">📅</span>
                  Business Hours
                </h3>
                <p class="business-hours-description">
                  Allows a branch to be created based on date & time conditions. Use it to set business hours or date range conditions.
                </p>
              </div>
              
              <div class="timezone-selector">
                <label>Time Zone</label>
                <select v-model="editableData.timezone" class="select-field">
                  <option value="UTC">(GMT+00:00) UTC</option>
                  <option value="America/New_York">(GMT-05:00) America/New_York</option>
                  <option value="America/Los_Angeles">(GMT-08:00) America/Los_Angeles</option>
                  <option value="Europe/London">(GMT+00:00) Europe/London</option>
                  <option value="Asia/Singapore">(GMT+08:00) Asia/Singapore</option>
                </select>
              </div>
              
              <div class="business-hours-table">
                <div class="business-hours-table-header">
                  <div class="table-header-cell">Day</div>
                  <div class="table-header-cell">Time</div>
                </div>
                <div class="business-hours-table-body">
                  <div
                    v-for="(time, index) in businessHours"
                    :key="index"
                    class="business-hour-row"
                  >
                    <div class="table-cell day-cell">{{ getDayName(time.day) }}</div>
                    <div class="table-cell time-cell">
                      <div class="time-input-wrapper">
                        <span class="clock-icon">🕐</span>
                        <input
                          v-model="time.startTime"
                          type="time"
                          class="time-input"
                        />
                      </div>
                      <span class="time-separator">to</span>
                      <div class="time-input-wrapper">
                        <span class="clock-icon">🕐</span>
                        <input
                          v-model="time.endTime"
                          type="time"
                          class="time-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="nodeType === 'dateTimeConnector'" class="node-type-section">
              <p class="read-only-notice">
                This connector node is for display only and cannot be edited.
              </p>
            </div>
          </div>

          <div class="drawer-footer">
            <button
              v-if="nodeType !== 'dateTimeConnector'"
              type="button"
              class="btn btn-danger"
              @click="handleDelete"
            >
              Delete Node
            </button>
            <div class="footer-actions">
              <button type="button" class="btn btn-secondary" @click="close">
                Cancel
              </button>
              <button
                v-if="nodeType !== 'dateTimeConnector'"
                type="button"
                class="btn btn-primary"
                @click="handleSave"
                :disabled="isSaving"
              >
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useFlowChartStore } from '../stores/flowChartStore'
import { useRouter } from 'vue-router'
import {
  validateTitle,
  validateDescription,
  validateComment,
  validateTextMessage,
} from '../utils/helpers'

const props = defineProps({
  nodeId: {
    type: String,
    default: null,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const store = useFlowChartStore()
const router = useRouter()

const fileInput = ref(null)
const isSaving = ref(false)
const errors = reactive({})

const node = computed(() => {
  if (!props.nodeId || !store.payloadData) return null
  return store.payloadData.find(
    (n) => n.id?.toString() === props.nodeId || n.id === props.nodeId
  )
})

const nodeType = computed(() => node.value?.type || '')

const editableData = reactive({
  title: '',
  description: '',
  comment: '',
  timezone: 'UTC',
})

const textItems = ref([])
const attachments = ref([]) 
const businessHours = ref([])

const initializeData = () => {
  if (!node.value) return

  editableData.title = node.value.name || ''
  editableData.description = node.value.description || ''

  if (nodeType.value === 'sendMessage') {
    const payload = node.value.data?.payload || []
    textItems.value = payload
      .filter((item) => item.type === 'text')
      .map((item) => ({ ...item }))
    
    attachments.value = payload
      .filter((item) => item.type === 'attachment')
      .map((item) => {
        if (typeof item.attachment === 'string') {
          return {
            url: item.attachment,
            filename: item.filename || getAttachmentName(item.attachment)
          }
        }
        return {
          url: item.attachment.url || item.attachment,
          filename: item.attachment.filename || getAttachmentName(item.attachment.url || item.attachment)
        }
      })
  } else if (nodeType.value === 'addComment') {
    editableData.comment = node.value.data?.comment || ''
  } else if (nodeType.value === 'dateTime') {
    const tz = node.value.data?.timezone || 'UTC'
    editableData.timezone = getTimezoneDisplayValue(tz)
    businessHours.value = (node.value.data?.times || []).map((t) => ({ ...t }))
    
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    days.forEach((day) => {
      if (!businessHours.value.find((t) => t.day === day)) {
        businessHours.value.push({
          day,
          startTime: '09:00',
          endTime: '17:00',
        })
      }
    })
  }
}

const validateTitleField = () => {
  errors.title = validateTitle(editableData.title)
}

const validateDescriptionField = () => {
  errors.description = validateDescription(editableData.description)
}

const validateCommentField = () => {
  errors.comment = validateComment(editableData.comment)
}

const validateTextItem = (index) => {
  const item = textItems.value[index]
  if (item) {
    errors[`text-${index}`] = validateTextMessage(item.text)
  }
}

const addTextItem = () => {
  textItems.value.push({ type: 'text', text: '' })
}

const removeTextItem = (index) => {
  textItems.value.splice(index, 1)
  delete errors[`text-${index}`]
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      attachments.value.push({
        url: e.target.result,
        filename: file.name
      })
    }
    reader.readAsDataURL(file)
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeAttachment = (index) => {
  attachments.value.splice(index, 1)
}

const getAttachmentUrl = (attachment) => {
  if (!attachment) return ''
  if (typeof attachment === 'string') return attachment
  return attachment.url || attachment
}

const getAttachmentDisplayName = (attachment) => {
  if (!attachment) return 'Attachment'
  if (typeof attachment === 'object' && attachment.filename) {
    return attachment.filename
  }
  return getAttachmentName(getAttachmentUrl(attachment))
}

const isImage = (url) => {
  if (!url) return false
  if (url.startsWith('data:image')) return true
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i
  if (imageExtensions.test(url)) return true
  try {
    const urlObj = new URL(url)
    if (imageExtensions.test(urlObj.pathname)) return true
  } catch {
    if (imageExtensions.test(url)) return true
  }
  return false
}

const getAttachmentName = (url) => {
  if (!url) return 'Attachment'
  if (url.startsWith('data:')) {
    const mimeMatch = url.match(/data:([^;]+)/)
    if (mimeMatch) {
      const mimeType = mimeMatch[1]
      if (mimeType.includes('image')) {
        const ext = mimeType.split('/')[1] || 'image'
        return `image.${ext}`
      }
    }
    return 'attachment'
  }
  try {
    const urlObj = new URL(url)
    const filename = urlObj.pathname.split('/').pop()
    return filename.split('?')[0] || 'Attachment'
  } catch {
    const parts = url.split('/')
    const filename = parts[parts.length - 1] || url
    return filename.split('?')[0] || (url.length > 30 ? url.substring(0, 30) + '...' : url)
  }
}

const handleImageLoad = (event) => {
  event.target.style.display = 'block'
}

const handleImageError = (event) => {
  const img = event.target
  const container = img.closest('.attachment-preview')
  if (container) {
    const url = img.src
    img.style.display = 'none'
    if (!container.querySelector('.attachment-placeholder')) {
      const placeholder = document.createElement('div')
      placeholder.className = 'attachment-placeholder'
      const attachmentIndex = Array.from(container.parentElement.children).indexOf(container)
      const attachment = attachments.value[attachmentIndex]
      const displayName = getAttachmentDisplayName(attachment || url)
      placeholder.innerHTML = `
        <span>📎</span>
        <span class="attachment-url">${displayName}</span>
      `
      container.appendChild(placeholder)
    }
  }
}

const getDayName = (day) => {
  const days = {
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun',
  }
  return days[day] || day
}

const getTimezoneDisplayValue = (timezone) => {
  const timezoneMap = {
    'UTC': '(GMT+00:00) UTC',
    'America/New_York': '(GMT-05:00) America/New_York',
    'America/Los_Angeles': '(GMT-08:00) America/Los_Angeles',
    'Europe/London': '(GMT+00:00) Europe/London',
    'Asia/Singapore': '(GMT+08:00) Asia/Singapore',
  }
  return timezoneMap[timezone] || `(GMT+00:00) ${timezone}`
}

const handleSave = async () => {
  Object.keys(errors).forEach((key) => delete errors[key])

  validateTitleField()
  validateDescriptionField()

  if (nodeType.value === 'addComment') {
    validateCommentField()
  }

  if (nodeType.value === 'sendMessage') {
    textItems.value.forEach((_, index) => validateTextItem(index))
  }

  if (Object.keys(errors).some((key) => errors[key])) {
    return
  }

  isSaving.value = true

  try {
    const updates = {
      name: editableData.title,
      description: editableData.description,
    }

    if (nodeType.value === 'sendMessage') {
      const payload = [
        ...textItems.value,
        ...attachments.value.map((attachment) => ({
          type: 'attachment',
          attachment: getAttachmentUrl(attachment),
          filename: typeof attachment === 'object' ? attachment.filename : undefined,
        })),
      ]
      updates.data = {
        ...node.value.data,
        payload,
      }
    } else if (nodeType.value === 'addComment') {
      updates.data = {
        ...node.value.data,
        comment: editableData.comment,
      }
    } else if (nodeType.value === 'dateTime') {
      const timezoneValue = editableData.timezone.split(') ').pop() || editableData.timezone
      updates.data = {
        ...node.value.data,
        times: businessHours.value,
        timezone: timezoneValue,
      }
    }

    store.updateNode(node.value.id, updates)
    close()
  } catch (error) {
    console.error('Error saving node:', error)
  } finally {
    isSaving.value = false
  }
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this node?')) {
    store.deleteNode(node.value.id)
    close()
  }
}

const close = () => {
  emit('close')
  router.push({ name: 'flowchart' })
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    initializeData()
  }
})

watch(() => props.nodeId, () => {
  if (props.isOpen) {
    initializeData()
  }
})

onMounted(() => {
  if (props.isOpen) {
    initializeData()
  }
})
</script>

<style scoped>
@import '../styles/NodeDetailsDrawer.css';
</style>

