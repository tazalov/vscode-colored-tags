import * as path from 'path'
import { runTests } from '@vscode/test-electron'

async function main() {
  try {
    // Path to extension
    const extensionDevelopmentPath = path.resolve(__dirname, '../../')
    // Path to test suite
    const extensionTestsPath = path.resolve(__dirname, './suite/index')

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: ['--disable-extensions'], // Disable other extensions
    })
  } catch (err) {
    console.error('Failed to run tests', err)
    process.exit(1)
  }
}

main()
