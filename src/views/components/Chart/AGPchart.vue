<template>
    <div>
         <div class='agp-chart-empty' v-if='empty'>
            <img src="~@/assets/image/empty-icon.png" alt="" class='empty-icon' >
            <div class='agp-chartempty-tips' >至少需要五天数据才可显示AGP图谱</div>
        </div>
        <div v-else>
            <div class='agp-legend' >
                <div class='agp-legend-item' >
                    <div class='apg-legend-shape1'>—</div>
                    <div class='agp-legend-info' >50%{{$t('message.reports.agp.chartLegend1')}}</div>
                </div>
                <div class='agp-legend-item' >
                    <div class='apg-legend-shape2'></div>
                    <div class='agp-legend-info' >25%-75%{{$t('message.reports.agp.chartLegend2')}}</div>
                </div>
                <div class='agp-legend-item' >
                    <div class='apg-legend-shape3'></div>
                    <div class='agp-legend-info' >5%-95%{{$t('message.reports.agp.chartLegend3')}}</div>
                </div>
                <div class='agp-legend-item' >
                    <div class='apg-legend-shape4-box'>
                        <p class='apg-legend-shape4'></p>
                        <p class='apg-legend-shape4'></p>
                    </div>
                    <div class='agp-legend-info' >{{$t('message.reports.agp.chartLegend4')}}</div>
                </div>
            </div>
            <t-chart
                    :style='{"width":tWidth+"%","height":height+"px"}'
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
                            show:true,
                            height:300,
                            left:140,
                            right:120,
                            top:30,
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
                            interval:3,
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
                            symbol: 'none',
                            silent: true, 
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
                            showSymbol: false,
                            lineStyle: {
                            width: 2,
                            },
                            silent: true, 
                            emphasis:{
                                disabled:true
                            },
                            animation:false,
                            markLine: {
                            silent: true, // 不高亮辅助线
                            symbol: 'none',
                            animation:false,
                            data: [
                                {
                                type: 'min',
                                yAxis:70,
                                lineStyle: {
                                    color: 'var(--color-error)',
                                    width: 2,
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
                                yAxis:180,
                                lineStyle: {
                                    color: 'var(--color-warning)',
                                    width: 2,
                                    type:'solid'
                                },
                                label: {
                                    color: 'var(--color-warning)',
                                    fontSize: 20,
                                    distance:14,
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
            height:{
                type:Number
            }
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
                let max =  Math.ceil(GlucoseUtils.mgdlToMmol(_.maxBy(value.agp95)) / 3) * 3<15?15:Math.ceil(GlucoseUtils.mgdlToMmol(_.maxBy(value.agp95)) / 3) * 3
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
                    max = max
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
                    this.option.yAxis[0].max = GlucoseUtils.mmolToMgdl(max)
                    this.option.yAxis[0].interval =3*18
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
        background:#B6D9F1;
    }
    .apg-legend-shape3{
        width:20px;
        height:20px;
        background:#DAECF8;
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