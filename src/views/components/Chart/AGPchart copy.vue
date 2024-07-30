<template>
    <div>
        <t-chart
                style="width: 100%;height:450px;"
                :option="option"
                :init-options="initOptions"
                theme="tduck-echarts-theme"
        />
    </div>
</template>
<script>
import TChart from '@/views/components/TChart'
import { hasEventListener } from "@/utils/utils";
import {formatDate} from '@/utils/formatTime'
import { AGPUtils } from "@/utils/algorithm/AGP";
import { GlucoseUtils } from "@/utils/algorithm/Glucose";
export default {
    data(){
        return{
            initOptions: {
                renderer: 'svg'
            },
            option: {
               
                grid:{
                    left:120,
                    right:120,
                    bottom:60,
                    top:60
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap:false,
                        axisTick: false,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: 'var(--color-black-10)',
                                width:1,
                            },
                        },
                        data:[],
                        axisLabel: {
                            formatter: function (value, index) {
                                if (index  % 360 === 0) {
                                    return value;
                                }
                            },
                            interval: 0,
                            color: '#666',
                            fontSize: 16, 
                            margin:14
                        }
                    }
                ],
                yAxis: [
                    {
                    type: 'value',
                    min: 0,
                    max: 15,
                    splitLine:{
                        lineStyle:{
                            type:'dashed',
                            color:'var(--color-black-10)'
                        }
                    },
                    axisLabel: {
                        formatter: '{value}',
                        color: '#666',
                        fontSize: 16,
                        margin:14
                    }
                    }
                ],
                series: [
                    {
                        name: 'L',
                        type: 'line',
                        data: [],
                        lineStyle: {
                        opacity: 0,
                        },
                        stack: 'confidence-band',
                        symbol: 'none',
                    },
                    // 置信区间5-25
                    {
                        name: 'U',
                        type: 'line',
                        data: [],
                        lineStyle: {
                        opacity: 0,
                        },
                        areaStyle: {
                        color: '#D6F1F2',
                        },
                        stack: 'confidence-band',
                        symbol: 'none',
                    },
                    //置信区间25-75
                    {
                        name: 'U',
                        type: 'line',
                        data: [],
                        lineStyle: {
                        opacity: 0,
                        },
                        areaStyle: {
                        color: '#94DBDE',
                        },
                        stack: 'confidence-band',
                        symbol: 'none',
                    },
                    //75-95
                    {
                        name: 'U',
                        type: 'line',
                        data:[],
                        lineStyle: {
                        opacity: 0,
                        },
                        areaStyle: {
                        color: '#94DBDE',
                        },
                        stack: 'confidence-band',
                        symbol: 'none',
                    },
                    //中位线
                    {
                        type: 'line',
                        data: [],
                        itemStyle: {
                        color:'#32BAC0',
                        },
                        showSymbol: false,
                        lineStyle: {
                        width: 2,
                        },
                        markLine: {
                        silent: true, // 不高亮辅助线
                        symbol: 'none',
                        data: [
                            {
                            type: 'min',
                            yAxis: 3.9,
                            lineStyle: {
                                color: '#32BAC0',
                                width: 1,
                                type:'dashed'
                            },
                            label: {
                                color: 'var(--color-black-40)',
                                fontSize: 16,
                                distance: 14,
                            },
                            },
                            {
                            type: 'max',
                            yAxis: 10.0,
                            lineStyle: {
                                color: '#32BAC0',
                                width: 1,
                                 type:'dashed'
                            },
                            label: {
                                color: 'var(--color-black-40)',
                                fontSize: 16,
                                distance:14
                            },
                            },
                        ],
                        },
                    },
                ],

              
            },
        }
    },
    components: {
        TChart
    },
    mounted(){
        // if(!hasEventListener(this.$bus,'getData')){
        //     this.$bus.$on('getData',(data)=>{
        //       this.manageData(data)  
        //     })
        // }
        this.manageData()
    },
    methods:{
        // 管理数据
        manageData(data){
            let array = [{DataTs:1715129400,Value:171},
            {DataTs:1715043000,Value:239},
            {DataTs:1714956600,Value:164},
            {DataTs:1714956660,Value:388},
            {DataTs:1715043060,Value:218},
            {DataTs:1715129460,Value:230},
            {DataTs:1715129520,Value:158},
            {DataTs:1715043120,Value:267},
            {DataTs:1714956720,Value:180},
            {DataTs:1714870320,Value:192},
            {DataTs:1714783920,Value:255},
            {DataTs:1714697520,Value:236},
            {DataTs:1714697460,Value:360},
            {DataTs:1714783860,Value:397},
            {DataTs:1714870260,Value:356},
            {DataTs:1714870200,Value:230},
            {DataTs:1714783800,Value:387},
            {DataTs:1714697400,Value:199},
            ]
            // 将数组分割为时刻数组
            let momentMap = new Map();
            array.forEach(item=>{
                item.moment = formatDate(item.DataTs*1000,'HH:MM')
                momentMap.has(item.moment) ? momentMap.get(item.moment).push(item.Value) : momentMap.set(item.moment, [item.Value]);
            })
            console.log(momentMap)
            // 计算出AGP数据并补全图谱数据
            let agpMap = new Map();
            let agp05 = new Array(24 * 60);
            let agp25 = new Array(24 * 60);
            let agp50 = new Array(24 * 60);
            let agp75 = new Array(24 * 60);
            let agp95 = new Array(24 * 60);
            let xData = new Array(24 * 60);
            for (let i = 0; i <= 24 * 60; i++) {
                // 分钟换算为时刻
                let h =  Math.floor(i/60)<10 ? '0'+ Math.floor(i/60) : Math.floor(i/60) 
                let m =  i%60 < 10 ? '0' + i%60 : i%60
                let moment = h+':'+m
                if(momentMap.has(moment)){
                    agp05[i] = GlucoseUtils.mgdlToMmol(AGPUtils.calculateYValue(momentMap.get(moment)).p05) 
                    agp25[i] = GlucoseUtils.mgdlToMmol(AGPUtils.calculateYValue(momentMap.get(moment)).p25)  
                    agp50[i] = GlucoseUtils.mgdlToMmol(AGPUtils.calculateYValue(momentMap.get(moment)).p50) 
                    agp75[i] = GlucoseUtils.mgdlToMmol(AGPUtils.calculateYValue(momentMap.get(moment)).p75)  
                    agp95[i] = GlucoseUtils.mgdlToMmol(AGPUtils.calculateYValue(momentMap.get(moment)).p95) 
                }
                xData[i] = moment
            }
            this.option.xAxis[0].data = xData
            this.option.series[0].data = agp05
            this.option.series[1].data =  agp25.map((item, index) => {
                    return item - agp05[index];
                    })
            this.option.series[2].data = agp75.map((item, index) => {
                    return item - agp25[index];
                    })
            this.option.series[3].data = agp95.map((item, index) => {
                    return item - agp75[index];
                    })
            this.option.series[4].data = agp50
        },
    },
    beforeDestroy(){
        this.$bus.$off('getData')
    }
}
</script>