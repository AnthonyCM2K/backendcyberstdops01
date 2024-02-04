const db = require('../config/config');// requerirr la base de datos

const Rol = {};

Rol.create = (id_user, id_rol, result) => {
    const sql = `
    INSERT INTO
        user_has_roles(
            id_user,
            id_rol,
            created_at,
            updated_at
        )
    VALUES(?, ?, ?, ?)
    `;

    db.query(
        sql,//consulta sql
        [id_user, id_rol, new Date(), new Date()],//parametros
        (err, res) => { //3. pasamos la funcion 
            if (err) {
                console.log('Error', err);
                result(err, null);
            }
            else {
                console.log('Usuario obtenido: ', res.insertID);
                result(null, res.insertID);
            }
        }
    )
}

module.exports = Rol;