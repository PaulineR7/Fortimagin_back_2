module.exports = (sequelize, DataTypes) => {
    return sequelize.define('comments', {
        reviews: {
            type: DataTypes.STRING,
            allowNull : false   
        },
        BattleId: {
            type: DataTypes.INTEGER,
            allowNull : false 
        },
    })
}