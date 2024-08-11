import { join } from 'path'
import { readdir, statSync } from 'fs'
import { pathToFileURL } from 'url';

export default async function loaddir(dir, callback) {
    if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return;

    const promises = [];

    readdir(dir, { withFileTypes: true, recursive: true }, function (err, files) {
        if (err) {
            promises.push(callback?.(err));
            return;
        }

        for (const file of files) {
            if (!file.isFile() || !file.name.endsWith(".js")) continue;

            promises.push(import(pathToFileURL(join(file.parentPath, file.name)))
                .then(output => callback?.(null, output, file))
                .catch(reason => callback?.(reason, null, file)));
        }
    });

    await Promise.all(promises);
}