const mongoose=require('mongoose');

const user = mongoose.Schema({
    name:{
        type:String,
        required: [true,"Name required"],
    },
    username:{
        type:String,
        required: [true,"Event name required"],
        unique:true,
    },
    // year:{
    //     type:Number,
    //     required: [true,"Year required"],
    // },
    devices:{
        type:[String],
    },
    password:{
        type:String,
        required: [true," Company Name required"],
        unique:true,
    },
    email: {
        type: String,
        required: [true, "Email required"],
        unique: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                // Regular expression for validating email addresses
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
});

module.exports =mongoose.model("User_list",user)