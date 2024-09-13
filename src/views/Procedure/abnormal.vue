<template>
    <div class='abnormal'  >
        <div class='unstall-cont' v-if='type==1'>
            <i class="el-icon-warning error-icon "></i>
            <div class='unistall-text' >{{$t('message.Driver.warning.noDriver')}}</div>
            <div class='unistall-tip' >{{$t('message.Driver.warning.noDriverTip')}}</div>
        </div>
        <div class='unstall-cont' v-if='type==2'>
            <i class="el-icon-warning  error-icon"></i>
            <div class='unistall-text' >{{$t('message.Driver.warning.fail')}}</div>
            <div class='unistall-tip' >{{$t('message.Driver.warning.failTip')}}</div>
        </div>
        <div class='unstall-cont' v-if='type==3'>
            <i class="el-icon-warning  waring-icon"></i>
            <div class='unistall-text' >{{$t('message.Driver.warning.newDriver')}}</div>
            <div class='unistall-tip' >{{$t('message.Driver.warning.newDriverTip')}}</div>
        </div>
        <div class='unstall-cont' v-if='type==5'>
            <i class="el-icon-warning  error-icon"></i>
            <div class='unistall-text' >{{$t('message.Driver.warning.connectFail')}}</div>
            <div class='unistall-tip' >{{$t('message.Driver.warning.connectFailTip')}}</div>
        </div>
        <div class='unstall-cont' v-if='type==6'>
            <i class="el-icon-warning  error-icon"></i>
            <div class='unistall-text' >{{$t('message.Driver.warning.upFail')}}</div>
            <div class='unistall-tip' >{{$t('message.Driver.warning.upFailTip')}}</div>
        </div>
        <div class='unistall-btns' v-if='type==2'>
            <el-button type="primary" @click="downLoad">{{$t('message.Driver.warning.reDown')}}</el-button>
            <el-button type="primary" @click='firing'>{{$t('message.Driver.warning.reStart')}}</el-button>
        </div>
        <div class='unistall-btns' v-if='type==5'>
            <el-button type="primary" @click="connectReader">{{$t('message.Driver.warning.reConenct')}}</el-button>
        </div>
        <div class='unistall-btns' v-if='type==6'>
            <el-button type="primary" @click="downLoad">{{$t('message.Driver.connect.upBtn')}}</el-button>
        </div>
        <div class='unistall-btn' v-if='type==1||type==3'>
            <el-button type="primary" @click="downLoad">{{$t('message.Driver.install.downDriver')}}</el-button>
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
        font-weight: 600;
    }
    .unistall-tip{
        text-align: center;
        font-size:var(--fontSize-default);
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