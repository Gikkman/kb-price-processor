import { Configuration } from "./config";

let loggerPrefix: string = "";
let logLevel: number = 99;

export default {
    initialize(config: Configuration, prefix: string) {
        logLevel = calculateLogLevel(config.log.level);
        loggerPrefix = prefix + " ";
    },
    debug(message: string): void {
        if (logLevel <= 0)
            log(loggerPrefix, "DEBUG", message)
    },
    info(message: string): void {
        if (logLevel <= 1)
            log(loggerPrefix, "INFO", message);
    },
    warn(message: string): void {
        if (logLevel <= 2)
            log(loggerPrefix, "WARN", message);
    },
    err(message: string): void {
        if (logLevel <= 3)
            log(loggerPrefix, "ERROR", message);
    }

}

function log(prefix: string, severity: "DEBUG" | "INFO" | "WARN" | "ERROR", message: string) {
    console.log(`[${severity}] ${prefix}- ${message}`);
}

function calculateLogLevel(level: string): number {
    switch(level.toLowerCase()) {
        case "debug": return 0;
        case "info": return 1;
        case "warning":
        case "warn": return 2;
        case "error": 
        case "err": return 3;
        case "off": return 4;
        default: return 1;
    }
}