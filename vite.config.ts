import { loadEnv, type Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

/**
 * GitHub Pages não conhece as rotas do React Router: para um endereço como
 * /Central-do-Alfabeto-FrontEnd/PlayerMenu ele devolve o 404.html. Quando o site é
 * publicado em um subcaminho (base diferente de "/"), o 404.html é uma cópia do
 * index.html e o app assume a rota.
 */
function spaFallback404(): Plugin {
  let base = '/'
  let indexHtml = ''

  return {
    name: 'spa-fallback-404',
    enforce: 'post',
    apply: 'build',
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        indexHtml = html
        return html
      },
    },
    generateBundle() {
      if (base === '/' || base === './' || !indexHtml) return
      this.emitFile({ type: 'asset', fileName: '404.html', source: indexHtml })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')

  return {
    // VITE_BASE_PATH define o subcaminho do deploy (ex.: /Central-do-Alfabeto-FrontEnd/).
    // A flag --base da linha de comando tem prioridade sobre esta configuração.
    base: env.VITE_BASE_PATH || '/',
    plugins: [react(), spaFallback404()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      clearMocks: true,
      // Ambiente fixo: o .env local não influencia os testes. Cada teste declara o modo
      // de que precisa com vi.stubEnv (VITE_API_URL vazio = modo demonstração).
      env: { VITE_API_URL: '', VITE_SPEECH_ENGINE: '', VITE_BASE_PATH: '' },
      unstubEnvs: true,
      pool: 'threads' as const,
    },
  }
})
