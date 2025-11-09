const mongoose = require('mongoose')

mongoose.connection.on('open', () => console.log('MongoDB connected'))

async function connectDB ({ host, port, dbName }) {
    const uri = `mongodb://${host}:${port}/${dbName}`
    try {
        await mongoose.connect(uri)
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err)
        throw err
    }
}

module.exports = connectDB
