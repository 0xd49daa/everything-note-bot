import User from "./User"

interface UserList {
    [key: string]: User
}

class UserManager {
    users: UserList

    constructor() {
        this.users = {}
    }

    getUser(id: string) {
        return this.users[id]
    }

    setUser(id: string, user: User) {
        return this.users[id] = user
    }
}

export default new UserManager()