const mongoose = require('mongoose');

const connectDB = async () => {
    const data = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`Database ${data.connection.name} connected at hostaddress: ${data.connection.host} and port: ${data.connection.port} with server successfully`);
}

module.exports = connectDB;