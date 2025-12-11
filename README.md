# tex-stylizer

Applies correct typographical styling to TeX family names ("logos") in HTML
pages, ignoring occurrences inside forbidden tags.

You can use plain-text notation (e.g. `LaTeX`) as well as LaTeX macros
(e.g. `\LaTeX` or `\LaTeX\`) in your HTML or Markdown document.

The following logos are processed:

- `XeLaTeX`
- `XeTeX`
- `LuaLaTeX`
- `LuaTeX`
- `LaTeX2e`[^latex2e]
- `LaTeXe`[^latexe]
- `LaTeX`
- `TeX`

The LaTeX macro names comply to the names provided by the [metalogo] package
or similar.

Take a look at the [Demo Page](https://priiduonu.github.io/tex-stylizer/).

## Usage

Include the CSS and JS files in the `<head>` section of your document:

```html
<link rel="stylesheet" href="tex-styles.css">
<script src="tex-stylizer.js" defer></script>
```

- `tex-styles.css` contains the styles for TeX logo components, taking care of
  correct kerning and transformations.

- `tex-stylizer.js` dynamically applies the styles to all occurances of TeX
  logos.

The script executes automatically after the DOM has finished loading.

## Configuration

By default, the script renders both - LaTeX macros and plain-text names
notations. You can disable the rendering of plain-text names by including the
following in the `<head>` section of your document:

```html
<script>
    window.config = { convertPlainTexLogos: false };
</script>
```

You can then later call the `texStyle(true)` function to toggle the rendering
of plain-text names to "on".

> [!NOTE]
> The current version can not "undo" the conversion, so you can not toggle the
  rendering of logos on/off.

### CSS only

If you do not want to include extra JavaScript or have only a couple of
occurences to style, you may omit the `tex-stylizer.js`.

Include the `tex-styles.css` as usual and make the replacements yourself, e.g.
instead of `LaTeX` write

```html
<span class="latex">L<sup>a</sup>T<sub>e</sub>X</span>
```

in your document.

You can find the replacement sequences from the `tex-stylizer.js`.

If you do not want to make the replacements manually or maybe you use Markdown
as a source and plan to use some external tools to post-process the source,
it is probably easier to go with CSS + JavaScript.

### MkDocs / Zensical

To use `tex-stylizer` with [MkDocs] or[Zensical], put this in your
`mkdocs.yml` config:

```yaml
extra_css:
    - css/tex-styles.css

extra_javascript:
    - js/tex-stylizer.js
```

You can configure the rendering of plain-text names for HTML output via the
boolean parameter:

```yaml
extra:
    convert_plain_tex_logos: yes
```

in `mkdocs.yml` file.

To make the parameter available for the `tex-stylizer.js` script, you must
also define the custom theme directory:

```yaml
theme:
    custom_dir: overrides
```

and make sure it contains the included `main.html` file.

`main.html` reads the `mkdocs.yml` configuration and injects the
`convert_plain_tex_logos` parameter into the page as a JavaScript variable.

## Excluding tags

You can exclude certain logos from being processed by changing the
`forbiddenTags` parameter in `tex-stylizer.js`.

By default, logos inside the following HTML tags are skipped:

```js
const forbiddenTags = new Set(["A", "CODE", "PRE"]);
```

## Fonts and kerning

The kerning values in `tex-styles.css` have been optimized for "Arial"
and "Times New Roman" fonts. If you use other fonts, the values might need
tweaking.

You can override the font used for the logos through the `font-family` CSS
property. However, it is generally recommended to keep the logo font
consistent with the document’s main typeface.

## LaTeX2e logo

There is no LaTeX macro named `\LaTeX2e`. Therefore it is recommended to use
the plain-text `LaTeX2e` if you do not plan to render plain-text logos in
HTML and use `\LaTeXe` as the macro name.

Keep this in mind if your workflow involves any post-processing steps.

All versions (`LaTeXe`, `\LaTeXe`, `LaTeX2e`, `\LaTeX2e`) are rendered
correctly in HTML.

[metalogo]: https://ctan.org/pkg/metalogo
[mkdocs]: https://www.mkdocs.org/
[zensical]: https://zensical.org/

[^latexe]: `LaTeXe` is rendered to `LaTeX2e` in HTML output
[^latex2e]: better use `\LaTeXe` as a correct macro name
