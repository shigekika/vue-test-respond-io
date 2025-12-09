<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="isOpen" class="dialog-overlay" @click.self="close">
        <div class="dialog-content" role="dialog" aria-labelledby="dialog-title">
          <div class="dialog-header">
            <h2 id="dialog-title">Create New Node</h2>
            <button class="dialog-close" @click="close" aria-label="Close dialog">
              ×
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="dialog-form">
            <div class="form-group">
              <label for="title">Title *</label>
              <input
                id="title"
                v-model="formData.title"
                type="text"
                required
                :class="{ 'error': errors.title }"
                @blur="validateTitle"
                placeholder="Enter node title"
              />
              <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                id="description"
                v-model="formData.description"
                :class="{ 'error': errors.description }"
                @blur="validateDescription"
                placeholder="Enter node description"
                rows="3"
              />
              <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
            </div>

            <div class="form-group">
              <label for="type">Type of Node *</label>
              <select
                id="type"
                v-model="formData.type"
                required
                class="select-field"
              >
                <option value="">Select a type</option>
                <option value="sendMessage">Send Message</option>
                <option value="addComment">Add Comments</option>
                <option value="dateTime">Business Hours</option>
              </select>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="close">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                {{ isSubmitting ? 'Creating...' : 'Create Node' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useFlowChartStore } from '../stores/flowChartStore'
import { validateTitle, validateDescription } from '../utils/helpers'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'created'])

const store = useFlowChartStore()

const formData = reactive({
  title: '',
  description: '',
  type: '',
})

const errors = reactive({
  title: null,
  description: null,
})

const isSubmitting = ref(false)

const resetForm = () => {
  formData.title = ''
  formData.description = ''
  formData.type = ''
  errors.title = null
  errors.description = null
}

const validateTitleField = () => {
  errors.title = validateTitle(formData.title)
}

const validateDescriptionField = () => {
  errors.description = validateDescription(formData.description)
}

const close = () => {
  resetForm()
  emit('close')
}

const handleSubmit = async () => {
  validateTitleField()
  validateDescriptionField()

  if (errors.title || errors.description) {
    return
  }

  isSubmitting.value = true

  try {
    const nodeData = {
      title: String(formData.title || '').trim(),
      description: String(formData.description || '').trim(),
      type: formData.type,
      data: getDefaultDataForType(formData.type),
    }

    store.createNode(nodeData)
    emit('created')
    close()
  } catch (error) {
    console.error('Error creating node:', error)
  } finally {
    isSubmitting.value = false
  }
}

const getDefaultDataForType = (type) => {
  switch (type) {
    case 'sendMessage':
      return { payload: [{ type: 'text', text: '' }] }
    case 'addComment':
      return { comment: '' }
    case 'dateTime':
      return {
        times: [],
        connectors: [],
        timezone: 'UTC',
        action: 'businessHours',
      }
    default:
      return {}
  }
}

watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>

<style scoped>
@import '../styles/CreateNodeDialog.css';
</style>

