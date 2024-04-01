const mongoose  = require('mongoose');

const featureSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    }
});

module.exports = mongoose.model('Feature', featureSchema);