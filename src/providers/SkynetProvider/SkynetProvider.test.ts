import { MockEngine } from "../../MockEngine"
import { SkynetProvider } from "./SkynetProvider"

describe('Search engine', () => {
    test('Add Item', async () => {
        const mockUploadJSON = jest.fn().mockReturnValueOnce('ID_1').mockReturnValueOnce('ID_2')
        const mockGetJSON = jest.fn()

        MockEngine.uploadJSON = mockUploadJSON
        MockEngine.getJSON = mockGetJSON

        const provider = new SkynetProvider('seed', 'root', MockEngine)

        await provider.add({ text: `Term processing Terms are downcased by default. No stemming is performed, and no stop-word list is applied. 
        To customize how the terms are processed upon indexing, for example to normalize them, filter them, or to apply stemming, 
        the processTerm option can be used. The processTerm function should return the processed term as a string, or a falsy value 
        if the term should be discarded:` })

        await provider.add({ text: `MiniSearch natively supports all modern browsers implementing JavaScript standards, 
        but requires a polyfill when used in Internet Explorer, as it makes use functions like Object.entries, Array.includes, 
        and Array.from, which are standard but not available on older browsers. The package core-js is one such polyfill that 
        can be used to provide those functions.` })

        const result = await provider.search('available')

        expect(result[0].id).toBe('ID_2')
    })
})

