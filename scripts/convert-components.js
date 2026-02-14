import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = path.join(__dirname, '../src/components/ui');

if (!fs.existsSync(directory)) {
    console.error(`Directory not found: ${directory}`);
    process.exit(1);
}

const files = fs.readdirSync(directory).filter(file => file.endsWith('.jsx'));

console.log(`Found ${files.length} .jsx files.`);

files.forEach(file => {
    const filePath = path.join(directory, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Remove React.forwardRef<...>
    // Matches React.forwardRef<...>(
    // [\s\S]*? is lazy, but followed by \s*\( ensures it consumes until the function call parenthesis.
    // This relies on the assumption that the generic closing > is followed by (
    content = content.replace(/React\.forwardRef<[\s\S]*?>\s*\(/g, 'React.forwardRef(');

    // 2. Remove prop type annotations in function arguments
    // ({ ... }: Type<...>) -> ({ ... })
    // Matches }: Type<...> or }: Type
    // [\w.]+ matches React.ComponentPropsWithoutRef
    // (?:<[^>]*>)? matches optional <...> (non-nested)
    content = content.replace(/\}:\s*[\w.]+(?:<[^>]*>)?/g, '}');

    // 3. Remove "as Type" assertions that might have remained
    // "as string", "as any", "as React.ElementType"
    // CAUTION: "has" contains "as". We need word boundary.
    // \s+as\s+[\w.]+(?:<[^>]*>)?
    content = content.replace(/\s+as\s+[\w.]+(?:<[^>]*>)?/g, '');

    // 4. Remove any remaining React.FC<...>
    content = content.replace(/React\.FC<[\s\S]*?>/g, 'React.FC');

    // 5. Remove "use client" if it's there (optional, Next.js specific but harmless in Vite? 
    // Vite doesn't care, but it's clutter. Let's keep it or remove it?
    // "use client" is for RSC. Vite is SPA (Client only). So "use client" is moot but harmless.
    // I'll leave it for now to avoid breaking anything unexpected, or remove it.
    // Cleaning it is better.
    content = content.replace(/^['"]use client['"];?\s*/g, '');

    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${file}`);
});
