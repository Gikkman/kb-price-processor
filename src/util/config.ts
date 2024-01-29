import files from "./files";
import baseConfig from '../../config.base.json'

export type Config = typeof baseConfig;
type Obj = Record<keyof any, any>;

let configCache: Config;

export default {
    initialize: async () => {
        const overrideConfigPath = files.relativeToRoot("config.override.json");
        configCache = await mergeConfigIfOverridesPresent(baseConfig, overrideConfigPath);
    },
    getConfig: (): Config => {
        if (!configCache) throw "Config is not initialized. Please call config.initialize() first."
        return { ...configCache };
    }
}

export async function mergeConfigIfOverridesPresent(baseConfig: Config, overridePath: string): Promise<Config> {
    if (await files.exists(overridePath)) {
        const overrides = JSON.parse(await files.read(overridePath));
        return mergeDeep(baseConfig, overrides) as Config;
    }
    return baseConfig;
}

/**
* Performs a deep merge of objects and returns new object. Does not modify
* objects (immutable) and merges arrays via concatenation.
*
* @param {...object} objects - Objects to merge
* @returns {object} New object with merged key/values
*/
export function mergeDeep(...objects: Obj[]) {
    const isObject = (obj: any): obj is Obj => obj && typeof obj === 'object';
    
    return objects.reduce((prev: Obj, obj: Obj) => {
      Object.keys(obj).forEach(key => {
        const pVal = prev[key];
        const oVal = obj[key];
        
        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = pVal.concat(...oVal);
        }
        else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = mergeDeep(pVal, oVal);
        }
        else {
          prev[key] = oVal;
        }
      });
      
      return prev;
    }, {});
  }