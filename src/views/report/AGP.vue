<template>
    <div class='agp'>
        <div class='agp-main' >
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
                    <img src="~@/assets/image/date-calendar.png" alt="" class='agp-icon' >
                    <div class='agp-date' >{{agpDate[0]}} — {{agpDate[1]}}（{{dayDate}}天）</div>
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
            <Progress :percentage='downProgress' v-if='progressShow' />
            <div v-else>
                <!-- 基本信息 -->
                <div class='agp-cont-main'>
                    <div class='cgm-cont-title'><span class='title-border' ></span>基本信息</div>
                    <div class='report-base-user' >
                        <div class='report-base-user-item' >
                            <div class='report-base-user-label'>姓名：</div>
                            <div class='report-base-user-value'>{{info.nickname?info.nickname:'--'}}</div>
                        </div>  
                        <div class='report-base-user-item' >
                            <div class='report-base-user-label'>年龄：</div>
                            <div class='report-base-user-value'>{{info.age?info.age:'--'}}</div>
                        </div>  
                        <div class='report-base-user-item' >
                            <div class='report-base-user-label'>糖尿病类型：</div>
                            <div class='report-base-user-value'>{{info.diabetes_type?info.diabetes_type:'--'}}</div>
                        </div>  
                        <div class='report-base-user-item' >
                            <div class='report-base-user-label'>病程：</div>
                            <div class='report-base-user-value'>{{info.diabetes_year?info.diabetes_year:'--'}}</div>
                        </div>  
                        <div class='report-base-user-item' >
                            <div class='report-base-user-label'>葡萄糖目标范围：</div>
                            <div class='report-base-user-value'>{{info.glucose_range_lower_limit}}-{{info.glucose_range_lupper_limit}}{{unit}}</div>
                        </div>  
                    </div>
                    <div class='report-data-source'>
                        <div class='report-base-user-item' >
                            <div class='report-base-user-label'>传感器序列号</div>
                        </div>  
                        <div class='report-base-user-item1' >
                            <div class='report-base-user-label'>数据来源</div>
                        </div>  
                        <div class='report-base-user-item2' >
                            <div class='report-base-user-label'>同步时间</div>
                        </div>  
                    </div>
                    <div class='report-data-sources' v-if='info.device.length<=0'>
                        <div class='report-base-user-item' >
                            <div class='report-base-user-value'>--</div>
                        </div>  
                        <div class='report-base-user-item1' >
                            <div class='report-base-user-value'>--</div>
                        </div>  
                        <div class='report-base-user-item2' >
                            <div class='report-base-user-value'>--</div>
                        </div>  
                    </div>
                    <div v-else >
                        <div class='report-data-sources' v-for='(item,index) in info.device' :key='index'>
                            <div class='report-base-user-item' >
                                <div class='report-base-user-value'>{{item.nickname?item.nickname:'--'}}</div>
                            </div>  
                            <div class='report-base-user-item1' >
                                <div class='report-base-user-value'>{{item.data_source?item.data_source:'--'}}</div>
                            </div>  
                            <div class='report-base-user-item2' >
                                <div class='report-base-user-value'>{{item.upDate?item.upDate:'--'}}</div>
                            </div>  
                        </div>
                    </div>
                </div>
                <Empty v-if='empty'/>
                <div class='agp-cont' id='overviewpage' v-else>
                    <el-row type="flex" justify="space-between">
                        <el-col :span="12" class='agp-cont-main agp-cont-main1' >
                            <div class='cgm-cont-title'>  <span class='title-border' ></span>血糖数据</div>
                            <!-- <div class='cgm-agp-info-box cgm-agp-info-box1'>
                                <div class='cgm-agp-info'></div>
                                <img src="~@/assets/image/reason-icon.png" alt="" class='reason-icon' >
                            </div> -->
                            <div class='bg-data-item' >
                                <div class='bg-data-label' >
                                    <div>CGM佩戴天数</div>
                                    <div class='bg-data-tip' ></div>
                                </div>
                                <div class='bg-data-val' >{{bgInfo.wearsDay}}</div>
                            </div>
                            <div class='bg-data-item' >
                                <div class='bg-data-label' >
                                    <div>CGM有效记录的时间占比：</div>
                                    <div class='bg-data-tip' >目标值>70%才可得到有效数据分析</div>
                                </div>
                                <div :class='[bgInfo.effective>70?"":"active","bg-data-val"]' >{{bgInfo.effective}}%</div>
                            </div>
                            <div class='bg-data-item' v-if='unit=="mg/dL"'>
                                <div class='bg-data-label' >
                                    <div>MG平均葡萄糖值：</div>
                                    <div class='bg-data-tip' >目标值＜118 mg/dL</div>
                                </div>
                                <div class='bg-data-val' >{{bgInfo.mean}}mg/dL</div>
                            </div>
                            <div class='bg-data-item' v-else>
                                <div class='bg-data-label' >
                                    <div>MG平均葡萄糖值：</div>
                                    <div class='bg-data-tip' >目标值＜6.6mmol/L</div>
                                </div>
                                <div class='bg-data-val' >{{bgInfo.mean}}mmol/L</div>
                            </div>
                            <div class='bg-data-item' >
                                <div class='bg-data-label' >
                                    <div>GMI葡萄糖管理指标：</div>
                                    <div class='bg-data-tip' >目标值＜7%</div>
                                </div>
                                <div class='bg-data-val'  >{{bgInfo.allData.length>=14400?bgInfo.GMI+'%':'无足够数据'}}</div>
                            </div>
                            <div class='bg-data-item' >
                                <div class='bg-data-label' >
                                    <div>CV变异系数：</div>
                                    <div class='bg-data-tip' >目标值＜33%</div>
                                </div>
                                <div class='bg-data-val' >{{bgInfo.CV}}%</div>
                            </div>
                        </el-col>
                        <el-col :span="12" class='agp-cont-main agp-cont-main1'>
                            <div class='cgm-cont-title'>  <span class='title-border' ></span>葡萄糖目标范围内时间</div>
                            <div class='cgm-agp-info-box'>
                                <div class='cgm-agp-info'>葡萄糖目标范围内占比越高，代表血糖控制的越好。</div>
                                <img src="~@/assets/image/reason-icon.png" alt="" class='reason-icon'  v-popover:tirPopover @click='openPopover("tir")' >
                            </div>
                            <TIR :dataList='tir'/>
                            <!-- <TIPCOPY/> -->
                        </el-col>
                    </el-row>
                    <div class='agp-cont-main' >
                        <div class='cgm-cont-title'><span class='title-border' ></span>AGP图谱</div>
                        <div class='cgm-agp-info-box'>
                            <div class='cgm-agp-info'>中位数葡萄糖曲位于目标范围内，且越平坦，表示血糖稳定性越好。25%-75%区间（图中深蓝色区域）与5%-95%区间（图中浅蓝色区域）均显示日间血糖波动情况，区间越宽提示相应时间段血糖波动越大。其中影响 25%-75%区间的因素主要是是生理状态(如胰岛素抵抗等)和药物治疗等。影响5%-95%区间的因素主要是饮食，运动等。</div>
                            <img src="~@/assets/image/reason-icon.png" alt="" class='reason-icon'  v-popover:agpPopover @click='openPopover("agp")'>
                        </div>
                        <AGP  :dataList='agpList' :height='370'/>
                    </div>
                <div class='agp-cont-main' >
                        <div class='cgm-cont-title'><span class='title-border' ></span>每日血糖曲线</div>
                        <div class='cgm-agp-info-box'>
                            <div class='cgm-agp-info'>每日血糖展示了14天中每天的血糖变化情况。</div>
                            <img src="~@/assets/image/reason-icon.png" alt="" class='reason-icon' v-popover:dayPopover @click='openPopover("day")'>
                        </div>
                        <DayChart :dataList='agpdayList'/>
                </div>
                </div>
            </div>

        </div>
        <!-- 解释弹窗 -->
        <el-popover
            ref="tirPopover"
            placement="top"
            width="550"
            v-model='tirVisible'
            trigger="manual">
            <div class='slot-popover' >
                <div class='slot-popover-title' >数据分析</div>
                <div class='slot-popover-cont'>内容暂定</div>
                <div class='slot-popover-btn'>
                     <el-button type="primary" @click='tirVisible=false' >我知道了</el-button>
                </div>
            </div>
        </el-popover>
        <el-popover
            ref="agpPopover"
            placement="top"
            width="550"
            v-model='agpVisible'
            trigger="manual">
            <div class='slot-popover' >
                <div class='slot-popover-title' >AGP图谱</div>
                <div class='slot-popover-cont'>
                    1、AGP图谱又称动态葡萄糖图谱，是以1个标准日(24h)的形式将多天的血糖监测数据叠加在相应时间点呈现，由5个平滑曲线表示血糖监测系统的数据，1个葡萄糖目标范围协助判断血糖是否达标。<br/>
                    2、中位数葡萄糖曲线反映了日内葡萄糖波动情况，曲线越平坦表示血糖稳定性越好。中位线葡萄糖曲线是否处于葡萄糖目标范围内，也进一步提示血糖控制达标情况。<br/>
                    3、由第 25和第75百分位数两条曲线组成25%-75%区间由第5和 95 百分位数两条曲线组成的5%-95%区间，均显示日间血糖波动情况，区间越宽提示相应时间段血糖波动越大，其中影响 25%-75%区间的因素主要是是生理状态(如胰岛素抵抗等)和药物治疗等。影响5%-95%区间的因素主要是饮食，运动等。<br/>
                </div>
                <div class='slot-popover-btn'>
                     <el-button type="primary" @click='agpVisible=false' >我知道了</el-button>
                </div>
            </div>
        </el-popover>
        <el-popover
            ref="dayPopover"
            placement="top"
            width="550"
            v-model='dayVisible'
            trigger="manual">
            <div class='slot-popover' >
                <div class='slot-popover-title' >每日血糖</div>
                <div class='slot-popover-cont'>
                    1、AGP图谱又称动态葡萄糖图谱，是以1个标准日(24h)的形式将多天的血糖监测数据叠加在相应时间点呈现，由5个平滑曲线表示血糖监测系统的数据，1个葡萄糖目标范围协助判断血糖是否达标。<br/>
                    2、中位数葡萄糖曲线反映了日内葡萄糖波动情况，曲线越平坦表示血糖稳定性越好。中位线葡萄糖曲线是否处于葡萄糖目标范围内，也进一步提示血糖控制达标情况。<br/>
                    3、由第 25和第75百分位数两条曲线组成25%-75%区间由第5和 95 百分位数两条曲线组成的5%-95%区间，均显示日间血糖波动情况，区间越宽提示相应时间段血糖波动越大，其中影响 25%-75%区间的因素主要是是生理状态(如胰岛素抵抗等)和药物治疗等。影响5%-95%区间的因素主要是饮食，运动等。<br/>
                </div>
                <div class='slot-popover-btn'>
                     <el-button type="primary" @click='dayVisible=false' >我知道了</el-button>
                </div>
            </div>
        </el-popover>
        <!-- 下载打印弹窗 -->
        <el-dialog
        :visible.sync="dialogVisible"
        :show-close="false"
        :title='dialogType=="print"?"打印报告":"下载报告"'
        width="1060"
        >
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
import {formatDate,formatTime} from '@/utils/formatTime'
import { AGPUtils } from "@/utils/algorithm/AGP";
import { TIRUtils } from "@/utils/algorithm/TIR";
import { GlucoseUtils } from "@/utils/algorithm/Glucose";
import TIR from '@/views/components/Chart/TIR'
import TIPCOPY from '@/views/components/Chart/TIR_COPY'
import AGP from '@/views/components/Chart/AGPchart'
import DayChart from '@/views/components/Chart/DayChart'
import Empty from '@/views/components/Empty/empty'
import mixin from "./mixin"
  import {mapGetters} from "vuex"
export default {
    data(){
        return{
            agpDates:'',
            tirVisible:false,
            agpVisible:false,
            dayVisible:false,
            info:{
                nickname:'',
                diabetes_type:'',
                age:'',
                diabetes_year:'',
                glucose_range_lower_limit:'',
                glucose_range_lupper_limit:'',
                device:[]
            },
            nowdate:'',
            agpdayList:[],//每日血糖
            tir:{},//tir
            agpList:{},//agp
            bgInfo:{},//血糖数据
        }
    },
    mixins: [mixin],
    components: {
        TIR,AGP,DayChart,Empty
    },
    created(){

    },
    mounted(){

    },
    methods:{
        // 打开解释弹窗
        openPopover(key){
            switch(key){
                case 'tir':
                    this.tirVisible = true
                    this.agpVisible = false
                    this.dayVisible = false
                    break;
                case 'agp':
                    this.tirVisible = false
                    this.dayVisible = false
                    this.agpVisible = true
                    break;
                case 'day':
                    this.dayVisible = true
                    this.tirVisible = false
                    this.agpVisible = false
                    break;
            }
        },
        // 自组件需要的数据
        handelTemplateDay(data){
            this.handelAgp(data)
            this.handelTir(data)
            this.handelDay(data)
            this.handelBg(data)
        },
        // agp图谱
        handelAgp(data){
            let datArray = _.cloneDeep(data)
            let newArr = []
            datArray.forEach((item,index)=>{
                if(index == index%1440){
                    newArr.push([datArray[index].Value])
                }else{
                    newArr[index%1440].push(datArray[index].Value)
                }
            })
            function momentAgp05(val){
                val = _.compact(val)
                return AGPUtils.calculateYValue(val)?AGPUtils.calculateYValue(val).p05:AGPUtils.calculateYValue(val)
            }
            function momentAgp25(val){
                val = _.compact(val)
                return AGPUtils.calculateYValue(val)?AGPUtils.calculateYValue(val).p25:AGPUtils.calculateYValue(val)
            }
            function momentAgp50(val){
                val = _.compact(val)
                return AGPUtils.calculateYValue(val)?AGPUtils.calculateYValue(val).p50:AGPUtils.calculateYValue(val)
            }
            function momentAgp75(val){
                val = _.compact(val)
                return AGPUtils.calculateYValue(val)?AGPUtils.calculateYValue(val).p75:AGPUtils.calculateYValue(val)
            }
            function momentAgp95(val){
                val = _.compact(val)
                return AGPUtils.calculateYValue(val)?AGPUtils.calculateYValue(val).p95:AGPUtils.calculateYValue(val)
            }
            let xData =  Array.from({length:60*24},(item, index) => index)
            let agp05 = _.map(newArr,momentAgp05)
            let agp25 = _.map(newArr,momentAgp25)
            let agp50 = _.map(newArr,momentAgp50)
            let agp75 = _.map(newArr,momentAgp75)
            let agp95 = _.map(newArr,momentAgp95)

            let params = {
                    xData:xData,
                    agp05:agp05,
                    agp25:agp25,
                    agp50:agp50,
                    agp75:agp75,
                    agp95:agp95
                }
            this.agpList = params
        },
        // tir
        handelTir(data){
            let tirTarget =  this.unit=='mmol/L'?[_.round(GlucoseUtils.mmolToMgdl(this.targetScope[0]),1),_.round(GlucoseUtils.mmolToMgdl(this.targetScope[1]),1)]:this.targetScope
            let datArrays = _.cloneDeep(data)
            let new_data = _.uniqBy(datArrays,'DataTs')
            let v_data = _.map(new_data,'Value')
            let result = TIRUtils.getTIRResult(_.compact(v_data),tirTarget[1],tirTarget[0])
            this.tir = result
        },
        // 每日血糖
        handelDay(data){
            let tirTarget =  this.unit=='mmol/L'?[_.round(GlucoseUtils.mmolToMgdl(this.targetScope[0]),1),_.round(GlucoseUtils.mmolToMgdl(this.targetScope[1]),1)]:this.targetScope
            let DdatArray = _.cloneDeep(data)
            let singleDay  = _.chunk(DdatArray,60*24) ;
            let max = _.maxBy(DdatArray,'Value').Value>400?400:_.maxBy(DdatArray,'Value').Value
            let dayList = new Array()
            singleDay.forEach(item=>{
                let value = _.map(item, 'Value');
                let handelValue = _.compact(value)
                dayList.push({
                    day: formatDate(item[0].DataTs*1000,'mm.dd'),
                    week: formatDate(item[0].DataTs*1000,'WW'),
                    value:value,
                    max:max,
                    tir:TIRUtils.getTIRResult(_.compact(value),tirTarget[1],tirTarget[0])?(Number(TIRUtils.getTIRResult(_.compact(value),tirTarget[1],tirTarget[0]).normalRate)*100).toFixed(1):''
                })
            })

            this.agpdayList =  dayList
        },
        // 血糖数据
        handelBg(data){
            let BdatArray = _.cloneDeep(data)
            let originList = _.compact(_.map(BdatArray,'Value'))
            let bgInfo = GlucoseUtils.calculateMeanCvGmi(_.compact(_.map(BdatArray,'Value')))
            bgInfo.mean = Math.round(bgInfo.mean)
            let unit = this.unit
            if(unit=='mmol/L'){
                bgInfo.mean = GlucoseUtils.mgdlToMmol(bgInfo.mean)
            }
            let filteredArray = BdatArray.filter(item => item.Value >= 40 && item.Value <= 400);
            bgInfo.effective = _.round((filteredArray.length/originList.length)*100,1)
            bgInfo.wearsDay = Math.ceil(Number(_.compact(BdatArray).length)/1440)
            console.log(filteredArray.length,_.compact(BdatArray).length)
            bgInfo.allData = filteredArray
            this.bgInfo = bgInfo
        }
    }
}
</script>
<style scoped>
    @media print {
        #overviewpage {
            background-color: white !important;
        }
    }
    .agp{
        width:100%;
        height:100%;
    }
    .agp-cont-main1{
        height:450px;
        position: relative;
    }
    .agp-cont-main1:nth-child(1){
         margin-right:20px;
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
        font-size:18px;
        width:45%;
    }
     .report-base-user-item1{
        font-size:18px;
        flex-grow: 2;
         width:45%;
    }
     .report-base-user-item2{
        font-size:18px;
        width:20%;
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
      .report-data-sources{
        width:100%;
        height:52px;
        padding-left:20px;
        padding-right:60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
 
    /* 标准 */
    .bg-data-item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin:0;
        height:74px;
        border-bottom:1px solid var(--color-black-10);
    }
    .bg-data-item:last-child{
        border: none;
    }
    .bg-data-label{
        font-size:var(--fontSize-max);
        color:var(--color-black-100);
    }
    .bg-data-tip{
        font-size:var(--fontSize-big);
        color:var(--color-black-60);
    }
    .bg-data-val{
        font-size:24px;
        color:var(--color-black-100);
        font-weight: 440;
        font-family:MiLan-Medium;
    }
    .bg-data-val.active{
        color:var(--color-error);
    }
</style>
