module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Battle', {
        title: {
            type: DataTypes.STRING
        },
        imageUrl: {
            type: DataTypes.STRING
        },
        history : {
            type: DataTypes.TEXT
        }
    })
}