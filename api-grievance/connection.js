const mongoose = require('mongoose');
const connect = async ()=> {
    try {
        let connection = await mongoose.connect('mongodb://127.0.0.1:27017/rd-grievance')
        console.log("Data base connected...");
    } catch(error) {
        console.log(error)
    }
}
module.exports = connect;