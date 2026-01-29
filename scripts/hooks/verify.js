#!/usr/bin/env node
/**
 * Hook: Verify
 * Full confidence run (format + lint + typecheck + test). Non-zero on failure.
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
  log('Running full verification...', 'info')

  const branch = getCurrentBranch()
  const changedFiles = getChangedFiles()
  const checks = []
  let allPassed = true

  // Check if node_modules exists
  const hasNodeModules = runCommand('test -d node_modules').success

  if (!hasNodeModules) {
    log('No node_modules found. Run pnpm install first.', 'error')
    const entry = formatLogEntry({
      command: 'verify',
      status: 'FAIL',
      branch,
      intent: 'Full verification',
      filesChanged: changedFiles,
      failureSummary: 'node_modules not found',
      nextStep: 'Run pnpm install',
    })
    appendToLearningLog(entry)
    exitWithStatus(false)
    return
  }

  // 1. Format check
  log('Checking formatting...', 'info')
  const formatResult = runCommand('npx prettier --check .')
  if (formatResult.exitCode === 0) {
    checks.push('format ✅')
    log('Format: passed', 'success')
  } else {
    checks.push('format ❌')
    log('Format: failed', 'fail')
    allPassed = false
  }

  // 2. Lint check
  log('Running linter...', 'info')
  const lintResult = runCommand('npx eslint . --ext .ts,.tsx,.js,.jsx')
  if (lintResult.exitCode === 0) {
    checks.push('lint ✅')
    log('Lint: passed', 'success')
  } else {
    checks.push('lint ❌')
    log('Lint: failed', 'fail')
    console.log(lintResult.stdout)
    allPassed = false
  }

  // 3. TypeScript check
  log('Running TypeScript check...', 'info')
  const tscResult = runCommand('npx tsc --noEmit')
  if (tscResult.exitCode === 0) {
    checks.push('typecheck ✅')
    log('TypeScript: passed', 'success')
  } else {
    checks.push('typecheck ❌')
    log('TypeScript: failed', 'fail')
    console.log(tscResult.stdout)
    allPassed = false
  }

  // 4. Tests
  log('Running tests...', 'info')
  const testResult = runCommand('npx vitest run', { timeout: 120000 })
  if (testResult.exitCode === 0) {
    checks.push('tests ✅')
    log('Tests: passed', 'success')
  } else {
    checks.push('tests ❌')
    log('Tests: failed', 'fail')
    console.log(testResult.stdout)
    allPassed = false
  }

  console.log('')
  console.log('=== Verification Summary ===')
  checks.forEach((c) => console.log(`  ${c}`))
  console.log(`\nOverall: ${allPassed ? 'PASS ✅' : 'FAIL ❌'}`)
  console.log('============================')
  console.log('')

  // Log the verify run
  const entry = formatLogEntry({
    command: 'verify',
    status: allPassed ? 'PASS' : 'FAIL',
    branch,
    intent: 'Full verification',
    filesChanged: changedFiles,
    checks,
    tests: checks.find((c) => c.includes('tests')) || 'not run',
    outcome: allPassed ? 'All verifications passed' : 'Verification failed',
    failureSummary: allPassed ? '' : 'One or more checks failed',
    nextStep: allPassed ? 'Ready to commit/push' : 'Fix failures and re-run hook:verify',
  })

  appendToLearningLog(entry)

  if (allPassed) {
    log('Full verification passed - ready to commit', 'success')
  } else {
    log('Verification failed - fix issues before committing', 'fail')
  }

  exitWithStatus(allPassed)
}

main().catch((err) => {
  log(`Verify failed: ${err.message}`, 'error')
  process.exit(1)
})
