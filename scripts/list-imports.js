import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = path.join(__dirname, '../src');

function getImports(dir) {
    let imports = new Set();
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            const subImports = getImports(filePath);
            subImports.forEach(i => imports.add(i));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            const content = fs.readFileSync(filePath, 'utf8');
            // Match import ... from 'package'
            const regex = /from\s+['"]([^'"]+)['"]/g;
            let match;
            while ((match = regex.exec(content)) !== null) {
                const pkg = match[1];
                if (!pkg.startsWith('.') && !pkg.startsWith('/')) {
                    // It's a package
                    // Handle @scope/pkg
                    if (pkg.startsWith('@')) {
                        const parts = pkg.split('/');
                        imports.add(`${parts[0]}/${parts[1]}`);
                    } else {
                        const parts = pkg.split('/');
                        imports.add(parts[0]);
                    }
                }
            }
        }
    });
    return imports;
}

const allImports = getImports(directory);
console.log(Array.from(allImports).join('\n'));
