#!/usr/bin/env node
/**
 * Hook: Plan
 * Record a micro-plan (3-7 bullets) + test strategy
 */
import {
  log,
  getCurrentBranch,
  appendToLearningLog,
  formatLogEntry,
  getIntent,
} from '../lib/utils.js'

async function main() {
  log('Recording micro-plan...', 'info')

  const branch = getCurrentBranch()
  const intent = getIntent() || process.argv[2] || ''

  console.log('')
  console.log('=== Micro-Plan Template ===')
  console.log('')
  console.log('Create a plan with 3-7 bullets covering:')
  console.log('1. What you are implementing')
  console.log('2. Key files to modify')
  console.log('3. Test strategy (what tests to write/run)')
  console.log('4. Verification steps')
  console.log('5. Rollback plan (if applicable)')
  console.log('')
  console.log('Example Plan:')
  console.log('- [ ] Implement user authentication endpoint')
  console.log('- [ ] Add input validation with zod')
  console.log('- [ ] Write unit tests for auth service')
  console.log('- [ ] Test manually with curl')
  console.log('- [ ] Run full test suite before commit')
  console.log('')
  console.log('===========================')

  // Log the plan run
  const entry = formatLogEntry({
    command: 'plan',
    status: 'PASS',
    branch,
    intent: intent || 'Create micro-plan',
    outcome: 'Plan template displayed',
    nextStep: 'Implement the plan items one by one',
  })

  appendToLearningLog(entry)
  log('Plan template generated. Customize for your task.', 'success')
}

main().catch((err) => {
  log(`Plan failed: ${err.message}`, 'error')
  process.exit(1)
})
