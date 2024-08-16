<template>
    <div>
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
                 <div class='report-agp-date-box'  @click='pickerFocus'>
                    <img src="~@/assets/image/date-calendar.png" alt="" class='agp-icon' >
                    <div class='agp-date' >{{agpDate[0]}} — {{agpDate[1]}}（{{dayDate}}天）</div>
                    <img src="~@/assets/image/select-icon.png" alt="" class='select-icon' >
                </div>
                <el-date-picker
                    class='agp-picker'
                    ref='datePicker'
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
                    :append-to-body='false'
                    :picker-options="pickerOptions">
                </el-date-picker>
        </div>
        <!-- 图表 -->
        <div class='main-box'>
            <Progress :percentage='downProgress' v-if='progressShow' />
            <div class='agp-main-box' :style='{"opacity":progressShow?0:1}'  >
                <Empty v-show='empty' style='height:600px;' />
                <div class='week-bg-main'  v-show="!empty" v-for='(item,index) in list' :key='index'>
                    <div  class='week-bg-title' >
                        <div class='week-bg-date' >{{item.day[0]}} - {{item.day[item.day.length-1]}}</div>
                        <img src="~@/assets/image/reason-icon.png" alt="" class='reason-icon'>
                    </div>
                    <Empty v-show='!item.info' style="height:500px;"/>
                    <WeekAnalysis :dataList='item' v-show='item.info' />
                </div>
            </div>
        </div>
         <!-- 下载打印弹窗 -->
        <el-dialog  :visible.sync="dialogVisible"  :show-close="false" :title='dialogType=="print"?"打印报告":"下载报告"'
         width="1060" >
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
import Empty from '@/views/components/Empty/empty'
import WeekAnalysis from '@/views/report/components/weekAnalysis'
import {formatDate,formatTime} from '@/utils/formatTime'
import { TIRUtils } from "@/utils/algorithm/TIR";
import { GlucoseUtils } from "@/utils/algorithm/Glucose";
import mixin from "./mixin"
export default {
    data(){
        return{
            list:[]
        }
    },
    mixins: [mixin],
    components: {
        WeekAnalysis,Empty
    },
    mounted(){
    },
    methods:{
        // 分割成7天血糖
        handelTemplateDay(data){
            let datArray = _.reverse(_.cloneDeep(data))
            let splitNum = this.dayDate<7?this.dayDate*24*60:7*24*60
            let weekData =  _.chunk(datArray,splitNum) ;
            let max = _.maxBy(datArray,'Value').Value>540?540:_.maxBy(datArray,'Value').Value
            let tirTarget =  this.unit=='mmol/L'?[_.round(GlucoseUtils.mmolToMgdl(this.targetScope[0]),1),_.round(GlucoseUtils.mmolToMgdl(this.targetScope[1]),1)]:this.targetScope
            let weekList = new Array()
            function handelDay(n){
                return formatDate(n.DataTs*1000,'mm月dd日')
            }
            
            weekData.forEach(item=>{
                let value = _.map(item, 'Value');
                let originValue = _.map(item, 'value');
                let values = _.flatten(value)
                let handelValue = _.compact(values)
                let DataTs= _.map(item, handelDay);
                weekList.push({
                    day: _.uniq(DataTs),
                    week: formatDate(item[0].DataTs*1000,'WW'),
                    value: _.chunk(originValue,60*24),
                    max:max,
                    tir:TIRUtils.getTIRResult(handelValue,tirTarget[1],tirTarget[0])?(Number(TIRUtils.getTIRResult(handelValue,tirTarget[1],tirTarget[0]).normalRate)*100).toFixed(1):'',
                    info:GlucoseUtils.calculateMeanCvGmi(handelValue)
                })
            })
            this.list  = weekList
            this.progressShow = false
        },
        // 合并7天血糖
        addWeek(data){
            let list = _.reverse(_.clone(data))
            let newList = _.chunk(list,7)
            let newArr = []
            function handelDay(n){
                return formatDate(n.day,'mm月dd日')
            }
            newList.forEach(item=>{
                let value = _.map(item,'value')
                let values = _.flatten(value)
                let handelValue = _.compact(values)
                let max = _.max(handelValue)>540?540:_.max(handelValue)
                newArr.push({
                    day:_.map(item,handelDay),
                    value:value,
                    max:max,
                    tir:TIRUtils.getTIRResult(handelValue)?(Number(TIRUtils.getTIRResult(handelValue).normalRate)*100).toFixed(1):'',
                    info:GlucoseUtils.calculateMeanCvGmi(handelValue)
                })
            })
            // this.list = newArr
        }
    }
}
</script>
<style scoped>
.week-bg-main{
    width:100%;
    height:605px;
    background:#fff;
    margin-bottom:20px;
    border-radius:10px;
    padding:20px;
    box-sizing: border-box;
}
.week-bg-title{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom:20px;
}
.week-bg-date{
    font-size:var(--fontSize-max);
    color:var(--color-black-100);
    font-weight: 700;
}
.reason-icon{
    width:24px;
    height:24px;
}
</style>