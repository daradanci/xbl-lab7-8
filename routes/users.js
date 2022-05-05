const express = require('express')
const { getUserId, getUsers, getOnesDeeds } = require('H://myProjects//XML//daServerbot//database//database.js')
const router = express.Router()
const db = require('H://myProjects//XML//daServerbot//database//database.js')

// const deeds = require('H://myProjects//XML//daServerbot//views//deeds.ejs')
var ItemList = []

router.get('/', (req, res) => {
    // ItemList = [{ Deed: 'Сделать уроки', IsDone: true }, { Deed: 'Сделать уроки2', IsDone: false }]
    //БД
    console.log(req.query.name);
    res.sendFile('H://myProjects//XML//daServerbot//views//choose.html')
})
router.get('/new', (req, res) => {
    res.render('users/new')
})
router.get('/old', (req, res) => {
    res.render('users/old')
})
router.get('/back', (req, res) => {
    res.render('users')
})
router.post('/', async(req, res) => {

    if (!(await db.ifUser(req.body.nickname))) {
        await db.insertUser(req.body.nickname, req.body.password)
        res.redirect('/users/' + (await getUserId(req.body.nickname)))
    } else {
        console.log('Error. Cannot Add User: ' + req.body.nickname);
        res.render('users/new', { nickname: req.body.nickname, errmes: 'Try again!' })
    }

})
router.post('/old', async(req, res) => {
    if (await db.loginCheck(req.body.nickname, req.body.password)) {
        res.redirect('/users/' + (await getUserId(req.body.nickname)))
    } else {
        console.log('Error. Cannot Log In as User: ' + req.body.nickname);
        res.render('users/old', { nickname: req.body.nickname, errmes: 'Неверный логин или пароль' })
    }
})


router.post('/delete/:id', async(req, res) => {
    db.deleteDeed1(req.id, req.body.checkbox)
    await sleep(200);
    res.redirect('/users/' + req.id)

})

router.post('/add/:id', async(req, res) => {
    if (req.body.n != "") {
        await db.insertDeed(req.id, req.body.n)
        await sleep(200);
    }
    res.redirect('/users/' + req.id)

})
router.post('/change/:id', async(req, res) => {
    if (req.body.telchat != "") {
        await db.eraseChatId(req.body.telchat);
        await sleep(200);
        await db.setChatId1(req.id, req.body.telchat);
        await sleep(200);

    }
    res.redirect('/users/' + req.id)

})
router.route('/:id')
    .get(async(req, res) => {
        ItemList = await getOnesDeeds(req.id)
        let UserName = await db.getUserById(req.id)
        let ChatId = await db.getChatId(req.id)
        await sleep(200);
        console.log(ItemList)
        res.render('H://myProjects//XML//daServerbot//views//deeds.ejs', { newListItem: ItemList, UserName: UserName, UserId: req.id, ChatId: ChatId })

    })
    .put(async(req, res) => {
        await sleep(200);
        console.log(req.body.n);
        res.send('ADDING')
    })
    .delete(async(req, res) => {
        db.deleteDeed(req.id, req.body.checkbox)
        await sleep(200);
        // console.log(req.body.checkbox);
        res.redirect('/users/' + req.id)

    })



router.param('id', async(req, res, next, id) => {
    // req.user = users[id]
    // req.deeds = await db.getOnesDeeds(id)
    req.id = id;
    next();
})



module.exports = router

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}