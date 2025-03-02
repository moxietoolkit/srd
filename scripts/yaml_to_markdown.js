const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// Create output directory if it doesn't exist
const outputDir = './source/3-character-paths/talents';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

function formatFeatures(features) {
  if (!features) return '';

  let result = '';
  features.forEach((feature) => {
    if (feature.type === 'track') {
      result += `${'[ ]'.repeat(feature.min)}${'[X]'.repeat(feature.max - feature.min)} **${feature.name}**: (refresh: ${feature.refresh})\n`;
    } else if (feature.type === 'checkbox') {
      result += `[ ] **${feature.name}** (refresh: ${feature.refresh})\n`;
    } else {
      result += `**${feature.name}**: ${feature.type.charAt(0).toUpperCase() + feature.type.slice(1)} (refresh: ${feature.refresh})\n`;
    }
    result += '\n';
  });
  return result;
}

function formatTalentsTable(talentsData) {
  const table = talentsData.split('\n');
  let markdown = '## Available Talents\n\n';
  markdown += table.join('\n');
  markdown += '\n\n';
  return markdown;
}

function convertYamlToMarkdown(yamlData) {
  if (!yamlData || !yamlData[0]) return '';

  const talent = yamlData[0];
  let markdown = `## ${talent.name}\n\n`;

  markdown += `${talent.description}\n`;

  if (talent?.feature?.length > 0) {
    markdown += formatFeatures(talent.feature);
  }

  markdown += `- **Type**: ${talent.type}\n`;
  markdown += `- **Path**: ${talent.path}\n`;
  markdown += `- **Sourcebook**: ${talent.sourcebook}\n\n`;

  return markdown;
}

// Read all YAML files in the talents directory
const talentsDir = './source/3-character-paths/talents';
const files = fs
  .readdirSync(talentsDir)
  .filter((file) => file.endsWith('.yml'));

// Process each file
let combinedMarkdown = '# Talents\n\n';

// First, process talents.yml if it exists
const talentsTablePath = path.join(talentsDir, 'talents.yml');
if (fs.existsSync(talentsTablePath)) {
  const talentsContent = fs.readFileSync(talentsTablePath, 'utf8');
  combinedMarkdown += formatTalentsTable(talentsContent);
}

// Then process individual talent files
files
  .filter((file) => file !== 'talents.yml')
  .forEach((file) => {
    try {
      const filePath = path.join(talentsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const yamlData = yaml.load(fileContent);

      const markdown = convertYamlToMarkdown(yamlData);
      combinedMarkdown += `${markdown}---\n\n`;

      console.log(`Processed: ${file}`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  });

// Write the combined markdown to a file
fs.writeFileSync(path.join(outputDir, 'talents.md'), combinedMarkdown);
console.log('Markdown file generated successfully!');
