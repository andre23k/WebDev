import { promises as fsPromises } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

export default async function LoadEvents() {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const eventsDir = join(__dirname, '../events/');

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

    const eventsFilesNames = await getAllFiles(eventsDir, '.js');

    await Promise.all(eventsFilesNames.map(eventFileName => import(pathToFileURL(eventFileName).href)));

    console.log(`${eventsFilesNames.length} Events | OK`);
}