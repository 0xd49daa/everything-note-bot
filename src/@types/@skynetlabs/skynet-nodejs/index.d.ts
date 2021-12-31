declare module '@skynetlabs/skynet-nodejs' {
    export class SkynetClient {
        constructor(url: string)
        browserClient: any
        async uploadFile(filename: string): Promise<string>
        async downloadFile(filename: string, skyline: string): Promise<void>
    }

    export function genKeyPairFromSeed(seed: string): {
        publicKey: string
        privateKey: string
    }

    export function genKeyPairAndSeed(): {
        publicKey: string,
        privateKey: string,
        seed: string
    }
}