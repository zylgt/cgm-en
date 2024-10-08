const getters = {
  deviceList: state => state.socket.deviceList,
  upProgess: state => state.socket.upProgess,
  upStep: state => state.socket.upStep,
  readerConnect:state=>state.socket.readerConnect,
  cgmList:state=>state.socket.cgmList,
  errorCode:state=>state.socket.errorCode,
  upLimit :state=>state.socket.upLimit,
  socketStatus:state=>state.socket.socketStatus,
  unit :state=>state.setting.unit,
  targetScope:state=>state.setting.targetScope,
  originTargetScope:state=>state.setting.originTargetScope,
  timeFormat:state=>state.setting.timeFormat,
  PageHeight:state=>state.setting.height ,
  scale:state=>state.setting.scale,
  driver:state=>state.socket.driver,
  PdfLoad:state=>state.report.PdfLoad,
  pdfFile:state=>state.report.pdfFile,
  bgRange:state=>state.setting.bgRange,
  upIndex:state=>state.socket.upIndex
}
export default getters