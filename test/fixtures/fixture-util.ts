import * as fs from 'node:fs'
import * as path from 'node:path'
import { readXml } from '../../src/util/xml';

export enum Project {
    merx = "merx"
}

export function getXmlFixturePath(project: Project) {
    const name = project+".xml";
    return path.join("test", "fixtures", name);
}

export function loadXmlResult(path: string) {
    return readXml(path)
}

export function createTemporaryWorkDirectory() {
    const rnd = Math.floor(Math.random()*50+1);
    const location = path.join("test", ".temp-"+rnd);
    fs.mkdirSync(location);
    return location;
}

export function cleanupTemporaryWorkDirectories() {
    const location = path.join("test")
    fs.readdirSync(location, {withFileTypes: true})
        .filter(el => el.isDirectory())
        .filter(el => el.name.startsWith(".temp"))
        .forEach(el => fs.rmSync(path.join("test", el.name), {force: true, recursive: true}));
}