import * as fs from 'node:fs/promises';
import path from 'node:path';

export default {
    exists, 
    read, 
    write, 
    relativeToRoot, 
    ensureDir
};

async function ensureDir(location: string) {
    if(await exists(location)) return location;
    await fs.mkdir(location, {recursive: true});
    return location;
}

async function exists(location: string) {
    try {
        await fs.stat(location);
        return true;
    } catch {
        return false;
    }
}

async function read(location: string) {
    return await fs.readFile(location, {encoding: "utf-8"});
}

async function write(content: string, location: string) {
    return fs.writeFile(location, content, {encoding: "utf-8"})
}

function relativeToRoot(...segments: string[]) {
    const root = path.resolve(__dirname, "..", "..");
    return path.resolve(root, ...segments);
}