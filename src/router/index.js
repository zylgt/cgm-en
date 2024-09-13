import Vue from 'vue'
import VueRouter from 'vue-router'
import sysend from 'sysend'
import {getToken} from '@/utils/auth'

Vue.use(VueRouter)

//解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
//push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};
//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => err);

}

const iconReport = require('@/assets/image/icon-report.png');
const iconUpload = require('@/assets/image/icon-upload.png');
const iconSetting = require('@/assets/image/icon-setting.png');
const iconHelp = require('@/assets/image/icon-help.png');
const iconReportCheck = require('@/assets/image/icon-report-check.png');
const iconUploadCheck = require('@/assets/image/icon-upload-check.png');
const iconSettingCheck = require('@/assets/image/icon-setting-check.png');
const iconHelpCheck = require('@/assets/image/icon-help-check.png');

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: { title: "登录"},
    component:(resolve) => require(["@/views/login/index"], resolve)
  },{
    path:'/',
    redirect: "/report/overview",
    component:(resolve) => require(["@/views/layout/layout"], resolve),
    children:[{
      path:'/report',
      name:'report',
      redirect: "/report/overview",
      component:(resolve) => require(["@/views/report/index"], resolve),
      meta:{title:'report',icon:iconReport,icons:iconReportCheck,isShow:true},
      children:[{
        path:'/report/overview',
        name:'overview',
        component:(resolve) => require(["@/views/report/overview"], resolve),
        meta:{title:'overview',icon:'el-icon-setting',isShow:true}
      },{
        path:'/report/AGP',
        name:'AGP',
        component:(resolve) => require(["@/views/report/AGP"], resolve),
        meta:{title:'AGP',icon:'el-icon-setting',isShow:true}
      },{
        path:'/report/dayReport',
        name:'dayReport',
        component:(resolve) => require(["@/views/report/dayReport"], resolve),
        meta:{title:'dayReport',icon:'el-icon-setting',isShow:true}
      },{
        path:'/report/weekReport',
        name:'weekReport',
        component:(resolve) => require(["@/views/report/weekReport"], resolve),
        meta:{title:'weekReport',icon:'el-icon-setting',isShow:true}
      }]
    },{
      path:'/upLoad',
      name:'upLoad',
      component:(resolve) => require(["@/views/Procedure/upLoad"], resolve),
      meta:{title:'upLoad',icon:iconUpload,icons:iconUploadCheck,isShow:true}
    },{
      path:'/help',
      name:'help',
      component:(resolve) => require(["@/views/help/help"], resolve),
      meta:{title:'help',icon:iconHelp,icons:iconHelpCheck,isShow:true}
    },{
      path:'/setting',
      name:'setting',
      component:(resolve) => require(["@/views/setting/setting"], resolve),
      meta:{title:'setting',icon:iconSetting,icons:iconSettingCheck,isShow:true},
    },{
      path:'/account',
      name:'account',
      component:(resolve) => require(["@/views/account/account"], resolve),
      meta:{title:'account',icon:iconSetting,icons:iconSettingCheck,isShow:false}
    },
  ]
  },{
    path:'/userInfo',
    name:'userInfo',
    component:(resolve) => require(["@/views/userInfo/userInfo"], resolve),
    meta:{title:'userInfo',icon:iconSetting,icons:iconSettingCheck,isShow:true}
  },{
    path: '/AGPreport',
    name: 'AGPreport',
    meta: { title: "动态葡萄糖监测报告"},
    component:(resolve) => require(["@/views/pdfReport/report"], resolve)
  }
]

const router = new VueRouter({
  mode: "hash", // 去掉url中的#
  base:'/',
  routes
})
router.beforeEach((to, from, next) =>{
  if(!getToken()){
    if(to.path=='/login'){
      next()
    }else{
      router.push('/login')
    }
  }else{
    next()
    sysend.track('ready', () => {
      sysend.list().then(tabs => {
        console.log(tabs)
        if (tabs.length > 0) {
            window.close()
            // window.location.href = '../index.html'
            window.location.href = 'about:blank'
        }
      })
    })
  }
  
})

export default router