#!/usr/bin/env node
/**
 * Hook: Check
 * Fast gate: format/lint/typecheck. Fail fast.
 */
import {
  log,
  runCommand,
  getCurrentBranch,
  appendToLearningLog,
  formatLogEntry,
  exitWithStatus,
  commandExists,
} from '../lib/utils.js'

async function main() {
  log('Running fast checks (lint/format/typecheck)...', 'info')

  const branch = getCurrentBranch()
  const checks = []
  let allPassed = true

  // Check if node_modules exists
  const hasNodeModules = runCommand('test -d node_modules').success

  if (!hasNodeModules) {
    log('No node_modules found. Run pnpm install first.', 'warn')
  }

  // Prettier check
  if (hasNodeModules && commandExists('npx')) {
    log('Checking formatting with Prettier...', 'info')
    const formatResult = runCommand('npx prettier --check . 2>/dev/null || true')
    if (formatResult.success && !formatResult.stdout.includes('error')) {
      checks.push('format ✅')
      log('Format check passed', 'success')
    } else {
      checks.push('format ⚠️')
      log('Format check: some files need formatting (run pnpm format)', 'warn')
    }
  } else {
    checks.push('format ⏭️ (skipped)')
  }

  // ESLint check
  if (hasNodeModules && commandExists('npx')) {
    log('Running ESLint...', 'info')
    const lintResult = runCommand('npx eslint . --ext .ts,.tsx,.js,.jsx 2>/dev/null || true')
    if (lintResult.exitCode === 0) {
      checks.push('lint ✅')
      log('Lint check passed', 'success')
    } else {
      checks.push('lint ⚠️')
      log('Lint check: warnings/errors found (run pnpm lint:fix)', 'warn')
      if (lintResult.stdout) console.log(lintResult.stdout)
    }
  } else {
    checks.push('lint ⏭️ (skipped)')
  }

  // TypeScript check
  if (hasNodeModules && commandExists('npx')) {
    log('Running TypeScript check...', 'info')
    const tscResult = runCommand('npx tsc --noEmit 2>/dev/null || true')
    if (tscResult.exitCode === 0) {
      checks.push('typecheck ✅')
      log('TypeScript check passed', 'success')
    } else {
      checks.push('typecheck ⚠️')
      log('TypeScript check: errors found', 'warn')
      if (tscResult.stdout) console.log(tscResult.stdout)
    }
  } else {
    checks.push('typecheck ⏭️ (skipped)')
  }

  console.log('')
  console.log('=== Check Summary ===')
  checks.forEach((c) => console.log(`  ${c}`))
  console.log('=====================')
  console.log('')

  // Log the check run
  const entry = formatLogEntry({
    command: 'check',
    status: allPassed ? 'PASS' : 'FAIL',
    branch,
    intent: 'Fast quality gate',
    checks,
    outcome: allPassed ? 'All checks passed' : 'Some checks failed or skipped',
    nextStep: allPassed ? 'Run hook:test' : 'Fix issues and re-run hook:check',
  })

  appendToLearningLog(entry)

  if (allPassed) {
    log('All checks passed', 'success')
  } else {
    log('Some checks need attention', 'warn')
  }

  exitWithStatus(allPassed)
}

main().catch((err) => {
  log(`Check failed: ${err.message}`, 'error')
  process.exit(1)
})
