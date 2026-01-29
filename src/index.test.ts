import { describe, it, expect } from 'vitest'
import { VERSION, getVersion } from './index.js'

describe('index', () => {
  describe('VERSION', () => {
    it('should be defined', () => {
      expect(VERSION).toBeDefined()
    })

    it('should be a valid semver string', () => {
      expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/)
    })
  })

  describe('getVersion', () => {
    it('should return the VERSION', () => {
      expect(getVersion()).toBe(VERSION)
    })

    it('should return a string', () => {
      expect(typeof getVersion()).toBe('string')
    })
  })
})
