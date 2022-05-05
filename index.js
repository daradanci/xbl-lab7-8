// const http = require('http');
// const PORT = process.env.PORT || 5000;
// const server = http.createServer((req, res) => {
//     res.end('Сервер работает')
// })

// server.listen(PORT, () => console.log('Сервер стартовал, порт: ' + PORT))

const express = require("express");
const app = express();
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())



app.get('/', (req, res) => {
    console.log('Here');
    res.sendFile('H://myProjects//XML//daServerbot//views//choose.html')

})


const userRouter = require('./routes/users')
app.use('/users', userRouter)
app.listen(2000, () => {
    console.log('Starting!');
});