const { UniqueConstraintError, ValidationError, QueryTypes } = require('sequelize')
const { BattlePass, User, sequelize } = require('../db/sequelizeSetup')


const findAllBattlePass= (req, res) => {
    BattlePass.findAll()
        .then((results) => {
            res.json(results)
            console.log(results)
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
}

const findAllBattlePassByUser = (req, res) => {
    
    User.findOne({ where: {pseudo : req.params.pseudo}})
        .then((results) => {
            if (!results) {
                res.status(404).json({ message: `Aucun utilisateur n'a été trouvé.` })
            }
            return BattlePass.findAll({ where: { userId : results.id}})
            .then((results) => {
                if (results.length === 0) {
                   return res.status(404).json({ message: `Vous n'avez pas encore créé de Battle pass` })
                }
                res.json(results)
            })
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
}



const findBattlePassByPk = (req, res) => {
    
    BattlePass.findByPk((parseInt(req.params.id)))
        .then((result) => {
            if (result) {
                res.json({ message: 'Un Battle Pass a été trouvé.', data: result })
            } else {
                res.status(404).json({ message: `Aucun Battle Pass n'a été trouvé.` })
            }
        })
        .catch((error) => {
            res.status(500).json({ message: 'Une erreur est survenue.', data: error.message })
        })
}




const createBattlePassWithImg = (req, res) => {
    User.findOne({ where: { pseudo: req.pseudo } })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: `L'utilisateur n'a pas été trouvé.` })
            }
            const newBattlePass = { ...req.body, userId: user.id, imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` }

            BattlePass.create(newBattlePass)
                .then((battlepass) => {
                    res.status(201).json({ message: 'Le Battle Pass a bien été créé', data: battlepass })
                })
                .catch((error) => {
                    if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
                        return res.status(400).json({ message: error.message })
                    }
                    res.status(500).json({ message: `Le Battle Pass n'a pas pu être créé`, data: error.message })
                })
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
}


const updateBattlePassWithImg = (req, res) => {
    BattlePass.findByPk(req.params.id)
        .then((result) => {
            if (result) {
                return result.update({ ...req.body, imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` })
                    .then(() => {
                        res.status(201).json({ message: 'Le Battle Pass a bien été mis à jour.', data: result })
                    })
            } else {
                res.status(404).json({ message: `Aucun Battle Pass à mettre à jour n'a été trouvé.` })
            }
        })
        .catch(error => {
            if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
                return res.status(400).json({ message: error.message })
            }
            res.status(500).json({ message: 'Une erreur est survenue.', data: error.message })
        })
}

const deleteBattlePass = (req, res) => {
    // A. On vérifie que l'id passé en req.params.id renvoie bien une ligne de notre table.
    BattlePass.findByPk(req.params.id)
        .then((result) => {
            // B. Si un battle pass correspond à l'id alors on exécute la méthode destroy()
            if (result) {
                return result.destroy()
                    // C. Si le battle pass est bien supprimé, on affiche un message avec comme data le battle pass récupéré dans le .findByPk()
                    .then((result) => {
                        res.json({ mesage: `Le battle pass a bien été supprimé.`, data: result })
                    })
            } else {
                // B Si aucun battle pass ne correspond à l'id alors on retourne une réponse à POSTMAN
                res.status(404).json({ mesage: `Aucun battle pass trouvé.` })
            }
        })
        .catch((error) => {
            // E. Si une erreur est survenue dès le findByPk, on retourne une réponse à POSTMAN
            res.status(500).json({ mesage: `La requête n'a pas aboutie.`, data: error.message })
        })
}






module.exports = {findAllBattlePass, findBattlePassByPk, createBattlePassWithImg, updateBattlePassWithImg, deleteBattlePass, findAllBattlePassByUser}