import { describe, it, expect } from 'vitest'
import {
  generateId,
  validateTitle,
  validateDescription,
  validateComment,
  validateTextMessage,
  formatTime,
  parseTime,
  getNodeIcon,
} from './helpers'

describe('helpers', () => {
  describe('generateId', () => {
    it('should generate a unique ID', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).toBeTruthy()
      expect(id2).toBeTruthy()
      expect(id1).not.toBe(id2)
    })
  })

  describe('validateTitle', () => {
    it('should return error for empty title', () => {
      expect(validateTitle('')).toBe('Title is required')
      expect(validateTitle('   ')).toBe('Title is required')
    })

    it('should return error for title longer than 100 characters', () => {
      const longTitle = 'a'.repeat(101)
      expect(validateTitle(longTitle)).toBe('Title must be less than 100 characters')
    })

    it('should return null for valid title', () => {
      expect(validateTitle('Valid Title')).toBeNull()
      expect(validateTitle('a'.repeat(100))).toBeNull()
    })
  })

  describe('validateDescription', () => {
    it('should return null for empty description', () => {
      expect(validateDescription('')).toBeNull()
    })

    it('should return error for description longer than 500 characters', () => {
      const longDesc = 'a'.repeat(501)
      expect(validateDescription(longDesc)).toBe('Description must be less than 500 characters')
    })

    it('should return null for valid description', () => {
      expect(validateDescription('Valid description')).toBeNull()
      expect(validateDescription('a'.repeat(500))).toBeNull()
    })
  })

  describe('validateComment', () => {
    it('should return error for empty comment', () => {
      expect(validateComment('')).toBe('Comment is required')
      expect(validateComment('   ')).toBe('Comment is required')
    })

    it('should return error for comment longer than 1000 characters', () => {
      const longComment = 'a'.repeat(1001)
      expect(validateComment(longComment)).toBe('Comment must be less than 1000 characters')
    })

    it('should return null for valid comment', () => {
      expect(validateComment('Valid comment')).toBeNull()
      expect(validateComment('a'.repeat(1000))).toBeNull()
    })
  })

  describe('validateTextMessage', () => {
    it('should return null for empty text', () => {
      expect(validateTextMessage('')).toBeNull()
    })

    it('should return error for text longer than 2000 characters', () => {
      const longText = 'a'.repeat(2001)
      expect(validateTextMessage(longText)).toBe('Text message must be less than 2000 characters')
    })

    it('should return null for valid text', () => {
      expect(validateTextMessage('Valid text')).toBeNull()
      expect(validateTextMessage('a'.repeat(2000))).toBeNull()
    })
  })

  describe('formatTime', () => {
    it('should return the time string', () => {
      expect(formatTime('09:00')).toBe('09:00')
      expect(formatTime('17:30')).toBe('17:30')
    })

    it('should return default for empty time', () => {
      expect(formatTime('')).toBe('00:00')
      expect(formatTime(null)).toBe('00:00')
    })
  })

  describe('parseTime', () => {
    it('should parse time string correctly', () => {
      expect(parseTime('09:00')).toEqual({ hours: 9, minutes: 0 })
      expect(parseTime('17:30')).toEqual({ hours: 17, minutes: 30 })
    })

    it('should handle invalid time strings', () => {
      expect(parseTime('invalid')).toEqual({ hours: 0, minutes: 0 })
    })
  })

  describe('getNodeIcon', () => {
    it('should return correct icon for each node type', () => {
      expect(getNodeIcon('trigger')).toBe('⚡')
      expect(getNodeIcon('sendMessage')).toBe('📤')
      expect(getNodeIcon('addComment')).toBe('💬')
      expect(getNodeIcon('dateTime')).toBe('📅')
      expect(getNodeIcon('dateTimeConnector')).toBe('🔗')
    })

    it('should return default icon for unknown type', () => {
      expect(getNodeIcon('unknown')).toBe('📦')
    })
  })
})

