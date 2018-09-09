var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app.use(fileUpload());



app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //Tipos de coleccion
    var tiposValidos = ['usuarios', 'hospitales', 'medicos'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida',
            errors: { message: 'tipo de coleccion no es valida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            errors: { message: 'debe seleccionar una imagen' }
        });

    }

    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //Extesiones aceptadas
    var extensionesValidas = ['png', 'jpg', 'gif'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'solo deben ser imagenes en formato ' + extensionesValidas.join(', ') }
        });
    }

    //Nombre del archivo personalizado

    var nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover archivo del temporal a uno en específico
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);



        /*
                res.status(200).json({
                    ok: true,
                    mensaje: 'Archivo movido',
                    extensionArchivo: extensionArchivo
                });

        */
    });

});



function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {

                return res.status(400).json({
                    ok: true,
                    mensaje: 'usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }



            var pathViejo = './uploads/usuarios/' + usuario.img;


            // Si existe elimina la imagen anterior

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }


            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });


            });

        }); // fin findById
    } // fin if usuarios

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {



            if (!medico) {

                return res.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe' }
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;


            // Si existe elimina la imagen anterior

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }


            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                //   medicoActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });


            });

        }); // fin findById

    } // fin de la parte de medicos

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {


            if (!hospital) {

                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;


            // Si existe elimina la imagen anterior

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }


            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                // hospitalActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });


            });

        }); // fin findById


    }

} // fin de la funcion

module.exports = app;