import * as vscode from 'vscode'

import { DEBOUNCE_DELAY, MAX_FILE_SIZE, SUPPORTED_LANGS } from './consts'
import { debounce, findTagNamesWithLevels, getColorForLevel } from './utils'

let decorations: vscode.TextEditorDecorationType[] = []
let fileSizeWarningShown = false

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

  if (text.length > MAX_FILE_SIZE) {
    if (!fileSizeWarningShown) {
      vscode.window.showWarningMessage(
        'File is too large for colored tags. Coloring disabled.',
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

const debouncedUpdateDecorations = debounce(updateDecorations, DEBOUNCE_DELAY)

export function activate(context: vscode.ExtensionContext) {
  fileSizeWarningShown = false

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
