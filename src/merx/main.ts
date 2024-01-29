import config from "../util/config";
import files from "../util/files";
import runner from "./runner";

async function main() {
    await config.initialize();
    const configuration = config.getConfig();
    const workDir = await files.ensureDir('_work');

    const xmlDocument = await runner.fetchXml(configuration)
    const outputFileLocation = await runner.run(xmlDocument, workDir, configuration)
    await runner.uploadXml(outputFileLocation, configuration);
}
main().then(() => {
    console.log("Done");
})