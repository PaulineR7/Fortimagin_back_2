const {User, Role, BattlePass} = require('../db/sequelizeSetup')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET_KEY = require('../configs/tokenData')

const rolesHierarchy = {
    edit: ["edit"],
    admin: ["admin", "edit"]
}

const login = (req, res) => {
    // A. On vérifie que l'utilisateur qui tente de se connecter existe bel et bien dans notre BDD
    User.scope('withPassword').findOne({ where: { pseudo: req.body.pseudo } })
        .then((result) => {
            // B. Si l'utilisateur n'existe pas, on renvoie une réponse erreur Client
            if (!result) {
                return res.status(404).json({ message: `Cet utilisateur n'existe pas.` })
            }

            return bcrypt.compare(req.body.password, result.password)
                .then((isValid) => {
                    if (!isValid) {
                        return res.status(401).json({ message: `Le mot de passe n'est pas valide.` })
                    }
                    const token = jwt.sign({
                        data: result.pseudo,
                        dataRole: result.roleId,
                        userId: result.id
                        // id: result.id
                        
                    }, SECRET_KEY, { expiresIn: '10h' });

                    // Possibilité de stocker le jwt dans un cookie côté client
                    // res.cookie('coworkingapi_jwt', token)
                    res.json({ message: `Login réussi`, data: token })
                })
        })
        .catch((error) => {
            res.status(500).json({ data: error.message })
        })
}

const protect = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: `Vous n'êtes pas authentifié.` })
    }

    const token = req.headers.authorization.split(' ')[1]

    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.pseudo = decoded.data
            next()
        } catch (error) {
            return res.status(403).json({ message: `Le token n'est pas valide.` })
        }
    }
}

const restrictToOwnUser = (model) => {
    return (req, res, next) => {
        User.findOne(
            {
                where:
                    { pseudo: req.pseudo }
            })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: `Pas d'utilisateur trouvé.` })
                }
                // on teste d'abord si le user est admin
                return Role.findByPk(user.roleId)
                    .then(role => {
                        if (rolesHierarchy[role.label].includes('admin')) {
                            return next()
                        }
                        console.log(model);
                        model.findByPk(req.params.id)
                            .then(resource => {
                                if (!resource) return res.status(404).json({ message: `La ressource n'existe pas.` })
                                if (user.id === resource.userId) {
                                    next()
                                } else {
                                    res.status(403).json({ message: `Vous n'êtes pas l'auteur de la ressource.` })
                                }
                            })
                            .catch(error => {
                                return res.status(500).json({ message: error.message })
                            })
                    })
            })
            .catch(error => console.log(error.message))
    }
}

const restrictToOwnUserBattlePass = () => {
    return (req, res, next) => {
        User.findOne(
            {
                where:
                    { pseudo: req.pseudo }
            })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: `Pas d'utilisateur trouvé.` })
                }
                // on teste d'abord si le user est admin
                return Role.findByPk(user.roleId)
                    .then(role => {
                        if (rolesHierarchy[role.label].includes('admin')) {
                            return next()
                        }
                        console.log(BattlePass)
                        BattlePass.findByPk(req.params.id)
                            .then(resource => {
                                if (!resource) return res.status(404).json({ message: `La ressource n'existe pas.` })
                                if (user.id === resource.userId) {
                                    next()
                                } else {
                                    res.status(403).json({ message: `Vous n'êtes pas l'auteur de la ressource.` })
                                }
                            })
                            .catch(error => {
                                return res.status(500).json({ message: error.message })
                            })
                    })
            })
            .catch(error => console.log(error.message))
    }
}

const correctUser = (req, res, next) => {
    User.findOne({ where: { pseudo: req.pseudo } })
        .then(authUser => {
            console.log(authUser.id, parseInt(req.params.id))
            if (authUser.id === parseInt(req.params.id)) {
                next()
            } else {
                res.status(403).json({ message: "Droits insuffisants." })
            }
        })
        .catch(error => {
            res.status(500).json({ message: error.message })
        })
}

module.exports = {login, protect, restrictToOwnUser, correctUser, restrictToOwnUserBattlePass}