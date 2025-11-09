const Reporte = require('../models/Reporte')

async function addReporte (req, res) {
    try {
        const {
            usuario_id,
            titulo,
            descripcion,
            categoria,
            ubicacion,
            imgUrl,
            estado,
            validado_por
        } = req.body

        const reporte = Reporte({
            usuario_id,
            titulo,
            descripcion,
            categoria,
            ubicacion,
            imgUrl,
            estado,
            validado_por
        })

        if (req.file) {
            const { filename } = req.file
            reporte.setImgUrl(filename)
        }

        const reporteStored = await reporte.save()

        res.status(201).send({ reporteStored })
    } catch (e) {
        res.status(500).send({ message: e.message})
    }
}

async function getReporte (req, res) {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const reporte = await Reporte.find()
            .skip(skip)
            .limit(limit)
            .lean()
            .exec()
        
        const total = await Reporte.countDocuments()
        const totalPages = Math.ceil(total / limit)

        res.status(200).send({ 
            reporte,
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
    addReporte,
    getReporte
}
