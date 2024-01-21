const { Sequelize, DataTypes } = require('sequelize');
const battlePassModel = require('../models/battlePassModel')
const userModel = require('../models/userModel')
const roleModel = require('../models/roleModel')
const commentModel = require('../models/commentModel')
const {setUsers, setBattlePass, setRoles} = require('../db/setDataSample')


const sequelize = new Sequelize('FortImagin', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
})

const BattlePass = battlePassModel(sequelize, DataTypes)
const User = userModel(sequelize, DataTypes)
const Role = roleModel(sequelize, DataTypes)
const Comment = commentModel(sequelize, DataTypes)

Role.hasMany(User)
User.belongsTo(Role)

User.hasMany(BattlePass)
BattlePass.belongsTo(User)

User.hasMany(Comment)
Comment.belongsTo(User)

sequelize.authenticate()
    .then(() => console.log('La connexion à la base de données a bien été établie.'))
    .catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))


sequelize.sync({ force: false })
    .then(async () => {
        await setRoles(Role)
        await setUsers(User)
        await setBattlePass(BattlePass)
    })
    .catch(error => {
        console.log(error)
    })





module.exports = {sequelize, BattlePass, User, Role, Comment}