 
 // The Entire Picture of the RoundRobin LoadBalancer;
    //              GET /
    //                │
    //                ▼
    //          ┌───────────┐
    //          │  Browser  │
    //          └─────┬─────┘
    //                │
    //                ▼
    //       ┌──────────────────┐
    //       │ Load Balancer    │
    //       │    :3000         │
    //       └────────┬─────────┘
    //                │
    //         Round Robin
    //                │
    //       ┌────────┼────────┐
    //       ▼        ▼        ▼
    //    :3001     :3002    :3003
    //    Server     Server   Server
    //       │        │        │
    //       └────────┼────────┘
    //                │
    //             Response
    //                │
    //                ▼
    //          Load Balancer
    //                │
    //                ▼
    //             Browser



const express =require("express");
const http = require("http");


const app = express();

const servers =[
    {
        host:"localhost",
        port:3001
    },
    {
        host:"localhost",
        port:3002
    },{
        host:"localhost",
        port:3003
    }
]

let currentServer =0;
app.use((req,res)=>{
    //select the server initally 0 
    const server = servers[currentServer];

    //move to the next server to make it round robin we are using this 

    currentServer=(currentServer+1)%servers.length;
    console.log(`Request → Server ${server.port}`);

    //request option preparing an request for this 

    const options ={
        hostname:server.host, //localhost
        port:server.port, //3001 , 3002 ,3003
        path:req.url, // /
        method:req.method, // get 
        headers:req.headers
    };

    // froward request   this is the main part of the load Balancer
    // first the browser reqest the loadbalancer then loadBalancer request to the server 1 ,2  ,3
//             Request 1
// Browser ──────────────→ Load Balancer
//                             │
//                             │ Request 2
//                             ▼
//                          Server 3002

    const proxy = http.request(options,(ServerRes)=>{

        // ServerRes is the response of the server to the Load Balancer 
// Server 3002
//      │
//      │ Response
//      ▼
// Load Balancer
        

        // use to write the HTTP response header information
        res.writeHead(ServerRes.statusCode , ServerRes.headers);
        
        
        // send back the response of the server from loadbalancer to the browser
        ServerRes.pipe(res);
    })


    // if backend fails use the proxy

    proxy.on("error",()=>{
        console.log(`server ${server.port} is down`)
        res.status(503).send("server Unavailable")
    })

//Take the request coming from the client and send it to the backend server.
//pipe is used to stream the data 
req.pipe(proxy);

})

app.listen(3000,()=>{
        console.log("Load Balancer running on port 3000");
})