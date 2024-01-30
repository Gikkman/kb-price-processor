import files from "./files";
import baseConfig from '../../config.base.json'
import logger from "./logger";

export type Configuration = typeof baseConfig;
type Obj = Record<keyof any, any>;

let configCache: Configuration;

export default {
    initialize: async () => {
        const overrideConfigPath = files.relativeToRoot("config.override.json");
        configCache = await mergeConfigIfOverridesPresent(baseConfig, overrideConfigPath);
        return configCache;
    },
}

export async function mergeConfigIfOverridesPresent(baseConfig: Configuration, overridePath: string): Promise<Configuration> {
  logger.debug(`Configuration overrides lookup at '${overridePath}`)
    if (await files.exists(overridePath)) {
      logger.debug("Configuration overrides found")
        const overrides = JSON.parse(await files.read(overridePath));
        return mergeDeep(baseConfig, overrides) as Configuration;
    }
    logger.warn("Configuration overrides not found. The project will use only the config from 'config.base.json'")
    return baseConfig;
}

export function mergeDeep(...objects: Obj[]): object {
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