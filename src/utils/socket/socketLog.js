const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  
  const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const mSecond = date.getMilliseconds()
    return [hour, minute, second, mSecond].map(formatNumber).join(':')
  }
function log (a){
    console.log(`[SOCKET | ${formatTime(new Date()) } ]: ` + a)
}
function warn(a) {
    console.log(`[SOCKET | ${formatTime(new Date())} ]: ` + a)
}
function error(a) {
    console.error(`[SOCKET | ${formatTime(new Date())} ]: ` + a)
}

export default   {
    log,warn,error
}