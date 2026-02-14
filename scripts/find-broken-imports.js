import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = path.join(__dirname, '../src/components/ui');

const files = fs.readdirSync(directory).filter(file => file.endsWith('.jsx'));

files.forEach(file => {
    const filePath = path.join(directory, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
        if (line.match(/import \* from/)) {
            console.log(`${file}:${index + 1}: ${line}`);
        }
    });
});
