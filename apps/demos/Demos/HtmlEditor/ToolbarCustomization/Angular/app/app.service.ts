import { Injectable } from '@angular/core';

const markup = `
    <h2>
        <img src="../../../../images/widgets/HtmlEditor.svg" alt="HtmlEditor">
        Formatted Text Editor (HTML Editor)
    </h2>
    <br>
    <p>DevExtreme JavaScript HTML Editor is a client-side WYSIWYG text editor that allows its users to format textual and visual content and store it as HTML.</p>
    <p>Supported features:</p>
    <ul>
        <li>Inline formats:
            <ul>
                <li><strong>Bold</strong>, <em>italic</em>, <s>strikethrough</s> text formatting</li>
                <li>Font, size, color changes (HTML only)</li>
            </ul>
        </li>
        <li>Block formats:
            <ul>
                <li>Headers</li>
                <li>Text alignment</li>
                <li>Lists (ordered and unordered)</li>
                <li>Code blocks</li>
                <li>Quotes</li>
            </ul>
        </li>
        <li>Custom formats</li>
        <li>Mail-merge placeholders (for example, %username%)</li>
        <li>Adaptive toolbar for working images, links, and color formats</li>
        <li>Image upload: drag-and-drop images onto the form, select files from the file system, or specify a URL.</li>
        <li>Copy-paste rich content (unsupported formats are removed)</li>
        <li>Tables support</li>
    </ul>
`;

@Injectable()
export class Service {
  getMarkup(): string {
    return markup;
  }
}
