<template>
    <div class='progress' >
       <div class='opacity-mask' ></div>
       <div class='progress-box' >
            <img src="~@/assets/image/data-loading.png" alt="" class='data-loading'>
            <div class='cgm-progress' >
                <div class='cgm-bg-progress' >
                    <div class='cgm-resulr-progress' :style='{"width":percentage*4+"px"}'></div>
                </div>
                <div class='progress-result' >{{percentage}}%</div>
            </div>
            <div class='tips' >{{$t('message.common.loading')}}...</div>
        </div> 
    </div>
</template>
<script>
export default {
    data(){
        return{
            percentage:0,
            progressTimer:null
        }
    },
    mounted(){
        this.interProgress()
    },
    methods:{
        interProgress(){
            let that = this
            this.progressTimer = setInterval(function(){
               let percentage = that.percentage
               percentage += 1
               if(percentage>=90){
                    percentage = 90
               }
               that.percentage = percentage
            },100)
        }
    },
    beforeDestroy(){
        this.percentage=100
    },
    destroyed(){
        clearInterval(this.progressTimer)
    }
}
</script>
<style  scoped>
    .progress{
        position: absolute;
        left:0;
        top:0;
        width: 100%;
    }
    .opacity-mask{
        width:100%;
        height:100%;
        background:rgba(0,0,0,0);
        position: fixed;
        left:0;
        top:0;
        z-index:9;
    }
    .progress-box{
        width:100%;
        height:540px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background:#fff;
        border-radius:10px;
    }
    .data-loading{
        width:80px;
        height:80px;
        margin-bottom:30px;
        -webkit-animation: rotate 1s linear;
        -moz-animation: rotate 1s linear;
        animation: rotate 1s linear;
        -webkit-animation-iteration-count: infinite;
        -moz-animation-iteration-count: infinite;
        animation-iteration-count: infinite;
    }
    .tips{
        text-align: center;
        margin-top:30px;
        color:var(--color-primary);
        font-size:var(--fontSize-max);
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
</style>