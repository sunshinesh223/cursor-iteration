#!/usr/bin/env node
/**
 * Hook: Test
 * Run focused tests (repo-defined)
 */
import {
  log,
  runCommand,
  getCurrentBranch,
  getChangedFiles,
  appendToLearningLog,
  formatLogEntry,
  exitWithStatus,
} from '../lib/utils.js'

async function main() {
  log('Running tests...', 'info')

  const branch = getCurrentBranch()
  const changedFiles = getChangedFiles()

  // Check if node_modules exists
  const hasNodeModules = runCommand('test -d node_modules').success

  if (!hasNodeModules) {
    log('No node_modules found. Run pnpm install first.', 'warn')
    const entry = formatLogEntry({
      command: 'test',
      status: 'FAIL',
      branch,
      intent: 'Run focused tests',
      filesChanged: changedFiles,
      failureSummary: 'node_modules not found',
      nextStep: 'Run pnpm install',
    })
    appendToLearningLog(entry)
    exitWithStatus(false)
    return
  }

  log('Running vitest...', 'info')
  const testResult = runCommand('npx vitest run 2>&1', { timeout: 120000 })

  console.log('')
  console.log('=== Test Output ===')
  if (testResult.stdout) {
    console.log(testResult.stdout)
  }
  if (testResult.stderr) {
    console.log(testResult.stderr)
  }
  console.log('===================')
  console.log('')

  const passed = testResult.exitCode === 0

  // Log the test run
  const entry = formatLogEntry({
    command: 'test',
    status: passed ? 'PASS' : 'FAIL',
    branch,
    intent: 'Run focused tests',
    filesChanged: changedFiles,
    tests: passed ? 'vitest ✅' : 'vitest ❌',
    outcome: passed ? 'All tests passed' : 'Some tests failed',
    failureSummary: passed ? '' : 'Test failures detected',
    nextStep: passed ? 'Run hook:verify for full verification' : 'Fix failing tests',
  })

  appendToLearningLog(entry)

  if (passed) {
    log('All tests passed', 'success')
  } else {
    log('Tests failed', 'fail')
  }

  exitWithStatus(passed)
}

main().catch((err) => {
  log(`Test hook failed: ${err.message}`, 'error')
  process.exit(1)
})
