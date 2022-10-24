const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/bankserver',{useNewUrlParser:true})
const User=mongoose.model('User',{
    acno:Number,
    username:String,
    password:Number,
    balance:Number,
    transaction:[]
})

module.exports={
    User
}