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
        url: '/datar/lastindex/web',
        method: 'POST',
        data: data
    })
}
// 上传血糖数据
export function upData(data) {
    return request({
        url: '/datar/upload/web',
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
// 获取报告月份
export function getMonth(data) {
    return request({
        url: '/report/month/web',
        method: 'POST',
        data: data
    })
}
// 分页获取报告列表
export function getRepoetList(data) {
    return request({
        url: '/report/web',
        method: 'POST',
        data: data
    })
}
// 获取报告年份
export function getYear(data) {
    return request({
        url: '/report/year/web',
        method: 'POST',
        data: data
    })
}
// 分页获取报告列表
export function getReportList(data) {
    return request({
        url: '/report/devicelist/web',
        method: 'POST',
        data: data
    })
}
// 同步reader信息
export function syncReader(data) {
    return request({
        url: '/readerdevice/sync',
        method: 'POST',
        data: data
    })
}
// 移除reader信息
export function delReader(data) {
    return request({
        url: '/readerdevice/delete',
        method: 'POST',
        data: data
    })
}
// 获取所有reader列表
export function getReader(data) {
    return request({
        url: '/readerdevice/getlist',
        method: 'POST',
        data: data
    })
}
// 获取最新驱动
export function getDriver(data) {
    return request({
        url: '/readerdriver/last',
        method: 'POST',
        data: data
    })
}
// 获取reader最新一条事件id
export function getEventLastId(data) {
    return request({
        url: '/readerevent/lastid',
        method: 'POST',
        data: data
    })
}
// 上传reader事件
export function upEvent(data) {
    return request({
        url: '/readerevent/upload',
        method: 'POST',
        data: data
    })
}
// 分享报告
export function shareWeb(data) {
    return request({
        url: '/report/web/share',
        method: 'POST',
        headers:{
            'Content-Type':'multipart/form-data'
        },
        data: data,
        transformRequest:[function(){
            return data;
        }]
    })
}
// 获取最近分享报告6个邮箱
export function getShareList(data) {
    return request({
        url: '/report/web/share/mails',
        method: 'POST',
        data: data
    })
}