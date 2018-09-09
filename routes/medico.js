var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Medico = require('../models/medico');

//================================================
// Obtener todos los medicos
//================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(

            (err, medicos) => {

                if (err) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error al cargar medicos',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                            //mensaje: 'Get de medicos!'
                    });
                });


            });


}); // fin del obtener todos los medicos

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
// Crear un nuevo medico
//================================================

app.post('/', mdAutenticacion.verficaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital

    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });


    })



}); // fin del crear medicos


//================================================
// Actualizar datos de medicos
//================================================



app.put('/:id', mdAutenticacion.verficaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar medico",
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe un medico con ese id' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;


        medico.save((err, medicoGuardado) => {


            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar medico",
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                medico: medicoGuardado
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
// Eliminar medicos
//================================================

app.delete('/:id', mdAutenticacion.verficaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar medico',
                errors: err
            });
        }

        if (!medicoGuardado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: {
                    message: 'No existe un medico con ese id'
                }
            });
        }


        res.status(200).json({
            ok: true,
            medico: medicoGuardado
        });
    });


});
module.exports = app;