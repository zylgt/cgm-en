<template>
    <div></div>
</template>
<style scoped>
 /* 头部信息 */
    .print-boxs .reports-box{
        height: 1663px;
    }
    .print-boxs .reportss-box{
        transform: scale(0.7);
        transform-origin: 0 0;
    }
    .print-boxs .agp-main-box{
        padding:0 40px
    }
     .reports-box{
        /* height:2375px; */
        overflow: hidden;
    }
    .report-main-title-infos{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom:50px;
        height:66px;
        position: relative;
        padding:0 20px;
        padding-top:73px;
        box-sizing: border-box;
    }
    .report-logo{
        width:158px;
        height:50px;
        display: block;
    }
    .report-main-title{
        font-size:50px;
        color:var(--color-primary);
        /* font-family:MiLan-Medium; */
        font-weight: 440;
        text-align: center;
        position: absolute;
        left:0;
        top:0;
        width:100%;
        padding-top:36.5px;
    }
    .report-main-date{
        font-size:20px;
        color:var(--color-black-100);
        display: flex;
        align-items: center;
    }
    .repart-main-dirver-box{
        width:20px;
        height:20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin:0 2px;
    }
    .repart-main-dirver{
        width:16px;
        height:1px;
        background:var(--color-black-100);
    }
    .agp{
        width:1680px;
        height:100%;
    }
    .agp-cont-main1{
        height:450px;
        position: relative;
    }
    .agp-cont-main1:nth-child(1){
         margin-right:20px;
    }
    .agp-main-box{
        width:1680px;
        padding:0 80px;
    }
    
    /* 基本信息 */
    .report-main-base-info{
        width:100%;
        height:209px;
    }
    .report-base-user{
        width:100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin:20px 0;
        height:35px;
        box-sizing: border-box;
        padding:0px 20px 0px 10px;
    }
    .report-base-user-item{
        display: flex;
        align-items: center;
        font-size:18px;
    }
    .report-base-user-item0{
         width:35%;
    }
    .report-base-user-item1{
        font-size:18px;
        flex-grow: 2;
         width:45%;
    }
     .report-base-user-item2{
        font-size:18px;
        width:20%;
    }
    .report-base-user-label{
        font-size: var(--fontSize-smax);
        color:var(--color-black-60);
    }
    .report-base-user-value{
        font-size: var(--fontSize-smax);
        color:var(--color-black-100);
        width:140px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 600;
    }
    .report-data-source{
        width:100%;
        height:52px;
        padding-left:20px;
        padding-right:60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background:#f7f7f7;
    }
      .report-data-sources{
        width:100%;
        height:52px;
        padding-left:20px;
        padding-right:60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
 
    /* 标准 */
    .bg-data-item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin:0;
        height:74px;
        padding:0 6px;
        border-bottom:1px solid var(--color-black-30);
    }
    .bg-data-item:last-child{
        border: none;
    }
    .bg-data-label{
        font-size:var(--fontSize-smax);
        color:var(--color-black-100);
        font-weight: 600;
    }
    .bg-data-tip{
        font-size:var(--fontSize-default);
        color:var(--color-black-60);
        font-weight: 400;
    }
    .bg-data-val{
        font-size:var(--fontSize-max);
        color:var(--color-black-100);
        font-weight: 440;
        font-family:MiLan-Medium;
    }
    .bg-data-val.active{
        color:var(--color-error);
    }
    .printToask{
        height:1080px;
    }
    .event-type{
        display: flex;
        align-items: center;
        margin-top:20px;
    }
    .event-type-item{
        display: flex;
        align-items: center;
        margin-right:30px;
    }
    .event-icon{
        width:30px;
        height:30px;
    }
    .event-type-label{
        font-size:var(--fontSize-default);
        color: var(--color-black-60);
        margin-left:6px;
    }
    /* pdf弹框 */
    .slot-progress{
        width:460px;
        margin:0 auto;
        padding:50px 0;
    }
    .down-icon{
        width:80px;
        height:80px;
        display: block;
        margin:0 auto;
        margin-bottom:30px;
    }
    .cgm-progress{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .cgm-bg-progress{
        width:400px;
        margin-right:10px;
        position: relative;
        border-radius:80px;
        background:#eaeaea;
        height:12px;
    }
    .cgm-resulr-progress{
        height: 12px;
        border-radius:80px;
        background:var(--color-primary);
    }
    .progress-result{
        font-size:var(--fontSize-max);
        color:var(--color-primary);
        width:50px;
    }
    .slot-progress-title{
        text-align: center;
        width:100%;
        font-size:var(--fontSize-smax);
        color:var(--color-primary);
        margin-bottom:20px;
    }
    .slot-progress-tips{
        font-size:var(--fontSize-default);
        color:var(--color-black-60);
        text-align: center;
    }
/* 参数解释 */
    .report-main-params{
        width:1480px;
        height:239px;
        background:#f7f7f7;
        border-radius:10px;
        padding:26px 20px 20px 20px;
        margin:0 auto;
    }
    .report-main-params-title{
        font-size:16px;
        color:var(--color-black-100);
        line-height: 21px;
    }
     .report-main-params-item{
        font-size:16px;
        color:var(--color-black-60);
        line-height: 21px;
        margin-bottom:8px;
     }
</style>