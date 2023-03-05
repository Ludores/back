const mongoose = require('mongoose')
const url = 'mongodb://127.0.0.1:27017/devHunt2'

async function connectDb() {
    await mongoose.connect(url);
    console.log('DB connected !');
}

module.exports = {
    connectDb
}
