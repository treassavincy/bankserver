//servr creation
//1.import express and store in a const variable
const express=require('express');
const req = require('express/lib/request');
const { status } = require('express/lib/response');
const res = require('express/lib/response');
const jwt= require('jsonwebtoken') //import librry for token validation
const cors=require('cors')

//2.app creation using express
const app=express() 

//to parse Json datas from req body
app.use(express.json())
app.use(cors({origin:'http://localhost:4200'}))
//3.create port numbr  ..3000
app.listen(3000,()=>{console.log('srver started at port nmbr 3000');})

//import dataservice file from service folder to use register folder
const dataservice=require('./service/dataservice')
//4.resolve http request
//get request using gt mthod here in  'anguar path empty but here / is use frst lnding page'
// app.get('/',(req,res)=>{
//     res.send('Get method')
// })

// //post req

// app.post('/',(req,res)=>{
//     res.send('Post method')
// })


// //put
// app.put('/',(req,res)=>{
//     res.send('Put method')
// })
// //patch
// app.patch('/',(req,res)=>{
//     res.send('Patch method')
// })
// //delete
// app.delete('/',(req,res)=>{
//     res.send('delete method')
// })

// command   for windws npm i -g nodemon  for linux sudo npm i -g nodemon 



//register -post
app.post('/register',(req,res)=>{
    console.log(req.body);
     dataservice.register(req.body.acno,req.body.username,req.body.password).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

//middleware creation for token validtion
//middlwre gets stuck in req  so to tke new req next is used
const jwtmiddleware=(req,res,next)=>{
    try{
        console.log('routr spcfc middlwre strted');
    token=req.headers['token']  //token from client req body
    const data=jwt.verify(token,'secretkey')
    console.log(data);
    next()
    }
    catch{
        res.status(422).json(
            {
                statusCode:422,
                status:false,
                message:'Please login'
            }
        )
    }
}


//login -post
app.post('/login',(req,res)=>{
    console.log(req.body);
    dataservice.login(req.body.acno,req.body.pswd).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

//deposit

app.post('/deposit',jwtmiddleware,(req,res)=>{
    console.log(req.body)
    dataservice.deposit(req.body.acnum,req.body.pswrd,req.body.amnt).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

//withdraw

app.post('/withdraw',jwtmiddleware,(req,res)=>{
    console.log(req.body)
    dataservice.withdraw(req.body.acnum,req.body.pswrd,req.body.amnt).then(result=>{
        res.status(result.statusCode).json(result)
    })
})


app.post('/transaction',jwtmiddleware,(req,res)=>{
    console.log(req.body)
    dataservice.getTransaction(req.body.acno).then(result=>{
        res.status(result.statusCode).json(result)
    })
})
app.delete('/deleteacc/:acno',(req,res)=>{
dataservice.deleteacc(req.params.acno).then(result=>{
    res.status(result.statusCode).json(result)

})
})
// app.post('/transaction',(req,res)=>{
//     console.log(req.body);
//     result=dataservice.transaction(req.body.acno)
//     res.status(result.statusCode).json(result)
// })
