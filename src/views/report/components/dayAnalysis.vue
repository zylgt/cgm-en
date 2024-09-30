<template>
    <div class='dayAnalysis' id='dayAnalysis' >
        <div class='dayAnalysis-box' >
            <div class='overview-compliance-border' v-if='dayInfo.tir>=70'></div>
            <div class='overview-nocompliance-border'  v-if='dayInfo.tir<70'></div>
            <div class='analysis-header' >
                <div class='analysis-date' >{{dayInfo.day}},{{dayInfo.week}}</div>
                <div class='analysis-event' v-if='tableData.length>0'> <el-checkbox v-model="eventChecked">{{$t('message.reports.trendDay.eventLog')}}</el-checkbox></div>
            </div>
            <Empty v-show='dayInfo.resultValue.length<=0' />
            <div class='analysis-box'  v-show='dayInfo.resultValue.length>0' >
                <div class='chart-box'>
                    <div class='analysis-info' >
                        <div class='analysis-info-item' >
                            <div  :class='[dayInfo.avg>118.8?"active":"","analysis-info-value"]' v-if='unit=="mg/dL"'>{{dayInfo.avg}} <span class='analysis-info-value-unit' >mg/dL</span>  </div>
                            <div  :class='[dayInfo.avg>6.6?"active":"","analysis-info-value"]' v-else>{{dayInfo.avg}} <span class='analysis-info-value-unit' >mmol/L</span>  </div>
                            <div class='analysis-info-label' >{{$t('message.reports.trendDay.mean')}}</div>
                        </div>
                        <div class='analysis-info-item' >
                            
                            <div  :class='[dayInfo.fluctate>79.2?"active":"","analysis-info-value"]'  v-if='unit=="mg/dL"'>{{dayInfo.fluctate}} <span class='analysis-info-value-unit' >mg/dL</span></div>
                            <div  :class='[dayInfo.fluctate>4.4?"active":"","analysis-info-value"]'  v-else>{{dayInfo.fluctate}} <span class='analysis-info-value-unit' >mmol/L</span></div>
                            <div class='analysis-info-label' >{{$t('message.reports.trendDay.max')}}</div>
                        </div>
                        <div class='analysis-info-item' >
                            
                            <div :class='[dayInfo.tir<=70?"active":"","analysis-info-value"]' >{{dayInfo.tir}} <span class='analysis-info-value-unit' >%</span></div>
                            <div class='analysis-info-label' >{{$t('message.reports.trendDay.tir')}}</div>
                        </div>
                        <div class='analysis-info-item' >
                            
                            <div :class='[dayInfo.lowTir>5?"active":"","analysis-info-value"]' >{{dayInfo.lowTir}} <span class='analysis-info-value-unit' >%</span></div>
                            <div class='analysis-info-label' >{{$t('message.reports.trendDay.lowRange')}}</div>
                        </div>
                        <div class='analysis-info-item' >
                        
                            <div :class='[dayInfo.hightTir>25?"active":"","analysis-info-value"]' >{{dayInfo.hightTir}} <span class='analysis-info-value-unit' >%</span></div>
                            <div class='analysis-info-label' >{{$t('message.reports.trendDay.highRange')}}</div>
                        </div>
                    </div>
                    <t-chart
                            style="flex-grow:1;height:360px;"
                            :option="option"
                            :init-options="initOptions"
                            theme="tduck-echarts-theme"
                            ref='chart'
                    />
                </div>
            </div>
         </div>
        <div class='event-box' v-show="eventChecked" >
            <el-table :data="tableData" style="width: 100%;border:none;" @current-change="handleCurrentChange"
            header-row-class-name='table-header' highlight-current-row ref="singleTable"  >
                <el-table-column  prop="ts"  :label="$t('message.reports.trendDay.time')"></el-table-column>
                <el-table-column  prop="event"  :label="$t('message.reports.trendDay.event')">
                    <template slot-scope="scope"> 
                        <div class='table-event-type' >
                            <img src="~@/assets/image/event-icon0.png" alt="" class='table-event-icon'  v-if='scope.row.event_type==0'>
                            <img src="~@/assets/image/event-icon1.png" alt="" class='table-event-icon'  v-if='scope.row.event_type==1'>
                            <img src="~@/assets/image/event-icon2.png" alt="" class='table-event-icon'  v-if='scope.row.event_type==3'>
                            <img src="~@/assets/image/event-icon3.png" alt="" class='table-event-icon'  v-if='scope.row.event_type==2'>
                            <img src="~@/assets/image/event-icon4.png" alt="" class='table-event-icon'  v-if='scope.row.event_type==4'>
                            <img src="~@/assets/image/event-icon5.png" alt="" class='table-event-icon'  v-if='scope.row.event_type==5'>
                            <img src="~@/assets/image/event-icon6.png" alt="" class='table-event-icon'  v-if='scope.row.event_type==6'>
                            <img src="~@/assets/image/event-icon7.png" alt="" class='table-event-icon'  v-if='scope.row.message_type==3'>
                            <img src="~@/assets/image/event-icon8.png" alt="" class='table-event-icon'  v-if='scope.row.message_type==2'>
                            <img src="~@/assets/image/event-icon8.png" alt="" class='table-event-icon'  v-if='scope.row.message_type==1'>
                            <span v-if='scope.row.event_type==0'>{{$t('message.tableEvent.food'+scope.row.food_time)}}</span>
                            <span v-if='scope.row.event_type==1'>{{$t('message.reports.trendDay.eventType1')}}</span>
                            <span v-if='scope.row.event_type==3'>{{$t('message.tableEvent.insulinTime'+scope.row.insulin_type)}}</span>
                            <span v-if='scope.row.event_type==2'>{{$t('message.reports.trendDay.eventType3')}}</span>
                            <span v-if='scope.row.event_type==4'>{{scope.row.sleep_name}}</span>
                            <span v-if='scope.row.event_type==5'>{{$t('message.reports.trendDay.eventType5')}}</span>
                            <span v-if='scope.row.event_type==6'>{{scope.row.custom_name}}</span>
                            <span v-if='scope.row.message_type==3'>{{$t('message.reports.trendDay.eventType7')}}</span>
                            <span v-if='scope.row.message_type==2'>{{$t('message.reports.trendDay.eventType8')}}</span>
                            <span v-if='scope.row.message_type==1'>{{$t('message.reports.trendDay.eventType9')}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  prop="event"  :label="$t('message.reports.trendDay.recordDetails')">
                    <template slot-scope="scope"> 
                        <div class='table-event-type' >
                            <span v-if='scope.row.event_type==0'>--</span>
                            <span v-if='scope.row.event_type==1'>{{scope.row.sport_minute}}{{$t('message.tableEvent.minutes')}}</span>
                            <span v-if='scope.row.event_type==2'>{{scope.row.drug_tiime?$t('message.tableEvent.drugTime'+scope.row.drug_tiime):scope.row.drug_tiime}}</span>
                            <span v-if='scope.row.event_type==3'>{{scope.row.insulin_value}}U</span>
                            <span v-if='scope.row.event_type==4'>{{scope.row.event_body.total_minute}}{{$t('message.tableEvent.minutes')}}</span>
                            <span v-if='scope.row.event_type==5'>{{scope.row.event_body.fingertipblood_name}}</span>
                            <span v-if='scope.row.event_type==6'>{{scope.row.event_body.remark}}</span>
                            <span v-if='scope.row.message_type==3'>--</span>
                            <span v-if='scope.row.message_type==2'>--</span>
                            <span v-if='scope.row.message_type==1'>--</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  prop="value"  :label="$t('message.reports.trendDay.glucoseLevel')">
                     <template slot-scope="scope"> 
                        <div v-if='scope.row.value&&scope.row.event_type!=5' >{{scope.row.value}}{{unit}}</div>
                        <div v-if='scope.row.event_type==5' >{{scope.row.event_body.bg}}{{unit}}</div>
                        <div v-if='scope.row.bgValue' >{{scope.row.bgValue}}{{unit}}</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
    </div>
</template>
<script>
import TChart from '@/views/components/TChart'
import Empty from '@/views/components/Empty/empty'
import {formatDate,formatDayEn,format12Date} from '@/utils/formatTime'
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
            // eventChecked:false, //事件记录开关
            initOptions: {
                renderer: 'svg'
            },
            option: {
                grid:[
                    {   
                        show:true,
                        left:60,
                        right:60,
                        top:10,
                        bottom:50,
                         borderColor:'#666'
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
                            show: false,
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
                            color: 'var(--color-black-40)',
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
                                color:'var(--color-black-20)'
                            }
                        },
                        axisLabel: {
                            formatter: '{value}',
                            color: 'var(--color-black-40)',
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
                                    width: 0,
                                    type:'solid'
                                },
                                label: {
                                    color: 'var(--color-error)',
                                    fontSize: 20,
                                    distance: 14,
                                    position:'end'
                                },
                                },
                                {
                                type: 'max',
                                yAxis:10,
                                lineStyle: {
                                    color: 'var(--color-warning)',
                                    width: 0,
                                    type:'solid'
                                },
                                label: {
                                    color: 'var(--color-warning)',
                                    fontSize: 20,
                                    distance:14,
                                    position:'end'
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
                                color:'rgba(72, 160, 220, 0.2)'
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
                ts:'7:00',
                event_type:0,
                event_body:{
                    eat_name:'早饭',
                    remark:'180mg/dL'
                },
                info:'一个鸡蛋，一个红薯',
                value:'最大波动幅度 5.0mmol/L'
            },{
                ts:'9:00',
                event_type:0,
                event_body:{
                    eat_name:'早饭',
                    remark:'180mg/dL'
                },
                value:'最大波动幅度 5.0mmol/L'
            }],
            dayInfo:{
                resultValue:[]
            },
        }
    },
    props:{
        dataList:{
            type:Object
        },
        eventList:{
            type:Array
        },
        eventChecked:{
            type:Boolean
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
            dayInfo.day =formatDayEn(dayInfo.day)
            let timeFormat = this.timeFormat
            if(dayInfo.resultValue.length>0){
                let unit = this.unit
               
                let resultValue = _.compact(dayInfo.value)
                let fluctate = _.max(dayInfo.value) -  _.min(dayInfo.value) //最大波动
                let avg = GlucoseUtils.calculateMeanCvGmi(resultValue).mean //平均值
                let lowTir = null,hightTir=null
                if(TIRUtils.getTIRResult(resultValue)){
                    lowTir = TIRUtils.getTIRResult(resultValue).lowRate + TIRUtils.getTIRResult(resultValue).veryLowRate
                    hightTir = TIRUtils.getTIRResult(resultValue).highRate + TIRUtils.getTIRResult(resultValue).veryHighRate
                }
                dayInfo.fluctate = unit=='mg/dL'?fluctate:GlucoseUtils.mgdlToMmol(fluctate);
                dayInfo.avg = unit=='mg/dL'? Math.round(avg):GlucoseUtils.mgdlToMmol(avg);
                dayInfo.lowTir = (Number(lowTir)*100).toFixed(1);
                dayInfo.hightTir = (Number(hightTir)*100).toFixed(1);
                
                
                // 图表数据
                let xData = Array.from({length:60*24},(item, index) => index)
                let max = dayInfo.max+10
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
                                moment = h-12+'PM'
                            }else if(h==12){
                                 moment = h+'PM'
                            }else{
                                if(h==0){h=12}
                                moment = h+'AM'
                            }
                            return moment;
                        }
                        if(index+1===24*60){
                            return '12AM'
                        }
                    }
                }
                this.option.series[0].markPoint.data = []
                this.option.series[0].markLine.data = this.option.series[0].markLine.data.splice(0,2)
                this.option.xAxis[0].data = xData
                this.option.yAxis[0].max = unit == 'mg/dL'?Math.ceil(max / 100) * 100:  Math.ceil(GlucoseUtils.mgdlToMmol(max) / 3) * 3
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
            let eventData = _.sortBy(_.cloneDeep(data),'event_ts')
            let chartValue = _.cloneDeep(this.dataList.value)
            let tableData = []
            if(unit != 'mg/dL'){
                chartValue = chartValue.map(val => GlucoseUtils.mgdlToMmol(val));
            } 
            if(eventData){
                eventData.forEach(item=>{
                    if(item&&item.type==1){
                        let img =[img0,img1,img3,img2,img4,img5,img6]
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
                    }
                    if(unit != 'mg/dL'){
                        item.value = item?GlucoseUtils.mgdlToMmol(item.value):''
                        // if(item.event_type==5){
                        //     item.event_body.bg = GlucoseUtils.mgdlToMmol(item.event_body.bg)
                        // }
                    }
                    let ts = null
                    if(this.timeFormat == 12){
                        ts = format12Date(item.event_ts*1000)
                    }else{
                        ts = formatDate(item.event_ts*1000,'HH:MM')
                    }
                    tableData.push({
                        ts:ts,
                        event_type:item.event_type,
                        food_time:item.food_time,
                        sport_minute:item.sport_minute,
                        drug_tiime:item.drug_tiime,
                        insulin_type:item.insulin_type,
                        insulin_value:item.insulin_value,
                        value:item?chartValue[item.xIndex]:'',
                        bgValue:item?item.Value:'',
                        message_type:item?item.message_type:'',
                        xIndex:item.xIndex,
                        yPosition:item.yPosition
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
                    let x = params.data.coord[0]
                    let y =  params.data.coord[1]
                    that.tableData.forEach(item=>{
                        if(item.xIndex==x&&item.yPosition==y){
                             that.$refs.singleTable.setCurrentRow(item);
                        }
                    })
                    that.option.series[0].markPoint.data.forEach(item=>item.symbolSize = 30)
                    that.option.series[0].markPoint.data[params.dataIndex].symbolSize = 50
                })
            }
           
        },
        // 表格点击
        handleCurrentChange(val){
            let tableData = this.tableData
            this.option.series[0].markPoint.data.forEach((item,index)=>{
                item.symbolSize = 30
                if(item.coord[0]==val.xIndex&&item.coord[1]==val.yPosition){
                     this.option.series[0].markPoint.data[index].symbolSize = 50
                }
            })
        }
    },
    watch:{
        dataList(n,o){
            this.handelOption(n)
        },
        eventList(n,o){
            this.markEvent(n)
        },
        eventChecked(n,o){
            console.log(n,'nnn')
            this.eventChecked = n
        }
    }
}
</script>
<style >
.dayAnalysis{
    margin-bottom:20px;
    margin-top:20px;
}
.dayAnalysis-box{
    position: relative;
    border:1px solid rgba(0,0,0,0.1);
    padding:15px 30px;
    border-radius:10px;
    height:460px;
}
.overview-compliance-border{
        width:10px;
        height:460px;
        background: var(--color-primary);
        position: absolute;
        left:0;
        top:0;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
     .overview-nocompliance-border{
        width:10px;
        height:460px;
        background: var(--color-error);
        position: absolute;
        left:0;
        top:0;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
.analysis-header{
    display: flex;
    align-items: center;
    margin-bottom:20px;
}
.analysis-date{
    width:180px;
    font-size:var(--fontSize-smax);
    color: var(--color-black-100);
    font-weight: 700;
}
.analysis-event{
    font-size:var(--fontSize-smax);
    color: var(--color-black-60);
}
/* 图表血糖信息 */
.chart-box{
    display: flex;
    height:360px;
    margin-bottom:20px;
}
.analysis-info{
    width:180px;
    height:360px;
    box-sizing: border-box;
    padding:10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.analysis-info-label{
    font-size:var(--fontSize-default);
    color: var(--color-black-60);
}
.analysis-info-value{
    font-size:var(--fontSize-max);
    color: var(--color-black-100);
}
.analysis-info-value-unit{
    font-size:var(--fontSize-default);
}
.analysis-info-value.active{
    color:var(--color-error);
}

/* 表格 */
.event-box{
    margin-top:20px;
}
.table-header{
    background:#f7f7f7;
}
.table-event-type{
    display: flex;
    align-items: center;
}
.table-event-icon{
    width:30px;
    height:30px;
    display: block;
}
</style>