import { MockEngine } from "./MockEngine"
import { SkynetProvider } from "./providers/SkynetProvider/SkynetProvider"
import {UserManager} from "./UserManager"
import config from "config"

describe('User manager', () => {
    test('init', async () => {
        const mockGetJSON = jest.fn()
        MockEngine.getJSON = mockGetJSON

        const userManager = new UserManager(MockEngine)

        userManager.init()

        expect(mockGetJSON.call.length).toBe(1)
        expect(mockGetJSON.mock.calls[0][0]).toBe(config.get('rootSeed'))
        expect(mockGetJSON.mock.calls[0][1]).toBe(config.get('sessionKey'))
    })    

    test('login', async () => {
        const mockGetJSON = jest.fn()
        const mockSetJSON = jest.fn()
        MockEngine.getJSON = mockGetJSON
        MockEngine.setJSON = mockSetJSON

        const userManager = new UserManager(MockEngine)

        userManager.init()
        userManager.login('ID', 'SEED')

        expect(mockSetJSON.call.length).toBe(1)
        expect(mockSetJSON.mock.calls[0][0]).toBe(config.get('rootSeed'))
        expect(mockSetJSON.mock.calls[0][1]).toBe(config.get('sessionKey'))
    })    
})