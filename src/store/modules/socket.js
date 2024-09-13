const socket = {
    state:{
        deviceList:[], //设备列表
        upProgess:0 ,//已经上传条数
        upLimit:0 ,//上传数据条数
        upStep:1 , //上传步骤 1启动驱动 2启动中 3连接设备 4同步数据
        readerConnect:0, //reader连接状态 0未连接 1连接中 2选择连接 
        cgmList:[], //reader绑定的发射器列表
        errorCode:0, //0未发生错误 1驱动未安装 2驱动启动失败 3驱动有更新 5reader连接失败 6数据同步失败
        socketStatus:1, //1连接 2关闭 3错误
    },
    mutations:{
        SET_DEVICE_LIST:(state,deviceList) => {
            if(deviceList.length==1){
                state.deviceList.push(deviceList)
            }else{
                state.deviceList = deviceList
            }
        },
        SET_UP_PROGESS:(state,upProgess) => {
            state.upProgess = upProgess
        },
        SET_UP_STEP:(state,upStep) => {
            state.upStep = upStep
        },
        SET_READER_CONNECT:(state,readerConnect) => {
            console.log(readerConnect)
            state.readerConnect = readerConnect
        },
        SET_ERROR_CODE:(state,errorCode) => {
            state.errorCode = errorCode
        },
        SET_CGM_LIST:(state,cgmList) => {
            state.cgmList = cgmList
        },
        SET_UP_LIMIT:(state,upLimit) => {
            state.upLimit = upLimit
        },
        SET_SOCKET_STATUS:(state,socketStatus) => {
            state.socketStatus = socketStatus
        },
    },
    actions:{
        setDeviceList({commit},data){
            commit('SET_DEVICE_LIST',data)
        },
        setUpProgess({commit},data){
            commit('SET_UP_PROGESS',data)
        },
        setUpStep({commit},data){
            commit('SET_UP_STEP',data)
        },
        setReaderConnect({commit},data){
            commit('SET_READER_CONNECT',data)
        },
        setErrorCode({commit},data){
            commit('SET_ERROR_CODE',data)
        },
        setCgmList({commit},data){
            console.log(data)
            commit('SET_CGM_LIST',data)
        },
        seUpLimit({commit},data){
            commit('SET_UP_LIMIT',data)
        },
        setSocketStatus({commit},data){
            commit('SET_SOCKET_STATUS',data)
        }
    }
}

export default socket