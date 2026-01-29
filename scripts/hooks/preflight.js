#!/usr/bin/env node
/**
 * Hook: Preflight
 * Collect branch/status/changed files + record intent
 */
import {
  log,
  getCurrentBranch,
  getChangedFiles,
  getGitStatus,
  appendToLearningLog,
  formatLogEntry,
  getIntent,
} from '../lib/utils.js'

async function main() {
  log('Running preflight check...', 'info')

  const branch = getCurrentBranch()
  const changedFiles = getChangedFiles()
  const status = getGitStatus()
  const intent = getIntent()

  console.log('')
  console.log('=== Preflight Summary ===')
  console.log(`Branch: ${branch}`)
  console.log(`Changed files: ${changedFiles.length}`)

  if (changedFiles.length > 0) {
    changedFiles.forEach((f) => console.log(`  - ${f}`))
  }

  if (status) {
    console.log('\nGit Status:')
    console.log(status)
  }

  if (intent) {
    console.log(`\nIntent: ${intent}`)
  }

  console.log('=========================')
  console.log('')

  // Log the preflight run
  const entry = formatLogEntry({
    command: 'preflight',
    status: 'PASS',
    branch,
    intent: intent || 'Preflight check',
    filesChanged: changedFiles,
    outcome: `Found ${changedFiles.length} changed file(s)`,
    nextStep: 'Run hook:plan to create micro-plan',
  })

  appendToLearningLog(entry)
  log('Preflight complete. Entry logged.', 'success')
}

main().catch((err) => {
  log(`Preflight failed: ${err.message}`, 'error')
  process.exit(1)
})
