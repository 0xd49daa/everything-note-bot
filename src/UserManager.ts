import SkynetWrapped, { ISkynet } from "./providers/SkynetProvider/skynet-js/skynet"
import User from "./User"
import config from "config"
import Queue from "queue"
import logger from "./logger"

interface UserList {
    [key: string]: User
}

interface Sessions {
    [key: string]: string
}

const childLogger = logger.child({ module: "UserManager" })

export class UserManager {
    engine: ISkynet
    sessions: Sessions = {}
    users: UserList
    loaded: boolean = false
    queue: Queue

    constructor(engine: ISkynet) {
        this.engine = engine
        this.users = {}
        this.queue = Queue({ results: [] })
        this.queue.autostart = true
    }

    async init() {
        const result = await this.engine.getJSON(config.get('rootSeed'), config.get('sessionKey'))

        if (result) {
            this.sessions = result
        }

        childLogger.debug({ sessions: this.sessions }, "UserManager::init sessions")

        this.loaded = true
    }

    getUser(id: string) {
        return this.users[id]
    }

    setUser(id: string, user: User) {
        return this.users[id] = user
    }

    async login(id: string, seed: string) {
        this.sessions[id] = seed
        await this.saveSessions()
    }

    async saveSessions() {
        const promise = new Promise<void>((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    await this.engine.setJSON(config.get('rootSeed'), config.get('sessionKey'), this.sessions)
                    resolve()
                } catch(e) {
                    reject(e)
                }
            })
        })
    
        return promise
    }
}

export default new UserManager(SkynetWrapped)