import request from '@/api/index'
// 注销账号
export function deleteAccount(data) {
    return request({
        url: '/user/delete',
        method: 'POST',
        data: data
    })
}
// 账号密码登录
export function account(data) {
    return request({
        url: '/webuser/login/account',
        method: 'POST',
        data: data
    })
}
// 手机号登录
export function phoneLogin(data) {
    return request({
        url: '/webuser/login/phone',
        method: 'POST',
        data: data
    })
}
// 手机号注册
export function phoneRegister(data) {
    return request({
        url: '/webuser/regist/phone',
        method: 'POST',
        data: data
    })
}
// 获取验证码
export function sendsmscode(data) {
    return request({
        url: '/user/sendsmscode',
        method: 'POST',
        data: data
    })
}
// 验证验证码
export function verifysmscode(data) {
    return request({
        url: '/user/verifysmscode',
        method: 'POST',
        data: data
    })
}
// 修改密码
export function setPassword(data){
    return request({
        url: '/user/changepassword/web',
        method: 'POST',
        data: data
    })
}
// 重置密码
export function resetPassword(data){
    return request({
        url: '/user/resetpassword',
        method: 'POST',
        data: data
    })
}
// 获取隐私和条款
export function protocol(data) {
    return request({
        url: '/protocol/last',
        method: 'POST',
        data: data
    })
}
// 获取用户详情配置
export function configs(data) {
    return request({
        url: '/user/profile/configs',
        method: 'POST',
        data: data
    })
}
// 保存用户信息
export function saveInfo(data) {
    return request({
        url: '/user/profile/save',
        method: 'POST',
        data: data
    })
}
// 获取用户信息
export function getInfo(data) {
    return request({
        url: '/user/profile/get',
        method: 'POST',
        data: data
    })
}
// 上传头像
export function upAvatar(data) {
    return request({
        url: '/user/uploadlogo/web',
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: data,
        transformRequest:[function(){
            return data;
        }]
    })
}
// 邮箱注册
export function register(data) {
    return request({
        url: '/webuser/regist/email',
        method: 'POST',
        data: data
    })
}
// 发送邮箱验证码
export function sendEmailCode(data) {
    return request({
        url: '/user/sendmailcode',
        method: 'POST',
        data: data
    })
}
// 发送邮箱虚拟验证码
export function sendEmailTest(data) {
    return request({
        url: '/user/sendmailtest',
        method: 'POST',
        data: data
    })
}
// 验证邮箱验证码
export function verifymailcode(data) {
    return request({
        url: '/user/verifymailcode',
        method: 'POST',
        data: data
    })
}
// 验证用户是否存在
export function userExit(data) {
    return request({
        url: '/user/exist',
        method: 'POST',
        data: data
    })
}
