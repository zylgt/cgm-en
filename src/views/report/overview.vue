<template>
    <div class='overview' v-loading='pageLoading'>
        <div class='no-data' v-if='empty'>
            <div class='no-data-text' >No data, click "Upload Data" button to sync the data.</div>
             <el-button type="primary" @click='upView' >
                <img src="~@/assets/image/btn-upload.png" alt="" class='btn-upload' >
                {{$t('message.reports.upLoad')}}
            </el-button>
        </div>
         <div class='overview-main' v-else>
            <div class='overview-top' >
                <div class='report-title' >{{$t('message.route.'+$route.meta.title)}}</div>
                <div class='overview-fr' >
                    <el-popover
                    v-model="visible"
                    placement="bottom"
                    width="1160"
                    trigger="manual">
                        <!-- <DeviceInfo  :list='readerList' @closePopover='closePopover' /> -->
                        <div class='device' slot="reference" @click='visible = true' >{{$t('message.reports.deviceInfo')}}</div>
                    </el-popover>
                    <el-button type="primary" @click='upView'>
                        <img src="~@/assets/image/btn-upload.png" alt="" class='btn-upload' >
                        {{$t('message.reports.upLoad')}}
                    </el-button>
                </div>
            </div>
            <div class='date-view'>
                <div :class='[yearToggle?"active":"","month-view"]' >
                    <div :class='[item.checked?"active":"","month-item"]' v-for='(item,index) in year' :key='index' @click="selectYear(index)">{{item.date}}</div>
                </div>
                <div class='more-icon-box' @click='yearToggle=!yearToggle' >
                    <img src="~@/assets/image/more-icon.png" alt="" :class='[yearToggle?"active":"","more-icon"]' v-if='year.length>11' >
                </div>
            </div>
            <div class='overview-item'  v-for='(item) in list' :key='item.create_ts'>
                <div class='overview-compliance-border' ></div>
                <div class='overview-nocompliance-border' ></div>
                <div class='overview-info' >
                    <div class='overview-date' >{{item.start_en_ts}} —— {{item.end_en_ts}}</div>
                    <div class='overview-tip' >
                        <div class='overview-mac' > {{$t('message.sensorcode')}}：{{item.mac}}</div>
                        <div class='overview-sync'> {{$t('message.synctime')}}：2024年3月14日</div>
                    </div>
                    <div class='overview-bg-date' >
                        <div class='overview-bg-item' >
                            <div class='overview-bg-value active' >{{item.bgInfo.tir?item.bgInfo.tir:'--'}}<span class='overview-limit' >%</span>  </div>
                            <div class='overview-bg-tips'>{{$t('message.tir')}}</div>
                        </div>
                        <div class='overview-bg-item' >
                            <div class='overview-bg-value' >{{item.bgInfo.mean?item.bgInfo.mean:'--'}}<span class='overview-limit' >mg/dL</span></div>
                            <div class='overview-bg-tips'>{{$t('message.mean')}}</div>
                        </div>
                        <div class='overview-bg-item' >
                            <div class='overview-bg-value' >{{item.bgInfo.GMI?item.bgInfo.GMI:''}} <span v-if='!item.bgInfo.GMI' class='noData' >无足够数据</span> <span class='overview-limit' >%</span></div>
                            <div class='overview-bg-tips'>{{$t('message.cmi')}}</div>
                        </div>
                        <div class='overview-bg-item' >
                            <div class='overview-bg-value' >{{item.bgInfo.CV?item.bgInfo.CV:'--'}}<span class='overview-limit' >%</span></div>
                            <div class='overview-bg-tips'>{{$t('message.cv')}}</div>
                        </div>
                         <div class='overview-bg-item' >
                            <div class='overview-bg-value' >{{item.bgInfo.SDBG?item.bgInfo.SDBG:'--'}}<span class='overview-limit' >%</span></div>
                            <div class='overview-bg-tips'>{{$t('message.sd')}}</div>
                        </div>
                    </div>
                </div>
                <div class='overview-agp' >
                    <div class='overview-agp-more' @click='agpTab(item.start_ts,item.end_ts)'>
                       {{$t('message.reports.more')}}
                        <img src="~@/assets/image/right-arrow.png" alt="" class='right-arrow' >
                    </div>
                   <div class='overview-agp-empty' v-if='item.datas.length<1440*5'>无足够数据</div>
                    <div class='overview-agp-agp' v-else> 
                        <AGPview :dataList='item.agp'/>
                    </div>
                </div>
            </div>
        </div>
         <!-- 分页 -->
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.page_size" @pagination="getList" />
    </div>
</template>
<script>
import AGPview from '@/views/components/Chart/AGPview'
import DeviceInfo from '@/views/report/deviceInfo'
import {formatDate,formatTime,formatEn} from '@/utils/formatTime'
import {getMonth,getRepoetList,getInfo,getYear,getReportList,getReader} from '@/api/dataApi'
import {getPreferences} from '@/api/setting'
import Pagination from '@/components/Pagination'
import Empty from '@/views/components/Empty/empty'
import { AGPUtils } from "@/utils/algorithm/AGP";
import { TIRUtils } from "@/utils/algorithm/TIR";
import { GlucoseUtils } from "@/utils/algorithm/Glucose";
import Cookies from 'js-cookie'
import {mapGetters} from "vuex"
export default {
    data(){
        return{
            visible:false,
            year:[],
            readerList:[],
            yearToggle:false,
            agpDates:'',  //agp日期
            list:[], //agp数据
            total:0,
            queryParams:{
                start_ts:'',
                end_ts:'',
                page:1,
                pagesize:2
            },
            empty:false,
            pageLoading:true,
        }
    },
    created(){
        this.getconfigs()
        this.getYearList()
        this.getReaderList()
    },
    mounted(){
    },
    computed:{
        ...mapGetters([
           'unit','targetScope']),
    },
    components: {
        AGPview,DeviceInfo,Pagination,Empty
    },
    methods:{
         // 获取个人偏好详情
        getconfigs(){
            getPreferences({}).then(response => {
                if(response.code == 1000){
                    // dispath目标范围和单位
                    this.$store.dispatch('setUnit',response.data.glucose_unit==0?'mmol/L':'mg/dL')
                    this.$store.dispatch('setTargetScope',[response.data.glucose_range_lower_limit,response.data.glucose_range_lupper_limit])
                }else{
                    this.$message({
                        type: 'error',
                        message: response.msg
                    });
                }
            }).catch((res) => {
            })
        },
        // 获取报告月份
        getYearList(){
            let year = []
            getYear({}).then(response => {
                if(response.code == 1000){
                    if(response.data.length>0){
                        response.data.forEach((item)=>{
                            year.push({
                                checked:false,
                                date:item
                            })
                        })
                        this.queryParams.start_ts = new Date(response.data[0]+'-01-01 12:00:00').getTime()/1000
                        this.queryParams.end_ts = new Date(response.data[0]+'-12-31 23:59:59').getTime()/1000
                        this.getList()
                    }
                    year[0].checked = true
                    this.year = year
                }else{
                    this.$message({
                        type: 'error',
                        message: response.msg
                    });
                }
            }).catch((res) => {
            })
        },
        // 分页获取报告列表
        getList(){
            getReportList(this.queryParams).then(response => {
                if(response.code == 1000){
                    if(response.data.length<=0){
                        this.empty = true
                    }else{
                        this.empty = false
                        response.data.forEach(item=>{
                            item.start_en_ts = formatEn(item.start_ts)
                            item.end_en_ts = formatEn(item.end_ts)
                            let handelInfo = this.handelTemplateDay(this.handleData(item.datas,item.start_ts,item.end_ts))
                            item.bgInfo = handelInfo.bgInfo
                            item.agp = handelInfo.agp
                        })
                    }
                    this.list = response.data
                    this.pageLoading = false
                }else{
                    this.$message({
                        type: 'error',
                        message: response.msg
                    });
                }
            }).catch((res) => {
            })
        },
        // 获取reader信息
        getReaderList(){
            getReader({}).then(response => {
                if(response.code == 1000){
                    this.readerList = response.data
                }else{
                    this.$message({
                        type: 'error',
                        message: response.msg
                    });
                }
            }).catch((res) => {
            })
        },
        closePopover(){
            this.visible = false
        },
        // 选择年份
        selectYear(index){
            let year = this.year
            year.forEach(item=>item.checked = false)
            year[index].checked = !year[index].checked
        },
        // 跳转agp图谱
        agpTab(s,e){
            Cookies.set('choose_e', s)
            Cookies.set('choose_s', e)
            this.$router.push('/report/AGP')
        },
        // 跳转上传数据页面
        upView(){
            this.$router.push('/upLoad')
        },
        processArray(arr, interval) {
            let result = [];

            for (let i = 0; i < arr.length - 1; i++) {
                result.push(arr[i]);

                let diff = arr[i + 1].DataTs - arr[i].DataTs;
                let addTs = arr[i].DataTs + interval;
                while (diff > interval) {
                result.push({DataTs: addTs, value: undefined});
                diff = arr[i + 1].DataTs - addTs;
                addTs += interval;
                }
            }
            result.push(arr[arr.length - 1]);

            return result;
        },

        filterArray  (data) {
            const result = [];

            const seenTimes = new Set();
            let levelLowInvalidMg = 20
            let levelHighInvalidMg = 800
            let levelTooLowMg = 40
            let levelTooHighMg = 400
            data.forEach(item => {
                const timeStr = formatDate(item.DataTs*1000,'YYYY-mm-dd HH:MM')

                if (!seenTimes.has(timeStr)) {
                seenTimes.add(timeStr);
                if (item.Value < levelLowInvalidMg || item.Value > levelHighInvalidMg) {
                    result.push({...item, value: undefined});
                } else if (item.Value < levelTooLowMg) {
                    result.push({
                    ...item,
                    value: levelTooLowMg,
                    });
                } else if (item.Value > levelTooHighMg) {
                    result.push({
                    ...item,
                    value: levelTooHighMg,
                    });
                } else {
                    result.push({
                    ...item,
                    value: item.Value,
                    });
                }
                }
            });
            // console.log(result)
            return result;
        },

        handleData (objects, s_ts, e_ts)  {
            let measuringInterval = 60
            objects = this.processArray(objects, measuringInterval);
            objects = this.filterArray(objects);
            let that = this
            let startTs = objects[0].DataTs;
            while (startTs - measuringInterval >= s_ts) {
                objects.unshift({
                DataTs: startTs - measuringInterval,
                value: undefined,
                Value:undefined
                });
                startTs = startTs - measuringInterval;
            }

            let endTs = objects[objects.length - 1].DataTs;
            while (endTs + measuringInterval < e_ts) {
                objects.push({
                DataTs: endTs + measuringInterval,
                value: undefined,
                Value:undefined
                });
                endTs = endTs + measuringInterval;
            }
            let storeKey = [formatDate(s_ts,'YYYY-mm-dd'),formatDate(e_ts,'YYYY-mm-dd')]
            this.$store.dispatch('setData',{key:storeKey.join('/'),value:objects}) //处理完数据存vuex
            return objects;
        },
         // 自组件需要的数据
        handelTemplateDay(data){
            return {
                bgInfo:this.handelBg(data),
                agp: this.handelAgp(data)
            }
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
            return params
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
            bgInfo.allData = filteredArray
            let tirTarget =  unit=='mmol/L'?[_.round(GlucoseUtils.mmolToMgdl(this.targetScope[0]),1),_.round(GlucoseUtils.mmolToMgdl(this.targetScope[1]),1)]:this.targetScope
            let new_data = _.uniqBy(BdatArray,'DataTs')
            let v_data = _.map(new_data,'Value')
            let result = TIRUtils.getTIRResult(_.compact(v_data),tirTarget[1],tirTarget[0])
            bgInfo.tir = this.handelTir(result).normalRate
            return bgInfo
        },
         // 计算总值为100
        handelTir(result){
            let veryHighRate = (result.veryHighRate * 100).toFixed(1);
            let highRate = (result.highRate * 100).toFixed(1);
            let normalRate = (result.normalRate * 100).toFixed(1);
            let lowRate = (result.lowRate * 100).toFixed(1);
            let veryLowRate = (result.veryLowRate * 100).toFixed(1);

            var rateObjs = [
                {origV: result.veryHighRate * 100, resultV: veryHighRate},
                {origV: result.highRate * 100, resultV: highRate},
                {origV: result.normalRate * 100, resultV: normalRate},
                {origV: result.lowRate * 100, resultV: lowRate},
                {origV: result.veryLowRate * 100, resultV: veryLowRate},
            ];

            // 求和
            let rateSumMax = 100;
            let rateSum = rateObjs.reduce(function (total, rateObj) {
                return total + parseFloat(rateObj.resultV);
            }, 0);
            if (rateSum !== rateSumMax) {
                const changeValue = 0.1;
                let changeCount = 0;
                if (rateSum > rateSumMax) {
                // >100，5入的需减
                const changeRateCount =
                    parseFloat((rateSum - rateSumMax).toFixed(1)) / changeValue;
                rateObjs.forEach((rateObj, i) => {
                    if (
                    rateObj.resultV > changeValue &&
                    rateObj.resultV > rateObj.origV &&
                    changeCount < changeRateCount
                    ) {
                    rateObjs[i] = {
                        origV: rateObj.origV,
                        resultV: (parseFloat(rateObj.resultV) - changeValue).toFixed(1),
                    };
                    changeCount++;
                    }
                });
                } else {
                // <100，4舍的需加
                const changeRateCount =
                    parseFloat((rateSumMax - rateSum).toFixed(1)) / changeValue;
                rateObjs.forEach((rateObj, i) => {
                    if (
                    rateObj.resultV < rateObj.origV &&
                    changeCount < changeRateCount
                    ) {
                    rateObjs[i] = {
                        origV: rateObj.origV,
                        resultV: (parseFloat(rateObj.resultV) + changeValue).toFixed(1),
                    };
                    changeCount++;
                    }
                });
                }
                veryHighRate = rateObjs[0].resultV;
                highRate = rateObjs[1].resultV;
                normalRate = rateObjs[2].resultV;
                lowRate = rateObjs[3].resultV;
                veryLowRate = rateObjs[4].resultV;
            }
            return {
                veryHighRate,
                highRate,
                normalRate,
                lowRate,
                veryLowRate
            }
        },
    }
}
</script>
<style scoped>
    [v-cloak] {
      display: none;
    }
    .no-data{
        width:100%;
        height:300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 4px;
    }
    .no-data-text{
        font-size: var(--fontSize-smax);
        color:var(--color-black-80);
        margin-bottom:30px;
    }
    .overview-top{
        display: flex;
        justify-content: space-between;
        margin-bottom:10px;
    }
    .overview-fr{
        display: flex;
        align-items: center;
    }
    .device{
        font-size:var(--fontSize-default);
        color:var(--color-primary);
        text-decoration: underline;
        text-decoration-color:var(--color-primary) ;
        margin-right:40px;
        cursor: pointer;
    }
    .btn-upload{
        display: inline-block;
        vertical-align: middle;
        margin-right:4px;
        width:20px;
        height:20px;
    }


.date-view{
        display: flex;
        /* align-items: baseline; */
        justify-content: space-between;
        margin-bottom:10px;
    }
    .date-picker{
        display: flex;
        align-items: center;
        height: 50px;
        font-size:var(--fontSize-big);
        color:var(--color-black-80);
        width:126px;
    }
    .picker-icon{
        width:24px;
        height:24px;
        margin-right:10px;
        display: block;
    }
    .more-icon-box{
        display: flex;
        align-items: center;
        height:50px;
        width:30px;
        justify-content:flex-end;
        cursor: pointer;
    }
    .more-icon{
        width:14px;
        height: 8px;
        display: block;
        transform: rotate(180deg);
    }
    .more-icon.active{
        transform: rotate(0deg);
    }
    .month-view{
        display: flex;
        flex-wrap: wrap;
        width:1400px;
        height:auto;
        overflow: hidden;
    }
    .month-view.active{
        height:60px;
    }
    .month-item{
        width:100px;
        height:48px;
        border-radius:10px;
        background:#fff;
        text-align: center;
        line-height: 50px;
        color:var(--colo-black-100);
        font-size:var(--fontSize-default);
        margin-right:20px;
        margin-bottom:10px;
        cursor: pointer;
    }
    .month-item.active{
         color:#fff;
         background:var(--color-primary);
    }

.overview-item{
        display: flex;
        justify-content: space-between;
        background: #fff;
        width: 100%;
        height:260px;
        border-radius:10px;
        box-shadow: 0px 2px 20px 0px #0000000D;
        padding:20px;
        box-sizing: border-box;
        margin-bottom:20px;
        position: relative;
    }
    .overview-info{
        margin-left:50px;
    }
    .overview-compliance-border{
        width:10px;
        height:260px;
        background: var(--color-primary);
        position: absolute;
        left:0;
        top:0;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
     .overview-nocompliance-border{
        width:10px;
        height:260px;
        background: var(--color-error);
        position: absolute;
        left:0;
        top:0;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    .overview-date{
        font-size:var(--fontSize-smax);
        color:var(--color-black-100);
        font-weight: 700;
        margin-bottom:10px;
    }
    .overview-tip{
        display: flex;
        align-items: center;
        color:var(--color-black-40);
        font-size:var(--fontSize-default);
        margin-bottom:60px;
    }
    .overview-mac{
        margin-right:80px;
    }
    .overview-bg-date{
        display: flex;
        align-items: center;
        justify-content:space-between;
        width:1000px;
    }
    .overview-bg-item{
        width:170px;

    }
    .overview-bg-value{
        font-size:40px;
        margin-bottom:10px;
    }
    .overview-bg-value.active{
        color:var(--color-error);
    }
    .overview-limit{
        font-size:var(--fontSize-smax);
    }
    .overview-bg-tips{
        color:var(--color-black-40);
        font-size:var(--fontSize-default);
    }
    .overview-agp{
        width:320px;
    }
    .overview-agp-more{
        width:100%;
        height:30px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size:var(--fontSize-smax);
        color:var(--color-primary);
        margin-bottom:10px;
        cursor: pointer;
    }
    .right-arrow{
        width:13px;
        height:20px;
        margin-left:3px;
    }
    .overview-agp-agp{
        width:320px;
        height:180px;
    }
    .overview-agp-empty{
        width:300px;
        height:180px;
        background:rgba(72, 160, 220, 0.1);
        text-align: center;
        line-height: 180px;
        color:var(--color-black-60);
        font-size:var(--fontSize-big);
    }
    .noData{
        font-size:var(--fontSize-max);
    }
</style>