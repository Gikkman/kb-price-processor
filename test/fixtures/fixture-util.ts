import * as fs from 'node:fs'
import * as path from 'node:path'
import { readXml } from '../../src/util/xml';

export enum Fixture {
    merx = "merx.xml",
    config = "config-override.json"
}

export function getFixturePath(fixture: Fixture) {
    return path.join("test", "fixtures", fixture);
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