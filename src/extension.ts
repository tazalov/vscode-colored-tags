import * as vscode from 'vscode'

import { SUPPORTED_LANGS } from './consts'
import { debounce, findTagNamesWithLevels, getColorForLevel } from './utils'
import { getDebounceDelay, getMaxFileSize } from './config'

let decorations: vscode.TextEditorDecorationType[] = []
let fileSizeWarningShown = false
let debouncedUpdateDecorations: () => void

function clearDecorations() {
  decorations.forEach((d) => d.dispose())
  decorations = []
}

function updateDecorations() {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    return
  }

  const document = editor.document
  const languageId = document.languageId

  if (!SUPPORTED_LANGS.includes(languageId)) {
    clearDecorations()
    return
  }

  const text = document.getText()
  const maxFileSize = getMaxFileSize()

  if (text.length > maxFileSize) {
    if (!fileSizeWarningShown) {
      vscode.window.showWarningMessage(
        `File is too large for colored tags (max ${maxFileSize}). Coloring disabled for this file.`,
      )
      fileSizeWarningShown = true
    }

    clearDecorations()
    return
  }

  const tagsByNameLevel = findTagNamesWithLevels(text)

  clearDecorations()

  for (const [level, ranges] of tagsByNameLevel) {
    if (ranges.length === 0) {
      continue
    }

    const color = getColorForLevel(level)

    const decorationType = vscode.window.createTextEditorDecorationType({
      color: color,
    })

    editor.setDecorations(decorationType, ranges)
    decorations.push(decorationType)
  }
}

function recreateDebouncedUpdate() {
  const delay = getDebounceDelay()
  debouncedUpdateDecorations = debounce(updateDecorations, delay)
}

export function activate(context: vscode.ExtensionContext) {
  fileSizeWarningShown = false
  recreateDebouncedUpdate()

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('coloredTags')) {
        console.log('Configuration changed, updating...')

        fileSizeWarningShown = false
        recreateDebouncedUpdate()
        updateDecorations()
      }
    }),
  )

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      fileSizeWarningShown = false
      updateDecorations()
    }),
  )

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (
        vscode.window.activeTextEditor &&
        event.document === vscode.window.activeTextEditor.document
      ) {
        debouncedUpdateDecorations()
      }
    }),
  )

  if (vscode.window.activeTextEditor) {
    updateDecorations()
  }

  let refreshCommand = vscode.commands.registerCommand(
    'vscode-colored-tags.refresh',
    () => {
      fileSizeWarningShown = false
      updateDecorations()
      vscode.window.showInformationMessage('Tag colors changed!')
    },
  )
  context.subscriptions.push(refreshCommand)
}

export function deactivate() {
  clearDecorations()
}
