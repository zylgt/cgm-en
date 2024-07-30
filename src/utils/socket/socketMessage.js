import Socket from '@/utils/socket/webSocket'
import store from '@/store'
import {lastIndex} from '@/api/dataApi'

// 处理数据
export function handelMessage (res) {
    switch(res.path){
        case 'getAppInfo':
            //  判断是否有更新，没有更新进行下一步
            Socket.getReaderList()
            break;
        case 'getReaderDevices': //获取redaer列表，如果只有一台直接连接，否则选取连接
            store.dispatch('setDeviceList',res.data.devices)
            store.dispatch('setUpStep',3)
            if(res.data.devices.length==1){
                store.dispatch('setReaderConnect',1)
                Socket.connectReader(res.data.devices[0])
            }
            break;
        case 'connectReaderDevice': //连接reader
            store.dispatch('setReaderConnect',2)
            Socket.getReaderInfo()
            break;
        case 'getReaderDeviceInfo': //获取reader信息，判断是否需要同步时间和目标范围
            // 判断reader时间与当前时间差值为1000，则同步时间
            let timestamp = Math.floor(Date.now() / 1000)
            if( Math.abs(timestamp-res.data.currentTime)>=1000){
                Socket.setTime({timestamp:timestamp})
            }
            Socket.cgmList() // 同时获取绑定的发射器列表
            break;
        case 'getBindDevices': //获取reader绑定的发射器列表
            store.dispatch('setCgmList',res.data.devices)
            getLimit(res.data.devices)
            // if(res.data.devices.length>0){
            //     getBgData(res.data.devices[0].mac,50,getLastIndex(res.data.devices[0].mac)==-1?res.data.devices[0].firstIndex:getLastIndex(res.data.devices[0].mac)+1,res.data.devices[0].lastIndex)
            //     store.dispatch('setUpStep',4)
            // }
            break;
        case 'getGlucoseData': //获取的血糖数据
            upLoad(res.data)
            break;
    }
}


/**
 * 从服务器获取最后一条数据索引
 */

 async function getLastIndex(mac){
    let data = await lastIndex({'device_mac':mac}).then(response => {
        if(response.code == 1000){
           return response.data
        }else{
            this.$message({
                type: 'error',
                message: response.msg
            });
        }
    }).catch((res) => {
        console.log(res)
    })
    console.log(data)
    return data
}

/**
 * 上传血糖数据总条数
 * 
 * @param {*} devices  reader绑定的发射器列表
 */

 function getLimit(device){
    let limit = 0
    device.forEach(item=>{
        let last_index = getLastIndex(item.mac)
        limit +=item.lastIndex -( last_index==-1?item.firstIndex:last_index)
    })
    store.dispatch('seUpLimit',limit)
}



/**
 * 获取数据
 */
 let cgm_index = 0 
 let upProgess = 0

function getBgData(mac,size,start_index,last_index){
    if(start_index<=last_index){
        Socket.queryGlucoseData({"mac":mac,"size":size,"startIndex":start_index})
    }else{
        console.log('传完了')
    }
}
/**
 * 上传数据
 */


function upLoad(data){
    let datas  = []
    data.values.forEach(item=>{
        datas.push({
           "data_index":item.index,
           "data_ts":item.timestamp,
           "timezone":8,
           "value":item.value,
           "current":item.current,
           "temperature":item.temperature,
        })
    })
    let params = {
        device_mac:data.mac,
        start_index:data.startIndex,
        end_index:data.values[data.values.length-1].index,
        start_ts:data.values[0].timestamp,
        end_ts:data.values[data.values.length-1].timestamp,
        data_source:1,
        datas:datas
    }
    let device = store.getters.cgmList
    // 模拟服务器上传成功时间
    setTimeout(function(){
        // 判断当前mac是否上传完成
        let last_index = device[cgm_index].lastIndex
        let start_index
        if(device.length>1&&last_index==params.end_index&&cgm_index!=device.length-1){
            cgm_index++
            start_index = getLastIndex(device[cgm_index].mac)+1
        }else{
            start_index = data.values[data.values.length-1].index + 1
        }
        upProgess += data.values.length //页面进度不需要判断当前mac是否完成
        store.dispatch('setUpProgess',upProgess)
        getBgData(device[cgm_index].mac,50,start_index,last_index)
    },100)
}

