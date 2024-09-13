<template>
    <div class='deviceInfo' >
        <div class='deviceInfo-title-box'>
            <div class='deviceInfo-title' >{{$t('message.deviceInfo.title')}}</div>
            <img src="~@/assets/image/close-icon.png" alt="" class='close-icon'  @click="closePopover" >
        </div>
        <div class='deviceInfo-tips' >{{$t('message.deviceInfo.updataTime')}}：2024年3月14日</div>
        <div class='deviceInfo-list' >
            <div class='deviceInfo-item' v-for='(item,index) in list' :key='index' >
                <div class='device-item-title' >
                    <div>{{$t('message.deviceInfo.device')}}1</div>
                    <div class='delet-device' >{{$t('message.deviceInfo.delete')}}</div>
                </div>
                <div class='device-item-main' >
                    <img src="~@/assets/image/device-img1.png" alt="" class='device-img' >
                    <div class='device-item-info' >
                        <div class='device-info-title' >{{$t('message.deviceInfo.title')}}：</div>
                        <div class='device-info-list'>
                            <div class='device-info-label'>{{$t('message.deviceInfo.deviceModel')}}：</div>
                            <div class='device-info-value' >{{item.model}}</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>{{$t('message.deviceInfo.version')}}：</div>
                            <div class='device-info-value' >{{item.firmware}}</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>{{$t('message.deviceInfo.upDate')}}：</div>
                            <div class='device-info-value' >{{item.current_time}}</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>{{$t('message.deviceInfo.targerRange')}}：</div>
                            <div class='device-info-value' >{{item.low}}-{{item.high}}mg/dL</div>
                        </div>
                    </div>
                    <div class='device-item-warning'>
                        <div class='device-info-title' >{{$t('message.deviceInfo.alarmSet')}}：</div>
                        <div class='device-info-list'>
                            <div class='device-info-label'>{{$t('message.deviceInfo.urgentLow')}}</div>
                            <div class='device-info-status-active' v-if='item.emergent_alarm_low_on==1'>开启</div>
                            <div class='device-info-status-close'  v-if='item.emergent_alarm_low_on==0'>关闭</div>
                            <div class='device-info-value' >{{$t('message.deviceInfo.less')}}{{item.emergent_alarm_low}}mg/dL</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>{{$t('message.deviceInfo.low')}}</div>
                            <div class='device-info-status-active' v-if='item.alarm_low_on==1'>开启</div>
                            <div class='device-info-status-close' v-if='item.alarm_low_on==0'>关闭</div>
                            <div class='device-info-value' >{{item.emergent_alarm_low}}-{{item.alarm_low}}mg/dL</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>{{$t('message.deviceInfo.veryHigh')}}</div>
                            <div class='device-info-status-active' v-if='item.alarm_high_on==1'>开启</div>
                            <div class='device-info-status-close' v-if='item.alarm_high_on==0'>关闭</div>
                            <div class='device-info-value' >{{item.alarm_high}}mg/dL</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>{{$t('message.deviceInfo.signalLoss')}}</div>
                            <div class='device-info-status-active' v-if='item.loss_alarm_on==1'>开启</div>
                            <div class='device-info-status-close' v-if='item.loss_alarm_on==0'>关闭</div>
                            <div class='device-info-value' >{{item.loss_time}}min</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    props:{
        list:{
            type:'Array'
        }
    },
    methods:{
        closePopover(){
            this.$emit('closePopover')
        }
    }
}
</script>
<style scoped>
    .deviceInfo{
        padding:10px;
        height:640px;
        overflow-y:auto ;
    }
    .deviceInfo-title-box{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom:8px;
    }
    .deviceInfo-title{
        font-size:var(--fontSize-smax);
        color: var(--color-black-100);
    }
    .close-icon{
        width:24px;
        height:24px;
        cursor: pointer;
    }
    .deviceInfo-tips{
        font-size:var(--fontSize-default);
        color: var(--color-black-40);
        margin-bottom:20px;
    }
    .deviceInfo-item{
        width:100%;
        height:264px;
        border-radius:10px;
        border:1px solid rgba(0,0,0,0.1);
        box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.05);
        box-sizing: border-box;
        padding:10px;
        background: #F7F7F7;
        margin-bottom:14px;
    }
    .device-item-title{
        font-size:var(--fontSize-smax);
        color:var(--color-black-80);
        margin-bottom:10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .delet-device{
         font-size:var(--fontSize-default);
        color:var(--color-error);
        text-decoration: underline;
        cursor: pointer;
    }
    .device-item-main{
        display: flex;
        align-items: center;
    }
    .device-img{
        width:86px;
        height:146px;
        display: block;
        margin-left:40px;
        margin-right:40px;
    }  
    .device-item-info{
        margin-right:40px;
    } 
    .device-info-title{
        font-size:var(--fontSize-default);
        color:var(--color-black-100);
        font-weight: 700;
        margin-bottom:20px;
    }
    .device-info-list{
        display: flex;
        align-items: center;
        margin-bottom:10px;
        font-weight: 400;
    }
    .device-info-status-active{
        font-size:var(--fontSize-default);
        color:var(--color-primary);
        width:60px;
        margin:0 20px;
        margin-right:60px;
    }
    .device-info-status-close{
        font-size:var(--fontSize-default);
        color:var(--color-error);
        width:60px;
        margin:0 20px;
        margin-right:60px;
    }
    .device-info-label{
        font-size:var(--fontSize-default);
        color:var(--color-black-40);
        width:150px;
        margin-right:30px;
    }
    .device-info-value{
        font-size:var(--fontSize-default);
        color:var(--color-black-100);
        font-weight: 600;
        width:180px;
    }
</style>