const userList = require('./data/list/internalTest')

userList.RECORDS.map((user, index) => {
    console.log(`${user.firstname} <${user.email}>`)
})