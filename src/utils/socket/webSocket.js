import { Message } from "element-ui";
import {generateKeys,arrayBufferToBase64,calShareKey} from '@/utils/socket/ecdh'
import {aesEncrypt,aesDecrypt} from '@/utils/socket/aes'
import {handelMessage} from '@/utils/socket/socketMessage'
import socketLog from '@/utils/socket/socketLog'
import store from '@/store'

let socket = null; //实例对象
let lockReconnect = false; //是否真正建立连接
let port = [8971,8972,8973,8974,8975,8976,8977,8978,8979,8980]; //端口号
let port_index = 0; //端口号下标
let repeat = 0; //重连次数
let status = 0; //连接状态 0开始建立连接 1连接成功 2交换秘钥成功 3连接失败 4连接中断
let share_key = null //AES加密共享秘钥
let exchange_shareKey = "com.ihealth.cgm" //AES加密共享秘钥
let privateKey = null //私钥
const initwebSocket = async()=>{
    if("WebSocket" in window){
        var wsUrl = 'ws://ivd.cgm3.com:'+port[port_index]+'/uploader'
        socketLog.log('尝试连接'+wsUrl,)
        socket = new WebSocket(wsUrl);
        status = 0
        socket.onerror = webSocketOnError;
        socket.onmessage = webSocketOnMessage;
        socket.onclose = closeWebsocket;
        socket.onopen = openWebsocket;
    }else{
        Message.error({
            showClose: true,
            message: '您的浏览器不支持websocket，请更换Chrome或者Firefox'
        });
    }
}


//重置
const reset = () => {
    repeat=0
    status=0
    port_index = 0

}
//建立连接
const openWebsocket = async(e) => {
    socketLog.log('连接成功')
    lockReconnect = true
    status = 1
    // 连接建立成功后开始协商秘钥
    let publickey = await getEcdhPublicKey()
    socketLog.log("开始协商秘钥...")
    sendWebsocket({"path":"changekey", "data":{"publicKey":publickey}})
}
// 重新连接
const reconnect = () =>{
    let self = this
    if(lockReconnect){
        return ;
    }
    port_index++
    if(port_index>9){
        port_index = 0
        repeat++
        if(repeat>2){
            status = 3
            store.dispatch('setErrorCode',2) //驱动启动失败
            socketLog.log('WebSocket 连接失败，端口都不被连接');
            return;
        }
        socketLog.log(`正在尝试第 ${repeat} 次重连...`);
    }
    initwebSocket()
}

// 发送数据
const sendWebsocket =(data) =>{
    if(!lockReconnect){
        socketLog.log("webSocket未连接")
        return
    }
    socketLog.log("发送的内容: " + JSON.stringify(data))
    const path = data.path
    //对data内容加密
    if ("data" in data){
        const key = path == "changekey" ? exchange_shareKey : share_key
        data["data"] = aesEncrypt(data["data"],key)  
    }
    let json = JSON.stringify(data)
    socket.send(json)
}
   

const webSocketOnError = (e) => {
    socketLog.log('连接中断',e)
}  
// 接收数据
const webSocketOnMessage = async(e) => {
    let info = JSON.parse(e.data)
    let path = info.path
    let code = info.code
    if(code==505||code==504||code==505){   //reader连接失败
        socketLog.log('响应错误:code'+info.code+"msg:"+info.msg)
        store.dispatch('setErrorCode',5) 
        return
    } 
    if(code==506){  //reader已连接，直接执行下一步
        store.dispatch('setReaderConnect',2)
       getReaderInfo()
    }
    if(code!=200){
        socketLog.log('响应错误:code'+info.code+"msg:"+info.msg)
        return
    }
    if(path == "changekey"){
        let data_info = aesDecrypt(info.data,exchange_shareKey)
        let procedure_public_key = data_info.publicKey
        let share_data = await calShareKey(privateKey,procedure_public_key)
        share_key = arrayBufferToBase64(share_data)
        getAppInfo()
        socketLog.log("协商秘钥结果: " + share_key + "\n")
    }else{
        info.data = aesDecrypt(info.data,share_key)
        socketLog.log('响应的内容：'+JSON.stringify(info.data))
        handelMessage(info)
    }

}



const closeWebsocket= (e) => {
   
    lockReconnect = false
    if(e.code==1000||e.code>1010){
        socketLog.log('连接已关闭',e)
    }else{
        // 异常关闭，需要重连
        reconnect();
    }
} 
//断开连接
const close = () => {
    //WebSocket对象也有发送和关闭的两个方法，只需要在自定义方法中分别调用send()和close()即可实现。
    socket?socket.close():'';  //登出时关闭socket ，需要判断socket是否实例化
}   


//获取公钥
const getEcdhPublicKey = async()=>{
    const ecdh = await generateKeys()
    privateKey = ecdh.privateKey
    //导出公钥转为base64字符串
    const public_bytes = await window.crypto.subtle.exportKey("raw", ecdh.publicKey);
    const base64_public_key = arrayBufferToBase64(public_bytes)
    return base64_public_key
}

//获取驱动程序的版本信息
const getAppInfo = () =>{
    socketLog.log("获取驱动程序的版本信息")
    let data = {"path": "getAppInfo"}
    sendWebsocket(data)
}

///获取电脑串口连接的reader设备
const getReaderList = () => {
    socketLog.log("获取Reader设备列表")
    let data = {"path": "getReaderDevices"}
    sendWebsocket(data)
}

//连接Reader设备,这里默认连接设备列表的第一个设备  
const connectReader = (device) =>{
    socketLog.log("连接Reader设备")
    let content = {"path": "connectReaderDevice","data":{"readerMac":device.readerMac}}
    sendWebsocket(content)
}

//读取Reader设备信息
 const getReaderInfo = () =>{
    socketLog.log("读取Reader设备信息")
    let content = {"path": "getReaderDeviceInfo"}
    sendWebsocket(content)
}

 //同步时间
 const setTime = (data) =>{
    socketLog.log("同步时间")
    let timestamp = Math.floor(Date.now() / 1000);
    let content = {"path": "setTime", "data":data}
    sendWebsocket(content)
}

// 同步目标范围
const setRange = (data) => {
    let content = {"path": "setGlucoseRange","data":{"low":54,"high":180}}
    sendWebsocket(content)
}

// 获取reader设备绑定的发射器列表
const cgmList = () => {
    let content ={"path": "getBindDevices"}
    sendWebsocket(content)
}

// 获取血糖数据
const queryGlucoseData = (data) => {
    let content ={"path": "getGlucoseData","data":data}
    sendWebsocket(content)
}



export default {
    initwebSocket,
    reset,
    getReaderList,
    connectReader,
    getReaderInfo,
    setTime,
    setRange,
    cgmList,
    queryGlucoseData,
    close
}