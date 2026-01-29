#!/usr/bin/env node
/**
 * Hook: Iterate
 * The main loop: preflight → check → test → summarize → log next step
 */
import {
  log,
  runCommand,
  getCurrentBranch,
  getChangedFiles,
  getGitStatus,
  appendToLearningLog,
  formatLogEntry,
  exitWithStatus,
  getIntent,
} from '../lib/utils.js'

async function main() {
  log('Running iteration loop...', 'info')
  console.log('')

  const branch = getCurrentBranch()
  const changedFiles = getChangedFiles()
  const intent = getIntent() || 'Iteration loop'
  const checks = []
  let allPassed = true

  // === PREFLIGHT ===
  console.log('=== Step 1: Preflight ===')
  console.log(`Branch: ${branch}`)
  console.log(`Changed files: ${changedFiles.length}`)
  if (changedFiles.length > 0) {
    changedFiles.slice(0, 5).forEach((f) => console.log(`  - ${f}`))
    if (changedFiles.length > 5) {
      console.log(`  ... and ${changedFiles.length - 5} more`)
    }
  }
  console.log('')

  // Check for node_modules
  const hasNodeModules = runCommand('test -d node_modules').success
  if (!hasNodeModules) {
    log('No node_modules found. Skipping checks that require dependencies.', 'warn')
    console.log('')
  }

  // === CHECK ===
  console.log('=== Step 2: Quick Checks ===')

  if (hasNodeModules) {
    // Format
    const formatResult = runCommand('npx prettier --check . 2>/dev/null')
    if (formatResult.exitCode === 0) {
      checks.push('format ✅')
      log('Format: OK', 'success')
    } else {
      checks.push('format ⚠️')
      log('Format: needs attention', 'warn')
    }

    // Lint
    const lintResult = runCommand('npx eslint . --ext .ts,.tsx,.js,.jsx 2>/dev/null')
    if (lintResult.exitCode === 0) {
      checks.push('lint ✅')
      log('Lint: OK', 'success')
    } else {
      checks.push('lint ⚠️')
      log('Lint: has warnings/errors', 'warn')
    }

    // TypeScript
    const tscResult = runCommand('npx tsc --noEmit 2>/dev/null')
    if (tscResult.exitCode === 0) {
      checks.push('typecheck ✅')
      log('TypeScript: OK', 'success')
    } else {
      checks.push('typecheck ⚠️')
      log('TypeScript: has errors', 'warn')
    }
  } else {
    checks.push('checks ⏭️ (no node_modules)')
  }
  console.log('')

  // === TEST ===
  console.log('=== Step 3: Tests ===')
  let testStatus = 'skipped'

  if (hasNodeModules) {
    const testResult = runCommand('npx vitest run 2>&1', { timeout: 120000 })
    if (testResult.exitCode === 0) {
      testStatus = 'vitest ✅'
      log('Tests: PASSED', 'success')
    } else {
      testStatus = 'vitest ❌'
      log('Tests: FAILED', 'fail')
      allPassed = false
      // Show last few lines of output
      const lines = testResult.stdout.split('\n').slice(-10)
      lines.forEach((l) => console.log(l))
    }
  } else {
    testStatus = 'tests ⏭️ (no node_modules)'
    log('Tests: skipped', 'warn')
  }
  console.log('')

  // === SUMMARY ===
  console.log('=== Iteration Summary ===')
  console.log(`Branch: ${branch}`)
  console.log(`Intent: ${intent}`)
  console.log(`Files changed: ${changedFiles.length}`)
  console.log('Checks:')
  checks.forEach((c) => console.log(`  ${c}`))
  console.log(`Tests: ${testStatus}`)
  console.log(`Status: ${allPassed ? 'READY ✅' : 'NEEDS WORK ⚠️'}`)
  console.log('')

  const nextStep = allPassed
    ? 'Run hook:verify for full verification, then commit'
    : 'Fix failing checks/tests, then re-run hook:iterate'

  console.log(`Next step: ${nextStep}`)
  console.log('=========================')
  console.log('')

  // Log the iteration
  const entry = formatLogEntry({
    command: 'iterate',
    status: allPassed ? 'PASS' : 'FAIL',
    branch,
    intent,
    filesChanged: changedFiles,
    checks,
    tests: testStatus,
    outcome: allPassed ? 'Iteration passed' : 'Issues found during iteration',
    nextStep,
  })

  appendToLearningLog(entry)

  exitWithStatus(allPassed)
}

main().catch((err) => {
  log(`Iterate failed: ${err.message}`, 'error')
  process.exit(1)
})
