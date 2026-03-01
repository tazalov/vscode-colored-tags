import * as vscode from 'vscode'

/**
 * Get max file size from user config
 * @returns file size (bytes)
 */
export function getMaxFileSize(): number {
  const config = vscode.workspace.getConfiguration('coloredTags')
  return config.get<number>('maxFileSize', 100000)
}

/**
 * Get debounce delay from user config
 * @returns delay (ms)
 */
export function getDebounceDelay(): number {
  const config = vscode.workspace.getConfiguration('coloredTags')
  return config.get<number>('debounceDelay', 300)
}

/**
 * Get saturation to color from user config
 * @returns saturation (0-100)
 */
export function getSaturation(): number {
  const config = vscode.workspace.getConfiguration('coloredTags')
  return config.get<number>('saturation', 60)
}

/**
 * Get lightness to color from user config
 * @returns lightness (0-100)
 */
export function getLightness(): number {
  const config = vscode.workspace.getConfiguration('coloredTags')
  return config.get<number>('lightness', 60)
}
