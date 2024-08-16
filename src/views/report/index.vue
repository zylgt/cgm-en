<template>
    
        <router-view></router-view>
    
</template>
<style >
    /* title和日期选择 */
    .agp-top{
        display: flex;
        display: -webkit-flex;
        display:-webkit-inline-flex;
        align-items: center;
        justify-content: space-between;
        width:100%;
        margin-bottom:20px;
    }
    .report-title{
        font-size:var(--fontSize-max);
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
        width:400px;
        border-radius:10px;
        background:#fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
    }
    .report-agp-dates{
        height:50px;
        position: relative;
        width:400px;
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
        border-radius:10px;
        background:#fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border:1px solid rgba(0,0,0,0.05);
        margin-bottom: 20px;
        position: absolute;
        left:0;
        top:0;
        z-index:9;
    }
    .agp-date{
        font-size:var(--fontSize-big);
        color:var(--color-black-100);
        display:inline-block;
        margin:0 10px;
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
        height:40px;
        line-height: 40px;
        vertical-align: middle;
        padding-left:14px;
        font-size:var(--fontSize-max);
        color:var(--color-black-100);
        font-weight: 440;
        background: rgba(50, 186, 192, 0.1);
        border-radius:4px;
        margin-bottom:10px;
        display: flex;
        align-items: center;
        box-shadow: 0px 2px 20px 0px #0000000D;
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
</style>