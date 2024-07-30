<template>
    <div>
        <div class='day-box' >
            <div class='day-item' v-for='(item,index) in dayList' :key='index'>
                <div class='day-week' >{{item[1].week}}</div>
                <div class='day-main' >
                    <div class='day-target' v-if='index==0' >
                        <div class='day-target-max' >10</div>
                        <div class='day-target-min' >3.9</div>
                    </div>
                    <div class='day-date-tir' >
                        <div class='day-date' >{{item[0]}}</div>
                        <div class='day-tir' >TIR:{{item[1].tir}}%</div>
                    </div>
                    <div class='chart-box' >
                        <t-chart
                            style="width: 100%;height:120px;"
                            :option="getOptions(item[1].value)"
                            :init-options="initOptions"
                            theme="tduck-echarts-theme"
                        />
                    </div>
                </div>
                <div class='chart-x-end' v-if='index==dayList.size-1'>
                    <div>00:00</div>
                    <div>12:00</div>
                    <div>00:00</div>
                </div>
                <div class='chart-x' v-else>
                    <div>00:00</div>
                    <div>12:00</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TChart from '@/views/components/TChart'
import { hasEventListener } from "@/utils/utils";
import {formatDate,formatTime} from '@/utils/formatTime'
import { TIRUtils } from "@/utils/algorithm/TIR";
export default {
    data(){
        return{
            initOptions: {
                renderer: 'svg'
            },
            option: {
                grid:[
                    {   
                        left:0,
                        right:0,
                        top:0,
                        bottom:0,
                        height:120,
                    }
                ],
                xAxis: [
                    {
                        type: 'category',
                        show:true,
                        splitLine:{
                            show:true,
                            lineStyle:{
                                type:'dashed',
                                color:'var(--color-black-10)'
                            },
                            interval:4
                        }
                    }
                ],
                yAxis: {
                        type: 'value',
                        show:false,
                        min:0,
                        max:16
                    },
                series: [
                    {
                        type: 'line',
                        data:[] ,
                        itemStyle: {
                        color:'var(--color-primary)',
                        },
                        showSymbol: false,
                        lineStyle: {
                        width: 2,
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
                            label: {
                                show:true,
                                color: 'var(--color-black-60)',
                                fontSize: 16,
                                distance: 10,
                                position:'left'
                            },
                            itemStyle:{
                                color:'rgba(50, 186, 192, 0.08)'
                            }
                        }
                    },
                ],
              
            },
            dayList:'',
        }
    },
    components: {
        TChart
    },
    created(){
        
    },
    mounted(){
        console.log(formatTime(new Date()),'组件渲染完成')  
        this.$bus.$on('getData',(data)=>{
              this.manageData(data)  
        })
        this.manageData()
    },
    methods:{
        // 管理数据
        manageData(data){
            console.log(formatTime(new Date()))
            let array = data
            // 将数组按天分割
            let dayMap = new Map()
             array.forEach(item=>{
                item.day = formatDate(item.DataTs*1000,'mm.dd')
                item.week = formatDate(item.DataTs*1000,'WW')
                item.moment = Number(formatDate(item.DataTs*1000,'HH'))*60+Number(formatDate(item.DataTs*1000,'MM'))
                item.dayArray = new Array(24*60)
                item.dayArray[item.moment] = item.Value
                dayMap.has(item.day) ? dayMap.get(item.day).value[item.moment]=item.Value: dayMap.set(item.day, {value:item.dayArray,week:item.week,tir:TIRUtils.getTIRResult(item.dayArray).normalRate});
            })
            // x轴数据
            this.dayList = dayMap
            this.$nextTick(()=>{
                console.log(formatTime(new Date()))
            })
        },
        getOptions(data){
            const config = {
                grid:[
                        {   
                            left:0,
                            right:0,
                            top:0,
                            bottom:0,
                            height:120,
                        }
                ],
                xAxis: [
                    {
                        type: 'category',
                        show:false,
                    }
                ],
                yAxis: {
                        type: 'value',
                        show:false,
                        min:0,
                        max:16
                },
                series: [
                        {
                            type: 'line',
                            data:data,
                            itemStyle: {
                            color:'var(--color-primary)',
                            },
                            showSymbol: false,
                            lineStyle: {
                            width: 2,
                            },
                            markLine:{
                                symbol: 'none',
                                animation:false,
                                data:[
                                    {
                                        xAxis:720,
                                        lineStyle: {
                                            color: 'var(--color-black-10)',
                                            width: 1,
                                            type:'dashed'
                                        },
                                        label:{
                                            show:false
                                        }
                                    }
                                ]
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
                                label: {
                                    show:true,
                                    color: 'var(--color-black-60)',
                                    fontSize: 16,
                                    distance: 10,
                                    position:'left'
                                },
                                itemStyle:{
                                    color:'rgba(50, 186, 192, 0.08)'
                                }
                            }
                        },
                ],
            }
            return config
        },
    },
    
    beforeDestroy(){
        this.$bus.$off('getData')
    }
}
</script>
<style scoped>
    .day-box{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding:0 50px;
    }
    .day-item{
        width:180px;
        height:180px;
        position: relative;
        margin:0 5px;
        margin-bottom:20px;
    }
    .day-week{
        width:100%;
        text-align: center;
        font-size:var(--fontSize-big);
        color:var(--color-black-60);
        margin-bottom:10px;
    }
    .day-main{
        width:180px;
        height:120px;
        position: relative;
    }
    .day-date-tir{
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
    .day-target{
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
    .chart-box{
        width:180px;
        height:120px;
        border:1px solid var(--color-black-10);
        border-radius:10px;
    }
    .chart-x{
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
    .chart-x-end{
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
</style>