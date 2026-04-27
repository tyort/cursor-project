import fs from 'fs/promises';
import path from 'path';

async function extractJSDoc(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const blocks = [];

  // Regex to match JSDoc comments and the following function/const declaration
  const jsdocRegex = /\/\*\*([\s\S]*?)\*\/\s*(?:export\s+)?(?:const|function|let|class)\s+([a-zA-Z0-9_]+)/g;

  let match;
  while ((match = jsdocRegex.exec(content)) !== null) {
    const rawDoc = match[1];
    const name = match[2];

    const lines = rawDoc.split('\n').map((l) => l.replace(/^\s*\*\s?/, '').trim());

    const descriptionLines = [];
    const params = [];
    const returns = [];

    for (const line of lines) {
      if (line.startsWith('@param')) {
        const pMatch = line.match(/@param\s+\{([^}]+)\}\s+([a-zA-Z0-9_.[\]=]+)\s*(?:-\s*(.*))?/);
        if (pMatch) {
          params.push({ type: pMatch[1], name: pMatch[2], desc: pMatch[3] || '' });
        }
      } else if (line.startsWith('@returns') || line.startsWith('@return')) {
        const rMatch = line.match(/@returns?\s+\{([^}]+)\}\s*(.*)/);
        if (rMatch) {
          returns.push({ type: rMatch[1], desc: rMatch[2] || '' });
        }
      } else if (!line.startsWith('@')) {
        if (line) {
          descriptionLines.push(line);
        }
      }
    }

    blocks.push({
      name,
      description: descriptionLines.join(' '),
      params,
      returns
    });
  }

  return blocks;
}

function formatMarkdown(blocks, fileName) {
  if (blocks.length === 0) {
    return '';
  }

  let md = `### File: \`${fileName}\`\n\n`;
  for (const b of blocks) {
    md += `#### \`${b.name}\`\n\n`;
    if (b.description) {
      md += `${b.description}\n\n`;
    }

    if (b.params.length > 0) {
      md += '**Параметры:**\n';
      for (const p of b.params) {
        md += `- \`${p.name}\` (\`${p.type}\`) - ${p.desc}\n`;
      }
      md += '\n';
    }

    if (b.returns.length > 0) {
      md += '**Возвращает:**\n';
      for (const r of b.returns) {
        md += `- (\`${r.type}\`) - ${r.desc}\n`;
      }
      md += '\n';
    }
  }

  return md;
}

async function generateDocs() {
  console.log('Generating custom API documentation from JSDoc...');

  const files = [
    'src/contexts/CartContext.jsx',
    'src/components/Cart/Cart.jsx',
    'src/components/ProductCard/ProductCard.jsx',
    'src/components/ProductGrid/ProductGrid.jsx'
  ];

  let allMd = '';

  for (const file of files) {
    const blocks = await extractJSDoc(file);
    allMd += formatMarkdown(blocks, path.basename(file));
  }

  try {
    let readme = await fs.readFile('README.md', 'utf-8');

    const startTag = '<!-- JSDOC_START -->';
    const endTag = '<!-- JSDOC_END -->';

    const startIdx = readme.indexOf(startTag);
    const endIdx = readme.indexOf(endTag);

    if (startIdx !== -1 && endIdx !== -1) {
      readme = `${readme.slice(0, startIdx + startTag.length) }\n\n${ allMd }\n${ readme.slice(endIdx)}`;
    } else {
      readme += `\n\n## Документация по коду (JSDoc API)\n\n${startTag}\n\n${allMd}\n${endTag}\n`;
    }

    await fs.writeFile('README.md', readme, 'utf-8');
    console.log('Successfully updated README.md with JSDoc API documentation.');
  } catch (error) {
    console.error('Error generating documentation:', error);
  }
}

generateDocs();
