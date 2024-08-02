import request from '@/api/index'

// 设置目标范围
export function setPreferences(data) {
    return request({
        url: '/user/preferences/save/web',
        method: 'POST',
        data: data
    })
}
// 获取目标范围
export function getPreferences(data) {
    return request({
        url: '/user/preferences/get/web',
        method: 'POST',
        data: data
    })
}