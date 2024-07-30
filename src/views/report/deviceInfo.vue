<template>
    <div class='deviceInfo' >
        <div class='deviceInfo-title-box'>
            <div class='deviceInfo-title' >设备信息</div>
            <img src="~@/assets/image/close-icon.png" alt="" class='close-icon'  @click="closePopover" >
        </div>
        <div class='deviceInfo-tips' >最近更新时间：2024年3月14日</div>
        <div class='deviceInfo-list' >
            <div class='deviceInfo-item'>
                <div class='device-item-title' >设备1</div>
                <div class='device-item-main' >
                    <img src="~@/assets/image/device-img1.png" alt="" class='device-img' >
                    <div class='device-item-info' >
                        <div class='device-info-title' >设备信息：</div>
                        <div class='device-info-list'>
                            <div class='device-info-label'>设备型号：</div>
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>软件信息：</div>
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>数据更新日期：</div>
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>目标血糖范围：</div>
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                    </div>
                    <div class='device-item-warning'>
                        <div class='device-info-title' >警报设置：</div>
                        <div class='device-info-list'>
                            <div class='device-info-label'>紧急低血糖警报</div>
                            <div class='device-info-status-active' >开启</div>
                            <!-- <div class='device-info-status-close' >关闭</div> -->
                            <div class='device-info-value' >低于3.0mmol/L</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>低血糖警报</div>
                            <div class='device-info-status-active' >开启</div>
                            <!-- <div class='device-info-status-close' >关闭</div> -->
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>高血糖警报</div>
                            <div class='device-info-status-active' >开启</div>
                            <!-- <div class='device-info-status-close' >关闭</div> -->
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>新号丢失警报</div>
                            <!-- <div class='device-info-status-active' >开启</div> -->
                            <div class='device-info-status-close' >关闭</div>
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='deviceInfo-item'>
                <div class='device-item-title' >设备1</div>
                <div class='device-item-main' >
                    <img src="~@/assets/image/device-img1.png" alt="" class='device-img' >
                    <div class='device-item-info' >
                        <div class='device-info-title' >设备信息：</div>
                        <div class='device-info-list'>
                            <div class='device-info-label'>设备型号：</div>
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>软件信息：</div>
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>数据更新日期：</div>
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>目标血糖范围：</div>
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                    </div>
                    <div class='device-item-warning'>
                        <div class='device-info-title' >警报设置：</div>
                        <div class='device-info-list'>
                            <div class='device-info-label'>紧急低血糖警报</div>
                            <div class='device-info-status-active' >开启</div>
                            <!-- <div class='device-info-status-close' >关闭</div> -->
                            <div class='device-info-value' >低于3.0mmol/L</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>低血糖警报</div>
                            <div class='device-info-status-active' >开启</div>
                            <!-- <div class='device-info-status-close' >关闭</div> -->
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>高血糖警报</div>
                            <div class='device-info-status-active' >开启</div>
                            <!-- <div class='device-info-status-close' >关闭</div> -->
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>新号丢失警报</div>
                            <!-- <div class='device-info-status-active' >开启</div> -->
                            <div class='device-info-status-close' >关闭</div>
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='deviceInfo-item'>
                <div class='device-item-title' >设备1</div>
                <div class='device-item-main' >
                    <img src="~@/assets/image/device-img1.png" alt="" class='device-img' >
                    <div class='device-item-info' >
                        <div class='device-info-title' >设备信息：</div>
                        <div class='device-info-list'>
                            <div class='device-info-label'>设备型号：</div>
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>软件信息：</div>
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>数据更新日期：</div>
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>目标血糖范围：</div>
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                    </div>
                    <div class='device-item-warning'>
                        <div class='device-info-title' >警报设置：</div>
                        <div class='device-info-list'>
                            <div class='device-info-label'>紧急低血糖警报</div>
                            <div class='device-info-status-active' >开启</div>
                            <!-- <div class='device-info-status-close' >关闭</div> -->
                            <div class='device-info-value' >低于3.0mmol/L</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>低血糖警报</div>
                            <div class='device-info-status-active' >开启</div>
                            <!-- <div class='device-info-status-close' >关闭</div> -->
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>高血糖警报</div>
                            <div class='device-info-status-active' >开启</div>
                            <!-- <div class='device-info-status-close' >关闭</div> -->
                            <div class='device-info-value' >ipone 11</div>
                        </div>
                         <div class='device-info-list'>
                            <div class='device-info-label'>新号丢失警报</div>
                            <!-- <div class='device-info-status-active' >开启</div> -->
                            <div class='device-info-status-close' >关闭</div>
                            <div class='device-info-value' >ipone 11</div>
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
    }
    .deviceInfo-tips{
        font-size:var(--fontSize-big);
        color: var(--color-black-80);
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
        font-size:var(--fontSize-max);
        color:var(--color-black-80);
        margin-bottom:10px;
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
        font-size:var(--fontSize-big);
        color:var(--color-black-80);
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
        font-size:var(--fontSize-smax);
        color:var(--color-primary);
        width:60px;
        margin:0 20px;
        margin-right:60px;
    }
    .device-info-status-close{
        font-size:var(--fontSize-smax);
        color:var(--color-error);
        width:60px;
        margin:0 20px;
        margin-right:60px;
    }
    .device-info-label{
        font-size:var(--fontSize-smax);
        color:var(--color-black-40);
        width:150px;
        margin-right:30px;
    }
    .device-info-value{
        font-size:var(--fontSize-smax);
        color:var(--color-black-80);
        width:180px;
    }
</style>