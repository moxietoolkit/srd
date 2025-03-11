const fs = require('fs');
const { marked } = require('marked');
const docx = require('docx');
const path = require('path');

async function convertSRD() {
  try {
    // Create output directories if they don't exist
    const htmlDir = path.join(__dirname, '../output/html');
    const docxDir = path.join(__dirname, '../output/docx');

    if (!fs.existsSync(htmlDir)) {
      fs.mkdirSync(htmlDir, { recursive: true });
    }
    if (!fs.existsSync(docxDir)) {
      fs.mkdirSync(docxDir, { recursive: true });
    }

    // Read the markdown file
    const markdownContent = fs.readFileSync(
      path.join(__dirname, '../output/markdown/full-moxie-srd.md'),
      'utf8',
    );

    // Convert markdown to HTML
    const htmlContent = marked(markdownContent);

    // Save HTML file
    fs.writeFileSync(
      path.join(htmlDir, 'full-moxie-srd.html'),
      `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Moxie SRD</title>
                <style>
                    body {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        line-height: 1.6;
                    }
                    h1, h2, h3 { margin-top: 2em; }
                    blockquote { 
                        border-left: 4px solid #ddd;
                        padding-left: 1em;
                        margin-left: 0;
                    }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `,
    );

    // Convert to DOCX
    const doc = new docx.Document({
      sections: [
        {
          properties: {},
          children: [
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: markdownContent,
                }),
              ],
            }),
          ],
        },
      ],
    });

    // Save DOCX file
    const buffer = await docx.Packer.toBuffer(doc);
    fs.writeFileSync(path.join(docxDir, 'full-moxie-srd.docx'), buffer);

    console.log('Conversion completed successfully!');
    console.log('Files generated:');
    console.log('- html/full-moxie-srd.html');
    console.log('- docx/full-moxie-srd.docx');
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

convertSRD();
