#!/usr/bin/env node
/**
 * Hook: Dependency Audit
 * Runs npm audit to check for vulnerable dependencies (optional).
 */
import { log, runCommand, exitWithStatus } from '../lib/utils.js'

function main() {
  log('Running dependency audit...', 'info')

  // Check if package.json exists
  const result = runCommand('test -f package.json')
  if (!result.success) {
    log('No package.json found. Skipping audit.', 'warn')
    return true
  }

  // Check if node_modules exists
  const hasNodeModules = runCommand('test -d node_modules').success
  if (!hasNodeModules) {
    log('No node_modules found. Run npm install first.', 'warn')
    return true // Don't fail if dependencies aren't installed
  }

  // Run npm audit
  const auditResult = runCommand('npm audit --audit-level=moderate', { timeout: 60000 })

  if (auditResult.exitCode === 0) {
    log('Dependency audit: no moderate or high severity vulnerabilities found', 'success')
    return true
  } else {
    // npm audit exits with non-zero if vulnerabilities are found
    log('Dependency audit: vulnerabilities found', 'warn')
    console.log(auditResult.stdout)

    // Check if there are only low severity issues (which we can ignore)
    const lowSeverityOnly =
      auditResult.stdout.includes('low severity') &&
      !auditResult.stdout.match(/moderate|high|critical/i)

    if (lowSeverityOnly) {
      log('Only low severity vulnerabilities found. Consider running: npm audit fix', 'warn')
      return true // Don't fail on low severity
    } else {
      log(
        'Moderate or higher severity vulnerabilities found. Review and fix with: npm audit fix',
        'error'
      )
      return false // Fail on moderate+ severity
    }
  }
}

const success = main()
exitWithStatus(success)
