import axios from 'axios';
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import files from './files';


export async function readXml<T extends object>(location: string, forceStringProperties: string[] = []) {
    const content = location.startsWith("http") ?
        readXmlFromInternet(location) :
        readXmlFromDisk(location);
    const parser = new XMLParser({
        numberParseOptions: {hex: true,leadingZeros: false, eNotation: true},
        tagValueProcessor: (name, value) => {
            if(forceStringProperties.includes(name)) {
                // Returning "undefined" means "don't parse this", and since all
                // values are strings by default, we effectively keep them unchanged
                return undefined 
            }
            return value;
        }
    });
    return parser.parse(await content) as T;
}

export function stringify(obj: object) {
    const builder = new XMLBuilder();
    return builder.build(obj) as string;
}

async function readXmlFromDisk(location: string): Promise<string> {
    return await files.read(location)
}

async function readXmlFromInternet(location: string): Promise<string> {
    const res = await axios.get(location);
    return res.data as string;
}