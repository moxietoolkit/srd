const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  rootDir: process.cwd(),
  sourceDir: 'source',
  outputDir: 'output/markdown',
  outputFile: 'full-moxie-srd.md',
  separatorToken: '---\n\n',
  encoding: 'utf-8',
};

/**
 * Removes HTML comments from content
 * @param {string} content
 * @returns {string}
 */
function removeHtmlComments(content) {
  return content.replace(/<!--[\s\S]*?-->/g, '');
}

/**
 * Transforms frontmatter into markdown header format
 * @param {string} content
 * @returns {string}
 */
function transformFrontmatter(content) {
  // More flexible frontmatter parsing
  return content.replace(/^---\s*\n([\s\S]*?)\n---/m, (match, frontmatter) => {
    const title =
      frontmatter.match(/title:\s*['"]?(.*?)['"]?\s*$/m)?.[1] || 'Untitled';
    const sourcebook =
      frontmatter.match(/sourcebook:\s*['"]?(.*?)['"]?\s*$/m)?.[1] || 'Unknown';
    return `> [!WARNING]\n> This is a generated file. Any changes should be made to the source files.\n\n# ${title}\nSourcebook: ${sourcebook}`;
  });
}

/**
 * Recursively gets all markdown files from directory and its subdirectories
 * @param {string} dirPath
 * @returns {string[]}
 */
function getAllMarkdownFiles(dirPath) {
  let files = [];
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(getAllMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  // First sort by directory path, then by filename
  return files.sort((a, b) => {
    const dirA = path.dirname(a);
    const dirB = path.dirname(b);

    // If directories are different, sort by directory path
    if (dirA !== dirB) {
      return dirA.localeCompare(dirB);
    }

    // If in the same directory, sort by filename
    const fileA = path.basename(a);
    const fileB = path.basename(b);
    // Extract numbers from start of filename if they exist
    const numA = parseInt(fileA.match(/^\d+/)?.[0] || '0');
    const numB = parseInt(fileB.match(/^\d+/)?.[0] || '0');
    if (numA !== numB) return numA - numB;
    return fileA.localeCompare(fileB);
  });
}

/**
 * Validates markdown content structure
 * @param {string} content
 * @returns {boolean}
 */
function isValidMarkdown(content) {
  // More lenient frontmatter validation
  const hasFrontmatter = /^---\s*\n[\s\S]*?\n---/.test(content);
  const hasContent = content.trim().length > 0;
  return hasFrontmatter && hasContent;
}

/**
 * Safely reads a file with error handling
 * @param {string} filePath
 * @returns {string}
 */
function safeReadFile(filePath) {
  try {
    return fs.readFileSync(filePath, config.encoding);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return '';
  }
}

/**
 * Reads and processes all markdown files in the directory
 * @param {string} dirPath
 * @returns {string}
 */
function processDirectory(dirPath) {
  const files = getAllMarkdownFiles(dirPath);
  let mergedContent = '';
  let processedCount = 0;

  console.log('\nMerging files in the following order:');
  files.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });
  console.log(''); // Empty line for better readability

  for (const filePath of files) {
    const content = safeReadFile(filePath);
    if (!content || !isValidMarkdown(content)) {
      if (!content) {
        console.warn(`Warning: Empty or unreadable file ${filePath}`);
      } else {
        console.warn(`Warning: Invalid markdown structure in ${filePath}`);
        console.warn('Content preview:', content.slice(0, 100));
      }
    } else {
      const cleanContent = removeHtmlComments(content);
      const transformedContent = transformFrontmatter(cleanContent);

      mergedContent += transformedContent + config.separatorToken;
      processedCount += 1;

      // Show progress for large directories
      if (processedCount % 10 === 0) {
        console.log(`Processed ${processedCount}/${files.length} files...`);
      }
    }
  }

  // Remove the final separator and ensure there's content
  return mergedContent.replace(new RegExp(`${config.separatorToken}$`), '');
}

async function main() {
  const srdDir = path.join(config.rootDir, config.sourceDir);
  const outputDir = path.join(config.rootDir, config.outputDir);
  const outputFile = path.join(outputDir, config.outputFile);

  try {
    // Validate directories
    if (!fs.existsSync(srdDir)) {
      throw new Error(`Directory ${srdDir} does not exist`);
    }

    // Ensure output directory exists
    fs.mkdirSync(outputDir, { recursive: true });

    // Process and merge the files
    const mergedContent = processDirectory(srdDir);

    // Write the merged content
    fs.writeFileSync(outputFile, mergedContent.trim(), config.encoding);
    console.log(`\nSuccessfully merged markdown files into ${outputFile}`);
    console.log(`Total size: ${(mergedContent.length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
