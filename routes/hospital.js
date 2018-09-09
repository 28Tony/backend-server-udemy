var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Hospital = require('../models/hospital');

//================================================
// Obtener todos los hospitales
//================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(

            (err, hospitales) => {

                if (err) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error al cargar hospitales',
                        errors: err
                    });
                }

                Hospital.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                            //mensaje: 'Get de hospitales!'
                    });
                });


            });


}); // fin del obtener todos los hospitales

/*
//================================================
// Middleware Verificar token
//================================================

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

//================================================
// Crear un nuevo hospital
//================================================

app.post('/', mdAutenticacion.verficaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id

    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });


    })



}); // fin del crear usuarios


//================================================
// Actualizar datos de usuarios
//================================================



app.put('/:id', mdAutenticacion.verficaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar hospital",
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese id' }
            });
        }

        hospital.nombre = body.nombre;

        hospital.usuario = req.usuario._id;


        hospital.save((err, hospitalGuardado) => {


            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar hospital",
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            })
        });

    });
    /*
        res.status(200).json({
            ok: true,
            id: id
        })
        */
});


//================================================
// Eliminar usuarios
//================================================

app.delete('/:id', mdAutenticacion.verficaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: {
                    message: 'No existe un hospital con ese id'
                }
            });
        }


        res.status(200).json({
            ok: true,
            usuario: hospitalBorrado
        });
    });


});
module.exports = app;