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
                    style="width: 100%;height:370px;"
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
                            height:300,
                            left:140,
                            right:120,
                            top:30
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
                                        return value;
                                    }
                                },
                                interval:0,
                                color: 'var(--color-black-60)',
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
                                    position:'start'
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
                                    position:'start'
                                },
                                },
                            ],
                            },
                        }
                    ],

                
                },
                empty:true,
                target:[3.9,13.9],
            }
        },
        components: {
            TChart
        },
        computed:{
            ...mapGetters([
                'unit']),
        },
        created(){
            
        },
        mounted(){
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
                console.log(result)
                if(result) {
                    console.log(1234567)
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
                data =  _.cloneDeep(data)
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
                for (let i = 0; i < 24 * 60; i++) {
                    // index换算为时刻
                    let h =  Math.floor(i/60)<10 ? '0'+ Math.floor(i/60) : Math.floor(i/60) 
                    let m =  i%60 < 10 ? '0' + i%60 : i%60
                    let moment = h+':'+m
                    if(momentMap.has(moment)){
                        agp05[i] = AGPUtils.calculateYValue(momentMap.get(moment))?AGPUtils.calculateYValue(momentMap.get(moment)).p05:AGPUtils.calculateYValue(momentMap.get(moment))
                        agp25[i] = AGPUtils.calculateYValue(momentMap.get(moment))?AGPUtils.calculateYValue(momentMap.get(moment)).p25:AGPUtils.calculateYValue(momentMap.get(moment))  
                        agp50[i] = AGPUtils.calculateYValue(momentMap.get(moment))?AGPUtils.calculateYValue(momentMap.get(moment)).p50:AGPUtils.calculateYValue(momentMap.get(moment))
                        agp75[i] = AGPUtils.calculateYValue(momentMap.get(moment))?AGPUtils.calculateYValue(momentMap.get(moment)).p75:AGPUtils.calculateYValue(momentMap.get(moment)) 
                        agp95[i] = AGPUtils.calculateYValue(momentMap.get(moment))?AGPUtils.calculateYValue(momentMap.get(moment)).p95:AGPUtils.calculateYValue(momentMap.get(moment))
                    }
                     xData[i] = moment
                }
               
                xData.push('00:00')
                let params = {
                    xData:xData,
                    agp05:agp05,
                    agp25:agp25,
                    agp50:agp50,
                    agp75:agp75,
                    agp95:agp95
                }
                console.log(formatTime(new Date()),'AGP计算完成')
                this.renderIng(params)
                this.$store.dispatch('setAgp',{key:data[0],value:params}) //处理完数据存vuex
               
                
            },
            // 渲染数据
            renderIng(data){
                let value = _.cloneDeep(data)
                this.option.xAxis[0].data = value.xData
                let unit = this.unit
                let max =  Math.ceil(GlucoseUtils.mgdlToMmol(_.maxBy(value.agp95)) / 3) * 3<15?15:Math.ceil(GlucoseUtils.mgdlToMmol(_.maxBy(value.agp95)) / 3) * 3
                this.option.series[4].markLine.data[0].yAxis =unit != 'mg/dL'?this.target[0]: GlucoseUtils.mmolToMgdl(this.target[0])
                this.option.series[4].markLine.data[1].yAxis = unit != 'mg/dL'?this.target[1]: GlucoseUtils.mmolToMgdl(this.target[1])
                if(unit != 'mg/dL'){
                    max = max
                    this.option.yAxis[0].max = max
                    this.option.series[0].data = value.agp05.map(val => GlucoseUtils.mgdlToMmol(val));
                    this.option.series[1].data = value.agp25.map((item, index) => {
                            return GlucoseUtils.mgdlToMmol(item - value.agp05[index]);
                            })
                    this.option.series[2].data = value.agp75.map((item, index) => {
                            return GlucoseUtils.mgdlToMmol(item - value.agp25[index]);
                            })
                    this.option.series[3].data = value.agp95.map((item, index) => {
                            return GlucoseUtils.mgdlToMmol(item - value.agp75[index]);
                            })
                    this.option.series[4].data = value.agp50.map(val => GlucoseUtils.mgdlToMmol(val))
                   
                }else{
                    this.option.yAxis[0].max = GlucoseUtils.mmolToMgdl(max)
                    this.option.yAxis[0].interval = GlucoseUtils.mmolToMgdl(max)/5
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
        border-top:2px solid var(--color-error); 
        display: block;
    }
    .apg-legend-shape4:nth-child(1){
        margin-bottom:10px;
        border-top:2px solid var(--color-warning); 
    }
</style>