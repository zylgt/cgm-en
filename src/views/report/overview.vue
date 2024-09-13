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
                        <DeviceInfo @closePopover='closePopover' />
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
                    <div class='overview-date' >{{item.report_date}}</div>
                    <div class='overview-tip' >
                        <div class='overview-mac' > {{$t('message.sensorcode')}}：CGM123456</div>
                        <div class='overview-sync'> {{$t('message.synctime')}}：2024年3月14日</div>
                    </div>
                    <div class='overview-bg-date' >
                        <div class='overview-bg-item' >
                            <div class='overview-bg-value active' >{{item.tir?item.tir:'--'}}<span class='overview-limit' >%</span>  </div>
                            <div class='overview-bg-tips'>{{$t('message.tir')}}</div>
                        </div>
                        <div class='overview-bg-item' >
                            <div class='overview-bg-value' >{{item.avg_bg?item.avg_bg:'--'}}<span class='overview-limit' >mmol/L</span></div>
                            <div class='overview-bg-tips'>{{$t('message.mean')}}</div>
                        </div>
                        <div class='overview-bg-item' >
                            <div class='overview-bg-value' >{{item.gmi?item.gmi:''}} <span v-if='!item.gmi' class='noData' >无足够数据</span> <span class='overview-limit' >%</span></div>
                            <div class='overview-bg-tips'>{{$t('message.cmi')}}</div>
                        </div>
                        <div class='overview-bg-item' >
                            <div class='overview-bg-value' >{{item.cv?item.gmi:'--'}}<span class='overview-limit' >%</span></div>
                            <div class='overview-bg-tips'>{{$t('message.cv')}}</div>
                        </div>
                         <div class='overview-bg-item' >
                            <div class='overview-bg-value' >{{item.cv?item.gmi:'--'}}<span class='overview-limit' >%</span></div>
                            <div class='overview-bg-tips'>{{$t('message.sd')}}</div>
                        </div>
                    </div>
                </div>
                <div class='overview-agp' >
                    <div class='overview-agp-more' @click='agpTab'>
                       {{$t('message.reports.more')}}
                        <img src="~@/assets/image/right-arrow.png" alt="" class='right-arrow' >
                    </div>
                   <div class='overview-agp-empty' >无足够数据</div>
                    <!-- <div class='overview-agp-agp' > 
                        <AGPview :agpDate='agpDates' :dataList='list'/>
                    </div> -->
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
import {formatDate,formatTime} from '@/utils/formatTime'
import {getMonth,getRepoetList,getInfo,getYear,getReportList} from '@/api/dataApi'
import {getPreferences} from '@/api/setting'
import Pagination from '@/components/Pagination'
import Empty from '@/views/components/Empty/empty'
export default {
    data(){
        return{
            visible:false,
            year:[],
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
            pageLoading:true
        }
    },
    created(){
        this.getconfigs()
        this.getYearList()
        // let queryParams = {
        //     start_ts:'',
        //     end_ts:'',
        //     page:1,
        //     pagesize:2
        // }
        // this.getList({})
    },
    mounted(){
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
                    response.data.forEach((item)=>{
                        year.push({
                            checked:false,
                            date:item
                        })
                    })
                    
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
                    this.list = response.data
                    if(response.data.length<=0){
                        this.empty = true
                    }else{
                         this.empty = false
                    }
                    this.pageLoading = false
                    console.log(this.empty)
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
        agpTab(){
            this.$router.push('/report/AGP')
        },
        // 跳转上传数据页面
        upView(){
            this.$router.push('/upLoad')
        }
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