const moment = require('moment')

const responseData = (type, response, page) => {
    let data = []
    
    response.rows.map((item, index) => {
        data.push({
            "type": type,
            "id": (item.id) ? item.id : 0,
            "attributes": item,                    
        })
    })
    return {
        data,
        meta : {
            count : response.count,
            prev : `/api/${type}${ (page > 1) ? `?page=${page-1}` : `` }`,
            next : `/api/${type}?page=${page+1}`
        }
    }    
}

const responseDetail = (actionData) => {
    var secondsPassed = 0
    if(actionData.rows.length > 0){
        var start = moment(actionData.rows[0].createdAt,'HH:mm:ss');
        secondsPassed = moment().diff(start, 'seconds');
    }
    return {
        count : actionData.count,
        actions : actionData.rows,
        last : actionData.rows[0],
        elapsedTime : (secondsPassed > 0) ? secondsPassed : -1
    }
}

/**
 * 
 * @param {*} action 
 * @param {*} actionDetail 
 */
const validateAction = (action, actionDetail) => {
    let valid = false
    if(action.limit === 'unique' && actionDetail.count === 0){
        valid = true
    }else if(action.limit === 'daily'){
        
        let sameDay = 0;
        actionDetail.actions.map((item, index)=>{
            isSameDay = moment(item.createdAt).isSame(moment(), 'day')
            if(isSameDay){
                sameDay++
            }
        })
        valid = (sameDay < action.top)

    }else if(action.limit === 'top' && actionDetail.count < action.top){
        valid = true
    }
    return valid
}

const parseContent = function(str, data){
    for(index in data){
        str = str.replace(new RegExp(`{{${index}}}`, 'g'), data[index]);
    }
    return str
}

module.exports = {
    responseData,
    responseDetail,
    validateAction,
    parseContent
}