import { describe, expect, it } from 'vitest'

describe('ambiente de testes', () => {
  it('executa com jsdom', () => {
    expect(typeof document).toBe('object')
    expect(sessionStorage.length).toBe(0)
  })
})
