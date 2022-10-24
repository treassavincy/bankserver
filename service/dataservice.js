const jwt= require('jsonwebtoken') //import librry for token generation
const db=require('./db')
userDetails={
    1000:{acno:1000,username:'amal',password:123,balance:100000,transaction:[]},
    1001:{acno:1001,username:'banu',password:123,balance:10000,transaction:[]},
    1002:{acno:1002,username:'morbis',password:123,balance:4000000,transaction:[]},
    1003:{acno:1003,username:'sachin',password:123,balance:800000,transaction:[]},
   }
const register=(acno,username,password)=>{

 return db.User.findOne({acno}).then(user=>{
    if(user){
      return {          //here instead of true pr false obj with stats and msg returned
        status:false,
        statusCode:401,
        message:'User already exists'
      }
    }
    else{
      const newuser=new db.User({acno,username,password,balance:0,transaction:[]})
      newuser.save()
      return {
        status:true,statusCode:200,
        message:'Registration Successful'
      }
    }
  })
      }
      const login=(acno,pswd)=>{
    return db.User.findOne({acno,password:pswd}).then(user=>{
if(user){
  currentuser=user.username
  currentacno=acno
   const token=jwt.sign({currentacno:acno},'secretkey')//string without space
   return { 
     status:true,
     statusCode:200,
     message:'Login Successful',
     currentuser,
     currentacno,
     token
 }
}
else{
    
  return {
    status:false,
    statusCode:401,
    message:'Incorrect Password or Acno'
   }
}
    })
     }
    
     const deposit=(acnum,pswrd,amnt)=>
     {
    var amount=parseInt(amnt)
    return db.User.findOne({acno:acnum,password:pswrd}).then(user=>{
      if(user){
        user.balance+=amount
        user.transaction.push({type:'Credit',amount})
        user.save()//sve updtns in db
        return{
          status:true,
          statusCode:200,
          message:`${amount} credited and new balaance is ${user.balance}`
        }
      }
      else{
        return {
          status:false,
          statusCode:401,
          message:'Incorrect Password or Acno'
         }    }
    })
     }

     const withdraw=(acnum,pswrd,amnt)=>{
      var amount=parseInt(amnt)
      return db.User.findOne({acno:acnum,password:pswrd}).then(user=>{
        if(user){
          if(user.balance>amount){
          user.balance-=amount
          user.transaction.push({type:'Debit',amount})
          user.save()//sve updtns in db
          return{
            status:true,
            statusCode:200,
            message:`${amount} Debited and new balaance is ${user.balance}`
          }
        }
        else{
          return {
            status:false,
            statusCode:401,
            message:'Insufficient Balance'
           }   
        }
      }
        else{
          return {
            status:false,
            statusCode:401,
            message:'Incorrect Password or Acno'
           }    }
          
      })
  
     } 


    const getTransaction=(acno)=>{
      return db.User.findOne({acno}).then(user=>{
        if(user){
        return{            
          status:true,
          statusCode:200,
          transaction:user.transaction
        }
      }
      else{
        return {
          status:false,
          statusCode:401,
          message:'User doesnt exist'
         }
      }
      })
     
    
     }

     const deleteacc=(acno)=>{
      return db.User.deleteOne({acno}).then(user=>{
        if(user)
        {
          return{            
            status:true,
            statusCode:200,
            message:'Deleted Successfully'
          }
        }
        else{
          return {
            status:false,
          statusCode:401,
          message:'User doesnt exist'
          }
        }
      })
     }
module.exports={
  register,login,deposit,withdraw,getTransaction,deleteacc
}