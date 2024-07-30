<template>
    <div class='overview' >
        <div class='overview-top' >
            <div class='report-title' >{{$t('message.route.'+$route.meta.title)}}</div>
            <div class='overview-fr' >
                <el-popover
                v-model="visible"
                placement="bottom"
                width="1160"
                trigger="manual">
                    <DeviceInfo @closePopover='closePopover' />
                    <div class='device' slot="reference" @click='visible = true' >设备信息</div>
                </el-popover>
                <el-button type="primary">
                    <img src="~@/assets/image/btn-upload.png" alt="" class='btn-upload' >
                    上传数据
                </el-button>
            </div>
        </div>
        <div class='date-view'>
            <div class='date-picker'>
                <img src="~@/assets/image/date-calendar.png" alt="" class='picker-icon' >
                <div>筛选月份</div>
            </div>
            <div :class='[monthToggle?"active":"","month-view"]' >
                <div :class='[item.checked?"active":"","month-item"]' v-for='(item,index) in month' :key='index' @click="selectMonth(index)">{{item.date}}</div>
            </div>
            <div class='more-icon-box' @click='monthToggle=!monthToggle' >
                <img src="~@/assets/image/more-icon.png" alt="" :class='[monthToggle?"active":"","more-icon"]' v-if='month.length>11' >
            </div>
        </div>
        <div class='overview-main' >
            <div class='overview-item' >
                <div class='overview-info' >
                    <div class='overview-date' >2024年3月11日 - 2024年3月14日（14天）</div>
                    <div class='overview-tip' >
                        <div class='overview-mac' >传感器序列号：CGM123456</div>
                        <div class='overview-sync'>同步时间：2024年3月14日</div>
                    </div>
                    <div class='overview-bg-date' >
                        <div class='overview-bg-item' >
                            <div class='overview-bg-value active' >90.0<span class='overview-limit' >%</span>  </div>
                            <div class='overview-bg-tips'>葡萄糖范围内时间TIR</div>
                        </div>
                        <div class='overview-bg-item' >
                            <div class='overview-bg-value' >8.0<span class='overview-limit' >mmol/L</span></div>
                            <div class='overview-bg-tips'>平均葡萄糖值</div>
                        </div>
                        <div class='overview-bg-item' >
                            <div class='overview-bg-value' >7.5<span class='overview-limit' >%</span></div>
                            <div class='overview-bg-tips'>GMI</div>
                        </div>
                        <div class='overview-bg-item' >
                            <div class='overview-bg-value' >90.0<span class='overview-limit' >%</span></div>
                            <div class='overview-bg-tips'>变异系数</div>
                        </div>
                    </div>
                </div>
                <div class='overview-agp' >
                    <div class='overview-agp-more' >
                        查看完整AGP报告
                        <img src="~@/assets/image/right-arrow.png" alt="" class='right-arrow' >
                    </div>
                   <!-- <div class='overview-agp-empty' >无足够数据</div> -->
                    <div class='overview-agp-agp' > 
                        <AGPview :agpDate='agpDates' :dataList='list'/>
                    </div>
                </div>
            </div>
            <div class='overview-item' >
                <div class='overview-info' >
                    <div class='overview-date' >2024年3月11日 - 2024年3月14日（14天）</div>
                    <div class='overview-tip' >
                        <div class='overview-mac' >传感器序列号：CGM123456</div>
                        <div class='overview-sync'>同步时间：2024年3月14日</div>
                    </div>
                    <div class='overview-bg-date' >
                        <div class='overview-bg-item' >
                            <div class='overview-bg-value active' >90.0<span class='overview-limit' >%</span>  </div>
                            <div class='overview-bg-tips'>葡萄糖范围内时间TIR</div>
                        </div>
                        <div class='overview-bg-item' >
                            <div class='overview-bg-value' >8.0<span class='overview-limit' >mmol/L</span></div>
                            <div class='overview-bg-tips'>平均葡萄糖值</div>
                        </div>
                        <div class='overview-bg-item' >
                            <div class='overview-bg-value' >7.5<span class='overview-limit' >%</span></div>
                            <div class='overview-bg-tips'>GMI</div>
                        </div>
                        <div class='overview-bg-item' >
                            <div class='overview-bg-value' >90.0<span class='overview-limit' >%</span></div>
                            <div class='overview-bg-tips'>变异系数</div>
                        </div>
                    </div>
                </div>
                <div class='overview-agp' >
                    <div class='overview-agp-more' >
                        查看完整AGP报告
                        <img src="~@/assets/image/right-arrow.png" alt="" class='right-arrow' >
                    </div>
                   <div class='overview-agp-empty' >无足够数据</div>
                    <div class='overview-agp-agp' > 
                        <!-- <AGP/> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import AGPview from '@/views/components/Chart/AGPview'
import DeviceInfo from '@/views/report/deviceInfo'
import {formatDate,formatTime} from '@/utils/formatTime'
export default {
    data(){
        return{
            visible:false,
            month:[],
            monthToggle:false,
            agpDates:'',  //agp日期
            list:[], //agp数据
        }
    },
    created(){
        let data = [{
                date:'2024年3月'
            },{
                date:'2024年4月'
            },{
                date:'2024年5月'
            },{
                date:'2024年6月'
            },{
                date:'2024年1月'
            },{
                date:'2024年2月'
            },{
                date:'2024年7月'
            },{
                date:'2024年8月'
            },{
                date:'2024年1月'
            },{
                date:'2024年2月'
            },{
                date:'2024年7月'
            },{
                date:'2024年8月'
            }]
        data.forEach(item=>{
            item.checked = false
        })
        this.month = data
    },
    mounted(){
        const end = new Date('2024-05-28 23:59:00');
        const start = new Date('2024-05-21 00:00:00');
        let agpDate = [formatDate(start,"YYYY-mm-dd"), formatDate(end,"YYYY-mm-dd")] 
        this.agpDates = agpDate.join('/')
    },
    components: {
        AGPview,DeviceInfo
    },
    methods:{
        closePopover(){
            this.visible = false
        },
        // 选择月份
        selectMonth(index){
            let month = this.month
            month[index].checked = !month[index].checked
        }
    }
}
</script>
<style scoped>
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
        font-size:var(--fontSize-big);
        color:var(--color-primary);
        text-decoration: underline;
        text-decoration-color:var(--color-primary) ;
        margin-right:40px;
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
        width:106px;
        height:50px;
        border:1px solid rgba(0,0,0,0.05);
        border-radius:10px;
        background:#fff;
        text-align: center;
        line-height: 50px;
        color:var(--colo-black-100);
        font-size:var(--fontSize-big);
        margin-left:13px;
        margin-bottom:10px;
        cursor: pointer;
    }
    .month-item.active{
         border:1px solid var(--color-primary);
         color:var(--color-primary);
         background:#E9FBFB;
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
    }
    .overview-date{
        font-size:var(--fontSize-max);
        color:var(--color-black-100);
        font-weight: 700;
        margin-bottom:10px;
    }
    .overview-tip{
        display: flex;
        align-items: center;
        color:var(--color-black-40);
        font-size:var(--fontSize-big);
        margin-bottom:60px;
    }
    .overview-mac{
        margin-right:80px;
    }
    .overview-bg-date{
        display: flex;
        align-items: center;
    }
    .overview-bg-item{
        margin-right:60px;
        width:153px;

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
        font-size:var(--fontSize-big);
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
        font-size:var(--fontSize-max);
        color:var(--color-primary);
        margin-bottom:10px;
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
        width:320px;
        height:180px;
        background:rgba(50, 186, 192, 0.1);
        text-align: center;
        line-height: 180px;
        color:var(--color-black-40);
        font-size:var(--fontSize-smax);
    }
</style>