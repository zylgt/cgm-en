<template>
    <div class='dayAnalysis' id='dayAnalysis' >
        <div class='analysis-header' >
            <div class='analysis-date' >{{dayInfo.day}}   {{dayInfo.week}}</div>
            <div class='analysis-event' v-if='tableData.length>0'> <el-checkbox v-model="eventChecked">事件记录</el-checkbox></div>
        </div>
        <Empty v-show='dayInfo.handelValue.length<=0' />
        <div class='analysis-box'  v-show='dayInfo.handelValue.length>0' >
            <div class='chart-box'>
                <div class='analysis-info' >
                    <div class='analysis-info-item' >
                        <div class='analysis-info-label' >平均葡萄糖值</div>
                        <div  :class='[dayInfo.avg>118.8?"active":"","analysis-info-value"]' v-if='unit=="mg/dL"'>{{dayInfo.avg}} mg/dL </div>
                        <div  :class='[dayInfo.avg>6.6?"active":"","analysis-info-value"]' v-else>{{dayInfo.avg}} mmol/L </div>
                    </div>
                    <div class='analysis-info-item' >
                        <div class='analysis-info-label' >最大血糖波动</div>
                        <div  :class='[dayInfo.fluctate>79.2?"active":"","analysis-info-value"]'  v-if='unit=="mg/dL"'>{{dayInfo.fluctate}} mg/dL</div>
                        <div  :class='[dayInfo.fluctate>4.4?"active":"","analysis-info-value"]'  v-else>{{dayInfo.fluctate}} mmol/L</div>
                    </div>
                    <div class='analysis-info-item' >
                        <div class='analysis-info-label' >目标范围内占比</div>
                        <div :class='[dayInfo.tir<70?"active":"","analysis-info-value"]' >{{dayInfo.tir}}%</div>
                    </div>
                    <div class='analysis-info-item' >
                        <div class='analysis-info-label' >低于目标范围占比</div>
                        <div :class='[dayInfo.lowTir>5?"active":"","analysis-info-value"]' >{{dayInfo.lowTir}}%</div>
                    </div>
                    <div class='analysis-info-item' >
                        <div class='analysis-info-label' >高于目标范围占比</div>
                        <div :class='[dayInfo.hightTir>25?"active":"","analysis-info-value"]' >{{dayInfo.hightTir}}%</div>
                    </div>
                </div>
                <t-chart
                        style="flex-grow:1;height:450px;"
                        :option="option"
                        :init-options="initOptions"
                        theme="tduck-echarts-theme"
                         ref='chart'
                />
            </div>
            <div class='event-box' v-show="eventChecked" >
                <el-table :data="tableData" style="width: 100%;border:none;" @current-change="handleCurrentChange"
                header-row-class-name='table-header' highlight-current-row ref="singleTable">
                    <el-table-column  prop="ts"  label="时间"></el-table-column>
                    <el-table-column  prop="event"  label="事件">
                        <template slot-scope="scope"> 
                            <div class='table-event-type' >
                                <img src="~@/assets/image/event-icon0.png" alt="" class='table-event-icon'  v-if='scope.row.event_type==0'>
                                <img src="~@/assets/image/event-icon1.png" alt="" class='table-event-icon'  v-if='scope.row.event_type==1'>
                                <img src="~@/assets/image/event-icon2.png" alt="" class='table-event-icon'  v-if='scope.row.event_type==2'>
                                <img src="~@/assets/image/event-icon3.png" alt="" class='table-event-icon'  v-if='scope.row.event_type==3'>
                                <img src="~@/assets/image/event-icon4.png" alt="" class='table-event-icon'  v-if='scope.row.event_type==4'>
                                <img src="~@/assets/image/event-icon5.png" alt="" class='table-event-icon'  v-if='scope.row.event_type==5'>
                                <img src="~@/assets/image/event-icon6.png" alt="" class='table-event-icon'  v-if='scope.row.event_type==6'>
                                <span v-if='scope.row.event_type==0'>{{scope.row.event_body.eat_name}}</span>
                                <span v-if='scope.row.event_type==1'>{{scope.row.event_body.sport_name}}</span>
                                <span v-if='scope.row.event_type==2'>{{scope.row.event_body.medicine_name}}</span>
                                <span v-if='scope.row.event_type==3'>{{scope.row.event_body.insulin_name}}</span>
                                <span v-if='scope.row.event_type==4'>{{scope.row.event_body.sleep_name}}</span>
                                <span v-if='scope.row.event_type==5'>指尖血</span>
                                <span v-if='scope.row.event_type==6'>{{scope.row.event_body.custom_name}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="event"  label="记录详情">
                        <template slot-scope="scope"> 
                            <div class='table-event-type' >
                                <span v-if='scope.row.event_type==0'>{{scope.row.event_body.remark}}</span>
                                <span v-if='scope.row.event_type==1'>{{scope.row.event_body.total_minute}}分钟</span>
                                <span v-if='scope.row.event_type==2'>{{scope.row.event_body.medicine_time_name}}</span>
                                <span v-if='scope.row.event_type==3'>{{scope.row.event_body.medicine_name}}</span>
                                <span v-if='scope.row.event_type==4'>{{scope.row.event_body.total_minute}}分钟</span>
                                <span v-if='scope.row.event_type==5'>{{scope.row.event_body.fingertipblood_name}}</span>
                                <span v-if='scope.row.event_type==6'>{{scope.row.event_body.remark}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="value"  label="测量值"></el-table-column>
                </el-table>
            </div>
            <div class='event-type'>
                <div class='event-type-item' >
                    <img src="~@/assets/image/event-icon0.png" alt="" class='event-icon' >
                    <p class='event-type-label' >饮食记录</p>
                </div>
                <div class='event-type-item' >
                    <img src="~@/assets/image/event-icon1.png" alt="" class='event-icon' >
                    <p class='event-type-label' >运动记录</p>
                </div>
                <div class='event-type-item' >
                    <img src="~@/assets/image/event-icon2.png" alt="" class='event-icon' >
                    <p class='event-type-label' >胰岛素记录</p>
                </div>
                <div class='event-type-item' >
                    <img src="~@/assets/image/event-icon3.png" alt="" class='event-icon' >
                    <p class='event-type-label' >用药记录</p>
                </div>
                <div class='event-type-item' >
                    <img src="~@/assets/image/event-icon4.png" alt="" class='event-icon' >
                    <p class='event-type-label' >睡眠记录</p>
                </div>
                <div class='event-type-item' >
                    <img src="~@/assets/image/event-icon5.png" alt="" class='event-icon' >
                    <p class='event-type-label' >指尖血记录</p>
                </div>
                <div class='event-type-item' >
                    <img src="~@/assets/image/event-icon6.png" alt="" class='event-icon' >
                    <p class='event-type-label' >其他事件</p>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
import TChart from '@/views/components/TChart'
import Empty from '@/views/components/Empty/empty'
import {formatDate,formatTime} from '@/utils/formatTime'
import {mapGetters} from "vuex"
import { TIRUtils } from "@/utils/algorithm/TIR";
import { GlucoseUtils } from "@/utils/algorithm/Glucose";
import img0 from '@/assets/image/event-icon0.png'
import img1 from '@/assets/image/event-icon1.png'
import img2 from '@/assets/image/event-icon2.png'
import img3 from '@/assets/image/event-icon3.png'
import img4 from '@/assets/image/event-icon4.png'
import img5 from '@/assets/image/event-icon5.png'
import img6 from '@/assets/image/event-icon6.png'

export default {
    data(){
        return{
            eventChecked:false, //事件记录开关
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
                        },
                        showSymbol:_.compact(this.dataList.value).length>1?false:true,
                        symbolSize:1,
                        symbol:'circle',
                        emphasis:{
                            disabled:true
                        },
                        lineStyle: {
                        width: 2,
                        },
                        animation:false,
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
                                }
                            ],
                        },
                        markArea:{
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
                        markPoint:{
                            data:[
                                
                            ]
                        }
                    }
                ],

                
            },
            tableData:[{
                time:'7:00',
                event:'早饭',
                info:'一个鸡蛋，一个红薯',
                value:'最大波动幅度 5.0mmol/L'
            },{
                time:'9:00',
                event:'早饭',
                info:'一个鸡蛋，一个红薯',
                value:'最大波动幅度 5.0mmol/L'
            }],
            dayInfo:{
                handelValue:[]
            },
        }
    },
    props:{
        dataList:{
            type:Object
        },
        eventList:{
            type:Array
        }
    },
    components: {
        TChart,Empty
    },
    computed:{
        ...mapGetters([
           'unit','targetScope','timeFormat']),
    },
    mounted(){
        this.handelOption(this.dataList)
        this.markEvent(this.eventList)
        this.chartMouse()
    },
    methods:{
        // 处理数据
        handelOption(data){
            let dayInfo = _.cloneDeep(data)
            if(dayInfo.handelValue.length>0){
                let unit = this.unit
                let timeFormat = this.timeFormat
                let handelValue = _.compact(dayInfo.value)
                let fluctate = _.max(dayInfo.value) -  _.min(dayInfo.value) //最大波动
                let avg = GlucoseUtils.calculateMeanCvGmi(handelValue).mean //平均值
                let lowTir = null,hightTir=null
                if(TIRUtils.getTIRResult(handelValue)){
                    lowTir = TIRUtils.getTIRResult(handelValue).lowRate + TIRUtils.getTIRResult(handelValue).veryLowRate
                    hightTir = TIRUtils.getTIRResult(handelValue).highRate + TIRUtils.getTIRResult(handelValue).veryHighRate
                }
                dayInfo.day = formatDate(dayInfo.day,'mm月dd日')
                dayInfo.fluctate = unit=='mg/dL'?fluctate:GlucoseUtils.mgdlToMmol(fluctate);
                dayInfo.avg = unit=='mg/dL'? Math.round(avg):GlucoseUtils.mgdlToMmol(avg);
                dayInfo.lowTir = _.round(Number(lowTir)*100, 1);
                dayInfo.hightTir =  _.round(Number(hightTir)*100, 1);
                
                
                // 图表数据
                let xData = Array.from({length:60*24},(item, index) => index)
                let max = GlucoseUtils.mgdlToMmol(dayInfo.max)<13.9?13.9: GlucoseUtils.mgdlToMmol(dayInfo.max)
                if(unit != 'mg/dL'){
                    dayInfo.value = dayInfo.value.map(val => GlucoseUtils.mgdlToMmol(val));
                }
                this.option.tooltip = {
                        show:true,
                        trigger:'axis',
                        confine:true,
                        axisPointer:{
                            type:'none',
                            axis:'x'
                        },
                        formatter(params){
                            let h =  Math.floor(Number(params[0].axisValue)/60)<10 ? '0'+ Math.floor(Number(params[0].axisValue)/60) : Math.floor(Number(params[0].axisValue)/60) 
                            let m =  Number(params[0].axisValue)%60 < 10 ? '0' + Number(params[0].axisValue)%60 : Number(params[0].axisValue)%60
                            if(timeFormat == 12){
                                h = h>=13?h-12:h
                            }
                            let moment = h+':'+m
                            let html =  "<div class='tooltip-box' >"+
                            " <div class='tooltips-val'>"+
                                " <span class='tooltips-val-num'>"+params[0].value+"</span>"+unit+
                                "</div>"+
                            " <div class='tooltips-date'>"+
                                dayInfo.day +' '+ moment+
                            " </div>"+
                        " </div>"
                            return params[0].value?html:''
                        },
                        extraCssText: 'box-shadow: 0 2px 10px rgba(195,245,247,1);'
                }
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
                this.option.series[0].markPoint.data = []
                this.option.series[0].markLine.data = this.option.series[0].markLine.data.splice(0,2)
                this.option.xAxis[0].data = xData
                this.option.yAxis[0].max = unit == 'mg/dL'?GlucoseUtils.mmolToMgdl(Math.ceil(max / 3) * 3):Math.ceil(max / 3) * 3
                this.option.series[0].data = dayInfo.value
                this.option.series[0].markLine.data[0].yAxis = this.targetScope[0]
                this.option.series[0].markLine.data[1].yAxis = this.targetScope[1]
                this.option.series[0].markArea.data[0][0].yAxis = this.targetScope[0]
                this.option.series[0].markArea.data[0][1].yAxis = this.targetScope[1]
            }
            this.dayInfo = dayInfo
        },
        // 标记事件
        markEvent(data){
            let unit = this.unit
            let eventData = _.cloneDeep(data)
            let chartValue = _.cloneDeep(this.dataList.value)
            let tableData = []
            if(unit != 'mg/dL'){
                chartValue = chartValue.map(val => GlucoseUtils.mgdlToMmol(val));
            }
            if(eventData){
                eventData.forEach(item=>{
                    let img =[img0,img1,img2,img3,img4,img5,img6]
                    this.option.series[0].markPoint.data.push({
                        coord:[item.xIndex,item.yPosition],
                        symbol:'image://'+img[item.event_type],
                        symbolSize:30
                    })
                    this.option.series[0].markLine.data.push([{
                        lineStyle:{
                                color: 'var(--color-black-60)',
                                width: 1,
                                type:'dashed'
                        },
                        coord:[item.xIndex,chartValue[item.xIndex]],
                    },{
                        coord:[item.xIndex,0],
                    }])
                    tableData.push({
                        id:item.event_id,
                        ts:formatDate(item.event_ts*1000,'HH:MM'),
                        event_type:item.event_type,
                        event_body:item.event_body
                    })
                    this.tableData = tableData
                })
            }else{
                this.tableData = []
            }
        },
        // 图表鼠标事件
        chartMouse(){
            let chart = this.$refs.chart.chart
            let that = this
            if(chart){
                 chart.on('click',(params)=>{
                    that.eventChecked = true
                    let row = that.tableData[params.dataIndex]
                    that.$refs.singleTable.setCurrentRow(row);
                    that.option.series[0].markPoint.data.forEach(item=>item.symbolSize = 30)
                    that.option.series[0].markPoint.data[params.dataIndex].symbolSize = 50
                })
            }
           
        },
        // 表格点击
        handleCurrentChange(val){
            let tableData = this.tableData
            let index = _.findIndex(tableData,function(o){return o.id==val.id})
            this.option.series[0].markPoint.data.forEach(item=>item.symbolSize = 30)
            this.option.series[0].markPoint.data[index].symbolSize = 50

        }
    },
    watch:{
        dataList(n,o){
            this.handelOption(n)
        },
        eventList(n,o){
            this.markEvent(n)
        },
    }
}
</script>
<style >
.dayAnalysis{
    padding:20px 0;
    border-bottom:1px solid rgba(0,0,0,0.1);
}
.analysis-header{
    display: flex;
    align-items: center;
    margin-bottom:20px;
}
.analysis-date{
    width:180px;
    font-size:var(--fontSize-max);
    color: var(--color-black-100);
}
/* 图表血糖信息 */
.chart-box{
    display: flex;
    height:450px;
    margin-bottom:20px;
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
    font-size:var(--fontSize-big);
    color: var(--color-black-60);
    margin-left:6px;
}
/* 表格 */
.table-event-type{
    display: flex;
}
.table-event-icon{
    width:30px;
    height:30px;
}
</style>