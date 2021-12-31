import { IProvider } from "../IProvider";
import { SkynetClient, genKeyPairFromSeed } from "skynet-js";

export class SkynetProvider implements IProvider {
    seed: string
    rootKey: string
    client!: SkynetClient;

    constructor(seed: string, rootKey: string) {
        this.seed = seed
        this.rootKey = rootKey
    }

    async init(): Promise<void> {
        this.client = new SkynetClient("https://siasky.net")
        await this.loadIndex()
    }

    async loadIndex(): Promise<void> {
        try {
            await this.client.browserClient.db.setJSON(this.privateKey, this.rootKey, {x: 'hello'});
            const { data, dataLink } = await this.client.browserClient.db.getJSON(this.publicKey, this.rootKey);
            console.log(data, dataLink)
        } catch(e) {
            console.log(e)
        }
    }

    get publicKey(): string {
        const { publicKey } = genKeyPairFromSeed(this.seed);
        return publicKey
    }
    get privateKey(): string {
        const { privateKey } = genKeyPairFromSeed(this.seed);
        return privateKey
    }
}
