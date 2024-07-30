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
                    <div class='agp-legend-info' >50%中位线</div>
                </div>
                <div class='agp-legend-item' >
                    <div class='apg-legend-shape2'></div>
                    <div class='agp-legend-info' >25%-75%区间</div>
                </div>
                <div class='agp-legend-item' >
                    <div class='apg-legend-shape3'></div>
                    <div class='agp-legend-info' >5%-95%区间</div>
                </div>
                <div class='agp-legend-item' >
                    <div class='apg-legend-shape4-box'>
                        <p class='apg-legend-shape4'></p>
                        <p class='apg-legend-shape4'></p>
                    </div>
                    <div class='agp-legend-info' >目标范围</div>
                </div>
            </div>
            <t-chart
                    style="width: 100%;height:600px;"
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
    export default {
        data(){
            return{
                initOptions: {
                    renderer: 'svg'
                },
                option: {
                    grid:[
                        {
                            height:380,
                            left:90,
                            right:90,
                            top:50
                        },
                        {
                            height:75,
                            left:90,
                            right:90,
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
                                show:true,
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
                                        return value;
                                    }
                                },
                                interval:0,
                                color: 'var(--color-black-40)',
                                fontSize: 16, 
                                margin:14
                            }
                        },
                        {
                            type: 'category',
                            gridIndex:1,
                            boundaryGap:true,
                            axisTick: false,
                            splitLine:{
                                show:true,
                                lineStyle:{
                                    type:'dashed',
                                    color:'var(--color-black-10)'
                                },
                                interval:0
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: 'var(--color-black-10)',
                                    width:1,
                                    type:'dashed',
                                },
                            },
                            data:[],
                            axisLabel: {
                                show:false,
                                interval:0,
                                color: 'var(--color-black-40)',
                                fontSize: 16, 
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
                                    type:'dashed',
                                    color:'var(--color-black-10)'
                                }
                            },
                            axisLabel: {
                                formatter: '{value}',
                                color: 'var(--color-black-40)',
                                fontSize: 16,
                                margin:14
                            }
                        },
                        {
                            type: 'value',
                            gridIndex:1,
                            name:['{a|分时段}','{b|平均血糖}'].join('\n'),
                            nameRotate:0,
                            nameLocation:'middle',
                            nameTextStyle:{
                                rich:{
                                    a:{
                                        color:'var(--color-black-40)',
                                        fontSize:16,
                                        padding:[0,0,8,0]
                                    },
                                    b:{
                                        color:'var(--color-black-40)',
                                        fontSize:16
                                    }
                                    
                                }
                            },
                            min: 0,
                            max: 0.1,
                            minInterval:1,
                            splitLine:{
                                lineStyle:{
                                    type:'dashed',
                                    color:'var(--color-black-10)'
                                }
                            },
                            axisLabel: {
                                show:false
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
                            color: '#D6F1F2',
                            },
                            stack: 'confidence-band',
                            symbol: 'none',
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
                            color: '#94DBDE',
                            },
                            stack: 'confidence-band',
                            symbol: 'none',
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
                            color: '#D6F1F2',
                            },
                            stack: 'confidence-band',
                            symbol: 'none',
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
                            animation:false,
                            markLine: {
                            silent: true, // 不高亮辅助线
                            symbol: 'none',
                            animation:false,
                            data: [
                                {
                                type: 'min',
                                yAxis: 3.9,
                                lineStyle: {
                                    color: 'var(--color-primary)',
                                    width: 1,
                                    type:'dashed'
                                },
                                label: {
                                    color: 'var(--color-error)',
                                    fontSize: 16,
                                    distance: 14,
                                    position:'start'
                                },
                                },
                                {
                                type: 'max',
                                yAxis: 13.9,
                                lineStyle: {
                                    color: 'var(--color-primary)',
                                    width: 1,
                                    type:'dashed'
                                },
                                label: {
                                    color: 'var(--color-warning)',
                                    fontSize: 16,
                                    distance:14,
                                    position:'start'
                                },
                                },
                            ],
                            },
                        },
                        {
                            type:'bar',
                            data: [],
                            xAxisIndex:1, 
                            yAxisIndex:1,
                            barGap:0,
                            barWidth:'100%',
                            animation:false,
                            itemStyle:{
                                color:''
                            },
                            showBackground:true,
                            backgroundStyle:{
                                color:'rgba(50, 186, 192, 0.1)'
                            },
                            emphasis:{
                                disabled:true
                            },
                            label:{
                                show:true,
                                position:'inside',
                                color:'#333',
                                fontSize:16
                            },
                        }
                    ],

                
                },
                empty:true,
                target:[3.9,10],
            }
        },
        components: {
            TChart
        },
        created(){
            
        },
        mounted(){
            console.log(formatTime(new Date()),'组件渲染完成')  
            this.$bus.$on('getDatas',(data)=>{
                if(data[1].length>=5*1440){
                    this.handelIng(data)  
                     this.empty = false
                }else{
                    this.empty = true
                }
            })
            this.$bus.$on('getVuexTag',(data)=>{
                let result  = this.$store.state.report.agp[data]
                if(result) {
                    this.empty = false
                    this.renderIng(result)
                }else{
                    this.empty = true
                }
                
            })
        },
        methods:{
            /**
             * 1.将原始数组分割为时刻数组，判断时间戳转换的HH:MM
             * 2.创建5条曲线所需要的1440长度时刻数组，数组下标对应数据时刻，例如：00：00=>0  00：01=>1  12：00=>12*60
             * 3.将时刻数组对应的下标塞到5个agp数组中
             * 4.分时段平均值，创建24长度的时段数组，1440个时刻，i%60为一个新时刻，否则向原来的数组中push,画图时求每个时段对应的平均值
             * 
             */
            handelIng(data){
                let array = data[1]
                // 将数组分割为时刻数组
                let momentMap = new Map();
                array.forEach(item=>{
                    item.moment = formatDate(item.DataTs*1000,'HH:MM')
                    momentMap.has(item.moment) ? momentMap.get(item.moment).push(item.Value) : momentMap.set(item.moment, [item.Value]);
                })
                // 计算出AGP数据并补全图谱数据
                let agpMap = new Map();
                let agp05 = new Array(24 * 60);
                let agp25 = new Array(24 * 60);
                let agp50 = new Array(24 * 60);
                let agp75 = new Array(24 * 60);
                let agp95 = new Array(24 * 60);
                let xData = new Array(24 * 60);
                let x2Data = new Array(24);
                let avgData = new Array(24);
                let avgMoment = 0
                for (let i = 0; i < 24 * 60; i++) {
                    // index换算为时刻
                    let h =  Math.floor(i/60)<10 ? '0'+ Math.floor(i/60) : Math.floor(i/60) 
                    let m =  i%60 < 10 ? '0' + i%60 : i%60
                    let moment = h+':'+m
                    if(momentMap.has(moment)){
                        agp05[i] = AGPUtils.calculateYValue(momentMap.get(moment))?GlucoseUtils.mgdlToMmol(AGPUtils.calculateYValue(momentMap.get(moment)).p05):AGPUtils.calculateYValue(momentMap.get(moment))
                        agp25[i] = AGPUtils.calculateYValue(momentMap.get(moment))?GlucoseUtils.mgdlToMmol(AGPUtils.calculateYValue(momentMap.get(moment)).p25):AGPUtils.calculateYValue(momentMap.get(moment))  
                        agp50[i] = AGPUtils.calculateYValue(momentMap.get(moment))?GlucoseUtils.mgdlToMmol(AGPUtils.calculateYValue(momentMap.get(moment)).p50):AGPUtils.calculateYValue(momentMap.get(moment))
                        agp75[i] = AGPUtils.calculateYValue(momentMap.get(moment))?GlucoseUtils.mgdlToMmol(AGPUtils.calculateYValue(momentMap.get(moment)).p75):AGPUtils.calculateYValue(momentMap.get(moment)) 
                        agp95[i] = AGPUtils.calculateYValue(momentMap.get(moment))?GlucoseUtils.mgdlToMmol(AGPUtils.calculateYValue(momentMap.get(moment)).p95):AGPUtils.calculateYValue(momentMap.get(moment))
                    }
                    xData[i] = moment
                    if(i%60==0){
                        avgMoment = i/60
                        x2Data[i/60] = moment
                        avgData[avgMoment] = momentMap.get(moment)?momentMap.get(moment):[]
                    }else{
                        momentMap.get(moment)?avgData[avgMoment].push(...momentMap.get(moment)):[]
                    }
                    
                }
                xData.push('24:00')
                let params = {
                    xData:xData,
                    x2Data:x2Data,
                    agp05:agp05,
                    agp25:agp25,
                    agp50:agp50,
                    agp75:agp75,
                    agp95:agp95,
                    avgData:avgData
                }
                this.$store.dispatch('setAgp',{key:data[0],value:params}) //处理完数据存vuex
                this.renderIng(params)
            },
            // 渲染数据
            renderIng(data){
                this.option.xAxis[0].data = data.xData
                this.option.xAxis[1].data =data.x2Data
                this.option.yAxis[0].max = Math.ceil(_.maxBy(data.agp95) / 3) * 3
                this.option.series[0].data = data.agp05
                this.option.series[1].data =  data.agp25.map((item, index) => {
                        return item - data.agp05[index];
                        })
                this.option.series[2].data = data.agp75.map((item, index) => {
                        return item - data.agp25[index];
                        })
                this.option.series[3].data = data.agp95.map((item, index) => {
                        return item - data.agp75[index];
                        })
                this.option.series[4].data = data.agp50
                this.option.series[5].data = data.avgData.map((item,index) => {
                    return GlucoseUtils.mgdlToMmol(_.mean(item));
                })
                this.option.series[5].itemStyle.color = (params) =>{
                    if(params.value>this.target[1]){
                        return '#F6C059'
                    }else if(params.value<this.target[0]){
                        return '#F43F31'
                    }else{
                        return 'rgba(0,0,0,0)'
                    }
                }
            }
        },
        
        beforeDestroy(){
            this.$bus.$off('getDatas')
            this.$bus.$off('getVuexTag')
        }
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
        border-top:1px dashed var(--color-primary); 
        display: block;
    }
    .apg-legend-shape4:nth-child(1){
        margin-bottom:10px;
    }
</style>