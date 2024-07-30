<template>
    <div class='abnormal'  >
        <div class='unstall-cont' v-if='type==1'>
            <i class="el-icon-warning error-icon "></i>
            <div class='unistall-text' >未检测到可用驱动</div>
            <div class='unistall-tip' >请您尝试下载驱动程序并重新安装</div>
        </div>
        <div class='unstall-cont' v-if='type==2'>
            <i class="el-icon-warning  error-icon"></i>
            <div class='unistall-text' >驱动启动失败</div>
            <div class='unistall-tip' >驱动程序运行失败，请重新启动，若依然无法解决，请您尝试重新下载驱动程序。</div>
        </div>
        <div class='unstall-cont' v-if='type==3'>
            <i class="el-icon-warning  waring-icon"></i>
            <div class='unistall-text' >发现新版本驱动</div>
            <div class='unistall-tip' >检测到存在新版本的驱动程序，请您下载最新驱动程序</div>
        </div>
        <div class='unstall-cont' v-if='type==5'>
            <i class="el-icon-warning  error-icon"></i>
            <div class='unistall-text' >设备连接失败</div>
            <div class='unistall-tip' >请检查您的网络及读取器连接状态。</div>
        </div>
        <div class='unstall-cont' v-if='type==6'>
            <i class="el-icon-warning  error-icon"></i>
            <div class='unistall-text' >数据同步失败</div>
            <div class='unistall-tip' >数据同步失败，请检查您的网络及读取器连接状态。</div>
        </div>
        <div class='unistall-btns' v-if='type==2'>
            <el-button type="primary" @click="downLoad">重新下载</el-button>
            <el-button type="primary" @click='firing'>重新启动</el-button>
        </div>
        <div class='unistall-btns' v-if='type==5'>
            <el-button type="primary" @click="connectReader">重新连接</el-button>
        </div>
        <div class='unistall-btns' v-if='type==6'>
            <el-button type="primary" @click="downLoad">重新同步</el-button>
        </div>
        <div class='unistall-btn' v-if='type==1||type==3'>
            <el-button type="primary" @click="downLoad">下载驱动</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name: "Abnormal",
    props:{
        type:{
            type:Number,
            default:''
        }
    },
    methods:{
        downLoad(){
            this.$emit('downLoad')
        },
        firing(){
            this.$emit('firing')
        },
        connectReader(){
            this.$emit('connectReader')
        }
    }
}
</script>
<style scoped>
    .abnormal{
        width:100%;
        height:100%;
        position: relative;
    }
    .unstall-cont{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height:100%;
    }
    .error-icon{
        font-size:60px;
        color:var(--color-error);
    }
    .waring-icon{
        font-size:60px;
        color:var(--color-warning);
    }
    .unistall-text{
        margin-top:30px;
        font-size:20px;
        text-align: center;
         font-weight: 440;
    }
    .unistall-tip{
        text-align: center;
        font-size:var(--fontSize-big);
        color:var(--color-black-60);
        font-weight: 400;
        margin-top:10px;
    }
    .unistall-btn{
        position: absolute;
        right:0;
        bottom:0;
        display: flex;
        justify-content: flex-end;
    }
    .unistall-btns{
        position: absolute;
        right:0;
        bottom:0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width:100%;
    }
</style>