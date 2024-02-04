const db = require('../config/config');
const bcrypt = require('bcryptjs');

const User = {};

// Sentencia sql que nos permitira obtener el usuario por id  //agregamos el nuevo methodo findById
// result = funcion
User.findById = (id, result) => {

    const sql = `
    SELECT
        CONVERT(U.id, char) AS id,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone,
        U.password,
        json_arrayagg(
            json_object(
                'id', CONVERT(R.id, char),
                'name', R.name,
                'image', R.image,
                'route', R.route
            )
        ) as roles
    FROM
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id
    INNER JOIN
        roles AS R
    ON
        UHR.id_rol = R.id
    WHERE
        U.id = ?
    GROUP BY
        U.id
    `;

    db.query(
        sql,//consulta sql
        [id],//parametros
        (err, user) => { //3. pasamos la funcion 
            if (err) {
                console.log('Error', err);
                result(err, null);
            }
            else {
                console.log('Usuario obtenido: ', user[0]);
                result(null, user[0]);
            }
        }
    )
}

User.findByEmail = (email, result) => {

    const sql = `
    SELECT
        U.id,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone,
        U.password,
        json_arrayagg(
            json_object(
                'id', CONVERT(R.id, char),
                'name', R.name,
                'image', R.image,
                'route', R.route
            )
        ) as roles
    FROM
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id
    INNER JOIN
        roles AS R
    ON
        UHR.id_rol = R.id
    WHERE
        email = ?
    GROUP BY
        U.id
    `;

    db.query(
        sql,//consulta sql
        [email],//parametros
        (err, user) => { //3. pasamos la funcion 
            if (err) {
                console.log('Error', err);
                result(err, null);
            }
            else {
                console.log('Usuario obtenido: ', user[0]);
                result(null, user[0]);
            }
        }
    )
}

User.create = async (user, result) => {

    const hash = await bcrypt.hash(user.password, 10);

    const sql = `
        INSERT INTO
            users(
                email,
                name,
                lastname,
                phone,
                image,
                password,
                created_at,
                updated_at
            )  
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query
    (
        sql,
        [
            user.email,
            user.name,
            user.lastname,
            user.phone,
            user.image,
            hash,
            new Date(),
            new Date()
        ],
        (err, res) => {
            if (err) {
                console.log('Error', err);
                result(err, null);
            }
            else {
                console.log('Id del nuevo usuario: ', res.insertId);
                result(null, res.insertId);
            }
        }
    )
}

User.update = (user, result) => {
    const sql = `
    UPDATE
        users
    SET
        name = ?,
        lastname = ?,
        phone = ?,
        image = ?,
        updated_at =?
    WHERE
        id = ?
    `;

    db.query//envio a la base de datos
    (
        sql,
        [
            
            user.name,
            user.lastname,
            user.phone,
            user.image,
            new Date(),
            user.id
        ],
        (err, res) => {
            if (err) {
                console.log('Error', err);
                result(err, null);
            }
            else {
                console.log('Usuario actualizado ', user.id);
                result(null, user.id);
            }
        }
    )


}

User.updateWithoutImage = (user, result) => {
    const sql = `
    UPDATE
        users
    SET
        name = ?,
        lastname = ?,
        phone = ?,
        updated_at =?,
        resultado_cuestionario = ?
    WHERE
        id = ?
    `;

    db.query
    (
        sql,
        [
            
            user.name,
            user.lastname,
            user.phone,
            
            new Date(),
            user.resultado_cuestionario,
            user.id
        ],
        (err, res) => {
            if (err) {
                console.log('Error', err);
                result(err, null);
            }
            else {
                console.log('Usuario actualizado ', user.id);
                result(null, user.id);
            }
        }
    )
}

module.exports = User;