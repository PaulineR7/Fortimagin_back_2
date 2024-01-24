module.exports = (sequelize, DataTypes) => {
    return sequelize.define('battles', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "Le nom du battle pass est déjà pris"
            }
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        history : {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    })
}