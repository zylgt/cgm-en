<template>
    <div>
        <div class='agp-top' >
            <div class='agp-top-fl' >
                <div class='report-title'> {{$t('message.route.'+$route.meta.title)}}</div>
                
            </div>
            <div class='agp-fr' >
                <img src="~@/assets/image/printer.png" alt="" class='agp-icon' @click='print' >
                <img src="~@/assets/image/down-icon.png" alt="" class='agp-icon' @click='handleExport' >
                <img src="~@/assets/image/share.png" alt="" class='agp-icon agp-fr-icon'>
                <el-button type="primary" @click="upload">
                    <img src="~@/assets/image/btn-upload.png" alt="" class='btn-upload' >
                    上传数据
                </el-button>
            </div>
        </div>
        <div class='report-agp-date' >
                <div class='report-agp-date-box'  @click='pickerFocus'>
                    <img src="~@/assets/image/date-calendar.png" alt="" class='agp-icon' >
                    <div class='agp-date' >{{agpDate[0]}} — {{agpDate[1]}}（{{dayDate}}天）</div>
                    <img src="~@/assets/image/select-icon.png" alt="" class='select-icon' >
                </div>
                <el-date-picker
                    class='agp-picker'
                    ref='datePicker'
                    v-model="agpDate"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    @change="changeDate"
                    :append-to-body='false'
                    :picker-options="pickerOptions">
                </el-date-picker>
        </div>
        <div class='main-box'>
            <Progress :percentage='downProgress' v-if='progressShow' />
            <div class='agp-main-box' :style='{"opacity":progressShow?0:1}' >
                <!-- 血糖总结 -->
                <div class='bg-summary agp-cont-main'>
                    <div class='cgm-cont-title'>  <span class='title-border' ></span>每日血糖总结</div>
                    <div class='cgm-agp-info-box cgm-agp-info-boxs'>
                        <div class='cgm-agp-info'></div>
                        <img src="~@/assets/image/reason-icon.png" alt="" class='reason-icon'  v-popover:tirPopover @click='openPopover("tir")' >
                    </div>
                    <div class='summary-chart' v-if='empty'>
                        <Empty/>
                    </div>
                    <div class='summary-chart'  v-else>
                        <t-chart
                            style="width: 100%;height:250px;"
                            :option="option"
                            :init-options="initOptions"
                            theme="tduck-echarts-theme"
                        />
                    </div>

                
                
                </div>
                <!-- 每日血糖图表 -->
                <div class='bg-summary agp-cont-main'>
                    <div class='cgm-cont-title'>  <span class='title-border' ></span>每日血糖图表 </div>
                    <div class='cgm-agp-info-box cgm-agp-info-boxs'>
                        <div class='cgm-agp-info'></div>
                        <img src="~@/assets/image/reason-icon.png" alt="" class='reason-icon'  v-popover:tirPopover @click='openPopover("tir")' >
                    </div>
                    <Empty v-if='empty'/>
                    <div v-else >
                        <div v-for='(item,index) in list' :key='index'>
                            <DayAnalysis :dataList='item' :eventList='eventList[item.date]'/>
                        </div>
                    </div>
                
                    
                </div>
            </div>
        </div>
         <!-- 下载打印弹窗 -->
        <el-dialog  :visible.sync="dialogVisible"  :show-close="false" :title='dialogType=="print"?"打印报告":"下载报告"'
         width="1060" >
            <div class='slot-popover'  id='popover'>
                <div class='slot-popover-cont slot-popover-conts'>
                    <div class='report-agp-date report-agp-dates' >
                            <img src="~@/assets/image/date-calendar.png" alt="" class='agp-icon' >
                            <div class='agp-date' >{{agpDate[0]}} — {{agpDate[1]}}（4天）</div>
                            <img src="~@/assets/image/select-icon.png" alt="" class='select-icon' >
                            <el-date-picker
                                class='agp-picker'
                                v-model="agpDate"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                @change="changeDate"
                                :picker-options="pickerOptions">
                            </el-date-picker>
                    </div>
                    <div class='popover-cont-label' >
                        <div class='popover-cont-label-label' v-if='dialogType=="print"'>请选择您想要打印的报告内容：</div>
                        <div class='popover-cont-label-label' v-else>请选择您想要下载的报告内容：</div>
                         <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    </div>
                    <el-checkbox-group v-model="checkedDowns" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="item in downloadList" :label="item" :key="item">{{item}}</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class='slot-popover-btn'>
                    <el-button type="primary" v-if='dialogType=="print"'>打印报告</el-button>
                    <el-button type="primary" v-else>下载报告</el-button>
                </div>
            </div>
            <img src="~@/assets/image/close-icon.png" alt="" class='dialog-close' @click='dialogVisible=false' >
        </el-dialog>
    </div>
</template>
<script>
import TChart from '@/views/components/TChart'
import Empty from '@/views/components/Empty/empty'
import DayAnalysis from '@/views/report/components/dayAnalysis'
import {formatDate,formatTime} from '@/utils/formatTime'
import {getAgpData} from '@/api/dataApi'
import { TIRUtils } from "@/utils/algorithm/TIR";
import { GlucoseUtils } from "@/utils/algorithm/Glucose";
import mixin from "./mixin"
export default {
    
    data(){
        return{
            initOptions: {
                renderer: 'svg'
            },
            option:{
                axisPointer:{
                    triggerEmphasis:false
                },
                grid:[{
                    left:120,
                    top:30,
                    bottom:30,
                    right:50,
                    show:false,
                    containLabel :false
                },{
                    left:150,
                    top:30,
                    bottom:30,
                    right:90,
                    show:false,
                    containLabel :false
                }],
                xAxis: [
                    {
                        type: 'category',
                        gridIndex:1,
                        name:'平均血糖值',
                        nameLocation:'start',
                        nameTextStyle:{
                            color:'#666',
                            fontSize:18,
                            height:80,
                            verticalAlign:'bottom',
                        },
                        nameGap:56,
                        data: [],
                        boundaryGap:false,
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel:{
                            fontSize:18,
                            color:'#666',
                        },
                        axisLine:{
                            show:false
                        },
                        axisTick:{
                             show:false
                        }
                    },
                    {
                        type: 'category',
                        name:'TIR',
                        nameLocation:'start',
                        nameTextStyle:{
                            color:'#666',
                            fontSize:18
                        },
                        nameGap:86,
                        gridIndex:0,
                        position:'top',
                        data: [],
                        boundaryGap:false,
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLine:{
                            show:false,
                            onZero:false
                        },
                        axisLabel:{
                            show:false
                        },
                        axisTick:{
                             show:false
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '平均血糖值',
                        gridIndex:1,
                        nameLocation:'end',
                        nameGap:40,
                        min: 0,
                        max:18 ,
                        show:false,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: 'TIR',
                        gridIndex:1,
                        nameLocation:'start',
                        show:false,
                        min: -20,
                        max: 100,
                        interval: 20,
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    },
                    {
                        type: 'value',
                        name: 'TIR',
                        gridIndex:0,
                        nameLocation:'start',
                        show:false,
                        min: -20,
                        max: 100,
                        interval: 20,
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }
                ],
                series: [
                    {
                        name: '平均血糖',
                        type: 'bar',
                        yAxisIndex:0,
                        xAxisIndex:0,
                        barMaxWidth:30,
                        legendHoverLine:false,
                        tooltip: {
                            valueFormatter: function (value) {
                            return value + '份';
                            }
                        },
                        itemStyle:{
                            color:'#e5e5e5'
                        },
                        label:{
                            show:true,
                            distance:5,
                            color:'#666',
                            fontSize:16,
                            position:'top'
                        },
                        data: [],
                        emphasis:{
                            disabled:true
                        }
                    },
                    {
                        name: 'TIR',
                        type: 'line',
                        yAxisIndex:1,
                        xAxisIndex:0,
                        tooltip: {
                            valueFormatter: function (value) {
                            return value + ' %';
                            }
                        },
                        label:{
                            show:true,
                            distance:5,
                            color:'#666',
                            fontSize:16,
                            formatter:'{c}%',
                            position:'top'
                        },
                        lineStyle:{
                            color:'#ccc',
                        },
                        itemStyle:{
                            color:(val)=>{
                                return val.value>=70?"#32BAC0":"#F43F31"
                            }
                        },
                        symbolSize:13,
                        data: [],
                        emphasis:{
                            disabled:true
                        }
                    },
                    {
                        name: 'TIR',
                        type: 'line',
                        yAxisIndex:2,
                        xAxisIndex:1,
                        markArea:{
                            data:[
                                [{
                                yAxis:70
                                },
                                {   
                                yAxis:100
                                }]
                            ],
                            itemStyle:{
                                    color:'rgba(72, 160, 220, 0.05)'
                            }
                        },
                        markLine:{
                            symbol: 'none',
                            data:[{
                                yAxis:70,
                                lineStyle: {
                                    width: 0,
                                },
                                label:{
                                    show:true,
                                    formatter:'{c}%',
                                    position:'end',
                                    distance:10,
                                    fontSize:16,
                                    color:'#666',

                                }
                            } ,
                            {
                                yAxis:100,
                                lineStyle: {
                                    width: 0,
                                },
                                label:{
                                    show:true,
                                    formatter:'{c}%',
                                    position:'end',
                                    fontSize:16,
                                    distance:10,
                                    color:'#666'
                                }
                            }]
                        }
                    }
                ]
            },
            eventList:[]
        }
    },
    mixins: [mixin],
    components: {
        TChart,DayAnalysis,Empty
    },
    methods:{
        // 分割成每日血糖所需要的
        handelTemplateDay(data){
            let tirTarget =  this.unit=='mmol/L'?[_.round(GlucoseUtils.mmolToMgdl(this.targetScope[0]),1),_.round(GlucoseUtils.mmolToMgdl(this.targetScope[1]),1)]:this.targetScope
            let datArray = _.cloneDeep(data)
            let singleDay  = _.chunk(datArray,60*24) ;
            let max = _.maxBy(datArray,'Value').Value>540?540:_.maxBy(datArray,'Value').Value
            let dayList = new Array()
            singleDay.forEach(item=>{
                let value = _.map(item, 'Value');
                let originValue = _.map(item, 'value');
                let handelValue = _.compact(value)
                dayList.push({
                    date: formatDate(item[0].DataTs*1000,'YYYY-mm-dd'),
                    day: formatDate(item[0].DataTs*1000,'mm.dd'),
                    week: formatDate(item[0].DataTs*1000,'WW'),
                    value:originValue,
                    handelValue:handelValue,
                    max:max,
                    tir:TIRUtils.getTIRResult(handelValue,tirTarget[1],tirTarget[0])?(Number(TIRUtils.getTIRResult(handelValue,tirTarget[1],tirTarget[0]).normalRate)*100).toFixed(1):''
                })
            })
            this.list =  _.reverse(_.cloneDeep(dayList)) 
            console.log(formatTime(new Date()),'每日分析血糖计算完成')
            this.readerIng(dayList)
        },
        // 渲染血糖总结图表
        readerIng(data){
            let list =  _.cloneDeep(data)
            let unit = this.unit
            let avgList = []
            let xData = []
            let tir = []
            let max = null
            list.forEach(item=>{
                let avg = _.round(_.mean(item.value), 1)
                xData.push(item.day)
                avgList.push(unit=='mg/dL'?avg:GlucoseUtils.mgdlToMmol(avg)) //平均值
                tir.push(item.tir)
                max = item.max
            })
            this.option.tooltip = {
                    show:true,
                    trigger:'axis',
                    confine:true,
                    axisPointer:{
                        type:'none',
                        shadowStyle:{
                            color:'rgba(0,0,0,0)'
                        },
                        axis:'x'
                    },
                    formatter(params){
                        let html =  "<div class='tooltip-box' >"+
                          " <div class='tooltips-date'>"+
                               "<span class='tooltips-val-tir'>"+params[1].value+"%</span>"+'  '+ params[0].axisValue+
                           " </div>"+
                           " <div class='tooltips-val'>"+
                               " <span class='tooltips-val-num'>"+params[0].value+"</span>"+unit+
                            "</div>"+
                       " </div>"
                       
                        return params[0].value?html:''
                    },
                    extraCssText: 'box-shadow: 0 2px 10px rgba(195,245,247,1);'
            }
            this.option.xAxis[0].data = xData
            this.option.xAxis[1].data = xData
            this.option.yAxis[0].max = unit == 'mg/dL'?max+5:GlucoseUtils.mgdlToMmol(max)+3
            this.option.series[0].data = avgList
            this.option.series[1].data = tir
            this.option.series[0].label.show = avgList.length>30?false:true
            this.option.series[1].label.show = avgList.length>30?false:true
            this.progressShow = false
        },
       
    }
}
</script>
<style scoped>
.cgm-agp-info-boxs{
    margin-bottom:0;
}
.summary-chart{
    height:250px;
}
</style>