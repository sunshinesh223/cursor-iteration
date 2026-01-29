#!/usr/bin/env node
/**
 * Hook: PR Notes
 * Generate PR description (what/why/tests/risks/rollback)
 */
import {
  log,
  runCommand,
  getCurrentBranch,
  getChangedFiles,
  appendToLearningLog,
  formatLogEntry,
  getIntent,
} from '../lib/utils.js'

async function main() {
  log('Generating PR notes...', 'info')

  const branch = getCurrentBranch()
  const changedFiles = getChangedFiles()
  const intent = getIntent() || ''

  // Get commit messages
  const commits = runCommand('git log --oneline main..HEAD 2>/dev/null || git log --oneline -5')
  const commitLog = commits.stdout || ''

  // Get diff stat
  const diffStat = runCommand('git diff --stat main...HEAD 2>/dev/null || git diff --stat HEAD~1')
  const stats = diffStat.stdout || ''

  // Count file types
  const sourceFiles = changedFiles.filter(
    (f) => f.endsWith('.ts') || f.endsWith('.js') || f.endsWith('.tsx') || f.endsWith('.jsx')
  )
  const testFiles = changedFiles.filter((f) => f.includes('test') || f.includes('spec'))
  const docFiles = changedFiles.filter((f) => f.endsWith('.md'))

  console.log('')
  console.log('=== PR Notes Template ===')
  console.log('')
  console.log('Copy this template and fill in the details:')
  console.log('')
  console.log('---')
  console.log('')
  console.log('## Summary')
  console.log('')
  console.log(`> Branch: \`${branch}\``)
  if (intent) {
    console.log(`> Intent: ${intent}`)
  }
  console.log('')
  console.log('### What')
  console.log('- [ ] Describe what this PR does')
  console.log('- [ ] List main changes')
  console.log('')
  console.log('### Why')
  console.log('- [ ] Explain the motivation')
  console.log('- [ ] Link to issue/ticket if applicable')
  console.log('')
  console.log('## Changes')
  console.log('')
  console.log(`- ${sourceFiles.length} source file(s)`)
  console.log(`- ${testFiles.length} test file(s)`)
  console.log(`- ${docFiles.length} documentation file(s)`)
  console.log('')

  if (commitLog) {
    console.log('### Commits')
    console.log('```')
    console.log(commitLog)
    console.log('```')
    console.log('')
  }

  console.log('## Test Plan')
  console.log('')
  console.log('- [ ] Unit tests pass (`pnpm test`)')
  console.log('- [ ] Manual testing completed')
  console.log('- [ ] Edge cases verified')
  console.log('')
  console.log('## Risks')
  console.log('')
  console.log('- [ ] No breaking changes')
  console.log('- [ ] No security concerns')
  console.log('- [ ] No performance impact')
  console.log('')
  console.log('## Rollback Plan')
  console.log('')
  console.log('If issues occur:')
  console.log('1. Revert this PR')
  console.log('2. Investigate root cause')
  console.log('3. Fix and re-submit')
  console.log('')
  console.log('---')
  console.log('')
  console.log('=========================')
  console.log('')

  // Log the PR notes generation
  const entry = formatLogEntry({
    command: 'prnotes',
    status: 'PASS',
    branch,
    intent: intent || 'Generate PR notes',
    filesChanged: changedFiles,
    outcome: 'PR notes template generated',
    nextStep: 'Fill in template and create PR',
  })

  appendToLearningLog(entry)
  log('PR notes template generated.', 'success')
}

main().catch((err) => {
  log(`PR Notes failed: ${err.message}`, 'error')
  process.exit(1)
})
