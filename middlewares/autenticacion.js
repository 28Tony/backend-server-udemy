var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


//================================================
// Middleware Verificar token
//================================================

exports.verficaToken = function(req, res, next) {

        var token = req.query.token;
        jwt.verify(token, SEED, (err, decoded) => {

            if (err) {
                return res.status(401).json({
                    ok: false,
                    mensaje: 'Token incorrecto',
                    errors: err
                });
            }
            req.usuario = decoded.usuario;
            next();
            /*
            return res.status(200).json({
                ok: true,
                decoded: decoded
            });
            */

        });
    }
    /*     ESTE BLOQUE ES PARTE DE COMO HACERLO NO EN UNA FUNCION
    app.use('/', (req, res, next) => {

        var token = req.query.token;
        jwt.verify(token, SEED, (err, decoded) => {

            if (err) {
                return res.status(401).json({
                    ok: false,
                    mensaje: 'Token incorrecto',
                    errors: err
                });
            }
            next();
        });
    });


    */