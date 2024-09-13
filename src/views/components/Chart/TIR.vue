<template>
    <div class='TIR' ref='tir'>
        <canvas id='myCanvas' ref='canvas' class='canvas' ></canvas>
        <div class='tir-info' >
            <div class='tir-key' >
                <div  v-for='(item) in tirList'  :key='item.key'>
                    <div class='tir-key-item' ref='tirInfo'  :data-index='item.index'  v-if='item.value!=0'>
                        <div class='tir-key-box'>
                            <div class='tir-key-legend' :style='{backgroundColor:item.color}' ref='legend' :data-index='item.index' ></div>
                            <div class='tir-key-desc' >
                                <div class='tir-key-key' >{{$t('message.reports.tirs.'+item.key)}} </div>
                                <div class='tir-key-range' >{{unit=='mg/dL'?item.descmg:item.desc}}</div>
                            </div>
                        </div>
                        <div class='tir-value'>
                            <div class='tir-key-key ' > 
                                <span v-if='item.index==2' :class='[Number(item.value)<=item.target?"active":"","tir-print-keys"]' >{{item.value}}%</span>
                                <span v-if='item.index!=2' :class='[Number(item.value)>=item.target?"active":"","tir-print-key"]' >{{item.value}}%</span>
                                ({{item.duration[0]}}H{{item.duration[1]}}M)
                            </div>
                            <div class='tir-key-range' v-if='item.index==2'>{{$t('message.common.target')}}＞{{item.target}}%</div>
                            <div class='tir-key-range' v-else>{{$t('message.common.target')}}＜{{item.target}}%</div>
                        </div>
                    </div>
                </div>
                <div class='tir-all-1' v-if='highTarget!=0' :style='{height:highTargetHeight+"px"}' >
                    <div :class='[highLine?"":"disabled","tir-all-line"]'></div>
                    <div class='tir-all-value' >
                        <div :class='[Number(highTarget)>=25?"active":"","tir-key-key"]' >{{highTarget}}%</div>
                        <div class='tir-key-range' >{{$t('message.common.target')}}＜25%</div>
                    </div>
                </div>
                <div class='tir-all-2'  v-if='lowTarget!=0' :style='{height:lowTargetHeight+"px"}'>
                    <div :class='[lowLine?"":"disabled","tir-all-line"]'></div>
                    <div class='tir-all-value'  >
                        <div :class='[Number(lowTarget)>=4?"active":"","tir-key-key"]' >{{lowTarget}}%</div>
                        <div class='tir-key-range' >{{$t('message.common.target')}}＜4%</div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>
<script>

import {formatDate,formatTime} from '@/utils/formatTime'
import {mapGetters} from "vuex"
export default {
    name:'TIR',
    data(){
        return{
            levels: [
                {key: 'veryHigh', 
                    value:1,  
                    duration:[],
                    color: '#E98C41',
                    desc: '>13.9mmol/L',
                    descmg:'>250mg/dL',
                    target:'5',
                    index:0
                },
                {
                    key: 'high',
                    value: 1,
                    duration:[],
                    color: '#F6C059',
                    desc: '10.1-13.9mmol/L',
                    descmg:'181-250mg/dL',
                    target:'25',
                    index:1
                },
                {
                    key: 'inrange',
                    value: 60,
                    duration:[],
                    color: '#A6CF39',
                    desc: '3.9-10mmol/L',
                    descmg:'70-180mg/dL',
                    target:'70',
                    index:2
                },
                {key: 'low', value: 30,  duration:[],color: '#F43F31', desc: '3.0~3.8mmol/L', descmg:'54-69mg/dL',target:'4', index:3},
                {key: 'veryLow', value:0,  duration:[],color: '#96251C', desc: '<3.0mmol/L', descmg:'<54/dL',target:'1', index:4},
            ],
            tirList:[],
            canvas:null,
            ctx:null,
            highTarget:0,
            lowTarget:0,
            highLine:false,
            lowLine:false,
            highTargetHeight:0,
            lowTargetHeight:0,
        }
    },
    props:{
        dataList:{
            type:Object
        }
    },
    created(){
    },
    computed:{
        ...mapGetters([
           'unit','targetScope']),
    },
    mounted(){
        this.renderData(this.dataList)
    },
    methods:{
        // 渲染
        renderData(data){
            let result = _.clone(data)
            // this.levels[0].value = _.round(Number(result.veryHighRate*100),1)
            // this.levels[1].value = _.round(Number(result.highRate*100),1)
            // this.levels[2].value = _.round(Number(result.normalRate*100),1)
            // this.levels[3].value = _.round(Number(result.lowRate*100),1)
            // this.levels[4].value = _.round(Number(result.veryLowRate*100),1)


            this.levels[0].value = this.handelTir(result).veryHighRate
            this.levels[1].value = this.handelTir(result).highRate
            this.levels[2].value = this.handelTir(result).normalRate
            this.levels[3].value = this.handelTir(result).lowRate
            this.levels[4].value = this.handelTir(result).veryLowRate

            this.levels[0].duration =[Math.floor(result.veryHighDuration/60), result.veryHighDuration%60 ]
            this.levels[1].duration =[Math.floor(result.highDuration/60), result.highDuration%60]
            this.levels[2].duration =[Math.floor(result.normalDuration/60), result.normalDuration%60]
            this.levels[3].duration =[Math.floor(result.lowDuration/60),result.lowDuration%60]
            this.levels[4].duration =[Math.floor(result.veryLowDuration/60), result.veryLowDuration%60]

            this.levels[2].desc = this.targetScope[0]+'-'+ this.targetScope[1]+'mmol/L'
            this.levels[2].descmg = this.targetScope[0]+'-'+this.targetScope[1]+'mg/dL'
            this.levels[1].desc = _.round(this.targetScope[1]+0.1,1)+'-13.9mmol/L'
            this.levels[1].descmg = this.targetScope[1]+1+'-250mg/dL'
            this.levels[3].desc = '3.0-'+_.round(this.targetScope[0]-0.1,1)+'mmol/L'
            this.levels[3].descmg = '54-'+(this.targetScope[0]-1)+'mg/dL'
            this.highTarget = Number(this.levels[0].value) || Number(this.levels[1].value) ?_.round(Number(this.levels[0].value)+Number(this.levels[1].value),1):0
            this.lowTarget =  Number(this.levels[3].value) || Number(this.levels[4].value) ?_.round(Number(this.levels[3].value)+Number(this.levels[4].value),1):0
            this.highLine = Number(this.levels[0].value) && Number(this.levels[1].value)
            this.lowLine = Number(this.levels[3].value) && Number(this.levels[4].value)
            this.tirList = _.filter(this.levels,function(e){return e.value>0})
            console.log(_.filter(this.levels,function(e){return e.value>0}))
            console.log(formatTime(new Date()),'TIR计算完成')
            this.$nextTick(()=>{
                this.drawTir()
                this.handelHeight()
            }) 
        },
        // 计算总值为100
        handelTir(result){
            let veryHighRate = (result.veryHighRate * 100).toFixed(1);
            let highRate = (result.highRate * 100).toFixed(1);
            let normalRate = (result.normalRate * 100).toFixed(1);
            let lowRate = (result.lowRate * 100).toFixed(1);
            let veryLowRate = (result.veryLowRate * 100).toFixed(1);

            var rateObjs = [
                {origV: result.veryHighRate * 100, resultV: veryHighRate},
                {origV: result.highRate * 100, resultV: highRate},
                {origV: result.normalRate * 100, resultV: normalRate},
                {origV: result.lowRate * 100, resultV: lowRate},
                {origV: result.veryLowRate * 100, resultV: veryLowRate},
            ];

            // 求和
            let rateSumMax = 100;
            let rateSum = rateObjs.reduce(function (total, rateObj) {
                return total + parseFloat(rateObj.resultV);
            }, 0);
            if (rateSum !== rateSumMax) {
                const changeValue = 0.1;
                let changeCount = 0;
                if (rateSum > rateSumMax) {
                // >100，5入的需减
                const changeRateCount =
                    parseFloat((rateSum - rateSumMax).toFixed(1)) / changeValue;
                rateObjs.forEach((rateObj, i) => {
                    if (
                    rateObj.resultV > changeValue &&
                    rateObj.resultV > rateObj.origV &&
                    changeCount < changeRateCount
                    ) {
                    rateObjs[i] = {
                        origV: rateObj.origV,
                        resultV: (parseFloat(rateObj.resultV) - changeValue).toFixed(1),
                    };
                    changeCount++;
                    }
                });
                } else {
                // <100，4舍的需加
                const changeRateCount =
                    parseFloat((rateSumMax - rateSum).toFixed(1)) / changeValue;
                rateObjs.forEach((rateObj, i) => {
                    if (
                    rateObj.resultV < rateObj.origV &&
                    changeCount < changeRateCount
                    ) {
                    rateObjs[i] = {
                        origV: rateObj.origV,
                        resultV: (parseFloat(rateObj.resultV) + changeValue).toFixed(1),
                    };
                    changeCount++;
                    }
                });
                }
                veryHighRate = rateObjs[0].resultV;
                highRate = rateObjs[1].resultV;
                normalRate = rateObjs[2].resultV;
                lowRate = rateObjs[3].resultV;
                veryLowRate = rateObjs[4].resultV;
            }
            return {
                veryHighRate,
                highRate,
                normalRate,
                lowRate,
                veryLowRate
            }
        },
        // 计算高血糖，低血糖总比例的高度
        handelHeight(){
            let levels = this.levels
            let legend = _.sortBy(this.$refs.legend,['dataset.index']) //图例的位置
            if(this.highLine){
                // 计算高度
                this.highTargetHeight = legend[1].offsetTop - legend[0].offsetTop
            }else if( Number(levels[0].value) || Number(levels[1].value)){
                // 计算高度
                this.highTargetHeight = legend[0].offsetTop
            }
            if(this.lowLine){
                // 计算高度
                this.lowTargetHeight = legend[legend.length-1].offsetTop - legend[legend.length-2].offsetTop
            }else if( Number(levels[3].value) || Number(levels[4].value)){
                // 计算高度
                this.lowTargetHeight =  legend[legend.length-1].offsetTop-legend[legend.length-1].offsetTop
            }
        },
        // 画图
        drawTir(){
            const canvas = document.getElementById("myCanvas");
            const ctx = canvas.getContext("2d")
            const W = 160
            const H = this.$refs.tir.offsetHeight*2
            canvas.width = W
            canvas.height = H
            ctx.scale(2, 2)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const barW = 40 //柱状图宽度
            const splitInterval = 1 //间隔距离
            const lineStart = barW+5 //标识线x轴起点
            const lineWidth =30//标识线总宽度
            let  start_y = 2 //柱状图y轴起始点 
            let  start_text_y = this.$refs.tir.offsetTop //第一段文字说明的起点
            let legend = _.sortBy(this.$refs.legend,['dataset.index']) //图例的位置
            let noRangeLength = 1 //需要花第2段线的数量
            for(var i=0;i<this.tirList.length;i++){
                let value = Number(this.tirList[i].value)*2.8

                // 画柱
                ctx.fillStyle = this.tirList[i].color
                ctx.fillRect(0,start_y,barW,value)

                // 画线
                let tir_key_top = null
                if( legend[i]) tir_key_top = legend[i].offsetTop+3
                let lineOneX = 0
                let lineOneY = 0
                let lineTwoX = 0
                let lineTwoY = 0
                let lineThreeX = 0
                let lineThreeY = 0
                if(tir_key_top-start_y>10&&start_y+value-tir_key_top>10){
                    lineOneX = lineStart+lineWidth
                    lineOneY= tir_key_top
                    lineTwoX =lineOneX
                    lineTwoY = lineOneY
                    lineThreeX = lineOneX
                    lineThreeY = lineOneY
                    noRangeLength = 1
                }else{
                    noRangeLength++
                    lineOneX = tir_key_top<start_y+value?lineStart+lineWidth-(lineWidth-noRangeLength*3):lineStart+(lineWidth-noRangeLength*3)-lineWidth/2
                    lineOneY= start_y +(value/2)
                    lineTwoX =  tir_key_top<start_y+value?lineStart+lineWidth-(lineWidth-noRangeLength*3):lineStart+(lineWidth-noRangeLength*3)-lineWidth/2
                    lineTwoY = tir_key_top
                    lineThreeX = lineStart+lineWidth
                    lineThreeY = tir_key_top
                }
                if(value!=0){
                    ctx.lineWidth="1";
                    ctx.strokeStyle="#e5e5e5";
                    ctx.beginPath();
                    ctx.moveTo(lineStart,lineOneY);
                    ctx.lineTo(lineOneX,lineOneY);
                    ctx.lineTo(lineTwoX,lineTwoY);
                    ctx.lineTo(lineThreeX,lineThreeY);
                    ctx.stroke();
                }
                start_y = start_y + value + splitInterval
            }
            this.$nextTick(()=>{
                console.log(formatTime(new Date()),'TIR渲染完成')
            })
        },
    },
    watch:{
        dataList:function(n,o){
            let data = n
            this.renderData(data)
        }
    }
}
</script>
<style scoped>
    .TIR{
        height:300px;
        display: flex;
        padding:0 6px;
    }
    .canvas{
        width:80px;
        height:300px;
    }
    .tir-info{
        flex-grow: 1;
        display: flex;
    }
    .tir-key{
        width:100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
    }
    .tir-key-item{
        width:100%;
        height:47px;
        display: flex;
    }
    .tir-key-box{
        display: flex;
        align-items:baseline;
        width:220px;
    }
    .tir-key-legend{
        width:7px;
        height:7px;
        margin-right:10px;
    }
    .tir-key-key{
        font-size:var(--fontSize-smax);
        color:var(--color-black-100);
        line-height: 26px;
        font-weight: 600;
    }
    .tir-key-key.active{
         color:var(--color-error);
    }
    .tir-print-key{
        font-size:24px;
        font-weight: 440;
        line-height: 26px;
        font-weight: 600;
    }
    .tir-print-keys{
        color:#A6CF39;
        font-size:24px;
        font-weight: 600;
        line-height: 26px;
    }
    .tir-print-keys.active{
        color:var(--color-error);
    }
     .tir-print-key.active{
        color:var(--color-error);
    }
    .tir-key-range{
        font-size:var(--fontSize-default);
        color:var(--color-black-60);
        line-height: 18px;
    }
    .tir-value{
        width:200px;
    }
    .tir-value-all{
        display: flex;
    }
    .tir-all-1{
        height:60px;
        display: flex;
        align-items: center;
        width:220px;
        position: absolute;
        right:0;
        top:13px;
    } 
    .tir-all-2{
        height:60px;
        display: flex;
        align-items: center;
        margin-top:25px;
        width:220px;
        position: absolute;
        right:0;
        bottom:25px;
    }
    .tir-all-line{
        width:120px;
        height:100%;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        border:1px solid var(--color-black-40);
        border-left:none;
        margin-right:10px;
    }
    .tir-all-line.disabled{
        opacity: 0;
    }
    .tir-all-value{
        width:120px;
    }
</style>