import bot from "../bot"
import UserManager from "../UserManager"

export default function login(msg, [source, match]) {
    const { chat: {id} } = msg

    if (!match || match.length < 30) {
        return bot.sendMessage(id, 'Seed should be provided')
    }

    const user = new User()
    user.setSeed(match)

    UserManager.setUser(id, user)

    return bot.sendMessage(id, RESPONSES.OK)
}