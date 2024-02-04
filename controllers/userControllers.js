const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');
const Rol = require('../models/rol');

module.exports = {
    
    // nuevo metodo login
    login(req, res) {

        const email = req.body.email;
        const password = req.body.password;

        User.findByEmail(email, async (err, myUser) => {
            //
            console.log('Error ', err);
            console.log('USUARIO ', myUser);

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            //si no llega el usuario 
            if (!myUser) {
                return res.status(401).json({ // El cliente no tiene autorizacion para realizar esta peticion (401)
                    success: false,
                    message: 'El email no fue encontrado',
                    error: err
                });    
            }

            //comparacion entre contraseña ingresada con la contraseña encriptada de la bd
            const isPasswordValid = await bcrypt.compare(password, myUser.password);

            if (isPasswordValid) {
                const token = jwt.sign({id: myUser.id, email: myUser.email}, keys.secretOrKey, {});//para recibir el token de sesion mostrarlo en consola

                const data = {
                    id: `${myUser.id}`,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    //retornamos el rol o roles
                    roles: myUser.roles //ordenar a tipo JSON " roles: JSON.parse(myUser.roles)  " puede ser nesesario para cuando exiten varios roles
                }
                
                return res.status(201).json({
                    success: true,
                    message: 'El Usuario fue autenticado correctamente',
                    data: data //el id dek nuevo usuario que se registro
                });
            }
            else {
                return res.status(401).json({ // El cliente no tiene autorizacion para realizar esta peticion (401)
                    success: false,
                    message: 'El pasword es incorrecto',
                    //error: err
                });
            }


        });

    },


    register(req, res) {
        const user = req.body; //capturo datos que envia el cliente
        User.create(user, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data: data //el id dek nuevo usuario que se registro
            });

        });
    },


    async registerWithImage(req, res) {
        const user = JSON.parse(req.body.user); //capturo datos que envia el cliente
        
        const files = req.files;
        
        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }


        User.create(user, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            user.id = `${data}`;
            const token = jwt.sign({id: user.id, email: user.email}, keys.secretOrKey, {});//para recibir el token de sesion mostrarlo en consola
            user.session_token = `JWT ${token}`;//traiga al token que acabamos de crear

            //crear rol de ususario
            Rol.create(user.id, 1, (err, data) => {//1 posicion del rol en la lista de  db
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del rol de usuario',
                        error: err
                    });
                }

                return res.status(201).json({
                    success: true,
                    message: 'El registro se realizo correctamente',
                    data: user //el id dek nuevo usuario que se registro
                });

            }); 

            

        });
    },


    async updateWithImage(req, res) {
        const user = JSON.parse(req.body.user); //capturo datos que envia el cliente
        
        const files = req.files;
        
        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }


        User.update(user, (err, data) => {
            
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            User.findById(data, (err, myData) => {

                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del usuario',
                        error: err
                    });
                }
    
                myData.session_token = user.session_token;   
                //myData.roles = myData.roles;

                return res.status(201).json({
                    success: true,
                    message: 'El usuario se actualizó correctamente',
                    data: myData //retornamos la data del usuario
                });

            })
        });
    },

    async updateWithoutImage(req, res) {
        
        
        const user = req.body; //capturo datos que envia el cliente

        User.updateWithoutImage(user, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la actualización del usuario',
                    error: err
                });
            }

            User.findById(data, (err, myData) => {

                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del usuario',
                        error: err
                    });
                }

                myData.session_token = user.session_token;  
                //myData.roles = myData.roles;

                return res.status(201).json({
                    success: true,
                    message: 'Datos actualizados correctamente',
                    data: myData //retornamos la data del usuario
                });
    
            })
        });
    },

   
}