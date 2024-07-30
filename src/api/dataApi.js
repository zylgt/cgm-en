import request from '@/api/index'


// 获取agp数据
export function getAgpData(data) {
    return request({
        url: '/data/app',
        method: 'POST',
        data: data
    })
}
// 获取agp报告基本信息
export function getAgpInfo(data) {
    return request({
        url: '/report/data/web',
        method: 'POST',
        data: data
    })
}
// 获取设备最后一条数据索引
export function lastIndex(data) {
    return request({
        url: '/data/lastindex',
        method: 'POST',
        data: data
    })
}
// 根据开始、结束时间获取事件
export function getEvent(data) {
    return request({
        url: '/event/getlist/web',
        method: 'POST',
        data: data
    })
}