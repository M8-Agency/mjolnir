require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

function generateToken(userData) {
    return {
        id: userData.id,
        email: userData.email,
        isAdmin: userData.isAdmin
    }
}

module.exports = (db) => {
    const userModel = require('./users.model')(db);


    return {
       async find(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY)
                const userData = (tokenData.isAdmin) ? await userModel.findAll() : await userModel.findById(tokenData.id)  
                return userData;
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },

        async findOne(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY)
                const targetId = (tokenData.isAdmin) ? req.params.id : tokenData.id;
                const userData = await userModel.findById(targetId);
                if (userData) {
                    userData.password = null;
                }
                return userData
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },

        async create(req, h) {
            try {
                const encryptedPassword = await bcrypt.hash(req.payload.password, 10)
                req.payload.password = encryptedPassword;
                let userData = await userModel.create(req.payload);
                
                if (userData) {
                    token = await jwt.sign(generateToken(userData), process.env.JWT_KEY);
                    userData = {
                        ...userData.dataValues,
                        password : null,
                        token
                    }
                    return userData;
                }
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },

        async update(req, h) {
            try {
                if (req.payload.password) {
                    const encryptedPassword = await bcrypt.hash(req.payload.password, 10)
                    req.payload.password = encryptedPassword;
                }
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY)
                const targetId = (tokenData.isAdmin) ? req.params.id : tokenData.id;                
                const userData = await userModel.update(
                    req.payload,
                    {
                        where: {
                            id: targetId
                        }
                    }
                )
                //Return data saved
                return req.payload
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },

        async destroy(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY)
                const targetId = (tokenData.isAdmin) ? req.params.id : tokenData.id;                    
                const userData = await userModel.destroy({
                    where: {
                        id: targetId
                    }
                })
                return userData;
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },
    }

}