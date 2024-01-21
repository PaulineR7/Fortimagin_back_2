const express = require('express')
const {sequelize} = require('./db/sequelizeSetup')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const port = 3000

app.use(bodyParser.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.send('salut')
}) 

const userRouter= require('./routes/userRoutes')
const battlePassRouter = require('./routes/battlePassRoutes')
const commentRouter = require('./routes/commentRoutes')

app.use(cors())
app.use('/api/users', userRouter)
app.use('/api/battlepass', battlePassRouter)
app.use('/api/comment', commentRouter)

app.use('/images', express.static(__dirname + '/images'));

app.listen(port, () => {
    console.log(`Example app listening ${port}`)
})

