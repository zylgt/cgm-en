<template>
    <div class='bg-summary agp-cont-main'>
        <div class='summary-chart' >
            <t-chart
                style="width: 100%;height:280px;"
                :option="option"
                :init-options="initOptions"
                theme="tduck-echarts-theme"
            />
        </div>
    </div>
</template>
<script>
import TChart from '@/views/components/TChart'
import { GlucoseUtils } from "@/utils/algorithm/Glucose";
import {mapGetters} from "vuex"
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
                        name:'Mean Glucose',
                        nameLocation:'start',
                        nameTruncate:{
                            maxWidth:80
                        },
                        nameTextStyle:{
                            color:'#666',
                            fontSize:20,
                            width:80,
                            overflow:'breakAll',
                            verticalAlign:'bottom',
                        },
                        nameGap:56,
                        data: [],
                        boundaryGap:false,
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel:{
                            fontSize:20,
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
                        name: 'Mean Glucose',
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
                        name: 'Mean Glucose',
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
                            color:'#000',
                            fontWeight:600,
                            fontSize:20,
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
                            color:'#000',
                            fontSize:20,
                            fontWeight:600,
                            formatter:'{c}%',
                            position:'top'
                        },
                        lineStyle:{
                            color:'#ccc',
                        },
                        itemStyle:{
                            color:(val)=>{
                                return val.value>=70?"#48A0DC":"#F43F31"
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
        }
    },
    props:{
        dataList:{
            type:Array
        }
    },
    computed:{
        ...mapGetters([
        'unit','targetScope','timeFormat']),
    },
    components: {
        TChart
    },
     mounted(){
        this.readerIng(this.dataList)
      
    },
    methods:{
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
                    extraCssText: 'box-shadow: 0px 2px 10px 0px rgba(72, 160, 220, 0.5);'
            }
            this.option.xAxis[0].data = xData
            this.option.xAxis[1].data = xData
            this.option.yAxis[0].max = unit == 'mg/dL'?max+5:GlucoseUtils.mgdlToMmol(max)+3
            this.option.series[0].data = avgList
            this.option.series[1].data = tir
            this.option.series[0].label.show = avgList.length>30?false:true
            this.option.series[1].label.show = avgList.length>30?false:true
        },
    }
}
</script>
<style scoped>
.summary-chart{
    height:280px;
}
</style>