module.exports = (sequelize, DataTypes) => {
    return sequelize.define('roles', {
        label: {
            type: DataTypes.STRING,
        }
    }) 
}