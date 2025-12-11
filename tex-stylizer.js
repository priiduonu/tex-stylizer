/**
 * @file tex-stylizer.js
 * @author priiduonu <priiduonu@github.com>
 * @description applies typographical styling to TeX logos via CSS
 */

// expects a boolean `window.config.convertPlainTexLogos` to be injected in the HTML
//
// - true  → convert macros \(Xe|Lua)(La)TeX, \(Xe|Lua)(La)TeX\ as well as plain text (Xe|Lua)(La)TeX
// - false → convert macros \(Xe|Lua)(La)TeX and \(Xe|Lua)(La)TeX\ only
//
// if not set, defaults to `true`

let convertPlainTexLogos =
    (window.config && typeof window.config.convertPlainTexLogos === "boolean")
        ? window.config.convertPlainTexLogos
        : true; // or change the fallback to 'false' if you like

// Add or remove tags to ignore as needed
const forbiddenTags = new Set(["A", "CODE", "PRE"]);

// TeX families and their styles
const styles = {
    "XeLaTeX":  '<span class="latex">X<sub><span class="xelatex">e</span></sub>L<sup>a</sup>T<sub>e</sub>X</span>',
    "LuaLaTeX": '<span class="latex">LuaL<sup>a</sup>T<sub>e</sub>X</span>',
    "XeTeX":    '<span class="latex">X<sub><span class="xetex">e</span></sub>T<sub>e</sub>X</span>',
    "LuaTeX":   '<span class="latex">LuaT<sub>e</sub>X</span>',
    "LaTeX2e":  '<span class="latex">L<sup>a</sup>T<sub>e</sub>X</span><span class="epsilon">2<sub>ε</sub></span>',
    "LaTeXe":   '<span class="latex">L<sup>a</sup>T<sub>e</sub>X</span><span class="epsilon">2<sub>ε</sub></span>',
    "LaTeX":    '<span class="latex">L<sup>a</sup>T<sub>e</sub>X</span>',
    "TeX":      '<span class="latex">T<sub>e</sub>X</span>'
};

function texStyle(convertPlainTexLogos) {

    // Recursively collect *text nodes*, skipping forbidden tags
    function collectTextNodes(element, collected = []) {
        element.childNodes.forEach(node => {

            if (node.nodeType === Node.TEXT_NODE) {
                collected.push(node);
            } else if (
                node.nodeType === Node.ELEMENT_NODE &&
                !forbiddenTags.has(node.tagName)
            ) {
                collectTextNodes(node, collected);
            }
        });

        return collected;
    }

    const textNodes = collectTextNodes(document.body);

    // Replace TeX family names in each text node
    textNodes.forEach(node => {
        let text = node.nodeValue;

        for (const [family, html] of Object.entries(styles)) {

            // Build regex depending on mode
            const regex = new RegExp(
                convertPlainTexLogos
                    ? '\\\\' + family + '\\\\?|' + family   // macros and plain text
                    : '\\\\' + family + '\\\\?',            // macros only
                'g'
            );

            text = text.replace(regex, html);
        };

        if (text !== node.nodeValue) {
            const wrapper = document.createElement("span");
            wrapper.innerHTML = text;
            node.replaceWith(...wrapper.childNodes);
        }
    });

};

document.addEventListener("DOMContentLoaded", () => {
    texStyle(convertPlainTexLogos);
});
