<template>
    <div class='agp' v-loading='loading'>
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
                 <div class='report-data-sources'>
                    <div class='report-base-user-item' >
                        <div class='report-base-user-value'>1234567</div>
                    </div>  
                    <div class='report-base-user-item1' >
                        <div class='report-base-user-value'>iPhone13</div>
                    </div>  
                    <div class='report-base-user-item2' >
                        <div class='report-base-user-value'>2023-09-17</div>
                    </div>  
                </div>
            </div>
            <div class='agp-cont' id='overviewpage'>
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
                            <div class='bg-data-val' >2023-10-30</div>
                        </div>
                        <div class='bg-data-item' >
                            <div class='bg-data-label' >
                                <div>CGM有效记录的时间占比：</div>
                                <div class='bg-data-tip' >目标值>70%才可得到有效数据分析</div>
                            </div>
                            <div class='bg-data-val' >2023-10-30</div>
                        </div>
                        <div class='bg-data-item' >
                             <div class='bg-data-label' >
                                <div>MG平均葡萄糖值：</div>
                                <div class='bg-data-tip' >将通过系统通知提醒您</div>
                            </div>
                            <div class='bg-data-val' >2023-10-30</div>
                        </div>
                        <div class='bg-data-item' >
                            <div class='bg-data-label' >
                                <div>GMI葡萄糖管理指标：</div>
                                <div class='bg-data-tip' >目标值＜7%</div>
                            </div>
                            <div class='bg-data-val' >2023-10-30</div>
                        </div>
                        <div class='bg-data-item' >
                             <div class='bg-data-label' >
                                <div>CV变异系数：</div>
                                <div class='bg-data-tip' >目标值＜33%</div>
                            </div>
                            <div class='bg-data-val' >2023-10-30</div>
                        </div>
                    </el-col>
                    <el-col :span="12" class='agp-cont-main agp-cont-main1'>
                        <div class='cgm-cont-title'>  <span class='title-border' ></span>葡萄糖目标范围内时间</div>
                        <div class='cgm-agp-info-box'>
                            <div class='cgm-agp-info'>葡萄糖目标范围内占比越高，代表血糖控制的越好。</div>
                            <img src="~@/assets/image/reason-icon.png" alt="" class='reason-icon'  v-popover:tirPopover @click='openPopover("tir")' >
                        </div>
                        <TIR :agpDate='agpDates' :dataList='list'/>
                        <!-- <TIPCOPY/> -->
                    </el-col>
                </el-row>
                <div class='agp-cont-main' >
                    <div class='cgm-cont-title'><span class='title-border' ></span>AGP图谱</div>
                    <div class='cgm-agp-info-box'>
                        <div class='cgm-agp-info'>中位数葡萄糖曲位于目标范围内，且越平坦，表示血糖稳定性越好。25%-75%区间（图中深蓝色区域）与5%-95%区间（图中浅蓝色区域）均显示日间血糖波动情况，区间越宽提示相应时间段血糖波动越大。其中影响 25%-75%区间的因素主要是是生理状态(如胰岛素抵抗等)和药物治疗等。影响5%-95%区间的因素主要是饮食，运动等。</div>
                        <img src="~@/assets/image/reason-icon.png" alt="" class='reason-icon'  v-popover:agpPopover @click='openPopover("agp")'>
                    </div>
                    <!-- <AGP /> -->
                    <AGP  :agpDate='agpDates' :dataList='list' source='agp' :height='370'/>
                   
               </div>
               <div class='agp-cont-main' >
                    <div class='cgm-cont-title'><span class='title-border' ></span>每日血糖曲线</div>
                    <div class='cgm-agp-info-box'>
                        <div class='cgm-agp-info'>每日血糖展示了14天中每天的血糖变化情况。</div>
                        <img src="~@/assets/image/reason-icon.png" alt="" class='reason-icon' v-popover:dayPopover @click='openPopover("day")'>
                    </div>
                    <DayChart :agpDate='agpDates' :dataList='list'/>
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
import TIR from '@/views/components/Chart/TIR'
import TIPCOPY from '@/views/components/Chart/TIR_COPY'
import AGP from '@/views/components/Chart/AGPchart'
import DayChart from '@/views/components/Chart/DayChart'
import {mapGetters} from "vuex"
import {getAgpData} from '@/api/dataApi'
import { liveQuery } from "dexie";
import PdfLoader from "@/utils/export/html2pdf";
export default {
    data(){
        return{
            agpDate:['2024-05-01','2024-05-08'],
            agpDates:'',
            empty:false,
            list:[],
            loading:false,
            tirVisible:false,
            agpVisible:false,
            dayVisible:false,
            dialogVisible:false,
            checkAll:false,
            isIndeterminate: true,
            dialogType:'',
            downloadList:['AGP报告','每日分析','多日血糖分析','报告解读','饮食分析'],
            checkedDowns:[],
            info:{
                nickname:'',
                diabetes_type:'',
                age:'',
                diabetes_year:'',
                glucose_range_lower_limit:'',
                device_mac:'',
                phone_model:'',
                nowdate:''
            },
            nowdate:'',
            pickerOptions: {
                shortcuts: [{
                    text: '最近7天',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                },{
                    text: '最近14天',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近30天',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近90天',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
                },
        }
    },
    components: {
        TIR,AGP,DayChart
    },
    computed:{
        ...mapGetters([
            'unit']),
    },
    created(){

    },
    mounted(){
        const end = new Date('2024-05-24 23:59:00');
        const start = new Date('2024-05-21 00:00:00');
        this.agpDate = [formatDate(start,"YYYY-mm-dd"), formatDate(end,"YYYY-mm-dd")] 
        if( _.indexOf(this.$store.state.report.chooseDateList,this.agpDate.join('/'))==-1){
            this.getData()
        }else{
            // console.log(this.$store.state.report.day[this.agpDate.join('/')])
            // this.list = this.$store.state.report.day[this.agpDate.join('/')]
            this.agpDates = this.agpDate.join('/')
        }

    },
    methods:{
        upload(){
            this.$router.push('/upLoad')
        },
        // 从云拉取数据
        getData(){
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
                                    this.empty = false
                                    this.list = [this.agpDate.join('/'),arrayData]
                                    this.$store.dispatch('setChooseDateList',this.agpDate.join('/'))
                                    
                                }else{
                                    this.empty = true
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
        // 选择时间
        changeDate(e){
            if( _.indexOf(this.$store.state.report.chooseDateList,this.agpDate.join('/'))==-1){
                this.getData()
            }else{
                this.agpDates = this.agpDate.join('/')
            }
        },
        // 选择下载。打印的内容
        handleCheckedCitiesChange(val){
            let checkedCount = val.length;
            this.checkAll = checkedCount === this.downloadList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.downloadList.length;
        },
        // 全选
        handleCheckAllChange(val){
            this.checkedDowns = val ? this.downloadList : [];
            this.isIndeterminate = false;
        },
        // 打印
        async print(){
            this.dialogVisible = true
            this.dialogType='print'
        },
        // 导出pdf
        handleExport() {
            this.dialogVisible = true
            this.dialogType='export'
            // console.log(formatTime(new Date()),'开始下载')   
            // let pdf = new PdfLoader(
            //    document.querySelector("#overviewpage"),
            //   "pdf"
            //   // "noSplitBox"
            // );
            // pdf.outPutPdfFn().then(response=>{
            //      console.log(formatTime(new Date()),'下载完成')   
            //     console.log(response)
            // });
        },
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
        font-size:var(--fontSize-big);
        color:var(--color-black-80);
    }
    .bg-data-tip{
        font-size:var(--fontSize-default);
        color:var(--color-black-40);
    }
    .bg-data-val{
        font-size:var(--fontSize-big);
        color:var(--color-black-80);
    }
</style>
