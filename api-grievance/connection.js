const mongoose = require('mongoose');
const connect = async ()=> {
    try {
        let connection = await mongoose.connect(process.env.MONGODB_URI)
        console.log("Data base connected...");
    } catch(error) {
        console.log(error)
    }
}
module.exports = connect;