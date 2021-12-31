import config from "config"

class User {
    seed: string = ""

    setSeed(seed: string) {
        this.seed = seed
    }

    // getPublicKey() {
    //     const { publicKey } = genKeyPairFromSeed(this.seed)
    //     return publicKey
    // }

    // async loadRoot() {
    //     const dataKey = config.get('rootKey')
    //     const { data, dataLink } = await client.browserClient.db.getJSON(publicKey, dataKey);
    //     return { data, dataLink }
    // }
}

export default User