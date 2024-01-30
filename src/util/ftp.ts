import {Client} from "basic-ftp";
import logger from "./logger";

type ConnectDetails = {
    user: string,
    pass: string,
    host: string,
    port: number,

}
type UploadFile = {
    inputPath: string,
    uploadPath: string,
}

export async function upload(connectDetails: ConnectDetails, ...uploads: UploadFile[]) {
    logger.debug("FTP client initiate")
    const client = new Client();
    await client.access({
        host: connectDetails.host,
        port: connectDetails.port,
        user: connectDetails.user,
        password: connectDetails.pass,
    })
    logger.debug("FTP client initiate - OK")
    for(const task of uploads) {
        logger.debug(`FTP upload (local) ${task.inputPath} -> (remote) ${task.uploadPath}`)
        await client.uploadFrom(task.inputPath, task.uploadPath)
        logger.debug(`FTP upload (local) ${task.inputPath} -> (remote) ${task.uploadPath} - OK`)
    }
    client.close();
    logger.debug(`FTP client closed`)
}