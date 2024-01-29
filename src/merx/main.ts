import config from "../util/config";
import files from "../util/files";
import runner from "./runner";

async function main() {
    await config.initialize();
    const configuration = config.getConfig();
    console.log(`Initialized configuration`)

    const workDir = await files.ensureDir('_work');
    console.log(`Created work directory ${workDir}`)

    const xmlDocument = await runner.fetchXml(configuration)
    console.log(`Downloaded xml document successfully`)

    const outputFileLocation = await runner.run(xmlDocument, workDir, configuration)
    console.log(`Processed xml document successfully. Output written to ${outputFileLocation}`)
    
    await runner.uploadXml(outputFileLocation, configuration);
    console.log(`Uploaded xml document to ${configuration.merx.upload.path}`)
}
main()
.then(() => {
    console.log("Task completed successfully");
})
.catch(e => {
    console.log("AN ERROR OCCURRED DURING MERX XML PROCESSING")
    console.log(e)
})