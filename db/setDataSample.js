const mockUsers = require('../db/mock-users')
const mockBattlePass = require('../db/mock-battlePass')
const bcrypt = require('bcrypt')

const setBattlePass = (BattlePass) => {
    return Promise.all(mockBattlePass.map((element) => {
        const newBattlePass = { ...element, id: null }
        return BattlePass.create(newBattlePass)
            .then(() => { })
            .catch((error) => {
                console.log(error.message)
            })
    }))
}

const setUsers = (User) => {
    return Promise.all(mockUsers.map(user => {
        return bcrypt.hash(user.password, 10)
            .then(hashResult => {
                return User.create({ ...user, password: hashResult })
                    .then(() => {})
                    .catch((error) => {
                        console.log(error.message)
                    })
            })
    }))
}

const setRoles = (Role) => {
    return Promise.all([Role.create({ label: "admin" }), Role.create({ label: "edit" })])
}

module.exports = {setUsers, setBattlePass, setRoles}
