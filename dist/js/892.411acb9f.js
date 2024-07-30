"use strict";(self["webpackChunkCGM3"]=self["webpackChunkCGM3"]||[]).push([[892],{892:function(t,s,e){e.r(s),e.d(s,{default:function(){return x}});var i=function(){var t=this,s=t._self._c;return s("div",{staticClass:"upLoad"},[0==t.errorCode?s("div",{staticClass:"run-procedure"},[1==t.upStep?s("div",{staticClass:"step-box step1"},[t._m(0),t._m(1),s("div",{staticClass:"btn-box"},[s("el-button",{attrs:{type:"primary"},on:{click:t.downLoad}},[t._v(" 下载驱动")]),s("el-button",{attrs:{type:"primary"},on:{click:t.firing}},[t._v("启动驱动")])],1)]):t._e(),2==t.upStep?s("div",{staticClass:"step-box step2"},[s("i",{staticClass:"el-icon-loading loading-icon"}),s("div",{staticClass:"unistall-text"},[t._v("正在启动中...")]),s("div",{staticClass:"unistall-text-tips"},[t._v("正在启动驱动程序，请稍后...")])]):t._e(),3==t.upStep?s("div",{staticClass:"step-box"},[t.startConnect?s("div",{staticClass:"step-box step1"},[t._m(2),t._m(3),s("div",{staticClass:"btn-box flex-end"},[s("el-button",{attrs:{type:"primary"},on:{click:t.startReader}},[t._v(" 开始连接")])],1)]):t._e(),t.deviceList.length>1&&!t.startConnect?s("div",{staticClass:"step-box step1"},[t._m(4),s("div",{staticClass:"procedure_img step3_procedure_img"},[s("img",{staticClass:"more-procedure",attrs:{src:e(5040),alt:""}}),s("div",{staticClass:"procedure-list"},t._l(t.deviceList,(function(e,i){return s("div",{key:i,class:[i==t.chooseIndex?"active":"","procedure-list-item"],on:{click:function(s){return t.chooseProcedure(i)}}},[t._v("设备"+t._s(i+1)+":"+t._s(e.readerMac))])})),0)]),s("div",{staticClass:"btn-box flex-end"},[s("el-button",{attrs:{type:"primary"},on:{click:t.connectReader}},[t._v(" 开始连接")])],1)]):t._e(),1!=t.readerConnect||t.startConnect?t._e():s("div",{staticClass:"step-box step2"},[s("i",{staticClass:"el-icon-loading loading-icon"}),s("div",{staticClass:"unistall-text step3-unistall-text"},[t._v("正在连接设备，请稍等")]),t._m(5)])]):t._e(),4==t.upStep?s("div",{staticClass:"step-box step2"},[t._m(6),s("div",{staticClass:"step-progess"},[s("div",{staticClass:"progess"},[s("div",{staticClass:"progess-install",style:{width:t.pct/100*380+"px"}})]),s("div",{staticClass:"progess-num"},[t._v(t._s(t.pct)+"%")])]),s("div",{staticClass:"unistall-text step3-unistall-text"},[t._v("正在同步数据，请稍等")]),t._m(7),s("div",{staticClass:"reader-data-tip"},[t._v("*检测到读取器与电脑时间不一致，将自动为您校准读取器的时间。")]),s("div",{staticClass:"reader-data-tip"},[t._v("*检测到读取器与电脑目标范围不一致，将自动为您同步到读取器。")])]):t._e(),s("div",{staticClass:"step-progess"},[s("div",{class:[t.upStep>=1?"active":"","progess-item"]}),s("div",{class:[t.upStep>=2?"active":"","progess-item"]}),s("div",{class:[t.upStep>=3?"active":"","progess-item"]}),s("div",{class:[t.upStep>=4?"active":"","progess-item"]})])]):t._e(),0!=t.errorCode?s("Abnormal",{attrs:{type:t.errorCode},on:{downLoad:t.downLoad,firing:t.firing,connectReader:t.repeatReader}}):t._e()],1)},a=[function(){var t=this,s=t._self._c;return s("div",{staticClass:"title"},[s("p",{staticClass:"title-border"}),t._v(" 运行驱动程序 ")])},function(){var t=this,s=t._self._c;return s("div",{staticClass:"procedure_img"},[s("div",{staticClass:"procedure_img_item"},[s("div",{staticClass:"procedure_img_box"},[s("img",{staticClass:"procedure_img_img",attrs:{src:e(132),alt:""}}),s("div",{staticClass:"procedure_img_step"},[t._v("1")])]),s("p",{staticClass:"procedure_img_text"},[t._v("第一步：点击“下载驱动”俺就下载驱动程序，下载完成后，双击打开驱动程序。")])]),s("div",{staticClass:"procedure_img_item"},[s("div",{staticClass:"procedure_img_box"},[s("img",{staticClass:"procedure_img_img",attrs:{src:e(3695),alt:""}}),s("div",{staticClass:"procedure_img_step"},[t._v("2")])]),s("p",{staticClass:"procedure_img_text"},[t._v("第二步：根据指引安装驱动程序。")])]),s("div",{staticClass:"procedure_img_item"},[s("div",{staticClass:"procedure_img_box"},[s("img",{staticClass:"procedure_img_img",attrs:{src:e(1958),alt:""}}),s("div",{staticClass:"procedure_img_step"},[t._v("3")])]),s("p",{staticClass:"procedure_img_text"},[t._v("第三步：当您完成驱动程序的安装后，点击“启动驱动”按钮运行驱动程序，并允许驱动程序运行。")]),s("p",{staticClass:"procedure_img_tips"},[t._v("*若您已安装驱动，请直接点击启动驱动")])])])},function(){var t=this,s=t._self._c;return s("div",{staticClass:"title"},[s("p",{staticClass:"title-border"}),t._v(" 连接读取器 ")])},function(){var t=this,s=t._self._c;return s("div",{staticClass:"procedure_img step3_procedure_img"},[s("div",{staticClass:"procedure_img_item"},[s("div",{staticClass:"procedure_img_box"},[s("img",{staticClass:"procedure_img_img",attrs:{src:e(6217),alt:""}}),s("div",{staticClass:"procedure_img_step"},[t._v("1")])]),s("p",{staticClass:"procedure_img_text"},[t._v("第一步：用数据线连接您的读取器与电脑。")])]),s("div",{staticClass:"procedure_img_item"},[s("div",{staticClass:"procedure_img_box"},[s("img",{staticClass:"procedure_img_img",attrs:{src:e(132),alt:""}}),s("div",{staticClass:"procedure_img_step"},[t._v("2")])]),s("p",{staticClass:"procedure_img_text"},[t._v("第二步：确认已将您的读取器连接至电脑后，点击右下方开始传输按钮。")])])])},function(){var t=this,s=t._self._c;return s("div",{staticClass:"title"},[s("p",{staticClass:"title-border"}),t._v(" 多台设备连接 "),s("div",{staticClass:"title-tips"},[t._v("检测到当前有多台设备连接电脑，请选择您想要同步的设备。请依据读取器后的编码选择您想同步的机器。")])])},function(){var t=this,s=t._self._c;return s("div",{staticClass:"unistall-text-tips step3-unistall-text-tips"},[s("img",{staticClass:"waring-icon",attrs:{src:e(7004),alt:""}}),t._v(" 正在连接设备，请勿拔下数据线。")])},function(){var t=this,s=t._self._c;return s("div",{staticClass:"step4-loading-box"},[s("img",{staticClass:"step4-loading",attrs:{src:e(2156),alt:""}})])},function(){var t=this,s=t._self._c;return s("div",{staticClass:"unistall-text-tips step3-unistall-text-tips"},[s("img",{staticClass:"waring-icon",attrs:{src:e(7004),alt:""}}),t._v(" 正在进行数据传输，在传输完成前请勿拔下数据线，以免丢失数据。")])}];function r(t,s,e){const i=t.addEventListener||t.attachEvent;return i.call(t,s,e),{remove:function(){const i=t.removeEventListener||t.detachEvent;i.call(t,s,e)}}}function o(t,s){let e=document.createElement("iframe");return e.src=s,e.id="hiddenIframe",e.style.display="none",t.appendChild(e),e}function c(t,s,e,i){let a=setTimeout((function(){s(),n.remove()}),i),c=document.querySelector("#hiddenIframe");c||(c=o(document.body,"about:blank"));let n=r(window,"blur",l);function l(){clearTimeout(a),n.remove(),e()}c.contentWindow.location.href=t}function n(t,s,e,i){let a=setTimeout((function(){s(),c.remove()}),i),o=window;while(o!==o.parent)o=o.parent;let c=r(o,"blur",n);function n(){clearTimeout(a),c.remove(),e()}window.location=t}function l(){var t=!!window.opera||navigator.userAgent.indexOf(" OPR/")>=0,s=navigator.userAgent.toLowerCase();return{isOpera:t,isFirefox:"undefined"!==typeof InstallTrigger,isSafari:~s.indexOf("safari")&&!~s.indexOf("chrome")||Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor")>0,isIOS:/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,isChrome:!!window.chrome&&!t,isIE:!!document.documentMode}}function d(t,s,e,i){var a=l();return a.isSafari?c(t,s,e,i):n(t,s,e,i)}var p=function(){var t=this,s=t._self._c;return s("div",{staticClass:"abnormal"},[1==t.type?s("div",{staticClass:"unstall-cont"},[s("i",{staticClass:"el-icon-warning error-icon"}),s("div",{staticClass:"unistall-text"},[t._v("未检测到可用驱动")]),s("div",{staticClass:"unistall-tip"},[t._v("请您尝试下载驱动程序并重新安装")])]):t._e(),2==t.type?s("div",{staticClass:"unstall-cont"},[s("i",{staticClass:"el-icon-warning error-icon"}),s("div",{staticClass:"unistall-text"},[t._v("驱动启动失败")]),s("div",{staticClass:"unistall-tip"},[t._v("驱动程序运行失败，请重新启动，若依然无法解决，请您尝试重新下载驱动程序。")])]):t._e(),3==t.type?s("div",{staticClass:"unstall-cont"},[s("i",{staticClass:"el-icon-warning waring-icon"}),s("div",{staticClass:"unistall-text"},[t._v("发现新版本驱动")]),s("div",{staticClass:"unistall-tip"},[t._v("检测到存在新版本的驱动程序，请您下载最新驱动程序")])]):t._e(),5==t.type?s("div",{staticClass:"unstall-cont"},[s("i",{staticClass:"el-icon-warning error-icon"}),s("div",{staticClass:"unistall-text"},[t._v("设备连接失败")]),s("div",{staticClass:"unistall-tip"},[t._v("请检查您的网络及读取器连接状态。")])]):t._e(),6==t.type?s("div",{staticClass:"unstall-cont"},[s("i",{staticClass:"el-icon-warning error-icon"}),s("div",{staticClass:"unistall-text"},[t._v("数据同步失败")]),s("div",{staticClass:"unistall-tip"},[t._v("数据同步失败，请检查您的网络及读取器连接状态。")])]):t._e(),2==t.type?s("div",{staticClass:"unistall-btns"},[s("el-button",{attrs:{type:"primary"},on:{click:t.downLoad}},[t._v("重新下载")]),s("el-button",{attrs:{type:"primary"},on:{click:t.firing}},[t._v("重新启动")])],1):t._e(),5==t.type?s("div",{staticClass:"unistall-btns"},[s("el-button",{attrs:{type:"primary"},on:{click:t.connectReader}},[t._v("重新连接")])],1):t._e(),6==t.type?s("div",{staticClass:"unistall-btns"},[s("el-button",{attrs:{type:"primary"},on:{click:t.downLoad}},[t._v("重新同步")])],1):t._e(),1==t.type||3==t.type?s("div",{staticClass:"unistall-btn"},[s("el-button",{attrs:{type:"primary"},on:{click:t.downLoad}},[t._v("下载驱动")])],1):t._e()])},u=[],v={name:"Abnormal",props:{type:{type:Number,default:""}},methods:{downLoad(){this.$emit("downLoad")},firing(){this.$emit("firing")},connectReader(){this.$emit("connectReader")}}},g=v,m=e(1656),C=(0,m.A)(g,p,u,!1,null,"1d2a4c37",null),_=C.exports,A=(e(3425),e(1910)),f={data(){return{chooseIndex:0,startConnect:!0}},computed:{...(0,A.L8)(["upStep","deviceList","errorCode","upProgess","upLimit","readerConnect"]),pct(){if(0==this.$store.getters.upLimit)return 0;{let t=this.$store.getters.upProgess/this.$store.getters.upLimit*100,s=t.toFixed(1);return console.log("当前上传进度======>"+this.$store.getters.upProgess,this.$store.getters.upLimit,s),this.$store.getters.upProgess,this.$store.getters.upLimit,s}}},components:{Abnormal:_},created(){},mounted(){},methods:{firing(){let t=this,s="CGM3Uploader://",e=1e3,i=()=>{t.$store.dispatch("setErrorCode",1)},a=()=>{t.$store.dispatch("setErrorCode",0),t.$store.dispatch("setUpStep",2),setTimeout((function(){t.$websocket.reset(),t.$websocket.initwebSocket(),t.$store.dispatch("setErrorCode",0)}),3e3)};d(s,i,a,e)},downLoad(){console.log("下载驱动"),this.$store.dispatch("setUpStep",1),this.$store.dispatch("setErrorCode",0)},chooseProcedure(t){this.chooseIndex=t},repeatReader(){this.$store.dispatch("setErrorCode",0)},startReader(){console.log(123),this.startConnect=!1,1==this.deviceList&&this.connectReader()},connectReader(){this.$store.dispatch("setReaderConnect",1),this.$store.dispatch("setErrorCode",0),this.$websocket.connectReader(this.deviceList[this.chooseIndex])}}},h=f,b=(0,m.A)(h,i,a,!1,null,"8f3bce7c",null),x=b.exports},2156:function(t){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAA+CAYAAACSqr0VAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOeSURBVHgB7ZvhddMwEMcvPL5TJiAbkA0wG4QJMBMUJkiYoGWCdIOWCRwmaJnAYoKkE/y5Q8qLOdty1VrKc+zfe/cS20okn6XTSXcmmpiYmJjojRklBMCcPzKW9yzyfdFQzLDsWX6zbFkeZrPZns4FVkLGcsWyw/MpWHKWCxoq7gbu0S+i1A1sT/PVvXBKFFnQKeEGLFlKxGfTphhVf0kB9GZDXOM2ZG1EG2ILHlh+krUVxp07cOFk4eQDWVvThvz+O9uYm0o75Pe7aiG+ntRWHnqFz0bcwtqSYBsgimZZw9/rrirlM3XtnlLCFa48DV2jR0MIa5fKlrrunfKW6vwdpcKjjAIdhu+F9a5b6i1hbUuVa0qBRxlfKQGuN5ToJn57uJLLhorFhmSUEK7vAtY++chC/jPY+sIOBT2VGZaPbMwNRcTd3CXZmciQnaEeK+eaeBvN03VPpGzoGdGdH1d3qLe7o5jAuuCanBIAazNCiTfltjQojQU/tqHLXmiCp9zXAWVX6tiwrCkhbAs+4Wgk53T0bEXe0NGrPVx7oBi09I6cxgrqzk7QgunsQH1myWmsoL5YOuve8eoJZT6r4y2NGdR3vTIaK7DeoWa4+5pPoGvIaJf8vHbAG+hyzHRvGKQyXK/OWfbV7cbn/FGuhsuGBgj+d/kLX9muITNXx39omCwr3zNfwS6F6LWAoYHR+yQAu39ZyCcNkIZ12OiXHdrTfpENOQe06/DoKzwGhbxXx1tf4TEoJFPHcTaNhkCD/ejcdD73HqJX6r9orKA5sreksYJ6qHW8/kdL73hSjDckDHGobE02dCgrX+NOGzqGFffVa7y63FJ6JGQyrxwbljhpEQgPFt1SQlBfoQs5xQJ2XRPKO0oA7FDR8d+4tgPPCDgjwbYj2vNF5iH/E2RD3I35bs6QTag7hBXFlvyIve3obrqg+v7Nt6gpGqh7fk3cIuFGNGxOatnQjjXFBnWDtW1pTImIOWaV9ly2PJQbSgFXdK2fAvy5XlcxFAPbU4uTKsM1RE+5S3fepxQ5v+pDMR2K+PeAKCXwRPFgg1rX8CMKzUOU45Swgj/jUGayXtYpQUl3UrM6VUtog3WCtKfYhHEi+xN6F0v8lgUdE198iAf65SQBNAQk1aM7HfulFDh1nBmBr13ADiNfOnYou9iKSPaWgFOgjHN5wyEL+KkMBRkWsrlzF3topH1tooJT0Jya7YQh9ypJ7GTgiYmJiYmI/AVTPaq8ql1BQQAAAABJRU5ErkJggg=="},132:function(t,s,e){t.exports=e.p+"img/procedure-img1.f7946efb.png"},3695:function(t,s,e){t.exports=e.p+"img/procedure-img2.14ddb8b6.png"},1958:function(t,s,e){t.exports=e.p+"img/procedure-img3.974f8c9f.png"},6217:function(t,s,e){t.exports=e.p+"img/procedure-img4.78346f75.png"},5040:function(t,s,e){t.exports=e.p+"img/procedure-img5.0f5f1587.png"},7004:function(t){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAYAAADtc08vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD6SURBVHgBjVOhDsJQDOwIBuwsWPQsFiyzYLFo/oH/QIIFCxaLZRYkIIeEHruF5q0ju+SSrXu9tte3SOoxVk6UL+VJufMOtWuSh8qpSUqVV+W5qUDK5L2JQTBT5vZgqyZZ2HZCHhkbhYdDgZjto/pDCh9GrLrje/efgK0eArGbFMa6ArZ6iXsgUnbR8wRSVgmrP80zTMQmZqFA4lQH4EMexLbsYGCDK+VcquhKYBoxYc63gyGD3k1bKJeOCNbaUY4hAFPObNciZps9MaYRGOuA4hDoKy9SBQQ3UsycOd+x0n7EFmP5XZ4mwEjY2jtiMkxJxDfMA0bAz7X+AONQNHcK7fD7AAAAAElFTkSuQmCC"}}]);
//# sourceMappingURL=892.411acb9f.js.map