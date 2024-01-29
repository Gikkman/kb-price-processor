import {Client} from "basic-ftp";

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
    const client = new Client();
    await client.access({
        host: connectDetails.host,
        port: connectDetails.port,
        user: connectDetails.user,
        password: connectDetails.pass,
    })
    for(const task of uploads) {
        await client.uploadFrom(task.inputPath, task.uploadPath)
    }
    client.close();
}