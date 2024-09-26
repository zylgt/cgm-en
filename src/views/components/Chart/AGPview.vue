<template>
    <div>
         <t-chart
                style='width:100%;height:180px'
                :option="option"
                :init-options="initOptions"
                theme="tduck-echarts-theme"
        />
    </div>
</template>
<script>
    import TChart from '@/views/components/TChart'
    import {formatDate,formatTime} from '@/utils/formatTime'
    import { AGPUtils } from "@/utils/algorithm/AGP";
    import { GlucoseUtils } from "@/utils/algorithm/Glucose";
    import {mapGetters} from "vuex"
    export default {
        data(){
            return{
                initOptions: {
                    renderer: 'svg'
                },
                option: {
                    grid:[
                        {
                            height:140,
                            left:30,
                            right:30,
                            bottom:30,
                            show:true,
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
                                    type:'dashed',
                                    color:'var(--color-black-10)'
                                },
                                interval:59
                            },
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
                                fontSize: 12, 
                                margin:14
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
                                   type:'solid',
                                    color:'var(--color-black-20)'
                                }
                            },
                            axisLabel: {
                                formatter: '{value}',
                                color: 'var(--color-black-40)',
                                fontSize: 12,
                                margin:8
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
                            silent: true, 
                            emphasis:{
                                disabled:true
                            },
                            smooth:true,
                            animation:false
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
                            color: '#DAECF8',
                            },
                            stack: 'confidence-band',
                            symbol: 'none',
                            silent: true, 
                            smooth:true,
                            emphasis:{
                                disabled:true
                            },
                            animation:false
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
                            color: '#B6D9F1',
                            },
                            stack: 'confidence-band',
                            symbol: 'none',
                            silent: true, 
                            smooth:true,
                            emphasis:{
                                disabled:true
                            },
                            animation:false
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
                            color: '#DAECF8',
                            },
                            stack: 'confidence-band',
                             silent: true, // 不高亮辅助线
                            symbol: 'none',
                             smooth:true,
                            emphasis:{
                                disabled:true
                            },
                            animation:false
                        },
                        //中位线
                        {
                            type: 'line',
                            data: [],
                            itemStyle: {
                                color:'var(--color-primary)',
                            },
                            silent: true, // 不高亮辅助线
                            emphasis:{
                                disabled:true
                            },
                            smooth:true,
                            animation:false,
                            showSymbol: false,
                            lineStyle: {
                                width: 1,
                            },
                            markLine: {
                                symbol: 'none',
                            
                                animation:false,
                                data: [
                                    {
                                    type: 'min',
                                    yAxis:70,
                                    lineStyle: {
                                        color: 'var(--color-error)',
                                        width: 1,
                                        type:'solid'
                                    },
                                    label: {
                                        color: 'var(--color-error)',
                                        fontSize: 12,
                                        distance: 8,
                                        position:'end'
                                    },
                                    },
                                    {
                                    type: 'max',
                                    yAxis:180,
                                    lineStyle: {
                                        color: 'var(--color-warning)',
                                        width: 1,
                                        type:'solid'
                                    },
                                    label: {
                                        color: 'var(--color-warning)',
                                        fontSize: 12,
                                        distance:8,
                                        position:'end'
                                    },
                                    },
                                ],
                            },
                        }
                    ],

                
                },
                empty:true,
                tWidth:100,
                target:[3.9,13.9],
            }
        },
        props:{
            dataList:{
                type:Object
            },
        },
        components: {
            TChart
        },
        computed:{
            ...mapGetters([
            'unit','targetScope','timeFormat']),
        },
        created(){
        },
        mounted(){
           let data = this.dataList
            if(_.compact(data.agp05).length>1&&_.compact(data.agp25).length>1&&_.compact(data.agp50).length>1
            &&_.compact(data.agp75).length>1&&_.compact(data.agp95).length>1){
                    this.renderIng(data) 
                    this.empty = false 
            }else{
                    this.empty = true
            }
        },
        methods:{
            // 渲染数据
            renderIng(data){
                let value = _.cloneDeep(data)
                this.option.xAxis[0].data = value.xData
                let unit = this.unit
                let max =  _.maxBy(value.agp95)+10
                this.option.series[4].markLine.data[0].yAxis = this.targetScope[0]
                this.option.series[4].markLine.data[1].yAxis = this.targetScope[1]
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
                if(unit != 'mg/dL'){
                   max =  Math.ceil(GlucoseUtils.mgdlToMmol(max) / 3) * 3
                    this.option.yAxis[0].max = max
                    this.option.series[0].data = value.agp05.map((val) => {
                        return val?GlucoseUtils.mgdlToMmol(val):val
                    });
                    this.option.series[1].data = value.agp25.map((item, index) => {
                        return item?GlucoseUtils.mgdlToMmol(item - value.agp05[index]):item;
                    })
                    this.option.series[2].data = value.agp75.map((item, index) => {
                        return item?GlucoseUtils.mgdlToMmol(item - value.agp25[index]):item;
                    })
                    this.option.series[3].data = value.agp95.map((item, index) => {
                        return item?GlucoseUtils.mgdlToMmol(item - value.agp75[index]):item;
                    })
                    this.option.series[4].data = value.agp50.map((val) => {
                        return val?GlucoseUtils.mgdlToMmol(val):val
                        
                    })
                   
                }else{
                    this.option.yAxis[0].max =  Math.ceil(max / 100) * 100
                    this.option.series[0].data = value.agp05;
                    this.option.series[1].data =  value.agp25.map((item, index) => {
                            return item - value.agp05[index];
                            })
                    this.option.series[2].data = value.agp75.map((item, index) => {
                            return item - value.agp25[index];
                            })
                    this.option.series[3].data = value.agp95.map((item, index) => {
                            return item - value.agp75[index];
                            })
                    this.option.series[4].data = value.agp50
                }
                this.$nextTick(()=>{
                    console.log(formatTime(new Date()),'AGP渲染完成')
                })
                
            }
        },
        watch:{
            dataList:function(n,o){
                let data = n
                if(_.compact(data.agp05).length>1&&_.compact(data.agp25).length>1&&_.compact(data.agp50).length>1
                &&_.compact(data.agp75).length>1&&_.compact(data.agp95).length>1){
                        this.renderIng(data) 
                        this.empty = false 
                }else{
                     this.empty = true
                }
            }
        },
    }
</script>
<style scoped>
   /* agp图谱legend */
    .agp-chart-empty{
        width:100%;
        padding:150px 0;
    }
    .empty-icon{
        width:80px;
        height:80px;
        display: block;
        margin:0 auto;
    }
    .agp-chartempty-tips{
        text-align: center;
        font-size:var(--fontSize-max);
        color:var(--color-black-40);
    }
    .agp-legend{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .agp-legend-item{
        display: flex;
        align-items: center;
        margin:0 10px;
    }
    .agp-legend-info{
         color:var(--color-black-60);
         margin-left:6px;
    }
    .apg-legend-shape1{
        color:var(--color-primary); 
    }
    .apg-legend-shape2{
        width:20px;
        height:20px;
        background:#94DBDE;
    }
    .apg-legend-shape3{
        width:20px;
        height:20px;
        background:#D6F1F2;
    }
    .apg-legend-shape4{
        width:20px;
        border-top:2px solid var(--color-error); 
        display: block;
    }
    .apg-legend-shape4:nth-child(1){
        margin-bottom:10px;
        border-top:2px solid var(--color-warning); 
    }
</style>