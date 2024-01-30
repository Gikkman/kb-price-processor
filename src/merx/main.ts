import config from "../util/config";
import files from "../util/files";
import logger from "../util/logger";
import runner from "./runner";

async function main() {
    const configuration = await config.initialize();
    logger.initialize(configuration, "MERX");
    logger.info(`Initialized configuration`)
    
    logger.info(`Creating work directory`)
    const workDir = await files.ensureDir('_work');
    logger.info(`Created work directory ${workDir}`)

    logger.info(`Downlading xml document`)
    const xmlDocument = await runner.fetchXml(configuration)
    logger.info(`Downloaded xml document successfully`)
    
    logger.info(`Processing xml document`)
    const outputFileLocation = await runner.run(xmlDocument, workDir, configuration)
    logger.info(`Processed xml document successfully. Output written to ${outputFileLocation}`)
    
    logger.info(`Uploading xml document`)
    await runner.uploadXml(outputFileLocation, configuration);
    logger.info(`Uploaded xml document to ${configuration.merx.upload.path}`)
}
main()
    .then(() => {
        logger.info("Task completed successfully");
    })
    .catch(e => {
        logger.err("AN ERROR OCCURRED DURING MERX XML PROCESSING")
        console.log(e)
    })