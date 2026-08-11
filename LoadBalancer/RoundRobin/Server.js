const express = require("express");

const app =express();

app.get("/",(req,res)=>{

    res.send("Server Started");
})

app.listen(8080,(err)=>{
    console.log(err);
})

