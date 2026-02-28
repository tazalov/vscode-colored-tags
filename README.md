# 🎨 Colored Tags

A VS Code extension that colors HTML/XML tag names based on their nesting level for better code readability.

![Demo](https://example.com/demo.gif) <!-- Добавьте позже реальную гифку с демонстрацией -->

## Features

- 🏷️ Colors tag names (opening, closing, and self-closing tags) based on nesting depth
- 🌈 Distinct colors for each nesting level (rotating hue)
- ⚡ Optimized for performance with debouncing and file size limits
- 🔄 Automatically updates as you type
- 🎯 Supports HTML, XML, JSX, and other similar languages

## Supported Languages

- HTML
- XML
- JavaScript (JSX)
- TypeScript (TSX)
- Vue
- Svelte
- PHP
- And any other language with HTML/XML-like tags

## How It Works

The extension analyzes your code in real-time and assigns a unique color to each nesting level:

```html
<!-- Level 0 (root) -->
<div>                      <!-- Red-ish -->
    <!-- Level 1 -->
    <section>              <!-- Green-ish -->
        <!-- Level 2 -->
        <article>          <!-- Blue-ish -->
            <h1>Title</h1> <!-- Purple-ish -->
            <p>Text</p>    <!-- Back to Blue-ish -->
        </article>         <!-- Blue-ish -->
    </section>             <!-- Green-ish -->
</div>                     <!-- Red-ish -->

```

## Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "Colored Tags"
4. Click Install

Or install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=your-publisher.colored-tags) (link will be available after publishing)

## Usage

The extension activates automatically for supported file types. Tag names will be colored immediately.

### Commands

- `Colored Tags: Refresh` - Manually refresh tag colors (useful if colors get out of sync)

### Performance Features

- **Debounced updates**: Colors update 300ms after you stop typing
- **File size limit**: Files larger than 500KB are skipped for performance
- **Smart caching**: Only processes visible/edited parts of the document

## Configuration

You can customize the following settings in your VS Code `settings.json`:

```json
{
    "coloredTags.maxFileSize": 100,        // Max file size in KB
    "coloredTags.updateDelay": 300,         // Debounce delay in ms
    "coloredTags.saturation": 60,            // Color saturation (0-100)
    "coloredTags.lightness": 60,             // Color lightness (0-100)
    "coloredTags.supportedLanguages": [      // Override supported languages
        "html",
        "xml",
        "javascriptreact",
        "typescriptreact",
				"vue",
    ]
}
```

## Requirements

- VS Code 1.60.0 or higher

## Known Issues

- Very large files (>500KB) are skipped by default
- Complex template literals in JSX might not be fully supported

## Contributing

Found a bug? Have a feature request? [Open an issue](https://github.com/tazalov/vscode-colored-tags/issues)

## License

MIT

---

**Enjoy!** 🎉