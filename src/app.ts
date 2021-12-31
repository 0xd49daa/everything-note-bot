import bot from "./bot"
import load from "./commands/load"
import login from "./commands/login"

const RESPONSES = {
    OK: '--> OK <--'
}

function startBot() {
    bot.onText(/\/login(.+)/, login)
    // bot.onText(/\/load/, load)
}

function loadData() {

}

startBot()

// decay origin ruby august oust reduce elite dove fossil tidy inmate mops aching ugly veered