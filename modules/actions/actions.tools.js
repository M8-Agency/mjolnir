const moment = require('moment');

const validateAction = (event, actions) => {
    let valid = false
    if (event.limit === 'unique' && actions.length === 0) {
        valid = true
    } else if (event.limit === 'daily') {

        let sameDay = 0;
        actions.map((item, index) => {
            isSameDay = moment(item.createdAt).isSame(moment(), 'day')
            if (isSameDay) {
                sameDay++
            }
        })
        valid = (sameDay < event.top)

    } else if (event.limit === 'top' && actions.length < event.top) {
        valid = true
    }
    return valid
}

module.exports = { validateAction }