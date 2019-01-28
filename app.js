/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-01-29 00:19:52 
 * @Last Modified by: 伟龙-Willon
 * @Last Modified time: 2019-01-29 00:46:52
 */
const http = require('http');
const WSS = require('ws').Server;
const server = http.createServer(
    require('ecstatic')({root:`${__dirname}/public`})
)
const wss = new WSS({server})
wss.on('connection',ws=>{
    console.log('client connected !!!')
    ws.on('message',msg=>{
        broadcast(msg)
    })
})

function broadcast(msg){
    wss.clients.forEach(client=>{
        client.send(msg)
    })
}

const port = 3000;
server.listen(process.argv[2] || port , ()=>{
    console.log(`server running......in ${port} port`)
})