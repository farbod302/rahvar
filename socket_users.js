
let socket_users = {
    list: [],
    setUsers(users) {
        this.list = users
    },
    getUsers() {
        return this.list
    },
    find_user(user_id) {
        let s_user = this.list.find(e => e.user_id === user_id)
        if (!s_user) return null
        return s_user.id
    }
}

module.exports = socket_users