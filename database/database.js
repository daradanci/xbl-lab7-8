const { get } = require('express/lib/response');
const sql = require('mssql')


const config = {
    user: 'user1',
    password: 'sa',
    database: 'daSERVERbotDB',
    server: 'DARADANCIPC',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}


async function getOnesDeeds(id) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query('select d.IdDeed,d.Deed,d.IsDone from deeds as d ' +
            'join users as u on (u.IdUser=d.UserId) where u.IdUser=' + id);
        // console.log(res['recordset']);
        sql.close();
        return res['recordset'];
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}

async function insertDeed(UserId, Deed) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query('insert into deeds (Deed, UserId) ' +
            "values('" + Deed + "', '" + UserId + "')");
        sql.close();
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}

async function deleteDeed1(UserId, Deed) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query(`delete from deeds where UserId=${UserId} and Deed='${Deed}'`);
        sql.close();
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}
async function deleteDeed(DeedId) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query(`delete from deeds where IdDeed=${DeedId}`);
        sql.close();
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}
async function check(id, text) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query('update deeds set IsDone=(1-IsDone) ' +
            "where Deed = '" + text + "' and UserId=" + id);
        sql.close();
        return 0;
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}

async function uncheck(id, text) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query('update deeds set IsDone = 0 ' +
            "where Deed = '" + text + "' and UserId=" + id);
        sql.close();
        return 0;
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}

async function getUsers() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query('select UserName from users');
        console.log(res['recordset']);
        sql.close();
        return res['recordset'];
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}
async function getUserById(UserId) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query(`select UserName from users where IdUser=${UserId}`);
        console.log(res['recordset'][0]['UserName']);
        sql.close();
        return res['recordset'][0]['UserName'];
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}
async function getUserId(UserName) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query(`select IdUser from users where UserName='${UserName}'`);
        console.log(res['recordset'][0]['IdUser']);
        sql.close();
        return res['recordset'][0]['IdUser'];
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}
async function insertUser(UserName, Password) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query('insert into dbo.Users (UserName, [Password])' +
            "values('" + UserName + "', '" + Password + "')");
        sql.close();
        return res['recordset'];
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}
async function insertUser(UserName, Password, ChatId) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query('insert into dbo.Users (UserName, [Password], ChatId)' +
            `values('${UserName}','${Password}','${ChatId}')`);
        sql.close();
        return res['recordset'];
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}
async function ifUser(UserName) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query(`select UserName from users where UserName='${UserName}'`);
        console.log('Пользователь найден');
        console.log(res['recordset']);
        sql.close();
        return (res['recordset'].length != 0);
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}

async function loginCheck(UserName, Password) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query(`select UserName from users where UserName='${UserName}' and password='${Password}'`);
        console.log('Попытка войти: ' + UserName + ' ' + Password);
        console.log(res['recordset']);
        sql.close();
        return (res['recordset'].length != 0);
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}

async function getChatId(UserId) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query(`select ChatId from users where IdUser=${UserId}`);
        console.log(res['recordset'][0]['ChatId']);
        sql.close();
        return res['recordset'][0]['ChatId'];
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}
async function setChatId(UserName, ChatId) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query(`update  users set ChatId='${ChatId}' where UserName='${UserName}'`);
        console.log(`Обновлена привязка: ${UserName} : ${ChatId}`);
        sql.close();
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}
async function setChatId1(UserId, ChatId) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query(`update  users set ChatId='${ChatId}' where IdUser='${UserId}'`);
        console.log(`Обновлена привязка: ${UserId} : ${ChatId}`);
        sql.close();
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}
async function eraseChatId(ChatId) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query(`update  users set ChatId='${0}' where ChatId='${ChatId}'`);
        console.log(`Обновлена привязка: ${UserName} : ${ChatId}`);
        sql.close();
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}
async function TelegramCheck(ChatId) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query(`select IdUser from users where ChatId='${ChatId}' `);
        console.log('Попытка войти через телеграм: ' + ChatId);
        console.log(res['recordset']);
        sql.close();
        return (res['recordset'].length != 0);
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}
async function getFromTelegram(ChatId) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query(`select IdUser from users where ChatId='${ChatId}' `);
        // console.log(res['recordset'][0]['IdUser']);
        sql.close();
        return res['recordset'][0]['IdUser']
    } catch (error) {
        console.log(error.message);
        sql.close();
    }
}

module.exports = {
    config: config,
    getOnesDeeds: getOnesDeeds,
    insertDeed: insertDeed,
    deleteDeed: deleteDeed,
    check: check,
    getUsers: getUsers,
    getUserId: getUserId,
    getUserById: getUserById,
    insertUser: insertUser,
    ifUser: ifUser,
    loginCheck: loginCheck,
    getChatId: getChatId,
    setChatId: setChatId,
    setChatId1: setChatId1,
    eraseChatId: eraseChatId,
    TelegramCheck: TelegramCheck,
    getFromTelegram: getFromTelegram,
    deleteDeed1: deleteDeed1
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}