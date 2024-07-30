import {formatDate,formatTime} from '@/utils/formatTime'
import {mapGetters} from "vuex"
import Progress from '@/views/report/components/Progress'
import {getAgpInfo,getEvent} from '@/api/dataApi'
var progressTimer = null //请求进度条定时器
export default{
    data(){
        return{
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
            },  //日期选择快速选项
            agpDate:['',''], //日期选中值
            dayDate:14,//天数
            checkAll:false, //下载打印全选
            isIndeterminate: true, //全选框配置
            downloadList:['AGP报告','每日分析','多日血糖分析','报告解读','饮食分析'], //下载，打印选项
            checkedDowns:[], //复选框选中项
            dialogVisible:false, //下载打印弹窗开关
            dialogType:"", // print 打印 download 下载
            empty:true,
            downProgress:0,
            progressShow:false
        }
    },
    components: {
        Progress
    },
    computed:{
        ...mapGetters([
           'unit','targetScope']),
    },
    mounted() {
        let end_ts = new Date()
        let start_ts = new Date().setDate(end_ts.getDate() - 13)
        this.chooseDay(new Date(start_ts),end_ts)
        this.agpDate = [formatDate(start_ts,"YYYY-mm-dd"), formatDate(end_ts,"YYYY-mm-dd")] 
        this.chooseGetData()
    },
    methods: {
         // 选择时间
        changeDate(e){
            this.chooseDay(new Date(e[0]), new Date(e[1]))
            this.chooseGetData()
        },
        // 选择天数
        chooseDay(date1,date2){
            let s_date = date1.setHours(0,0,0)/1000
            let e_date = date2.setHours(23,59,59)/1000
            let oneDay = 24 * 60 * 60 ; // 每天的毫秒数
            let diff = Math.abs(s_date - e_date); // 计算差值的绝对值
            this.dayDate  = Math.ceil(diff / oneDay)
        },
        // 判断从哪里拉取数据
        chooseGetData(){
            if( _.indexOf(this.$store.state.report.chooseDateList,this.agpDate.join('/'))==-1){
                this.getData()
                this.getEventList()
            }else{
                let result  = this.$store.state.report.data[this.agpDate.join('/')]
                let events  = this.$store.state.report.events[this.agpDate.join('/')]
                if(result.length>0){
                    this.empty = false
                }else{
                    this.empty = true
                }
                this.handelTemplateDay(result)
                this.handelEventDay(events)
                this.info =  this.$store.state.report.info[this.agpDate.join('/')]
            }
        },
        // 从云拉取数据
        getData(){
            let that = this
            this.progressShow = true
            this.downProgress = 0
            progressTimer = setInterval(function(){
               let downProgress = that.downProgress
               downProgress += 1
               if(downProgress>=90){
                    downProgress = 90
               }
               that.downProgress = downProgress
            },100)
            let s = new Date(this.agpDate[0])
            let e = new Date(this.agpDate[1])
            let start_ts = s.setHours(0,0,0)/1000
            let end_ts = e.setHours(23,59,59)/1000
            getAgpInfo({start_ts:start_ts,end_ts:end_ts}).then(response => {
                    clearInterval(progressTimer)
                    this.downProgress = 100
                    setTimeout(function(){that.progressShow = false},30)
                    if(response.code == 1000){
                        if(response.data.devices.length>0){
                            response.data.devices.forEach(item=>{
                                item.upDate = formatDate(item.update_ts*1000,"YYYY年mm月dd日")
                            })
                        }
                        let params = {
                            nickname:response.data.nickname,
                            diabetes_type:response.data.diabetes_type,
                            age:response.data.age,
                            diabetes_year:response.data.diabetes_year,
                            glucose_range_lower_limit:response.data.glucose_range_lower_limit,
                            glucose_range_lupper_limit:response.data.glucose_range_lupper_limit,
                            device:response.data.devices
                        }
                        this.$store.dispatch('setInfo',{key:this.agpDate.join('/'),value:params}) //处理完数据存vuex
                        this.$store.dispatch('setTargetScope',[response.data.glucose_range_lower_limit,response.data.glucose_range_lupper_limit])
                        this.$store.dispatch('setUnit',response.data.glucose_unit==0?'mmol/L':'mg/dL')
                        this.info = params

                        let arrayData = response.data.datas
                       
                        if(arrayData.length>0){
                            console.log(formatTime(new Date()),'得到数据')   
                            this.empty = false
                            this.handelTemplateDay(this.handleData(arrayData,start_ts,end_ts))
                            this.$store.dispatch('setChooseDateList',this.agpDate.join('/'))
                        }else{
                            this.empty = true
                        }

                    }else{
                        this.$message({
                            type: 'error',
                            message: response.msg
                        });
                    }
            }).catch((res) => {
                clearInterval(progressTimer)
                that.downProgress = 100
                this.progressShow = false
                console.log(res)
            })
        },
        // 云拉取事件
        getEventList(){
            let s = new Date(this.agpDate[0])
            let e = new Date(this.agpDate[1])
            let start_ts = s.setHours(0,0,0)/1000
            let end_ts = e.setHours(23,59,59)/1000
            getEvent({event_type:-1,start_ts:start_ts,end_ts:end_ts}).then(response => {
                if(response.code == 1000){
                    this.$store.dispatch('setEvents',{key:this.agpDate.join('/'),value:response.data}) //处理完数据存vuex
                    this.handelEventDay(response.data)

                }else{
                    this.$message({
                        type: 'error',
                        message: response.msg
                    });
                }
            }).catch((res) => {
            })
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
                if (item.value > levelLowInvalidMg || item.value < levelHighInvalidMg) {
                    result.push({...item, value: undefined});
                } else if (item.value < levelTooLowMg) {
                    result.push({
                    ...item,
                    value: levelTooLowMg,
                    });
                } else if (item.value > levelTooHighMg) {
                    result.push({
                    ...item,
                    value: levelTooHighMg,
                    });
                } else {
                    result.push(item);
                }
                }
            });

            return result;
        },

        handleData (objects, s_ts, e_ts)  {
            let measuringInterval = 60
            objects = this.processArray(objects, measuringInterval);
            objects = this.filterArray(objects);

            let startTs = objects[0].DataTs;
            while (startTs - measuringInterval >= s_ts) {
                objects.unshift({
                DataTs: startTs - measuringInterval,
                value: undefined,
                });
                startTs = startTs - measuringInterval;
            }

            let endTs = objects[objects.length - 1].DataTs;
            while (endTs + measuringInterval < e_ts) {
                objects.push({
                DataTs: endTs + measuringInterval,
                value: undefined,
                });
                endTs = endTs + measuringInterval;
            }
            this.$store.dispatch('setData',{key:this.agpDate.join('/'),value:objects}) //处理完数据存vuex
            return objects;
        },
         // 全部事件分割为每天事件
        handelEventDay(datas){
            let data = _.clone(datas)
            // let data = _.concat(_.clone(datas),_.clone(datas))
            let unit = this.unit
            let eventList ={};
            let sameList = {}
            let repeatNum = 1
            data.forEach(item=>{
                let key = formatDate(item.event_ts*1000,'YYYY-mm-dd')
                let zeroTs = new Date(key).setHours(0,0,0)/1000
                item.xIndex = (item.event_ts-zeroTs)/60
                if(sameList[item.event_ts]){
                    repeatNum++
                    sameList[item.event_ts].push(item)
                }else{
                    repeatNum = 1
                    sameList[item.event_ts] = [item]
                }
                item.yPosition = unit=='mmol/L'?1*repeatNum:18*repeatNum
                if(eventList[key]){
                    eventList[key].push(item)
                }else{
                    eventList[key] = [item]
                }
            })
            this.eventList = eventList
        },
        upload(){
            this.$router.push('/upLoad')
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
        },
    },
   

}