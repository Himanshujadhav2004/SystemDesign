const express = require("express");

const app =express();

const PORT = process.argv[2] || 3001;

     // index 0 "node",   
    // index 1  "server.js"
     // index 2     "3001"    


app.get("/",(req,res)=>{

    res.send(`Reques Handle By This Server  ${PORT}`);
})

app.listen(PORT,()=>{
    console.log(`Server is Runnign on port ${PORT}`);
})

