/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-01-29 00:19:52 
 * @Last Modified by: 伟龙-Willon
 * @Last Modified time: 2019-03-03 11:15:40
 */
const http = require('http');
const WSS = require('ws').Server;
const server = http.createServer(
    require('ecstatic')({root:`${__dirname}/public`})
)
const wss = new WSS({server})
const args = require('minimist')(process.argv.slice(2));
const zmq = require('zmq');
const pubSocket = zmq.socket('pub');
pubSocket.bind(`tcp://127.0.0.1:${args['pub']}`)
const subSocket = zmq.socket('sub')
const subPorts = [].concat(args['sub'])
subPorts.forEach(p=>{
    console.log(`subsortbing to ${p}`)
    subSocket.connect(`tcp://127.0.0.1:${p}`)
})
subSocket.subscribe('chat'); // 订阅来自sub端口的chat频道
subSocket.on('message',msg=>{
    console.log(`from other server ${msg}`)
    broadcast(msg.toString().split(' ')[1])
})
wss.on('connection',ws=>{
    console.log('client connected !!!')
    ws.on('message',msg=>{
        broadcast(msg)  // 广播自身端口
        pubSocket.send(`chat ${msg}`) // 通过次端口发布广播消息
    })
})
function broadcast(msg){
    wss.clients.forEach(client=>{
        client.send(msg)
    })
}
const port = args['http'];
server.listen(port || 3000 , ()=>{
    console.log(`server running......in ${port} port`)
})