const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// Configuration
const CONFIG = {
  inputDir: './source/3-character-paths/talents',
  outputDir: './source/3-character-paths/talents',
  outputFile: 'talents.md',
  talentsTableFile: 'talents.yml',
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

function formatTrack(feature) {
  const empty = '[ ]'.repeat(feature.min);
  const filled = '[X]'.repeat(feature.max - feature.min);
  return `${empty}${filled}`;
}

function formatFeatures(features) {
  if (!features?.length) return '';

  return features
    .map((feature) => {
      const formattedFeature =
        feature.type === 'track'
          ? `${formatTrack(feature)} **${feature.name}**`
          : `[ ] **${feature.name}**`;

      return `${formattedFeature} (refresh: ${feature.refresh})\n`;
    })
    .join('\n');
}

function formatTalentsTable(content) {
  try {
    const data = yaml.load(content);
    const headers = ['Style', 'Tune', 'Impact'];

    // Build table headers
    let table = '## Available Combinations\n\n';
    table += '| Style | + | Tune | of | Impact |\n';
    table += '|-------|---|------|----|---------|\n';

    // Get the maximum length of all columns
    const maxRows = Math.max(
      ...headers.map((header) => (data[header] || []).length),
    );
    // Build table rows
    for (let i = 0; i < maxRows; i += 1) {
      const row = headers.map((header) => (data[header] || [])[i] || '');
      table += `| ${row[0]} | | ${row[1]} | | ${row[2]} |\n`;
    }

    return `${table}\n`;
  } catch (error) {
    console.error('Error parsing talents table:', error);
    return '';
  }
}

function formatTalentMetadata(talent) {
  return `${[
    `- **Type**: ${talent.type}`,
    `- **Path**: ${talent.path}`,
    `- **Sourcebook**: ${talent.sourcebook}`,
  ].join('\n')}\n`;
}

function convertYamlToMarkdown(yamlData) {
  if (!yamlData?.[0]) return '';

  const talent = yamlData[0];
  const sections = [
    `## ${talent.name}\n`,
    `${talent.description}`,
    talent.feature?.length ? formatFeatures(talent.feature) : '',
    formatTalentMetadata(talent),
  ];

  return sections.filter(Boolean).join('\n');
}

async function generateMarkdown() {
  try {
    let combinedMarkdown = '# Talents\n\n';

    // Process talents table
    const talentsTablePath = path.join(
      CONFIG.inputDir,
      CONFIG.talentsTableFile,
    );
    if (fs.existsSync(talentsTablePath)) {
      const talentsContent = fs.readFileSync(talentsTablePath, 'utf8');
      combinedMarkdown += formatTalentsTable(talentsContent);
    }

    // Process individual talent files
    const files = fs
      .readdirSync(CONFIG.inputDir)
      .filter(
        (file) => file.endsWith('.yml') && file !== CONFIG.talentsTableFile,
      );

    for (const file of files) {
      try {
        const filePath = path.join(CONFIG.inputDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const yamlData = yaml.load(fileContent);

        const markdown = convertYamlToMarkdown(yamlData);
        combinedMarkdown += `${markdown}\n---\n\n`;

        console.log(`✓ Processed: ${file}`);
      } catch (error) {
        console.error(`✗ Error processing ${file}:`, error);
      }
    }

    // Write output file
    const outputPath = path.join(CONFIG.outputDir, CONFIG.outputFile);
    fs.writeFileSync(outputPath, combinedMarkdown);
    console.log(`\n✨ Successfully generated ${CONFIG.outputFile}`);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
generateMarkdown();
