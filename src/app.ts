import bot from "./bot"
import login from "./commands/login"
import logger from "./logger"
import UserManager from "./UserManager"

const RESPONSES = {
    OK: '--> OK <--'
}

async function startBot() {
    const childLogger = logger.child({ method: 'startBot' })

    await UserManager.init()
    childLogger.info('UserManager initialized done.')

    bot.onText(/\/login(.+)/, login)
    // bot.onText(/\/status(.+)/, status)
    // bot.onText(/\/load/, load)
}

startBot()

// decay origin ruby august oust reduce elite dove fossil tidy inmate mops aching ugly veered