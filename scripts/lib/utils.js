/**
 * Cross-platform utility functions for hooks
 */
import { execSync, spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const REPO_ROOT = path.resolve(__dirname, '../..')
export const LEARNING_LOG_PATH = path.join(REPO_ROOT, 'docs/learning-log.md')

/**
 * Get current timestamp in ISO format
 */
export function getTimestamp() {
  return new Date().toISOString()
}

/**
 * Get current git branch
 */
export function getCurrentBranch() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf8', cwd: REPO_ROOT }).trim()
  } catch {
    return 'unknown'
  }
}

/**
 * Get list of changed files (staged + unstaged)
 */
export function getChangedFiles() {
  try {
    const staged = execSync('git diff --cached --name-only', { encoding: 'utf8', cwd: REPO_ROOT })
    const unstaged = execSync('git diff --name-only', { encoding: 'utf8', cwd: REPO_ROOT })
    const untracked = execSync('git ls-files --others --exclude-standard', {
      encoding: 'utf8',
      cwd: REPO_ROOT,
    })
    const all = [...staged.split('\n'), ...unstaged.split('\n'), ...untracked.split('\n')]
    return [...new Set(all.filter(Boolean))]
  } catch {
    return []
  }
}

/**
 * Get git status summary
 */
export function getGitStatus() {
  try {
    return execSync('git status --short', { encoding: 'utf8', cwd: REPO_ROOT }).trim()
  } catch {
    return ''
  }
}

/**
 * Run a command and return result
 */
export function runCommand(command, options = {}) {
  const result = spawnSync('sh', ['-c', command], {
    encoding: 'utf8',
    cwd: options.cwd || REPO_ROOT,
    timeout: options.timeout || 60000,
  })
  return {
    success: result.status === 0,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    exitCode: result.status,
  }
}

/**
 * Check if a command exists
 */
export function commandExists(cmd) {
  try {
    execSync(`which ${cmd}`, { encoding: 'utf8' })
    return true
  } catch {
    return false
  }
}

/**
 * Append an entry to the learning log
 */
export function appendToLearningLog(entry) {
  const logDir = path.dirname(LEARNING_LOG_PATH)
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }

  let content = ''
  if (fs.existsSync(LEARNING_LOG_PATH)) {
    content = fs.readFileSync(LEARNING_LOG_PATH, 'utf8')
  } else {
    content = `# Learning Log

> Append-only log of hook runs and lessons learned.

---

`
  }

  content += `\n${entry}\n`
  fs.writeFileSync(LEARNING_LOG_PATH, content)
}

/**
 * Format a learning log entry
 */
export function formatLogEntry({
  command,
  status,
  branch,
  intent = '',
  filesChanged = [],
  checks = [],
  tests = '',
  outcome = '',
  nextStep = '',
  failureSummary = '',
}) {
  const timestamp = getTimestamp()
  const statusLabel = status === 'PASS' ? 'PASS' : 'FAIL'

  let entry = `## ${timestamp} — ${command.toUpperCase()} (${statusLabel})

- Branch: ${branch}
- Intent: ${intent || 'Not specified'}
- Files changed: ${filesChanged.length > 0 ? filesChanged.join(', ') : 'None'}`

  if (checks.length > 0) {
    entry += `\n- Checks: ${checks.join(', ')}`
  }

  if (tests) {
    entry += `\n- Tests: ${tests}`
  }

  if (status === 'FAIL' && failureSummary) {
    entry += `\n- Failure: ${failureSummary}`
  }

  if (outcome) {
    entry += `\n- Outcome: ${outcome}`
  }

  if (nextStep) {
    entry += `\n- Next step: ${nextStep}`
  }

  entry += '\n'
  return entry
}

/**
 * Read user intent from stdin or environment
 */
export function getIntent() {
  return process.env.HOOK_INTENT || ''
}

/**
 * Set exit code based on status
 */
export function exitWithStatus(success) {
  process.exit(success ? 0 : 1)
}

/**
 * Print a formatted message
 */
export function log(message, type = 'info') {
  const prefix =
    {
      info: '[INFO]',
      warn: '[WARN]',
      error: '[ERROR]',
      success: '[OK]',
      fail: '[FAIL]',
    }[type] || '[LOG]'

  console.log(`${prefix} ${message}`)
}
