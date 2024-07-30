import request from '@/api/index'

// 设置目标范围
export function setPreferences(data) {
    return request({
        url: '/user/preferences/save',
        method: 'POST',
        data: data
    })
}