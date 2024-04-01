const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true
    },
    password: {
        type:String,
        minLength:[8, 'Password length should be atleast 8']
    },
    profilePicture:String,
    activeFeatures: [Schema.Types.ObjectId]
});

UserSchema.methods.createJWT = function() {
    return jwt.sign({id:this._id, email:this.email}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_LIFETIME});
}

UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt()
    const hashedPass = await bcrypt.hash(this.password, salt);

    this.password = hashedPass;
})

UserSchema.methods.comparePassword = async function(pass) {
    const match = await bcrypt.compare(pass, this.password);
    
    return match;
}

UserSchema.methods.getHashed = async function(pass) {
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(pass, salt);

    return hashedPass;
}

module.exports = mongoose.model("User", UserSchema);