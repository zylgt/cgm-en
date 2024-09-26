<template>
    <div class='upLoad' >
        <div class='run-procedure'  v-if='errorCode==0'>
            <div class='step-box step1' v-if='upStep==1'>
                <div class='title' >
                    {{$t('message.Driver.install.title')}}
                </div>
                <div class='procedure_img' >
                    <div class='procedure_img_item' >
                        <div class='procedure_img_box' >
                            <img src="~@/assets/image/procedure-img1.png" alt="" class='procedure_img_img' >
                            <div class='procedure_img_step' >1</div>
                        </div>
                        <p class='procedure_img_text' > {{$t('message.Driver.install.step1')}}</p>
                    </div>
                    <div class='procedure_img_item' >
                         <div class='procedure_img_box' >
                            <img src="~@/assets/image/procedure-img2.png" alt="" class='procedure_img_img' >
                            <div class='procedure_img_step' >2</div>
                        </div>
                        <p class='procedure_img_text' > {{$t('message.Driver.install.step2')}}</p>
                    </div>
                    <div class='procedure_img_item' >
                         <div class='procedure_img_box' >
                            <img src="~@/assets/image/procedure-img3.png" alt="" class='procedure_img_img' >
                            <div class='procedure_img_step' >3</div>
                        </div>
                        <p class='procedure_img_text' > {{$t('message.Driver.install.step3')}}</p>
                        <p class='procedure_img_tips' >{{$t('message.Driver.install.installedTip')}}</p>
                    </div>
                </div>
                <div class='btn-box' >
                    <el-button type="primary"  @click='downLoad'> {{$t('message.Driver.install.downDriver')}}</el-button>
                    <el-button type="primary"  @click='firing'>{{$t('message.Driver.install.startDriver')}}</el-button>
                </div>
            </div>
            <div class='step-box step2' v-if='upStep==2' >
                    <i class="el-icon-loading loading-icon "></i>
                    <div class='unistall-text' >{{$t('message.Driver.install.startUp')}}.</div>
                    <div class='unistall-text-tips' >{{$t('message.Driver.install.startUpTip')}}</div>
            </div>
            <div class='step-box' v-if='upStep==3'>
                <div class='step-box step1'  v-if='readerConnect==0'>
                    <div class='title' >
                        {{$t('message.Driver.connect.oneTitle')}}
                    </div>
                    <div class='procedure_img step3_procedure_img' >
                        <div class='procedure_img_item' >
                            <div class='procedure_img_box' >
                                <img src="~@/assets/image/procedure-img4.png" alt="" class='procedure_img_img' >
                                <div class='procedure_img_step' >1</div>
                            </div>
                            <p class='procedure_img_text' > {{$t('message.Driver.connect.step1')}}</p>
                        </div>
                        <div class='procedure_img_item' >
                            <div class='procedure_img_box' >
                                <img src="~@/assets/image/procedure-img1.png" alt="" class='procedure_img_img' >
                                <div class='procedure_img_step' >2</div>
                            </div>
                            <p class='procedure_img_text' >{{$t('message.Driver.connect.step2')}}</p>
                        </div>
                    </div>
                    <div class='btn-box flex-end' >
                       
                    </div>
                </div>
                <div class='step-box step1'  v-if='readerConnect==2'>
                     <div class='title' >
                        {{$t('message.Driver.connect.moreTitle')}}
                        <div class='title-tips' >{{$t('message.Driver.connect.moreTip')}}</div>
                    </div>
                    <div class='procedure_img step3_procedure_img' >
                        <img src="~@/assets/image/procedure-img5.png" alt="" class='more-procedure' >
                        <div class='procedure-list' >
                            <div :class='[index==chooseIndex?"active":"", "procedure-list-item" ]' v-for='(item,index) in deviceList' :key='index' @click='chooseProcedure(index)' >Reader{{index+1}}:{{item.readerMac}}</div>
                        </div>
                    </div>
                    <div class='btn-box flex-end' >
                        <el-button type="primary"  @click='connectReader'> {{$t('message.Driver.connect.upBtn')}}</el-button>
                    </div>
                </div>
                <div class='step-box step2'  v-if='readerConnect==1' >
                    <i class="el-icon-loading loading-icon "></i>
                    <div class='unistall-text step3-unistall-text' >{{$t('message.Driver.upCloude.title')}}</div>
                    <div class='unistall-text-tips step3-unistall-text-tips' > <img src="~@/assets/image/waring-icon.png" alt="" class='waring-icon' > {{$t('message.Driver.upCloude.tip')}}</div>
                </div>
            </div>
            <div class='step-box step2' v-if='upStep==4'>
                <div class='step4-loading-box' >
                    <img src="~@/assets/image/loading.png" alt="" class='step4-loading' >
                </div>
                <div class='step-progess'>
                    <div class='progess'>
                        <div class='progess-install' :style="{width:pct/100*380+'px'}"  ></div>
                    </div>
                    <div class='progess-num'>{{pct}}%</div>
                </div>
                <div class='unistall-text step3-unistall-text' >{{$t('message.Driver.upCloude.title')}}</div>
                <div class='unistall-text-tips step3-unistall-text-tips' > <img src="~@/assets/image/waring-icon.png" alt="" class='waring-icon' > {{$t('message.Driver.upCloude.tip')}}</div>
                <div class='reader-up-mac'>{{$t('message.Driver.upCloude.mac')}}:{{upMac}}</div>
                <div class='reader-data-tip' >{{$t('message.Driver.upCloude.timeTip')}}</div>
                <div class='reader-data-tip' >{{$t('message.Driver.upCloude.rangeTip')}}</div>
            </div>
            <div class='step-box' v-if='upStep==5'>
                <div class='step-box step1'  v-if='readerConnect==0'>
                    <div class='title' >
                        {{$t('message.Driver.connect.oneTitle')}}
                    </div>
                    <div class='procedure_img step3_procedure_img' >
                        <div class='procedure_img_item' >
                            <div class='procedure_img_box' >
                                <img src="~@/assets/image/procedure-img4.png" alt="" class='procedure_img_img' >
                                <div class='procedure_img_step' >1</div>
                            </div>
                            <p class='procedure_img_text' > {{$t('message.Driver.connect.step1')}}</p>
                        </div>
                    </div>
                    <div class='btn-box flex-end' >
                        <el-button type="primary"  @click='upAgain'> {{$t('message.botton.upData')}}</el-button>
                    </div>
                </div>
            </div>
            <div class='step-progess' v-if='upStep!=5'>
                <div :class='[upStep>=1?"active":"","progess-item"]' ></div>
                <div :class='[upStep>=2?"active":"","progess-item"]' ></div>
                <div :class='[upStep>=3?"active":"","progess-item"]' ></div>
                <div :class='[upStep>=4?"active":"","progess-item"]' ></div>
            </div>
        </div>
        <Abnormal v-if='errorCode!=0' :type='errorCode' @upAgain='upAgain'  @downLoad='downLoad' @firing='firing'  @connectReader='repeatReader'/>
    </div>
</template>
<script>
import { openProcedure } from "@/utils/socket/monitoringApp";
import Abnormal from "./abnormal"
import Socket from '@/utils/socket/webSocket'
import {mapGetters} from "vuex"
import {getDriver} from '@/api/dataApi'
export default {
    data(){
        return{
            chooseIndex:0,//选择要连接的设备
            startConnect:true, //连接reader指导页
            driverUrl:''
        }
    },
    computed:{
        ...mapGetters([
            'upStep',
            'deviceList',
            'cgmList',
            'upIndex',
            'errorCode',
            'upProgess',
            'upLimit',
            'readerConnect']),
        pct(){
            if(this.$store.getters.upLimit==0){
                return 0
            }else{
                let a = (this.$store.getters.upProgess/this.$store.getters.upLimit)*100
                let num = a.toFixed(1)
                console.log('当前上传进度======>'+this.$store.getters.upProgess,this.$store.getters.upLimit,num)
                if(this.$store.getters.upProgess == this.$store.getters.upLimit){
                    // this.$router.push('/')
                }
                return num
            }
        },
        upMac(){
            if(this.$store.getters.cgmList.length>0){
                return this.$store.getters.cgmList[this.$store.getters.upIndex].mac
            }
        }
    },
    components:{
        Abnormal
    },
    created(){}, 
    mounted(){},
    methods:{
        firing(){
            let self = this
            let appUri = 'CGM3Uploader://'; // 应用程序的地址(注册表应用名称)
            // let appUri = 'Clashx://'; // 应用程序的地址(注册表应用名称)
            let timeoutDuration = 1000;
            let openAppFailure = () => { //未检测到驱动，需要下载
                self.$store.dispatch('setErrorCode',1) 
            };
            let openAppSuccess = () => {
                // 已安装驱动
                self.$store.dispatch('setErrorCode',0) 
                self.$store.dispatch('setUpStep',2)
                // this.getDrivers()
                setTimeout(function(){ //等待用户点击弹窗判断用户是否要打开驱动
                    self.$websocket.reset();
                    self.$websocket.initwebSocket();
                    self.$store.dispatch('setErrorCode',0) 
                     
                },3000)

            };
            openProcedure(appUri, openAppFailure, openAppSuccess, timeoutDuration);
        },
        // 下载
        downLoad(){ 
            console.log('下载驱动')
            this.$store.dispatch('setUpStep',1)
            this.$store.dispatch('setErrorCode',0) 
            if(this.$store.getters.driver.version){
                window.location.href=this.$store.getters.driver.path
            }else if(this.driverUrl){
                window.location.href=this.driverUrl
            }else{
                this.getDrivers()
            }
        },   
        // 选择要连接的设备
        chooseProcedure(index){
            this.chooseIndex = index
        },
        // 重新连接设备
        repeatReader(){
            this.$store.dispatch('setErrorCode',0) 
        },
        // 开始连接reader
        startReader(){
            this.startConnect = false
            if(this.deviceList==1){
                this.connectReader()
            }
        },
        // 连接reader设备
        connectReader(){
            this.$store.dispatch('setReaderConnect',1)
            this.$store.dispatch('setErrorCode',0) 
            this.$websocket.connectReader(this.deviceList[this.chooseIndex])
        },
        // 再次上传数据
        upAgain(){
            console.log('再次上传数据')
            this.$store.dispatch('setErrorCode',0) 
            this.$websocket.getReaderList()
        },
        // 获取驱动信息
        getDrivers(){
            let params={
                "platform":this.getUserOS()
            }
            getDriver(params).then(response => {
                if(response.code == 1000){
                   this.$store.dispatch('setDriver',response.data)
                  window.location.href=response.data.path
                   this.driverUrl = response.data.path
                }else{
                    this.$message({
                        type: 'error',
                        message: response.msg
                    });
                }
            }).catch((res) => {
                console.log(res)
            })
        },
        // 判断电脑系统
        getUserOS(){
            let userOS = 'unknown';
            const platform = navigator.platform.toLowerCase();
            if (platform.includes('win')) {
            userOS = 'windows';
            } else if (platform.includes('mac')) {
            userOS = 'mac';
            }
            return userOS;
        }
    }
}
</script>
<style scoped>
    .upLoad{
        width:1580px;
        margin:0 auto;
        height:100%;
        padding:30px;
        background:#fff;
         border-radius:10px;
        box-shadow: 0px 2px 20px 0px #0000000D;
    }
    .run-procedure{
         height:100%;
    }
    .step-progess{
        width:100%;
        height:80px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .progess-item{
        width:60px;
        height:5px;
        border-radius:1px;
        background:#f0f0f0;
        margin:0 4px;
    }
    .progess-item.active{
        background:var(--color-primary);
    }
    .step-box{
        width:100%;
        height: 90%;
    }
/* 步骤一 */
    .step1{
        position: relative;
        width:100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .title{
        font-size:var(--fontSize-smax);
        color:#000;
        margin-bottom:20px;
        position: relative;
        padding-left:6px;
        height:30px;
        line-height: 30px;
        font-weight: 700;
    }
    .title-border{
        width:2px;
        height:20px;
        border-radius: 1px;
        background:var(--color-primary);
        position: absolute;
        left:0;
        top:5px;
    }
    .procedure_img{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .procedure_img_item{
        width:30%;
        max-height:460px;
        min-height: 360px;
        margin:0 10px;
    }
    .procedure_img_box{
        background:#d9d9d9;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        margin-bottom:20px;
    }
    .procedure_img_step{
        width:40px;
        height:40px;
        background:var(--color-primary);
        text-align: center;
        line-height: 40px;
        justify-content: center;
        color:#fff;
        font-size:24px;
        font-weight: 380;
        position: absolute;
        left:0;
        top:0;
    }
    .procedure_img_img{
        display: block;
        width:100%;
    } 
    .procedure_img_text{
        font-size:var(--fontSize-default);
        color:var(--color-black-80);
    }
    .procedure_img_tips{
        font-size:var(--fontSize-default);
        color:var(--color-primary);
        margin-top:14px;
    }
    .btn-box{
        display: flex;
        align-items: center;
        justify-content:flex-end;
        
    }
    .btn-box.flex-end{
        justify-content: flex-end;
    }
/* 步骤2 */
     .step2{
       display: flex;
       align-items: center;
       justify-content: center; 
       flex-direction: column;
        height:90%;
        width:100%;

    }
    .loading-icon{
        font-size:60px;
        color:var(--color-primary);
    }
/* 步骤三 */
    .step3_procedure_img{
        justify-content: center;
    }
    .title-tips{
        font-size:var(--fontSize-default);
        font-weight: 400;
        color:var(--color-black-60);
    }
    .procedure-list{
        margin-left:100px;
    }
    .procedure-list-item{
        width:500px;
        height:60px;
        border-radius:10px;
        border:1px solid var(--color-black-10);
        padding-left:20px;
        line-height: 60px;
        margin-bottom:20px;
        font-size:20px;
        color:var(--color-black-100);
        font-weight: 380;
    }
    .procedure-list-item.active{
        color:#fff;
        background:var(--color-primary);
        border:1px solid var(--color-primary);
    }
    .step3-unistall-text-tips{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom:20px;
    }
    .waring-icon{
        margin-right:6px;
    }
    .step3-unistall-text{
         color:var(--color-primary);
    }
    .reader-up-mac{
        font-size: var(--fontSize-smax);
        color:#000;
        font-weight: 600;
        margin-bottom:30px;
    }
/* 步骤四 */
    .reader-data-tip{
        font-size:var(--fontSize-default);
        color:var(--color-warning);
        text-align: center;
    }
    .step4-loading-box{
        margin:0 auto;
        width:80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-primary);
        border-radius:50%;
    }
    .step4-loading{
        
        display: block;
        -webkit-animation: rotate 1s linear;
        -moz-animation: rotate 1s linear;
        animation: rotate 1s linear;
        -webkit-animation-iteration-count: infinite;
        -moz-animation-iteration-count: infinite;
        animation-iteration-count: infinite;
    }
    @keyframes rotate {
        0% {
        transform: rotate(0deg);
        }
    
        50% {
            transform: rotate(180deg);
        }
    
        100% {
            transform: rotate(360deg);
        }
    }
    .step-progess{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .progess{
        width:380px;
        height:12px;
        border-radius:22px;
        background: #eaeaea;
        margin-right:20px;
        position: relative;
    }
    .progess-install{
        position: absolute;
        left:0;
        top:0;
        width:0px;
        height:12px;
        border-radius:22px;
        background:var(--color-primary);
        transition: all 0.5s linear;
    }
    .progess-num{
        font-size:20px;
        color:var(--color-primary);
        font-weight: 440;
    }
/* 未安装 */
    .uninstall-procedure{
        height:100%;
        position: relative;
    }
     .unstall-tips{
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height:100%;
    }
    .waring-icon{
        font-size:60px;
        color:red;
    }
    .unistall-text{
        margin-top:30px;
        font-size:20px;
        text-align: center;
        font-weight: 600;
    }
    .unistall-text-tips{
        font-size:var(--fontSize-default);
        color:var(--color-black-60);
        font-weight: 400;
        margin-top:20px;
    }
    .unistall-btn{
        display: flex;
        justify-content: flex-end;
        position: absolute;
        right:0;
        bottom:0;
    }
   
  
</style>