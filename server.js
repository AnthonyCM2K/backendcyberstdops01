const express = require('express');//Facilita la creación APIs mediante la simplificación del manejo de rutas, solicitudes y respuestas.
const app = express();
const http = require('http');//se utiliza para crear un servidor HTTP que se utiliza junto con Express para manejar las solicitudes HTTP entrantes
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');//midelwar
const passport = require('passport');//Facilita la gestión de sesiones y la protección de rutas específicas.
const multer = require('multer');//Multer es un middleware para el procesamiento de datos en formularios que se envían a través de solicitudes HTTP multipart/form-data

/*
* IMPORTAR RUTAS
*/
const usersRoutes =require('./routes/userRoutes');


const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);

//multer
const upload = multer({
    storage: multer.memoryStorage()
});


/*
* LLAMADO DE LAS RUTAS
*/
usersRoutes(app, upload);

//actualizamos ip 192.168.1.14
server.listen(3000, '192.168.1.18' || 'localhost', function() {
    console.log('Aplicacion de NodesJS ' + port + ' Iniciada...')
});

app.get('/', (req, res) => {
    res.send('Ruta raiz del backend');
});

app.get('/test', (req, res) => {
    res.send('Ruta raiz del backend');
});

//ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});