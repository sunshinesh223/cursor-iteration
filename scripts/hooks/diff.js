#!/usr/bin/env node
/**
 * Hook: Diff Summary
 * Human-readable summary of changes (for PR/review)
 */
import {
  log,
  runCommand,
  getCurrentBranch,
  getChangedFiles,
  appendToLearningLog,
  formatLogEntry,
} from '../lib/utils.js'

async function main() {
  log('Generating diff summary...', 'info')

  const branch = getCurrentBranch()
  const changedFiles = getChangedFiles()

  // Get diff stats
  const diffStat = runCommand('git diff --stat HEAD~1 2>/dev/null || git diff --stat')
  const diffStatOutput = diffStat.stdout || 'No diff available'

  // Get commit messages since divergence from main
  const commits = runCommand('git log --oneline main..HEAD 2>/dev/null || git log --oneline -5')
  const commitLog = commits.stdout || 'No commits to show'

  // Categorize files by type
  const filesByType = {
    source: [],
    test: [],
    config: [],
    docs: [],
    other: [],
  }

  changedFiles.forEach((f) => {
    if (f.includes('test') || f.includes('spec')) {
      filesByType.test.push(f)
    } else if (f.endsWith('.md') || f.startsWith('docs/')) {
      filesByType.docs.push(f)
    } else if (
      f.includes('config') ||
      f.endsWith('.json') ||
      f.endsWith('.yaml') ||
      f.endsWith('.yml')
    ) {
      filesByType.config.push(f)
    } else if (f.endsWith('.ts') || f.endsWith('.js') || f.endsWith('.tsx') || f.endsWith('.jsx')) {
      filesByType.source.push(f)
    } else {
      filesByType.other.push(f)
    }
  })

  console.log('')
  console.log('=== Diff Summary ===')
  console.log('')
  console.log(`Branch: ${branch}`)
  console.log(`Total files changed: ${changedFiles.length}`)
  console.log('')

  if (filesByType.source.length > 0) {
    console.log(`Source files (${filesByType.source.length}):`)
    filesByType.source.forEach((f) => console.log(`  - ${f}`))
    console.log('')
  }

  if (filesByType.test.length > 0) {
    console.log(`Test files (${filesByType.test.length}):`)
    filesByType.test.forEach((f) => console.log(`  - ${f}`))
    console.log('')
  }

  if (filesByType.config.length > 0) {
    console.log(`Config files (${filesByType.config.length}):`)
    filesByType.config.forEach((f) => console.log(`  - ${f}`))
    console.log('')
  }

  if (filesByType.docs.length > 0) {
    console.log(`Documentation (${filesByType.docs.length}):`)
    filesByType.docs.forEach((f) => console.log(`  - ${f}`))
    console.log('')
  }

  console.log('Diff Stats:')
  console.log(diffStatOutput)
  console.log('')

  if (commitLog && commitLog !== 'No commits to show') {
    console.log('Recent Commits:')
    console.log(commitLog)
    console.log('')
  }

  console.log('====================')
  console.log('')

  // Log the diff summary
  const entry = formatLogEntry({
    command: 'diff',
    status: 'PASS',
    branch,
    intent: 'Generate diff summary',
    filesChanged: changedFiles,
    outcome: `Summarized ${changedFiles.length} changed files`,
    nextStep: 'Use this summary for PR description',
  })

  appendToLearningLog(entry)
  log('Diff summary generated.', 'success')
}

main().catch((err) => {
  log(`Diff failed: ${err.message}`, 'error')
  process.exit(1)
})
