const Difusiones = require('../models/Difusiones')

async function addDifusion (req, res) {
    try {
        const {
            reporte_id,
            medio_id,
            fecha_envio,
            estado_envio,
            msj_publi
        } = req.body

        const difusiones = Difusiones({
            reporte_id,
            medio_id,
            fecha_envio,
            estado_envio,
            msj_publi
        })

        const difusionesStored = await difusiones.save()

        res.status(201).send({ difusionesStored })
    } catch (e) {
        res.status(500).send({ message: e.message})
    }
}

async function getDifusion (req, res) {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const difusion = await Difusiones.find()
            .skip(skip)
            .limit(limit)
            .lean()
            .exec()
        
        const total = await Difusiones.countDocuments()
        const totalPages = Math.ceil(total / limit)

        res.status(200).send({ 
            difusion,
            pagination: {
                currentPage: page,
                totalPages,
                totalDocuments: total,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        })
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}

module.exports = {
    addDifusion,
    getDifusion
}
