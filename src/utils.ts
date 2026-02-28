import * as vscode from "vscode";
import { MAX_FILE_SIZE, TAG_NAME_REGEX } from "./consts";

/**
 * Debounce function
 * @param func function to debounce
 * @param delay delay for calling function
 * @returns debounced function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): T {
  let timeoutId: NodeJS.Timeout | undefined;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = undefined;
    }, delay);
  } as T;
}

/**
 * Pastel color generation function
 * @param level tag nesting level
 * @returns hsl color
 */
export function getColorForLevel(level: number): string {
  const hue = (level * 60) % 360;
  const saturation = 60;
  const lightness = 60;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Function for setting tag name positions for the nesting level
 * @param tagsByNameLevel map object, when key - nested level, value - [start, end] positions to name
 * @param level current nested level
 * @param start start position of tag name
 * @param end end position of tag name
 * @returns mutation tagsByNameLevel param
 */
function addTagNameRangeToLevel(
  tagsByNameLevel: Map<number, vscode.Range[]>,
  level: number,
  start: number,
  end: number,
): void {
  if (!tagsByNameLevel.has(level)) {
    tagsByNameLevel.set(level, []);
  }

  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const startPos = editor.document.positionAt(start);
    const endPos = editor.document.positionAt(end);
    tagsByNameLevel.get(level)?.push(new vscode.Range(startPos, endPos));
  }
}

/**
 * Function for finds all tag names with group by nesting level (opening tags, closing tags, and self-closing tags)
 * @param text current text from editor
 * @returns map object, when key - nested level, value - [start, end] positions to name
 */
export function findTagNamesWithLevels(
  text: string,
): Map<number, vscode.Range[]> {
  const tagsByNameLevel = new Map<number, vscode.Range[]>();
  const stack: { name: string; level: number }[] = [];

  let match;

  while ((match = TAG_NAME_REGEX.exec(text)) !== null) {
    const slash = match[1]; // "/" for closing tags or empty for opening tags
    const tagName = match[2];
    const closingBracket = match[3]; // ">" or "/>"

    const isClosing = slash === "/";
    const isSelfClosing = closingBracket.trim() === "/>";

    // Tag position (after < or </)
    const nameStart = match.index + (isClosing ? 2 : 1); // <div -> position d, </div -> position after </
    const nameEnd = nameStart + tagName.length;

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      continue;
    }

    if (isSelfClosing) {
      // Self-closing tag - doesn't affect nesting level
      const level = stack.length;
      addTagNameRangeToLevel(tagsByNameLevel, level, nameStart, nameEnd);
      // Don't push to stack - self-closing tags don't create new level
      continue;
    }

    if (!isClosing) {
      // Opening tag
      const level = stack.length;
      addTagNameRangeToLevel(tagsByNameLevel, level, nameStart, nameEnd);

      stack.push({ name: tagName, level });
      continue;
    }

    // Closing tag
    if (stack.length > 0) {
      const lastTag = stack[stack.length - 1];
      if (lastTag.name === tagName) {
        stack.pop();
        // Add range of closing tag on same level
        addTagNameRangeToLevel(
          tagsByNameLevel,
          lastTag.level,
          nameStart,
          nameEnd,
        );
      } else {
        // Add range of closing tag on current stack level
        addTagNameRangeToLevel(
          tagsByNameLevel,
          stack.length - 1,
          nameStart,
          nameEnd,
        );
      }
    } else {
      // Closing tag without pair - level 0
      addTagNameRangeToLevel(tagsByNameLevel, 0, nameStart, nameEnd);
    }
  }

  return tagsByNameLevel;
}
