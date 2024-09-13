import Socket from '@/utils/socket/webSocket'
import store from '@/store'
import {lastIndex,upData,syncReader} from '@/api/dataApi'
import router from '@/router'
// 处理数据
export async function handelMessage (res) {
    switch(res.path){
        case 'getAppInfo':
            //  判断是否有更新，没有更新进行下一步
            Socket.getReaderList()
            break;
        case 'findNewReader':
            /**
             * 检测到有驱动插入
             * 设备为0，直接连接
             * 设备为1，不做处理，因为已经处于同步数据状态
             * 设备为2且处于选择reader界面，直接追加到设备列表
             */
            if(store.getters.deviceList.length<=0){
                store.dispatch('setReaderConnect',1)
                Socket.connectReader(res.data.device)
            }else if(store.getters.deviceList.length>1&&store.getters.upStep==3){
                store.dispatch('setDeviceList',[res.data.device])
            }
            break;
        case 'getReaderDevices': //获取redaer列表，如果只有一台直接连接，否则选取连接
            console.log(res)
            if(res.data.devices.length==1){
                store.dispatch('setReaderConnect',1)
                store.dispatch('setUpStep',3)
                Socket.connectReader(res.data.devices[0])
            }else if(res.data.devices.length>1){
                store.dispatch('setReaderConnect',2)
                store.dispatch('setDeviceList',res.data.devices)
                store.dispatch('setUpStep',3)
            }else{
                store.dispatch('setReaderConnect',0)
                store.dispatch('setUpStep',3)
            }
            break;
        case 'connectReaderDevice': //连接reader
            Socket.getReaderInfo()
            break;
        case 'getReaderDeviceInfo': //获取reader信息
            upReader(res.data)
            Socket.setTime() 
            break;
        case 'setTime':
            Socket.setRange(store.getters.originTargetScope)
            break;
        case 'setGlucoseRange':
            Socket.cgmList() // 获取绑定的发射器列表
            break;
        case 'getBindDevices': //获取reader绑定的发射器列表
            store.dispatch('setCgmList',res.data.devices)
            getLimit(res.data.devices)
            if(res.data.devices.length>0){
                getBgData(res.data.devices[0].mac,50,await getLastIndex(res.data.devices[0].mac)==-1?res.data.devices[0].firstIndex:await getLastIndex(res.data.devices[0].mac)+1,res.data.devices[0].lastIndex)
                store.dispatch('setUpStep',4)
            }
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
    let  data = await lastIndex({'device_mac':mac}).then(response => {
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
    return data
}

/**
 * 上传血糖数据总条数
 * 
 * @param {*} devices  reader绑定的发射器列表
 */

async function getLimit(device){
    let limit = 0
    for(const item of device){
        let last_index = await getLastIndex(item.mac)
        console.log(last_index==-1,last_index,'lase_index')
        limit +=item.lastIndex -( last_index==-1?item.firstIndex:last_index)
    }
    store.dispatch('seUpLimit',limit)
}



/**
 * 获取数据
 */
 let cgm_index = 0 
 let upProgess = 0

function getBgData(mac,size,start_index,last_index){
    console.log(mac,size,start_index,last_index)
    if(start_index<=last_index){
        Socket.queryGlucoseData({"mac":mac,"size":size,"startIndex":start_index})
    }else{
        console.log('传完了')
        Socket.transferStatus(2) // 下发传输状态
        store.dispatch('setUpStep',1) 
        router.push('/report/overview')
        
    }
}
/**
 * 上传数据
 */


function upLoad(data){
    let datas  = []
    Socket.transferStatus(1) // 下发传输状态
    data.values.forEach(item=>{
        datas.push({
           "data_index":item.index,
           "data_ts":item.timestamp,
           "timezone":8,
           "value":item.value,
           "current":item.current,
           "temperature":Number(item.temperature),
        })
    })
    let params = {
        device_mac:data.mac,
        start_index:data.startIndex,
        end_index:data.values[data.values.length-1].index,
        start_ts:data.values[0].timestamp,
        end_ts:data.values[data.values.length-1].timestamp,
        data_source:1,
        datas:datas,
        online:0
    }
    let device = store.getters.cgmList
    upData(params).then(response => {
        if(response.code == 1000){
            // return response.data
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
        }else{
            this.$message({
                type: 'error',
                message: response.msg
            });
        }
    }).catch((res) => {
        console.log(res)
    })
}

/**
 * 上传reader信息
 */
function upReader(data){
    let params={
        "mac": data.readerMac,
        "firmware": data.firmware,
        "current_time": data.currentTime,
        "manufacturer": data.manufacturer,
        "model": data.model,
        "hardware": data.hardware,
        "hattery": data.battery,
        "high": data.high,
        "low": data.low,
        "emergent_alarm_low": data.emergentAlarmLow,
        "emergent_alarm_low_on": data.emergentAlarmLowOn,
        "alarm_low": data.alarmLow,
        "alarm_low_on": data.alarmLowOn,
        "alarm_high": data.alarmHigh,
        "alarm_high_on": data.alarmHighOn,
        "loss_time": data.lossTime,
        "loss_alarm_on": data.lossAlarmOn
    }
    syncReader(params).then(response => {
        if(response.code == 1000){
            console.log('上传成功')
        }else{
            this.$message({
                type: 'error',
                message: response.msg
            });
        }
    }).catch((res) => {
        console.log(res)
    })
}
