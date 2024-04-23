const mongoose=require('mongoose');

const Entry = mongoose.Schema({
    createdAt: { type: Number, default: () => Math.floor(Date.now() / 1000) },
    deviceId:{
        type:String,
        required: [true,"Event name required"],
    },
    temperature:{
        type:String,
        required: [true," Company Name required"],
    },
    moisture:{
        type:String,
        required: [true," Company Name required"],
    },
    ec:{
        type:String,
        required: [true," Company Name required"],
    },
    pH:{
        type:String,
        required: [true," Company Name required"],
    },
    N:{
        type:String,
        required: [true," Company Name required"],
    },
    P:{
        type:String,
        required: [true," Company Name required"],
    },
    K:{
        type:String,
        required: [true," Company Name required"],
    },
});

module.exports =mongoose.model("entry_list",Entry)