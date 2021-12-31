import { SkynetClient, genKeyPairFromSeed } from "@skynetlabs/skynet-nodejs";
import tmp from "tmp"
import fs from "node:fs/promises"

const client = new SkynetClient("https://siasky.net")

export async function getDataFromRegistry(seed: string, root: string): Promise<{data: any, revision: number}|undefined> {
  const { publicKey } = genKeyPairFromSeed(seed)

  const result = await client.browserClient.registry.getEntry(publicKey, root)

  if (result.entry) {
    // @ts-ignore
    return { data: Buffer.from(result.entry?.data.buffer).toString(), revision: result.entry.revision }
  }
}

export async function setDataToRegistry(seed: string, root: string, value: string, revision: number) {
  const { publicKey, privateKey } = genKeyPairFromSeed(seed)
  const entry = {     
    dataKey: root,
    data: Buffer.from(value),
    revision: BigInt(revision)
 };

  await client.browserClient.registry.setEntry(privateKey, entry)
}

export async function writeTempFile(data: string) {
  const tempfile = tmp.fileSync()
  await fs.writeFile(tempfile.name, data)
  return tempfile
}

export async function setJSON(seed: string, root: string, json: any) {
  const result = await getDataFromRegistry(seed, root)
  const next_revision = result?.revision !== undefined ? (result.revision + 1): 1

  const tempfile = await writeTempFile(JSON.stringify(json))
  const skylink = await client.uploadFile(tempfile.name)

  await setDataToRegistry(seed, root, skylink.substring(6), next_revision)
}

export async function getJSON(seed: string, root: string): Promise<any> {
  const result = await getDataFromRegistry(seed, root)
  const tempfile = tmp.fileSync()

  await client.downloadFile(tempfile.name, result?.data)

  const content = await fs.readFile(tempfile.name, )

  return JSON.parse(content.toString())
}