const Medios = require('../models/Medios')

async function addMedio (req, res) {
    try {
        const {
            nombre,
            tipo,
            url,
            contacto,
            activo
        } = req.body

        const medios = Medios({
            nombre,
            tipo,
            url,
            contacto,
            activo
        })

        const mediosStored = await medios.save()

        res.status(201).send({ mediosStored })
    } catch (e) {
        res.status(500).send({ message: e.message})
    }
}

async function getMedio (req, res) {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const medio = await Medios.find()
            .skip(skip)
            .limit(limit)
            .lean()
            .exec()
        
        const total = await Medios.countDocuments()
        const totalPages = Math.ceil(total / limit)

        res.status(200).send({ 
            medio,
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
    addMedio,
    getMedio
}
