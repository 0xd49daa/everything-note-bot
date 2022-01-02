import TelegramBot from "node-telegram-bot-api"
import bot from "../bot"
import logger from "../logger"
import { Responses } from "../responses"
import UserManager from "../UserManager"

const childLogger = logger.child({ module: "login" })

export default function login(msg: TelegramBot.Message, match: RegExpExecArray | null) {
    const { chat: {id} } = msg

    childLogger.debug({msg, match}, "login command")

    const seed = match?.[1].trim()

    if (!seed || seed.length < 30) {
        bot.sendMessage(id, 'Seed should be provided')
        return
    }
    
    UserManager.login("" + id, seed)

    bot.sendMessage(id, Responses.OK)
}