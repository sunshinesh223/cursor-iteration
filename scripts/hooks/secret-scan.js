#!/usr/bin/env node
/**
 * Hook: Secret Scan
 * Scans for potential secrets in the codebase (optional but recommended).
 */
import { log, runCommand, exitWithStatus } from '../lib/utils.js'

// Common secret patterns to detect
const SECRET_PATTERNS = [
  // API keys
  { pattern: /(api[_-]?key|apikey)\s*[:=]\s*['"](sk|pk|AKIA|AIza)[\w-]+['"]/i, name: 'API Key' },
  // AWS keys
  {
    pattern:
      /(aws[_-]?access[_-]?key[_-]?id|aws[_-]?secret[_-]?access[_-]?key)\s*[:=]\s*['"][\w+/=]{20,}['"]/i,
    name: 'AWS Credentials',
  },
  // Tokens
  { pattern: /(token|bearer|authorization)\s*[:=]\s*['"][\w-]{32,}['"]/i, name: 'Token' },
  // Passwords
  { pattern: /(password|passwd|pwd)\s*[:=]\s*['"][^'"]{8,}['"]/i, name: 'Password' },
  // Private keys
  { pattern: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/, name: 'Private Key' },
  // GitHub tokens
  { pattern: /ghp_[a-zA-Z0-9]{36}/, name: 'GitHub Token' },
  // OpenAI keys
  { pattern: /sk-proj-[a-zA-Z0-9]{48}/, name: 'OpenAI Key' },
]

function main() {
  log('Scanning for potential secrets...', 'info')

  let foundSecrets = false
  const findings = []

  // Use git grep to search for patterns (faster and respects .gitignore)
  for (const { pattern, name } of SECRET_PATTERNS) {
    // Convert regex to a simpler grep pattern for git grep
    // Escape special characters but keep the pattern readable
    const grepPattern = pattern.source
      .replace(/\\s/g, '\\s')
      .replace(/['"]/g, '[\'"]')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/\?/g, '\\?')
      .replace(/\+/g, '\\+')
      .replace(/\*/g, '\\*')

    // Try git grep first (respects .gitignore automatically)
    const gitGrepCmd = `git grep -n -E "${grepPattern}" -- ':!node_modules' ':!.git' ':!.husky' ':!dist' ':!build' ':!.next' ':!.cache' ':!coverage' '*.lock' '*.log' 2>/dev/null || true`
    const result = runCommand(gitGrepCmd, { timeout: 30000 })

    if (result.stdout.trim()) {
      const lines = result.stdout
        .trim()
        .split('\n')
        .filter((line) => {
          // Filter out false positives from test files or documentation
          const lowerLine = line.toLowerCase()
          return (
            !lowerLine.includes('example') &&
            !lowerLine.includes('test') &&
            !lowerLine.includes('sample') &&
            !lowerLine.includes('placeholder')
          )
        })

      if (lines.length > 0) {
        findings.push({ type: name, count: lines.length, lines: lines.slice(0, 5) })
        foundSecrets = true
      }
    }
  }

  if (foundSecrets) {
    log('Potential secrets found:', 'warn')
    findings.forEach(({ type, count, lines }) => {
      console.log(`\n  ${type}: ${count} potential match(es)`)
      lines.forEach((line) => console.log(`    ${line}`))
    })
    log('\n⚠️  Review these findings. Some may be false positives.', 'warn')
    log('If these are legitimate secrets, remove them and rotate any exposed credentials.', 'error')
    return false
  } else {
    log('No potential secrets detected', 'success')
    return true
  }
}

const success = main()
exitWithStatus(success)
