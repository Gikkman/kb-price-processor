import files from "./files";

import baseConfig from '../../config.base.json'
export type Config = typeof baseConfig;

let configCache: Config;

export default {
    initialize: async () => {
        const overrideConfigPath = files.relativeToRoot("config.override.json");
        configCache = await mergeConfigIfOverridesPresent(baseConfig, overrideConfigPath);
    },
    getConfig: (): Config => {
        if(!configCache) throw "Config is not initialized. Please call config.initialize() first."
        return {...configCache};
    }
}

async function mergeConfigIfOverridesPresent(baseConfig: Config, overridePath: string): Promise<Config> {
    if(await files.exists(overridePath)) {
        const overrides = JSON.parse(await files.read(overridePath));
        return {...baseConfig, ...overrides} as Config;
    }
    return baseConfig;
}