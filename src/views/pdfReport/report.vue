<template>
    <div id='report' >
            <div class='report-main-title-info' >
                <img src="~@/assets/image/report-logo.png" alt="" class='report-logo' >
                <div class='report-main-title' >动态葡萄糖监测报告</div>
                <div class='report-main-date' >
                    2024年3月1日<div class='repart-main-dirver-box'><span class='repart-main-dirver' ></span></div>2024年3月14日</div>
            </div>
            <!-- 基本信息 -->
            <div class='report-main-base-info report-main' ref='test'>
                <div class='report-module-title'  >
                    <div class='report-module-title-border' ></div>
                    <div class='report-module-title-text' >基本信息</div>
                </div>
                <div class='report-base-user' >
                    <div class='report-base-user-item' >
                        <div class='report-base-user-label'>姓名：</div>
                        <div class='report-base-user-value'>卡布达</div>
                    </div>  
                    <div class='report-base-user-item' >
                        <div class='report-base-user-label'>年龄：</div>
                        <div class='report-base-user-value'>65</div>
                    </div>  
                    <div class='report-base-user-item' >
                        <div class='report-base-user-label'>糖尿病类型：</div>
                        <div class='report-base-user-value'>一型糖尿病</div>
                    </div>  
                    <div class='report-base-user-item' >
                        <div class='report-base-user-label'>病程：</div>
                        <div class='report-base-user-value'>5年</div>
                    </div>  
                    <div class='report-base-user-item' >
                        <div class='report-base-user-label'>葡萄糖目标范围：</div>
                        <div class='report-base-user-value'>3.9-10.0mmol/L</div>
                    </div>  
                </div>
                <div class='report-data-source'>
                    <div class='report-base-user-item' >
                        <div class='report-base-user-label'>传感器序列号：</div>
                        <div class='report-base-user-value'>CGM1234567</div>
                    </div>  
                    <div class='report-base-user-item' >
                        <div class='report-base-user-label'>数据来源：</div>
                        <div class='report-base-user-value'>iPhone XS Max</div>
                    </div>  
                    <div class='report-base-user-item' >
                        <div class='report-base-user-label'>生成时间：</div>
                        <div class='report-base-user-value'>2024年3月14日</div>
                    </div>  
                </div>
            </div>
            <!-- 血糖数据、TIR -->
            <div class='report-main-data-tir-box' >
                <div class='report-main-data-tir report-main' >
                    <div class='report-module-title' >
                        <div class='report-module-title-border' ></div>
                        <div class='report-module-title-text' >血糖数据</div>
                    </div>
                    <div class='report-main-data-list'>
                        <div class='report-main-data-label'>
                            <div class='report-main-data-label-text' >CGM佩戴天数：</div>
                        </div>
                        <div class='report-main-data-val'>14天</div>
                    </div>
                    <div class='report-main-data-list'>
                        <div class='report-main-data-label'>
                            <div class='report-main-data-label-text' >CGM有效记录的时间占比：</div>
                            <div class='report-main-data-label-tip' >目标值>70%才可得到有效数据分析</div>
                        </div>
                        <div class='report-main-data-val'>{{bgInfo.effective>70?bgInfo.effective:'--'}}%</div>
                    </div>
                    <div class='report-main-data-list' v-if='unit=="mg/dL"' >
                        <div class='report-main-data-label'>
                            <div class='report-main-data-label-text' >MG 平均葡萄糖值：</div>
                            <div class='report-main-data-label-tip' >目标值＜119 mg/dL</div>
                        </div>
                        <div class='report-main-data-val'>{{bgInfo.mean}}mg/dL</div>
                    </div>
                    <div class='report-main-data-list' v-else>
                        <div class='report-main-data-label'>
                            <div class='report-main-data-label-text' >MG 平均葡萄糖值：</div>
                            <div class='report-main-data-label-tip' >目标值＜6.6mmol/L</div>
                        </div>
                        <div class='report-main-data-val'>{{bgInfo.mean}}mmol/L</div>
                    </div>
                    <div class='report-main-data-list'>
                        <div class='report-main-data-label'>
                            <div class='report-main-data-label-text' >GMI 葡萄糖管理指标:</div>
                            <div class='report-main-data-label-tip' >目标值＜7%</div>
                        </div>
                        <div class='report-main-data-val'>{{bgInfo.GMI}}%</div>
                    </div>
                    <div class='report-main-data-list'>
                        <div class='report-main-data-label'>
                            <div class='report-main-data-label-text' >CV 变异系数：</div>
                            <div class='report-main-data-label-tip' >目标值＜33%</div>
                        </div>
                        <div class='report-main-data-val'>{{bgInfo.CV}}%</div>
                    </div>
                </div>
                <div class='report-main-data-tir report-main' >
                    <div class='report-module-title' >
                        <div class='report-module-title-border' ></div>
                        <div class='report-module-title-text' >葡萄糖目标范围内时间</div>
                    </div>
                    <div class='report-module-tips report-module-tips-only' >
                        葡萄糖目标范围内占比越高，代表血糖控制的越好。
                    </div>
                    <div class='tir-box' >
                        <TIR/>
                    </div>
                    
                </div>
            </div>
            <!-- AGP图谱 -->
            <div class='report-main-agp report-main' >
                <div class='report-module-title' >
                    <div class='report-module-title-border' ></div>
                    <div class='report-module-title-text' >AGP图谱</div>
                </div>
                <div class='report-module-tips' >
                     <div class='report-module-tips' >
                       中位数葡萄糖曲位于目标范围内，且越平坦，表示血糖稳定性越好。25%-75%区间（图中深蓝色区域）与5%-95%区间（图中浅蓝色区域）均显示日间血糖波动情况，区间越宽提示相应时间段血糖波动越大。其中影响 25%-75%区间的因素主要是是生理状态(如胰岛素抵抗等)和药物治疗等。影响5%-95%区间的因素主要是饮食，运动等。
                    </div>
                </div>
                <div class='agp-box' >
                    <AGP/>
                </div>
            </div>
            <!-- 每日血糖 -->
            <div class='report-main-day report-main' >
                <div class='report-module-title' >
                    <div class='report-module-title-border' ></div>
                    <div class='report-module-title-text' >每日血糖简图</div>
                </div>
                <div class='report-module-tips' >
                     <div class='report-module-tips' >
                       每日血糖展示了14天中每天的血糖变化情况。
                    </div>
                </div>
                <div class='day-chart-box'>
                    <DayChart/>
                </div>
            </div>
            <!-- 参数解释 -->
            <div class='report-main-params' >
                <div class='report-main-params-title' >参数解释</div>
                <div class='report-main-params-item' >
                    1.平均葡萄糖值（MG）：CGM 监测期间所有葡萄糖值的平均值，用于评价整体血糖水平。<br/>
                    2.葡萄糖管理指标（GMI）：预估糖化血红蛋白(eHbA1c)，根据 CGM 葡萄糖读数估算 HbA1c，用于评价整体血糖水平<br/>
                    3.变异系数(CV)：葡萄糖标准差与平均葡萄糖比值所得百分数，用于评价血糖波动。<br/>
                    4.葡萄糖目标范围内百分比(TIR)：指葡萄糖在目标范围内的时间或其所占的百分比，<br/>
                    5.葡萄糖高于目标范围百分比(TAR)：指葡萄糖高于目标范围的时间或其所占的百分比<br/>
                    6.葡萄糖低于目标范围百分比(TBR):指葡萄糖低于目标范围的时间或其所占的百分比。<br/>
                </div>
                <div class='report-main-params-title' >参考文献</div>
                <div class='report-main-params-item' >
                    动态葡萄糖图谱报告临床应用专家共识（2023版）
                </div>
            </div>
            <!-- <img src="~@/assets/image/test.jpg" alt="" class='test' > -->
    </div>
</template>
<script>
import TIR from '@/views/components/Chart/TIR'
import AGP from '@/views/components/Chart/AGPchart'
import DayChart from '@/views/components/Chart/DayChart'
import {getAgpData} from '@/api/dataApi'
import {formatDate,formatTime} from '@/utils/formatTime'
import { GlucoseUtils } from "@/utils/algorithm/Glucose";
export default {
    data(){
        return{
            bgInfo:'',
            unit:'mg/dL'
        }
    },
     components: {
        TIR,AGP,DayChart
    },
    mounted(){
        const end = new Date('2024-06-03 23:59:00');
        const start = new Date('2024-05-18 00:00:00');
        this.agpDate = [formatDate(start,"YYYY-mm-dd"), formatDate(end,"YYYY-mm-dd")] 
        if( _.indexOf(this.$store.state.report.chooseDateList,this.agpDate.join('/'))==-1){
            this.getData()
        }else{
            this.$bus.$emit('getVuexTag',this.agpDate.join('/'))
        }
    },
    methods:{
       // 从云拉取数据
        getData(){
            console.log(formatTime(new Date()),'请求数据')   
            let s = new Date(this.agpDate[0])
            let e = new Date(this.agpDate[1])
            let start_ts = s.setHours(0,0,0)/1000
            let end_ts = e.setHours(23,59,59)/1000
            this.loading = true
            getAgpData({start_ts:start_ts,end_ts:end_ts}).then(response => {
							if(response.code == 1000){
                                let arrayData = response.data
                                this.loading = false
                                if(arrayData.length>0){
                                    console.log(formatTime(new Date()),'得到数据')   
                                    this.list = arrayData
                                    this.bgInfo = GlucoseUtils.calculateMeanCvGmi(_.map(arrayData,'Value'))
                                    if(this.unit=='mmol/L'){
                                        this.bgInfo.mean = GlucoseUtils.mgdlToMmol(this.bgInfo.mean)
                                    }
                                    this.handel(_.map(arrayData,'Value'))
                                    this.$bus.$emit('getDatas',[this.agpDate.join('/'),arrayData,this.unit])
                                    this.$store.dispatch('setChooseDateList',this.agpDate.join('/'))
                                    
                                }
							}else{
                                this.loading = false
								this.$message({
                                    type: 'error',
                                    message: response.msg
								});
							}
            }).catch((res) => {
                console.log(res)
            })
        },
       
        // cgm有效时间占比
        handel(dataArray){
            let filteredArray = dataArray.filter(val => val >= 40 && val <= 400);
            this.bgInfo.effective = _.round((filteredArray.length/dataArray.length)*100,1)
        }
    }
}
</script>
<style scoped>
.test{
    margin:0 auto;
    display: block;
    position: absolute;
    opacity: 0;
    left:0;
    top:0;
}
 @media print {
        #report {
            /* transform: scale(0.35);
            transform-origin: top center; */
            -webkit-print-color-adjuset:exact;
            color-adjust: exact;
        }
    }
/* 内容框设置 */
    #report{
        width:1680px;
        height:2375px;
        background:#fff;
        margin:0 auto;
        overflow: hidden;
        box-sizing: border-box;
        padding:75px 80px 0 80px;
        position: relative;
       
    }
    .report-main{
        box-sizing: border-box;
        padding:24px 20px 0 20px;
    }
/* 头部信息 */
    .report-main-title-info{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom:20px;
        position: relative;
    }
    .report-logo{
        width:60px;
        height:60px;
        display: block;
    }
    .report-main-title{
        font-size:50px;
        color:var(--color-primary);
        /* font-family:MiLan-Medium; */
        font-weight: 440;
        text-align: center;
        position: absolute;
        left:0;
        top:0;
        width:100%;
    }
    .report-main-date{
        font-size:20px;
        color:var(--color-black-100);
        display: flex;
        align-items: center;
    }
    .repart-main-dirver-box{
        width:20px;
        height:20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin:0 2px;
    }
    .repart-main-dirver{
        width:16px;
        height:1px;
        background:var(--color-black-100);
    }
/* 模块标题 */
    .report-module-title{
        width:100%;
        height:50px;
        border-radius:4px;
        background:rgba(50,186,192,0.1);
        display: flex;
        align-items: center;
        box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.05);
    }
    .report-module-title-border{
        width:3px;
        height:24px;
        background:var(--color-primary);
        margin-left:10px;
    }
    .report-module-title-text{
        font-size:20px;
        color:var(--color-black-100);
        /* font-family:MiLan-Medium; */
        margin-left:4px;
        font-weight: 700;
    }
    .report-module-tips{
        font-size:16px;
        color:var(--color-black-60);
        padding:5px 0 0 10px;
    }
    .report-module-tips-only{
        padding:10px 0 0 10px;
    }
/* 基本信息 */
    .report-main-base-info{
        width:100%;
        height:209px;
    }
    .report-base-user{
        width:100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin:20px 0;
        height:35px;
        box-sizing: border-box;
        padding:0px 20px 0px 10px;
    }
    .report-base-user-item{
        display: flex;
        align-items: center;
        font-size:20px;
    }
    .report-base-user-label{
        color:var(--color-black-60);
    }
    .report-base-user-value{
        color:var(--color-black-100);
    }
    .report-data-source{
        width:100%;
        height:52px;
        padding-left:20px;
        padding-right:60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background:#f7f7f7;
    }
/* 血糖数据、TIR */
    .report-main-data-tir-box{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .report-main-data-tir{
        width:750px;
        height:446px;
    }
    .report-main-data-list{
        width:690px;
        height:75px;
        box-sizing: border-box;
        margin:0 auto;
        border-bottom:1px solid rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .report-main-data-label-text{
        font-size:20px;
        color:var(--color-black-100);
        height:27px;
        line-height: 27px;
    }
    .report-main-data-label-tip{
        font-size:16px;
        color:var(--color-black-60);
        height:18px;
        line-height: 18px;
    }
    .report-main-data-val{
        font-size:24px;
        color:var(--color-black-100);
        font-weight: 440;
        font-family:MiLan-Medium;
    }
    .tir-box{
        padding:20px 0 0 20px;
    }
/* agp图谱 */
    .report-main-agp{
        width:100%;
        height:567px;
    }
    .agp-box{
        margin-top:20px;
    }
/* 每日血糖曲线 */
    .report-main-day{
        width:100%;
        height:691px;
    }
    .day-chart-box{
        margin-top:16px;
    }
/* 参数解释 */
    .report-main-params{
        width:1480px;
        height:239px;
        background:#f7f7f7;
        border-radius:10px;
        padding:26px 20px 20px 20px;
        margin:0 auto;
    }
    .report-main-params-title{
        font-size:16px;
        color:var(--color-black-100);
        line-height: 21px;
    }
     .report-main-params-item{
        font-size:16px;
        color:var(--color-black-60);
        line-height: 21px;
        margin-bottom:8px;
     }
</style>