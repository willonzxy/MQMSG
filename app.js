/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-01-29 00:19:52 
 * @Last Modified by: 伟龙-Willon
 * @Last Modified time: 2019-01-29 00:58:49
 */
const http = require('http');
const WSS = require('ws').Server;
const redis = require('redis');
const redisSub = redis.createClient();
const redisPub = redis.createClient();
const server = http.createServer(
    require('ecstatic')({root:`${__dirname}/public`})
)
const wss = new WSS({server})
wss.on('connection',ws=>{
    console.log('client connected !!!')
    ws.on('message',msg=>{
        //broadcast(msg)
        redisPub.publish('chat_msg',msg) // 发布到该chat_msg频道
    })
})
redisSub.subscribe('chat_msg'); // 订阅频道
redisSub.on('message',(channel,msg)=>{
    wss.clients.forEach(client=>{
        client.send(msg)
    })
})

const port = 3000;
server.listen(process.argv[2] || port , ()=>{
    console.log(`server running......in ${port} port`)
})