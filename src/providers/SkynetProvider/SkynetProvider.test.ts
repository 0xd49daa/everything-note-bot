import { SkynetProvider } from "./SkynetProvider"

test('Initialize skyet', async () => {
    const provider = new SkynetProvider("decay origin ruby august oust reduce elite dove fossil tidy inmate mops aching ugly veered", "everything-note-telegram")
    await provider.init()
    expect(true).toBe(true)
})
