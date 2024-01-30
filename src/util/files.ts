import * as fs from 'node:fs/promises';
import path from 'node:path';
import logger from './logger';

export default {
    exists, 
    read, 
    write, 
    relativeToRoot, 
    ensureDir
};

async function ensureDir(location: string) {
    if(await exists(location)) {
        logger.debug(`Path ${location} already existing. Directory not created.`)
        return location;
    }
    logger.debug(`Create directory ${location}`)
    await fs.mkdir(location, {recursive: true});
    logger.debug(`Create directory ${location} - OK`)
    return location;
}

async function exists(location: string) {
    logger.debug(`Check path ${location}`)
    try {
        await fs.stat(location);
        logger.debug(`Check path ${location} - existed`)
        return true;
    } catch {
        logger.debug(`Check path ${location} - did not exist`)
        return false;
    }
}

async function read(location: string) {
    logger.debug(`Read file from ${location}`)
    const content = await fs.readFile(location, {encoding: "utf-8"});
    logger.debug(`Read file from ${location} - OK`)
    return content;
}

async function write(content: string, location: string) {
    logger.debug(`Write file to ${location}`)
    await fs.writeFile(location, content, {encoding: "utf-8"})
    logger.debug(`Wrote file to ${location} - OK`)
}

function relativeToRoot(...segments: string[]) {
    const root = path.resolve(__dirname, "..", "..");
    return path.resolve(root, ...segments);
}