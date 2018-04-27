module.exports = function responseData(type, response, page){
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