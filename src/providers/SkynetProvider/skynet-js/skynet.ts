import fs from "node:fs/promises";
import tmp from "tmp";
import logger from "../../../logger";
import { decrypt, encrypt } from "../../../utils/encrypt";

const {genKeyPairFromSeed, SkynetClient} = require("@skynetlabs/skynet-nodejs")

const client = new SkynetClient("https://siasky.net")

const childLogger = logger.child({ module: "skynet" })

export interface ISkynet {
    setJSON(seed: string, root: string, json: any): Promise<void>
    getJSON(seed: string, root: string): Promise<any>
    uploadJSON(seed: string, json: JSON): Promise<string>
    downloadJSON(seed: string, skylink: string): Promise<string>
}

export interface ISkynetWrapped {
    new (): ISkynetWrappedInstance;
    setJSON(seed: string, root: string, json: any): Promise<void>
    getJSON(seed: string, root: string): Promise<any>
    getDataFromRegistry(seed: string, root: string): Promise<{ data: any, revision: number } | undefined>
    setDataToRegistry(seed: string, root: string, value: string, revision: number): Promise<void>
    uploadJSON(seed: string, json: JSON): Promise<string>
    downloadJSON(seed: string, skylink: string): Promise<string>
}

interface ISkynetWrappedInstance {
}

const SkynetWrapped: ISkynetWrapped = class SkynetWrapped {
    static async getDataFromRegistry(seed: string, root: string): Promise<{ data: string, revision: number } | undefined> {
        const { publicKey } = genKeyPairFromSeed(seed)

        const result = await client.browserClient.registry.getEntry(publicKey, root)

        if (result.entry) {
            const data: string = Buffer.from(result.entry?.data.buffer).toString()
            const revision = result.entry.revision

            childLogger.debug({
                root, data, revision
            }, "getDataFromRegistry")

            return { data, revision }
        } else {
            childLogger.debug({
                root
            }, "getDataFromRegistry::empty")
        }
    }

    static async setDataToRegistry(seed: string, root: string, value: string, revision: number) {
        const { publicKey, privateKey } = genKeyPairFromSeed(seed)

        childLogger.debug({
            dataKey: root,
            data: value,
            revision: revision
        }, "setDataToRegistry")

        const entry = {
            dataKey: root,
            data: Buffer.from(value),
            revision: BigInt(revision)
        };

        await client.browserClient.registry.setEntry(privateKey, entry)
    }

    static async writeTempFile(seed: string, data: JSON) {
        const { privateKey } = genKeyPairFromSeed(seed)
        const content = encrypt(data, privateKey)

        const tempfile = tmp.fileSync()
        await fs.writeFile(tempfile.name, content)
        return tempfile
    }

    static async uploadJSON(seed: string, json: JSON): Promise<string> {
        const tempfile = await SkynetWrapped.writeTempFile(seed, json)
        return await client.uploadFile(tempfile.name)
    }

    static async setJSON(seed: string, root: string, json: any) {
        const result = await SkynetWrapped.getDataFromRegistry(seed, root)
        const next_revision = result?.revision !== undefined ? (result.revision + 1) : 1

        const skylink = await this.uploadJSON(seed, json)

        await SkynetWrapped.setDataToRegistry(seed, root, skylink.substring(6), next_revision)
    }

    static async downloadJSON(seed: string, skylink: string): Promise<string> {
        const { privateKey } = genKeyPairFromSeed(seed)
        const tempfile = tmp.fileSync()
        await client.downloadFile(tempfile.name, skylink)
        const content = await fs.readFile(tempfile.name)
        return decrypt(content.toString(), privateKey)
    }

    static async getJSON(seed: string, root: string): Promise<any> {
        const result = await SkynetWrapped.getDataFromRegistry(seed, root)

        if (!result?.data) {
            return
        }

        return SkynetWrapped.downloadJSON(seed, result.data)
    }
}

export default SkynetWrapped
