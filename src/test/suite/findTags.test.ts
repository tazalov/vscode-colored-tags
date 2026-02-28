import * as assert from 'assert'
import * as sinon from 'sinon'
import * as vscode from 'vscode'

import { findTagNamesWithLevels } from '../../utils'

suite('Tag Parser Tests', () => {
  let sandbox: sinon.SinonSandbox
  let mockDocument: any

  setup(() => {
    sandbox = sinon.createSandbox()

    // mock document
    mockDocument = {
      positionAt: (offset: number) => {
        return new vscode.Position(0, offset)
      },
    }

    // mock vscode.window.activeTextEditor
    sandbox.stub(vscode.window, 'activeTextEditor').value({
      document: mockDocument,
    })
  })

  teardown(() => {
    sandbox.restore()
  })

  test('Finds simple HTML tags', () => {
    const text = '<div></div>'
    const result = findTagNamesWithLevels(text)

    // One level
    assert.strictEqual(result.size, 1)

    // Level 0: div (opening and closing)
    const level0Ranges = result.get(0)
    assert.ok(level0Ranges)
    assert.strictEqual(level0Ranges.length, 2)

    // Check positions
    assert.strictEqual(level0Ranges[0].start.character, 1)
    assert.strictEqual(level0Ranges[0].end.character, 4)

    assert.strictEqual(level0Ranges[1].start.character, 7)
    assert.strictEqual(level0Ranges[1].end.character, 10)
  })

  test('Correctly identifies nesting levels', () => {
    const text = '<div><section><p>text</p></section></div>'
    const result = findTagNamesWithLevels(text)

    // Three levels
    assert.strictEqual(result.size, 3)

    // Level 0: div (opening and closing)
    const level0Ranges = result.get(0)
    assert.strictEqual(level0Ranges?.[0].start.character, 1) // div открывающий
    assert.strictEqual(level0Ranges?.[1].start.character, 37) // div закрывающий

    // Level 1: section (opening and closing)
    const level1Ranges = result.get(1)
    assert.strictEqual(level1Ranges?.[0].start.character, 6) // section открывающий
    assert.strictEqual(level1Ranges?.[1].start.character, 27) // section закрывающий

    // Level 2: p (opening and closing)
    const level2Ranges = result.get(2)
    assert.strictEqual(level2Ranges?.[0].start.character, 15) // p открывающий
    assert.strictEqual(level2Ranges?.[1].start.character, 23) // p закрывающий
  })

  test('Correctly handles self-closing tags', () => {
    const text = '<div><img /><br/></div>'
    const result = findTagNamesWithLevels(text)

    // Two levels
    assert.strictEqual(result.size, 2)

    // Level 0: div (opening and closing)
    const level0Ranges = result.get(0)
    assert.strictEqual(level0Ranges?.length, 2)
    assert.strictEqual(level0Ranges?.[0].start.character, 1) // div открывающий
    assert.strictEqual(level0Ranges?.[1].start.character, 19) // div закрывающий

    // Level 1: img and br (both self-closing)
    const level1Ranges = result.get(1)
    assert.strictEqual(level1Ranges?.length, 2)

    // Check positions
    // <img />
    assert.strictEqual(level1Ranges?.[0].start.character, 6)
    assert.strictEqual(level1Ranges?.[0].end.character, 9)

    // <br/>
    assert.strictEqual(level1Ranges?.[1].start.character, 13)
    assert.strictEqual(level1Ranges?.[1].end.character, 15)
  })

  test('Correctly handles mixed tag types', () => {
    const text = '<div><img /><p>text</p><br/></div>'
    const result = findTagNamesWithLevels(text)

    // Two levels
    assert.strictEqual(result.size, 2)

    // Level 0: div
    const level0Ranges = result.get(0)
    assert.strictEqual(level0Ranges?.length, 2)

    // Level 1: img, p (opening and closing), br
    const level1Ranges = result.get(1)
    assert.strictEqual(level1Ranges?.length, 4)

    // Check order of tags
    assert.strictEqual(level1Ranges?.[0].start.character, 6) // img
    assert.strictEqual(level1Ranges?.[1].start.character, 13) // p opening
    assert.strictEqual(level1Ranges?.[2].start.character, 21) // p closing
    assert.strictEqual(level1Ranges?.[3].start.character, 24) // br
  })

  test('Correctly ignores comments', () => {
    const text = '<!-- comment --><div></div><!-- another comment -->'
    const result = findTagNamesWithLevels(text)

    // Only div
    assert.strictEqual(result.size, 1)
  })

  test('Correctly ignores comments within tags', () => {
    const text = '<div><!-- comment --><span></span><!-- comment --></div>'
    const result = findTagNamesWithLevels(text)

    // Two levels
    assert.strictEqual(result.size, 2)
  })

  test('Correctly handles nested self-closing tags', () => {
    const text = '<div><section><img /><br/></section></div>'
    const result = findTagNamesWithLevels(text)

    // Должно быть 3 уровня
    assert.strictEqual(result.size, 3)
  })
})
