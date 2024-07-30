const getters = {
    deviceList: state => state.socket.deviceList,
    upProgess: state => state.socket.upProgess,
    upStep: state => state.socket.upStep,
    readerConnect:state=>state.socket.readerConnect,
    cgmList:state=>state.socket.cgmList,
    errorCode:state=>state.socket.errorCode,
    upLimit :state=>state.socket.upLimit,
    unit :state=>state.setting.unit,
    targetScope:state=>state.setting.targetScope,
    timeFormat:state=>state.setting.timeFormat,
    PageHeight:state=>state.setting.height ,
  }
  export default getters