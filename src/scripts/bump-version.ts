import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..', '..');

function bumpVersion(type: 'major' | 'minor' | 'patch'): void {
    // Read package.json
    const packageJsonPath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    // Parse current version
    const [major, minor, patch] = packageJson.version.split('.').map(Number);
    
    // Calculate new version
    let newVersion: string;
    switch (type) {
        case 'major':
            newVersion = `${major + 1}.0.0`;
            break;
        case 'minor':
            newVersion = `${major}.${minor + 1}.0`;
            break;
        case 'patch':
            newVersion = `${major}.${minor}.${patch + 1}`;
            break;
    }
    
    // Update package.json
    packageJson.version = newVersion;
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    
    console.log(`Version bumped to ${newVersion}`);
}

// Get bump type from command line argument
const bumpType = process.argv[2] as 'major' | 'minor' | 'patch';
if (!['major', 'minor', 'patch'].includes(bumpType)) {
    console.error('Please specify version bump type: major, minor, or patch');
    process.exit(1);
}

bumpVersion(bumpType); 