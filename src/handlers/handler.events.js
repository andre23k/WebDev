import { promises as fsPromises } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function LoadEvents() {
    const eventsDir = join(__dirname, '../events/');
    const eventsFilesNames = await getAllFiles(eventsDir, '.js');

    for (const eventFileName of eventsFilesNames) {
        const modulePath = pathToFileURL(eventFileName).href;
        await import(modulePath);
    }

    console.log(`${eventsFilesNames.length} Events | OK`);
}

async function getAllFiles(dir, extension, files = []) {
    const entries = await fsPromises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            await getAllFiles(fullPath, extension, files);
        } else if (fullPath.endsWith(extension)) {
            files.push(fullPath);
        }
    }

    return files;
}
