#!/usr/bin/env node
/**
 * Hook: Reflect
 * Capture what worked/failed + "rule we should adopt"
 */
import {
  log,
  getCurrentBranch,
  getChangedFiles,
  appendToLearningLog,
  formatLogEntry,
  getIntent,
} from '../lib/utils.js'

async function main() {
  log('Running reflection...', 'info')

  const branch = getCurrentBranch()
  const changedFiles = getChangedFiles()
  const intent = getIntent() || process.argv[2] || ''

  console.log('')
  console.log('=== Reflection Template ===')
  console.log('')
  console.log('Answer these questions:')
  console.log('')
  console.log('1. What worked well?')
  console.log('   - Which approaches were effective?')
  console.log('   - What saved time?')
  console.log('')
  console.log("2. What didn't work?")
  console.log('   - What caused delays or issues?')
  console.log('   - What assumptions were wrong?')
  console.log('')
  console.log('3. What rule should we adopt?')
  console.log('   - Pattern to follow in the future')
  console.log('   - Anti-pattern to avoid')
  console.log('')
  console.log('Example Reflection:')
  console.log('- Worked: Writing tests first caught edge cases early')
  console.log('- Failed: Assumed API would handle nulls, but it throws')
  console.log('- Rule: Always test null/undefined inputs for external APIs')
  console.log('')
  console.log('===========================')
  console.log('')

  // Log the reflection
  const entry = formatLogEntry({
    command: 'reflect',
    status: 'PASS',
    branch,
    intent: intent || 'Session reflection',
    filesChanged: changedFiles,
    outcome: 'Reflection template generated',
    nextStep: 'Document learnings and update guardrails if needed',
  })

  appendToLearningLog(entry)
  log('Reflection complete. Update guardrails with new rules.', 'success')
}

main().catch((err) => {
  log(`Reflect failed: ${err.message}`, 'error')
  process.exit(1)
})
