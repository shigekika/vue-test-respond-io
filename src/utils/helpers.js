export function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export function validateTitle(title) {
  if (!title || (typeof title === 'string' && title.trim().length === 0)) {
    return 'Title is required'
  }
  const titleStr = String(title || '')
  if (titleStr.length > 100) {
    return 'Title must be less than 100 characters'
  }
  return null
}

export function validateDescription(description) {
  if (description && description.length > 500) {
    return 'Description must be less than 500 characters'
  }
  return null
}

export function validateComment(comment) {
  if (!comment || (typeof comment === 'string' && comment.trim().length === 0)) {
    return 'Comment is required'
  }
  const commentStr = String(comment || '')
  if (commentStr.length > 1000) {
    return 'Comment must be less than 1000 characters'
  }
  return null
}

export function validateTextMessage(text) {
  if (text && text.length > 2000) {
    return 'Text message must be less than 2000 characters'
  }
  return null
}

export function formatTime(time) {
  return time || '00:00'
}

export function parseTime(timeString) {
  const [hours, minutes] = timeString.split(':')
  return {
    hours: parseInt(hours, 10) || 0,
    minutes: parseInt(minutes, 10) || 0,
  }
}

export function getNodeIcon(type) {
  const icons = {
    trigger: '⚡',
    sendMessage: '📤',
    addComment: '💬',
    dateTime: '📅',
    dateTimeConnector: '🔗',
  }
  return icons[type] || '📦'
}

