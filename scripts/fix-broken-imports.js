import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = path.join(__dirname, '../src/components/ui');

// Map of package names to known aliases for Shadcn UI
const knownAliases = {
    'react': 'React',
    'cmdk': 'CommandPrimitive',
};

const brokenFiles = [];

const files = fs.readdirSync(directory).filter(file => file.endsWith('.jsx'));

files.forEach(file => {
    const filePath = path.join(directory, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Fix imports
    content = content.replace(/import \* from '([^']+)'/g, (match, pkg) => {
        let alias = knownAliases[pkg];

        if (!alias) {
            // Heuristic: try to find usage pattern Alias.Root or Alias.Item
            // We search for CapitalizedWord.CapitalizedWord in the content
            // And hope one of them corresponds to the package

            // Common Shadcn pattern: const Component = Primitive.Root
            // We can look for assignments
            const primitiveMatch = content.match(/const \w+ = ([A-Z]\w+)\.Root/);
            if (primitiveMatch) {
                alias = primitiveMatch[1];
            } else {
                // Try looking for any usage of Alias.Something
                const usageMatch = content.match(/([A-Z]\w+)\.[A-Z]\w+/);
                if (usageMatch) {
                    // Check if this looks like a primitive usage?
                    // e.g. AccordionPrimitive.Item
                    // If we have multiple, it might be tricky.
                    // But usually only one * import per file besides React.
                    alias = usageMatch[1];
                }
            }
        }

        // Fallback for Radix
        if (!alias && pkg.startsWith('@radix-ui/react-')) {
            // @radix-ui/react-accordion -> AccordionPrimitive
            const name = pkg.split('-').pop(); // accordion
            // Capitalize first letter
            const PascalName = name.charAt(0).toUpperCase() + name.slice(1);
            alias = `${PascalName}Primitive`;
        }

        if (alias) {
            changed = true;
            console.log(`Restoring alias '${alias}' for package '${pkg}' in ${file}`);
            return `import * as ${alias} from '${pkg}'`;
        } else {
            console.warn(`Could not determine alias for package '${pkg}' in ${file}`);
            return match; // Keep broken
        }
    });

    if (changed) {
        fs.writeFileSync(filePath, content);
    }
});
