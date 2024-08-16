<template>
    <div>
        <div class='chart-box'>
            <div class='analysis-info' >
                <div class='analysis-info-item' >
                    <div class='analysis-info-label' >目标范围内占比</div>
                    <div :class='[dayInfo.tir<70?"active":"","analysis-info-value"]' >{{dayInfo.tir}}%</div>
                </div>
                <div class='analysis-info-item' >
                    <div class='analysis-info-label' >平均葡萄糖值</div>
                    <div  :class='[dayInfo.mean>118.8?"active":"","analysis-info-value"]' v-if='unit=="mg/dL"'>{{dayInfo.mean}} mg/dL </div>
                    <div  :class='[dayInfo.mean>6.6?"active":"","analysis-info-value"]' v-else>{{dayInfo.mean}} mmol/L </div>
                </div>
                <div class='analysis-info-item' >
                    <div class='analysis-info-label' >预估HbA1c（GMI）</div>
                    <div :class='[dayInfo.GMI>7?"active":"","analysis-info-value"]' >{{dayInfo.GMI}}%</div>
                </div>
                <div class='analysis-info-item' >
                    <div class='analysis-info-label' >变异系数（CV）</div>
                    <div :class='[dayInfo.CV>33?"active":"","analysis-info-value"]' >{{dayInfo.CV}}%</div>
                </div>
            </div>
            <div class='t-chart' >
                <t-chart
                    style="width:100%;height:450px;"
                    :option="option"
                    :init-options="initOptions"
                    theme="tduck-echarts-theme"
                    ref='chart'
                />
                <div class='tooltip-box' :style='{"left":tooltipLeft+"px","top":tooltipTop+"px"}' v-if='tooltipShow' >
                        <div class='tooltips-val'>
                            <span class='tooltips-val-num'>{{tooltipValue}}</span>{{unit}}
                        </div>
                        <div class='tooltips-date'>
                            {{tooltipDay}}  {{tooltipMoment}}
                        </div>
                </div>
                <div class='date-box' id='dayAnalysis'>
                    <div class='date-item' >
                        <div :class='[item.diabled?"disDay":item.checked?"checkDay"+index:"noCheckDay","chart-day"]' v-for='(item,index) in chartDate' :key='index'  @click='checkChart(index)'>{{item.day}}</div>
                    </div>
                     <el-checkbox  v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                </div>
                
            </div>
        </div>
    </div>
</template>
<script>
import TChart from '@/views/components/TChart'
import {mapGetters} from "vuex"
import { GlucoseUtils } from "@/utils/algorithm/Glucose";
import {formatDate,formatTime} from '@/utils/formatTime'
export default {
    data(){
        return{
             initOptions: {
                renderer: 'svg'
            },
            option: {
                grid:[
                    {
                        left:60,
                        right:30,
                        top:10,
                        bottom:50
                    }
                ],
                xAxis: [
                    {
                        type: 'category',
                        gridIndex:0,
                        boundaryGap:false,
                        axisTick: false,
                        splitLine:{
                            show:false,
                            lineStyle:{
                                color:'var(--color-black-60)'
                            },
                            interval:59
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: 'var(--color-black-60)',
                                width:1,
                            },
                        },
                        data:[],
                        axisLabel: {
                            formatter: function (value, index) {
                                if (index  % 360 === 0) {
                                    let h =  Math.floor(value/60)<10 ? '0'+ Math.floor(value/60) : Math.floor(value/60) 
                                    let m =  value%60 < 10 ? '0' + value%60 : value%60
                                    let moment = h+':'+m
                                    return moment;
                                }
                                if(index+1===24*60){
                                    return '00:00'
                                }
                            },
                            interval:0,
                            color: 'var(--color-black-60)',
                            fontSize: 20, 
                            margin:20
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        gridIndex:0,
                        min: 0,
                        max: 15,
                        splitLine:{
                            lineStyle:{
                                color:'var(--color-black-60)'
                            }
                        },
                        axisLabel: {
                            formatter: '{value}',
                            color: 'var(--color-black-60)',
                            fontSize: 20,
                            margin:14
                        }
                    }
                ],
                series: [
                    //中位线
                    {
                        type: 'line',
                        data: [],
                        z:9,
                        itemStyle: {
                        color:'var(--color-primary)',
                        opacity:0
                        },
                        showSymbol:_.compact(this.dataList.value).length>1?false:true,
                        symbolSize:1,
                        symbol:'circle',
                        emphasis:{
                            focus:'series',
                            scale:false
                        },
                        lineStyle: {
                        width: 2,
                        opacity:1
                        },
                        animation:false,
                        triggerLineEvent:true,
                        markLine: {
                            silent: true, // 不高亮辅助线
                            symbol: 'none',
                            animation:false,
                            data: [
                                {
                                type: 'min',
                                yAxis:3.9,
                                lineStyle: {
                                    color: 'var(--color-error)',
                                    width: 2,
                                    type:'solid'
                                },
                                label: {
                                    color: 'var(--color-error)',
                                    fontSize: 20,
                                    distance: 14,
                                    position:'start'
                                },
                                },
                                {
                                type: 'max',
                                yAxis:10,
                                lineStyle: {
                                    color: 'var(--color-warning)',
                                    width: 2,
                                    type:'solid'
                                },
                                label: {
                                    color: 'var(--color-warning)',
                                    fontSize: 20,
                                    distance:14,
                                    position:'start'
                                },
                                },
                            ],
                        },
                        markArea:{
                            silent: true, // 不高亮辅助线
                            data:[
                                [{
                                    yAxis: 3.9
                                },
                                {   
                                    yAxis: 10
                                }]
                            ],
                            itemStyle:{
                                color:'rgba(72, 160, 220, 0.05)'
                            }
                        },
                    }
                ],

                
            },
            dayInfo:'',
            color: ['#E5B769','#D191E1','#83B1E9','#D7796E','#B5D87F','#E9EB5C','#32BAC0'],
            checkAll:true,
            chartDate:[],
            tooltipValue:0,
            tooltipDay:null,
            tooltipMoment:null,
            tooltipLeft:0,
            tooltipTop:0,
            tooltipShow:false
        }
    },
    props:{
        dataList:{
            type:Object
        }
    },
    components: {
        TChart
    },
    computed:{
        ...mapGetters([
           'unit','targetScope','timeFormat']),
    },
    mounted(){
        this.handelOption(this.dataList)
        this.chartMouse()
    },
    methods:{
        handelOption(data){
            // 初始化
            this.$refs.chart.clear()
            this.option.series = [this.option.series[0]]
            this.option.series[0].lineStyle={opacity:1,width:3}
            this.checkAll = true
            let obj = _.cloneDeep(data) 
            let unit = this.unit
            this.dayInfo = obj
            if(obj.info){
                obj.info.mean = Math.round(obj.info.mean)
                this.dayInfo.mean = unit=='mg/dL'?obj.info.mean:GlucoseUtils.mgdlToMmol(obj.info.mean);
                this.dayInfo.GMI = obj.info.GMI
                this.dayInfo.CV = obj.info.CV
            }
         
            
            
            // 图表数据
            let xData = Array.from({length:60*24},(item, index) => index)
            let max = GlucoseUtils.mgdlToMmol(obj.max)<13.9?13.9: GlucoseUtils.mgdlToMmol(obj.max)

            let chartDate = []
            let color =this.color

            obj.value.forEach((item,index)=>{
                chartDate.push({
                    day:obj.day[index],
                    checked:true,
                    diabled:_.compact(item).length>1?false:true,
                    color:color[index]
                })
                if(unit != 'mg/dL'){
                    item = item.map(val => GlucoseUtils.mgdlToMmol(val));
                }
                if(index==0){
                     if(this.timeFormat == 12){
                        this.option.xAxis[0].axisLabel.formatter = function (value, index) {
                            if (index  % 360 === 0) {
                                let h = Math.floor(value/60) 
                                let moment = h
                                if(h>12){
                                    moment = h-12+'pm'
                                }else if(h==12){
                                    moment = h+'pm'
                                }else{
                                    if(h==0){h=12}
                                    moment = h+'am'
                                }
                                return moment;
                            }
                            if(index+1===24*60){
                                return '12am'
                            }
                        }
                    }
                    this.option.xAxis[0].data = xData
                    this.option.yAxis[0].max = unit == 'mg/dL'?GlucoseUtils.mmolToMgdl(Math.ceil(max / 3) * 3):Math.ceil(max / 3) * 3
                    this.option.series[0].data = item
                    this.option.series[0].markLine.data[0].yAxis = this.targetScope[0]
                    this.option.series[0].markLine.data[1].yAxis = this.targetScope[1]
                    this.option.series[0].markArea.data[0][0].yAxis = this.targetScope[0]
                    this.option.series[0].markArea.data[0][1].yAxis = this.targetScope[1]
                    this.option.series[0].itemStyle = {
                        color:color[0]
                    }
                }else{
                    this.option.series.push({
                        type: 'line',
                        data:item,
                        z:9,
                        itemStyle: {
                            color:color[index],
                            opacity:0
                        },
                        emphasis:{
                            focus:'series',
                             scale:false
                        },
                        triggerLineEvent:true,
                        showSymbol:_.compact(item).length>1?false:true,
                        symbolSize:1,
                        symbol:'circle',
                        lineStyle: {
                            width: 2,
                            opacity:1
                        },
                        animation:false,
                    })
                }
            })
            this.chartDate = chartDate
        },
        // 图表选中
        checkChart(index){
            let chartDate = this.chartDate
            if(!chartDate[index].disabled){
                chartDate[index].checked = !chartDate[index].checked
               
                this.option.series[index].lineStyle = {
                        opacity:chartDate[index].checked?1:0
                }
            }
            this.checkAll = _.every(chartDate, 'checked');
        },
        // 全选
        handleCheckAllChange(val){
            let chartDate = this.chartDate
            chartDate.forEach(item=>item.checked = val)
            this.option.series.forEach(item=>{
                item.lineStyle = {
                     opacity:val?1:0
                }
            })
        },
        // 图表鼠标事件
        chartMouse(){
            let chart = this.$refs.chart.chart
            chart.on('mousemove',(params)=>{
                
                let pointInPixel = [params.event.offsetX, params.event.offsetY];
                let pointInGrid = chart.convertFromPixel({seriesIndex: params.seriesIndex}, pointInPixel);
                let xIndex = pointInGrid[0];
                let h =  Math.floor(Number(xIndex)/60)<10 ? '0'+ Math.floor(Number(xIndex)/60) : Math.floor(Number(xIndex)/60) 
                let m =  Number(xIndex)%60 < 10 ? '0' + Number(xIndex)%60 : Number(xIndex)%60
                if(this.timeFormat == 12){
                    h = h>=13?h-12:h
                }
                let moment = h+':'+m
                this.tooltipShow = true
                this.tooltipMoment = moment
                this.tooltipDay = _.words(this.chartDate[params.seriesIndex].day, /[^月|日 ]+/g).join('.');
                this.tooltipValue = this.option.series[params.seriesIndex].data[xIndex]
                this.tooltipLeft = params.event.offsetX
                this.tooltipTop = params.event.offsetY
            })
            chart.on('mouseout',(e)=>{
                this.tooltipShow = false
            })
        }
    },
    watch:{
        dataList(n,o){
            this.handelOption(n)
        }
    }
}
</script>
<style scoped>
/* 图表血糖信息 */
.chart-box{
    display: flex;
}
.analysis-info{
    width:180px;
    height:450px;
    background: #f7f7f7;
    box-sizing: border-box;
    padding:10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
     font-size:var(--fontSize-max);
    color: var(--color-black-100);
}
.analysis-info-value.active{
    color:var(--color-error);
}
.t-chart{
    width:1340px;
    position: relative;
}
.date-box{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left:60px;
    margin-top:20px;
}
.date-item{
    display: flex;
    align-items: center;
}
.chart-day{
    width:120px;
    height:40px;
    border-radius:10px;
    text-align: center;
    line-height: 40px;
    font-size:var(--fontSize-big);
    color:#fff;
    margin-right:40px;
}
.checkDay0{
    background:#E5B769;
}
.checkDay1{
    background:#D191E1;
}
.checkDay2{
    background:#83B1E9;
}
.checkDay3{
    background:#D7796E;
}
.checkDay4{
    background:#B5D87F;
}
.checkDay5{
    background:#E9EB5C;
}
.checkDay6{
    background:#32BAC0;
}
.noCheckDay{
    background: #908D8D;
}
.disDay{
    background: #F7F7F7;
}
/* echarts提示框 */
    .tooltip-box{
        position: absolute;
        left:0;
        top:0;
        z-index:999;
        padding:10px;
        border-radius:10px;
        background:#fff;
        box-shadow: 0px 2px 10px 0px #C3F5F7;
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
</style>