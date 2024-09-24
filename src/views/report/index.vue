<template class='cont-main-box'>
    
        <router-view></router-view>
    
</template>
<style >
    .cont-main-box{
        width:1680px;
        margin:0 auto;
    }
    /* title和日期选择 */
    .agp-top{
        display: flex;
        display: -webkit-flex;
        display:-webkit-inline-flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom:20px;
        width:1680px;
        padding:0 80px;
        margin:0 auto;
    }
    .report-title{
        font-size:30px;
        color:var(--color-black-100);
        font-weight: 700;
    }
    .btn-upload{
        display: inline-block;
        vertical-align: middle;
        margin-right:4px;
        width:20px;
        height:20px;
    }
    .report-agp-date{
        height:50px;
        position: relative;
        width:380px;
        border-radius:10px;
        background:#fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        border:1px solid rgba(0,0,0,0.05)
    }
    .report-agp-dates{
        height:50px;
        position: relative;
        width:380px;
        border-radius:10px;
        background:#f7f7f7;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border:1px solid rgba(0,0,0,0.05);
        margin-bottom: 60px;
        box-shadow: 0px 2px 20px 0px #0000000D;
    }
    .report-agp-date-box{
        height:50px;
        position: relative;
        width:400px;
        padding:0 10px;
        border-radius:10px;
        background:#fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border:1px solid rgba(0,0,0,0.05);
        margin-bottom: 20px;
        box-sizing: border-box;
        margin-left:80px;
    }
    .agp-date{
        font-size:var(--fontSize-default);
        color:var(--color-black-100);
        display:inline-block;
        margin:0 10px;
        width:320px;
    }
    .main-box{
        position: relative;
    }
    .select-icon{
        width:20px;
        height:20px;
    }
    .agp-icon{
        width:24px;
        height:24px;
        display:inline-block;
        vertical-align: sub;
        margin-right:10px;
    }
    .edit-agp-icon{
        width:24px;
        height:24px;
        margin-right:30px;
        vertical-align: sub;
    }
    .agp-picker{
        position: absolute;
        left:3px;
        top:3px;
        width:390px !important;
        height:36px !important;
    }
    .agp-picker i ,.agp-picker input{
        opacity: 0;
    }
    /* 解释说明、dialog弹窗 */
    .slot-popover{
        padding:10px;
    }
    .slot-popover-title{
        font-size:var(--fontSize-smax);
        color:var(--color-black-100);
        margin-bottom:8px;
    }
    .slot-popover-cont{
        font-size:var(--fontSize-big);
        color:var(--color-black-40);
        line-height: 22px;
    }
    .slot-popover-conts{
        margin-bottom:100px;
    }
    .popover-cont-label{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .popover-cont-label-label{
        font-size:var(--fontSize-max);
        color:var(--color-black-60);
        margin-bottom:20px;
    }
    .slot-popover-btn{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    /* 模块title */
    .agp-cont-main{
        background: #fff;
        padding:20px;
        border-radius:10px;
        box-sizing: border-box;
        margin-bottom:20px;
    }
    .cgm-cont-title{
        width:100%;
        height:50px;
        line-height: 50px;
        vertical-align: middle;
        padding-left:14px;
        font-size:var(--fontSize-max);
        color:#fff;
        font-weight: 440;
        background: var(--color-primary);
        border-radius:4px;
        margin-bottom:10px;
        display: flex;
        align-items: center;
        font-family:MiLan-Medium;
    }
    .title-border{
        display: block;
        width:3px;
        height:20px;
        background: var(--color-primary);
        margin-right:4px;
    }
      /* 模块解释说明图表 */
    .cgm-agp-info-box{
        margin-bottom:20px;
        display: flex;
        justify-content: space-between;
    }
    .cgm-agp-info-box1{
        margin: 0;
        position: absolute;
        right:20px;
        top:70px;
    }
    .cgm-agp-info{
        color:var(--color-black-40);
        font-size: var(--fontSize-default);
        padding-left:6px;
    }
    .reason-icon{
        width:22px;
        height:22px;
        margin-left:40px;
    }
    /* echarts提示框 */
    .tooltip-box{
        font-size:var(--fontSize-default);
        color:var(--color-black-40);
    }
    .tooltips-val{
        margin-bottom:4px;
    }
    .tooltips-val-num{
        font-size:var(--fontSize-big);
        color:var(--color-black-80);
        padding-right:4px;
    }
    .tooltips-val-tir{
         color:var(--color-black-80);
    }
    /* 日期弹窗 */
    .datePop-box{
        width:100%;
        height: 100%;
        padding: 10px;
    }
    .datePop-title{
        height:42px;
        line-height: 42px;
        border-bottom:1px solid rgba(0,0,0,0.1);
        font-size:var(--fontSize-smax);
        color:var(--color-black-100);
        font-weight: 700;
    }
    .datePop-sub-title{
        font-size:var(--fontSize-default);
        color:var(--color-black-100);
        padding:10px 0;
    }
    .datePop-days{
        display: flex;
        align-items: center;
        margin-bottom:20px;
        width: 100%;
        justify-content: space-between;
    }
    .datePop-days-item{
        width:160px;
        height:42px;
        border-radius:10px;
        border:1px solid rgba(0,0,0,0.1);
        text-align: center;
        line-height: 42px;
        font-size:var(--fontSize-default);
        color:var(--color-black-80);
        cursor: pointer;
    }
    .datePop-days-item.active{
        background: var(--color-primary);
        color:#fff;
    }
    .datePop-change-day{
        width:100%;
        height:100px;
        border-radius:10px;
        background:#f7f7f7;
        box-sizing: border-box;
        padding:20px;
        font-size:var(--fontSize-default);
        color:var(--color-black-100);
    }
    .datePop-btn{
        display: flex;
        align-items: center;
        justify-content: center;
        margin:40px 0;
    }
    .cancel-btn{
        width:140px;
        height:50px;
        border-radius:10px;
        background: #f7f7f7;
        text-align: center;
        line-height: 50px;
        font-size:var(--fontSize-default);
        color:var(--color-black-80);
        font-weight: 600;
        margin-right:30px;
        cursor: pointer;
    }
    .confirm-btn{
        width:140px;
        height:50px;
        border-radius:10px;
        background:var(--color-primary);
        text-align: center;
        line-height: 50px;
        font-size:var(--fontSize-default);
        color:#fff;
        font-weight: 600;
        cursor: pointer;
    }
</style>