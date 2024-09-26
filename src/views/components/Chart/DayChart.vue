<template>
    <div>
        <div class='day-box' ref='day' id='day-box'>
            <div class='day-item-box' v-if='dayList.length>0'>
                <div class='day-item'  v-for='(item,index) in dayList' :key='index' :style="{width:gridW+'px'}" >
                    <div class='day-week' v-if='index<7'>{{item.week}}</div>
                    <div class='day-grid-border' ref='gridBox'></div>
                </div>
            </div>
            <t-chart
                :style='{"width":"100%","height":height+"px"}'
                :option="option"
                :init-options="initOptions"
                theme="tduck-echarts-theme"
            />
        </div>
    </div>
</template>
<script>
import TChart from '@/views/components/TChart'
import { hasEventListener } from "@/utils/utils";
import {formatDate,formatTime} from '@/utils/formatTime'
import { TIRUtils } from "@/utils/algorithm/TIR";
import { GlucoseUtils } from "@/utils/algorithm/Glucose";
import { Divider } from 'element-ui';
import {mapGetters} from "vuex"
export default {
    data(){
        return{
            initOptions: {
                renderer: 'svg'
            },
            option: {
                tooltip:{
                    show:true,
                    trigger:'axis',
                    confine:true

                },
                title:[],
                grid:[],
                xAxis: [],
                yAxis: [],
                visualMap:[],
                series: [],
            },
            dayList:[],
            week:[],
            gridW:0,
            height:510
        }
    },
    props:{
        dataList:{
            type:Array
        }
    },
    components: {
        TChart
    },
    created(){
        
    },
    computed:{
        ...mapGetters([
           'unit','targetScope','timeFormat']),
    },
    mounted(){
        this.getOption(this.dataList)
      
    },
    methods:{
        // 渲染数据
        getOption(data){
            let dayList = _.cloneDeep(data)
            this.dayList = data
            this.height = Math.ceil(data.length/7)*170
            let gridW = Math.floor((this.$refs.day.clientWidth-240)/7)
            this.gridW = gridW
            let xData = Array.from({length:60*24},(item, index) => index)
            let max = data.length>0?data[0].max:0
            max = GlucoseUtils.mgdlToMmol(max)<13.9?13.9: GlucoseUtils.mgdlToMmol(max)
            let unit = this.unit
            let timeFormat = this.timeFormat
            this.option = {
                tooltip :{
                    show:true,
                    trigger:'axis',
                    confine:false,
                    axisPointer:{
                        type:'none',
                        axis:'x',
                        snap:true
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
                              dayList[params[0].axisIndex].day +' '+ moment+
                           " </div>"+
                       " </div>"
                        return params[0].value?html:''
                    },
                    extraCssText: 'box-shadow: 0 2px 10px rgba(195,245,247,1);'
                },
                title:[],
                grid:[],
                xAxis: [],
                yAxis: [],
                visualMap:[],
                series: [],
            }
            this.$nextTick(()=>{
                dayList.forEach((item,index)=>{
                    if(unit != 'mg/dL'){
                        item.value = item.value.map(val => GlucoseUtils.mgdlToMmol(val));
                    }
                    let tirClass = item.tir>70?'tir':'tirs'
                    this.option.title.push({
                        text:item.tir?['{date|'+item.day+'}{tirLable|TIR:}{'+tirClass+'|'+item.tir+'%}']:['{date|'+item.day+'}{tir|TIR:--}'],
                        left:index==0?90:index<7&&index>0?index*(gridW+15)+90:(index%7)*(gridW+15)+90,
                        top:this.$refs.gridBox[index].offsetTop-30,
                        right:10,
                        textStyle:{
                            rich:{
                                date:{
                                    fontSize:16,
                                    color:'#666',
                                    width:(gridW-10)/2-10,
                                    align:'left'
                                },
                                tirLable:{
                                    fontSize:20,
                                    width:30,
                                    color:'#000',
                                    align:'right',
                                    fontWeight:600
                                },
                                tir:{
                                    fontSize:20,
                                    width:70,
                                    color:'#000',
                                    align:'left',
                                    fontWeight:600
                                },
                                tirs:{
                                    fontSize:20,
                                    width:70,
                                    color:'#F43F31',
                                    align:'left',
                                    fontWeight:600
                                }
                            }
                        },
                    })
                    this.option.grid.push({   
                            show:false,
                            left:index==0?90:index<7&&index>0?index*(gridW+15)+90:(index%7)*(gridW+15)+90,
                            right:0,
                            top:this.$refs.gridBox[index].offsetTop,
                            width:gridW,
                            height:90,
                            borderColor:'#666',
                            borderWidth:1
                    })
                    this.option.xAxis.push({   
                            type: 'category',
                            gridIndex:index,
                            show:true,
                            axisLine:{
                                show:false
                            },
                            data:xData,
                            axisLabel:{
                                formatter: function (value, indexs) {
                                    if(timeFormat==12){
                                        if(indexs==0){
                                            return '12AM'
                                        }else if(index==dayList.length-1&&indexs==item.value.length-1||index%7==6&&indexs==item.value.length-1){
                                            return '12AM'
                                        }else if(indexs==(item.value.length/2)-1){
                                            return '12PM'
                                        }
                                        
                                    }else{
                                        if(indexs==0){
                                            return '00:00'
                                        }else if(index==dayList.length-1&&indexs==item.value.length-1||index%7==6&&indexs==item.value.length-1){
                                            return '00:00'
                                        }else if(indexs==(item.value.length/2)-1){
                                            return '12:00'
                                        }
                                    }
                                },
                                interval:0,
                                color: 'var(--color-black-60)',
                                fontSize: 16, 
                                margin:15
                            },
                            axisTick:{
                                show:false
                            }
                    })
                    this.option.yAxis.push({   
                            type: 'value',
                            show:false,
                            gridIndex:index,
                            min:0,
                            max: unit == 'mg/dL'?GlucoseUtils.mmolToMgdl(Math.ceil(max / 3) * 3):Math.ceil(max / 3) * 3
                    })
                    this.option.visualMap.push({
                        type: "piecewise",
                            show: false,
                            pieces: [
                                {
                                    gt: 0,
                                    lt: this.targetScope[0],
                                    color: "var(--color-error)",//大于0小于12为红色
                                },
                                {
                                    gt: this.targetScope[1],
                                    color: "var(--color-warning",//大于12区间为红色
                                },{
                                    gt: this.targetScope[0],
                                    lt: this.targetScope[1],
                                    color: "var(--color-primary",//大于12区间为红色
                                },
                            ],
                    })
                    this.option.series.push(  
                            {
                            type: 'line',
                            data:item.value,
                            xAxisIndex:index,
                            yAxisIndex:index,
                            showSymbol:_.compact(item.value).length>1?false:true,
                            symbolSize:1,
                            symbol:'circle',
                            emphasis:{
                                disabled:true
                            },
                            lineStyle: {
                                width: 1,
                            },
                            markPoint:{
                                symbol: 'circle',
                                symbolSize:_.compact(item.value).length==1?5:0,
                                itemStyle:{
                                    color:'var(--color-primary)'
                                },
                                emphasis:{
                                    disabled:true
                                },
                                data:[{
                                    coord:[_.indexOf(item.value,_.compact(item.value)[0]),_.compact(item.value)[0]]
                                }]
                            },
                            markLine:{
                                    symbol: 'none',
                                    // animation:false,
                                    data:[
                                        // {
                                        //     xAxis:xData.length/2-1,
                                        //     lineStyle: {
                                        //         color: 'var(--color-black-10)',
                                        //         width: 1,
                                        //         type:'dashed'
                                        //     },
                                        //     label:{
                                        //         show:false
                                        //     }
                                        // } ,
                                        {
                                            yAxis:this.targetScope[0],
                                            lineStyle: {
                                                width: 0,
                                            },
                                            label:{
                                                show:index%7==0?true:false,
                                                position:'start',
                                                distance:14,
                                                fontSize:16,
                                                color:'#666',

                                            }
                                        } ,
                                        {
                                            yAxis:this.targetScope[1],
                                            lineStyle: {
                                                width: 0,
                                            },
                                            label:{
                                                show:index%7==0?true:false,
                                                position:'start',
                                                fontSize:16,
                                                distance:14,
                                                color:'#666'
                                            }
                                        } ,
                                    ]
                            },
                            markArea:{
                                data:[
                                    [{
                                        yAxis: this.targetScope[0]
                                    },
                                    {   
                                        yAxis: this.targetScope[1]
                                    }]
                                ],
                                itemStyle:{
                                    color:'rgba(72, 160, 220, 0.2)'
                                }
                            },

                        }
                    )
                })
                this.$nextTick(()=>{
                    this.$emit('readerIng',false)
                    console.log(formatTime(new Date()),'每日血糖渲染完成')
                })
            })
        },
    },
    beforeDestroy(){
    },
    watch:{
        dataList:function(n,o){
            let data = n
            this.getOption(data)
        }
    },
}
</script>
<style >
    .day-box{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        position: relative;
        padding-top:20px;
    }
    #day-box .day-item-box{
        overflow: hidden;
        padding:0 0 0 90px;
        width:100%;
        position: absolute;
        left:0;
        top:-11px;
    }
    #day-box .day-item{
        /* position: relative; */
        margin-right:15px;
        margin-bottom:49px;
        float: left;
    }
    #day-box .day-week{
        text-align: center;
        font-size:var(--fontSize-big);
        color:var(--color-black-80);
        /* height:24px;
        margin-bottom:10px; */
        height:30px;
    }
    #day-box .day-grid-border{
        height:120px;
        border:1px solid #666;
        border-radius:10px;
        width:100%;
    }
    #day-box .day-main{
        width:180px;
        height:120px;
        position: relative;
    }
    #day-box .day-date-tir{
        width:100%;
        padding:2px 6px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        left:0;
        top:0;
        color:var(--color-black-60);
        font-size: var(--fontSize-big);
    }
    #day-box .day-target{
        height: 66px;
        display: flex;
        flex-direction: column;
        align-items:center ;
        justify-content: space-between;
        position: absolute;
        top:35px;
        left:-30px;
        font-size:var(--fontSize-big);
        color:var(--color-black-60);
    }
    #day-box .chart-box{
        width:180px;
        height:120px;
        border:1px solid var(--color-black-10);
        border-radius:10px;
    }
    #day-box .chart-x{
        width:130px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        bottom:0;
        left:-20px;
        font-size:var(--fontSize-big);
        color:var(--color-black-40);
    }
    #day-box .chart-x-end{
        width:220px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        bottom:0;
        left:-20px;
        font-size:var(--fontSize-big);
        color:var(--color-black-40);
    }
    #day-box .tooltip-box{
        font-size:var(--fontSize-default);
        color:var(--color-black-40);
    }
    #day-box .tooltips-val{
        margin-bottom:4px;
    }
    #day-box .tooltips-val-num{
        font-size:var(--fontSize-big);
        color:var(--color-black-80);
        padding-right:4px;
    }
</style>