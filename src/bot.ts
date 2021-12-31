import config from "config"
import TelegramBot from "node-telegram-bot-api"

const bot = new TelegramBot(config.get('token'), { polling: true })

export default bot