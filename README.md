# 🎨 Colored Tags

A VS Code extension that colors HTML/JSX/TSX etc. tag names based on their nesting level for better code readability.

## Features

- 🏷️ Colors tag names (opening, closing, and self-closing tags) based on nesting depth
- 🌈 Distinct colors for each nesting level (rotating hue)
- ⚡ Optimized for performance with debouncing and file size limits
- 🔄 Automatically updates as you type
- 🎯 Supports HTML, XML, JSX, and other similar languages (maybe)

## Supported Languages

- HTML
- XML
- JavaScript (JSX)
- TypeScript (TSX)
- Vue
- And any other language with HTML/XML-like tags (maybe)

## How It Works

The extension analyzes your code in real-time and assigns a unique color to each nesting level:

![Demo preview](assets/preview.png)

## Installation

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

- Very large files (>100KB) are skipped by default
- Complex template literals in JSX might not be fully supported

## Contributing

Found a bug? Have a feature request? [Open an issue](https://github.com/tazalov/vscode-colored-tags/issues)

## License

MIT

---

**Enjoy!** 🎉