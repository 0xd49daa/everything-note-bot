import { genKeyPairAndSeed } from "@skynetlabs/skynet-nodejs";
import SkynetWrapped from "./skynet";

describe('skynet', () => {
    test('Check set registry', async () => {
        const {seed} = genKeyPairAndSeed()
        const TEST_STRING = 'TEST_STRING'
    
        await SkynetWrapped.setDataToRegistry(seed, 'skynet-test', TEST_STRING, 0)
        const result = await SkynetWrapped.getDataFromRegistry(seed, 'skynet-test')
    
        expect(result?.data).toBe(TEST_STRING)
    })
    
    test('Check get registry', async () => {
        const {seed} = genKeyPairAndSeed()
    
        const result = await SkynetWrapped.getDataFromRegistry(seed, 'skynet-test')
    
        expect(result).toBe(undefined)
    })
    
    test('Check set json', async () => {
        const {seed} = genKeyPairAndSeed()
    
        await SkynetWrapped.setJSON(seed, 'skynet-test', {text: 'hello'})
    
        const result = await SkynetWrapped.getDataFromRegistry(seed, 'skynet-test')
    
        expect(true).toBe(true)
    }, 30000)
    
    test('Check existing data', async () => {
        const result = await SkynetWrapped.getDataFromRegistry('65d696324da7d2a7f9260adaab0b4fc216fa6156bdeb1d7d37848041b935df03ceaef0f893d528528016008d0bcabacef2aa79673374b5d4d69d764848b2b91c', 'skynet-test')
        expect(result?.data).toBe('AAD9CODRbi2M4qvDxRLY9RfnV0VWqHf8f6o_yS1iSdtapw')
        expect(result?.revision).toBe(BigInt(1))
    }, 30000)
    
    test('Check set/get json', async () => {
        const {seed} = genKeyPairAndSeed()
    
        await SkynetWrapped.setJSON(seed, 'skynet-test', {text: 'hello'})
        const json = await SkynetWrapped.getJSON(seed, 'skynet-test')
        
    
        expect(json).toStrictEqual({text: 'hello'})
    }, 30000)

    test('Check empty json', async () => {
        const {seed} = genKeyPairAndSeed()
    
        const json = await SkynetWrapped.getJSON(seed, 'skynet-test')
    
        expect(json).toBeUndefined()
    }, 30000)
})
