let User = require("../models/User.js");
let bcrypt = require("bcrypt");
let saltRounds = 10;
const createAdmin = async (req, res)=> {
    try {
        let user = await User.findOne({ email: 'naushad@rdec.in'});
        if(!user) {
            user = new User();
            user.firstName = 'Naushad';
            user.lastName = 'Imam';
            user.email = 'naushad@rdec.in'
            user.mobileNo = '1234456788'
            user.password =bcrypt.hashSync('12345', saltRounds),
            user.userType = 4;
            user.isVerified = 'Verified';
           
            user = await user.save();
        }

    } catch(err) {

    }
}
module.exports = {
    createAdmin
}