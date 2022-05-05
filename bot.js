const TelApi = require('node-telegram-bot-api')
const { getFromTelegram, insertDeed } = require('./database/database')
const token = '[DELETED]'
const db = require('./database/database')

const bot = new TelApi(token, { polling: true })
var logging = 0
var reg = false
var newUser = { UserName: '', Password: '', ChatId: '' }
const start = () => {

    bot.setMyCommands([
        { command: '/start', description: 'Начало начал' },
        { command: '/info', description: 'Возник вопрос' },
        { command: '/go', description: 'Список дел' },
        { command: '/reg', description: 'Авторизовать новый аккаунт' },
        { command: '/log', description: 'Войти в существующий аккаунт' },
        { command: '/cancel', description: 'Отмена' }


    ])


    bot.on('message', async msg => {
        console.log('Получено сообщение:');
        console.log(msg.message_id);
        console.log(msg.from.username);
        console.log(msg.chat.id);
        console.log(msg.text);

        const text = msg.text
        const chatId = msg.chat.id
        if (text === '/cancel' || text === '/c') {
            logging = 0;
            reg = false;
            return 0;
        }
        if (logging > 0) {
            if (reg) {
                await regis(msg);
            } else {
                await log(msg);
            }
            console.log(newUser);

            return 0;
        }


        if (text === '/start') {
            await bot.sendMessage(chatId, 'Добро пожаловать!')
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/348/e30/348e3088-126b-4939-b317-e9036499c515/1.webp')
            checkId(chatId);

            return 0;
        }
        if (text === '/info') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/348/e30/348e3088-126b-4939-b317-e9036499c515/20.webp')
            await bot.sendMessage(chatId, 'Что за бот?')
            await bot.sendMessage(chatId, 'Это бот-записная книжка. Записывай, что хочешь!')
            await bot.sendMessage(chatId, 'Чтобы добавить новую запись, просто введите её.')

            return 0;
        }
        if (text === '/go') {
            await bot.sendMessage(chatId, 'Ваш список дел:')
            await showDeeds(chatId);
            return 0;
        }
        if (text === '/reg') {
            await bot.sendMessage(chatId, 'Введите логин:');
            logging = 2;
            reg = true;
            return 0;
        }
        if (text === '/log') {
            await bot.sendMessage(chatId, 'Введите логин:');
            logging = 2;
            reg = false;
            return 0;
        }

        await addingProcess(chatId, text);
        if (await db.TelegramCheck(chatId)) {
            await bot.sendMessage(chatId, 'Новая запись введена! Используйте /go для просмотра всего списка.');
        } else {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/348/e30/348e3088-126b-4939-b317-e9036499c515/38.webp')
        }

        // await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/348/e30/348e3088-126b-4939-b317-e9036499c515/38.webp')
    })

}

start()
async function checkId(chatId) {

    if (!(await db.TelegramCheck(chatId))) {
        await bot.sendMessage(chatId, 'Пожалуйста, войдите в систему для начала работы.');
        await bot.sendMessage(chatId, 'Используйте команду /reg для создания нового профиля или команду /log для авторизации в существующий профиль.');

    }
}

async function log(msg) {
    reg = false;
    switch (logging) {
        case 0:
            return 0;
        case 2:
            newUser.UserName = msg.text;
            logging = 3;
            await bot.sendMessage(msg.chat.id, 'Введите пароль:');
            return 0;
        case 3:
            newUser.Password = msg.text;
            newUser.ChatId = msg.chat.id;

            if (await db.loginCheck(newUser.UserName, newUser.Password)) {
                await bot.sendMessage(msg.chat.id, 'Вы успешно вошли в систему');
                await db.eraseChatId(newUser.ChatId);
                await db.setChatId(newUser.UserName, newUser.ChatId);
                logging = 0;
            } else {
                await bot.sendMessage(msg.chat.id, 'Неверный логин или пароль. Попробуйте заново.');
                logging = 2;
                await bot.sendMessage(msg.chat.id, 'Введите логин:');

            }
            return 0;
        default:
            return 0;
    }
}

async function regis(msg) {
    switch (logging) {
        case 0:
            return 0;
        case 2:
            newUser.UserName = msg.text;
            logging = 3;
            await bot.sendMessage(msg.chat.id, 'Введите пароль:');
            return 0;
        case 3:
            newUser.Password = msg.text;
            newUser.ChatId = msg.chat.id;

            if (!(await db.loginCheck(newUser.UserName, newUser.Password))) {
                await bot.sendMessage(msg.chat.id, 'Вы успешно вошли в систему');
                await db.eraseChatId(newUser.ChatId);
                await db.insertUser(newUser.UserName, newUser.Password, newUser.ChatId);
                logging = 0;
                reg = false;
            } else {
                await bot.sendMessage(msg.chat.id, 'Подобный аккаунт уже существует. Попробуйте заново.');
                logging = 2;
                await bot.sendMessage(msg.chat.id, 'Введите логин:');

            }
            return 0;
        default:
            return 0;
    }
}
async function showDeeds(chatId) {
    try {
        let id = await db.getFromTelegram(chatId);
        let itemList = await db.getOnesDeeds(id);
        console.log(id);
        console.log(itemList);

        for (var i = 0; i < itemList.length; i++) {
            var option = {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{ text: '✅', callback_data: ('/checked: ' + itemList[i]['IdDeed']) }],
                    ]
                })
            };
            bot.sendMessage(chatId, itemList[i]['Deed'], option);
        }
        return 0;
    } catch (err) {
        console.log(err)
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/348/e30/348e3088-126b-4939-b317-e9036499c515/34.webp')

    }

}

bot.on('callback_query', async(msg) => {
    console.log(msg.data)
    console.log(msg.from.id)
    if (msg.data.indexOf('/checked:') === 0) {
        await deletingProcess(msg.from.id, msg.data)
    }
})

async function deletingProcess(ChatId, data) {
    let id = await db.getFromTelegram(ChatId);
    let str = data.slice(10)
    await db.deleteDeed(str)
}

async function addingProcess(ChatId, data) {
    let id = await db.getFromTelegram(ChatId);
    await db.insertDeed(id, data)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}