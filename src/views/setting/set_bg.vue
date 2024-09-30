<template>
    <div class='set-bg' >
         <div class='setting-item-title' >
            <div class='item-title' >{{$t('message.setting.bg.title')}}</div>
            <div class='item-edit' @click='editShow' v-if='!edit' >{{$t('message.setting.profile.edit')}}</div>
        </div>
        <div class='set-bg-info' v-if='!edit'>
            <div class='common-set' >
                <!-- <div class='common-set-item' >
                    <div class='set-item-label' >{{$t('message.setting.bg.title')}}：</div>
                    <div class='set-item-value' >{{bgInfo.glucose_unit==0?'mmol/L':'mg/dL'}}</div>
                </div> -->
                <div class='common-set-item' >
                    <div class='set-item-label' >{{$t('message.setting.bg.format')}}：</div>
                    <div class='set-item-value' >{{timeFormat}}{{$t('message.setting.bg.hour')}}</div>
                </div>
            </div>
            <div class='common-set' >
                <div class='common-set-item' >
                    <div class='set-item-label' >{{$t('message.setting.bg.range')}}：</div>
                    <div class='set-item-value' >{{bgInfo.glucose_range_lower_limit}}-{{bgInfo.glucose_range_lupper_limit}}{{ bgInfo.glucose_unit == 0 ? 'mmol/L':'mg/dL'}}</div>
                </div>
                <div class='common-set-item' >
                    <div class='set-item-label' >{{$t('message.setting.bg.veryLow')}}：</div>
                    <div class='set-item-value' >{{ bgInfo.glucose_unit == 0 ? '3.9mmol/L':'70mg/dL'}}</div>
                </div>
                <div class='common-set-item' >
                    <div class='set-item-label' >{{$t('message.setting.bg.veryHigh')}}：</div>
                    <div class='set-item-value' >{{ bgInfo.glucose_unit == 0 ? '13.9mmol/L':'251mg/dL'}}</div>
                </div>
            </div>
            <div class='set-preview' >
                <div class='set-item-label' >{{$t('message.setting.bg.preview')}}：</div>
                <t-chart
                            style="width: 1200px;height:400px;"
                            :option="option"
                            :init-options="initOptions"
                            theme="tduck-echarts-theme"
                        />
            </div>
        </div>
        <div class='set-bg-edit' v-else>
            <div class='common-set' >
                <div class='common-set-item' >
                    <div class='set-item-label' >{{$t('message.setting.bg.format')}}：</div>
                    <div class='set-item-edit' >
                        <div :class='[item.checked?"active":"","set-item-edit-item"]' v-for='(item,index) in timeShow' :key='item.value' @click="timeSelect(index)">{{item.value}} {{$t('message.setting.bg.hour')}}</div>
                    </div>
                </div>
                <!-- <div class='common-set-item' >
                    <div class='set-item-label' >血糖单位设置：</div>
                    <div class='set-item-edit' >
                        <div :class='[item.checked?"active":"","set-item-edit-item"]' v-for='(item,index) in bgUnit' :key='item.value' @click="unitSelect(index)">{{item.value==0?'mmol/L':'mg/dL'}}</div>
                    </div>
                </div> -->
            </div>
            <!-- <div class='common-set' >
                <div class='common-set-item common-edit-item' >
                    <div class='set-item-label' >{{$t('message.setting.bg.setRange')}}：</div>
                    <div class='set-item-value' >
                        {{$t('message.setting.bg.setrangeTip')}}
                        <el-select v-model="minTarget" placeholder="请选择" @change="minChange" :popper-append-to-body='false'>
                            <el-option
                            v-for="item in targetMin"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                        -
                        <el-select v-model="maxTarget" placeholder="请选择" @change="maxChange" :popper-append-to-body='false'>
                            <el-option
                            v-for="item in targetMax"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                       {{ unit == 0 ? 'mmol/L':'mg/dL'}}
                    </div>
                </div>
            </div> -->
            <div class='common-set' >
                <div class='common-set-item' >
                    <div class='set-item-label' >{{$t('message.setting.bg.veryLow')}}：</div>
                    <div class='set-item-value' >{{ unit == 0 ? '3.9mmol/L':'70mg/dL'}}</div>
                </div>
                <div class='common-set-item' >
                    <div class='set-item-label' >{{$t('message.setting.bg.veryHigh')}}：</div>
                    <div class='set-item-value' >{{ unit == 0 ? '13.9mmol/L':'251mg/dL'}}</div>
                </div>
            </div>
            <div class='set-preview' >
                <div class='set-item-label' >{{$t('message.setting.bg.preview')}}：</div>
                <t-chart
                            style="width: 1200px;height:400px;"
                            :option="options"
                            :init-options="initOptions"
                            theme="tduck-echarts-theme"
                        />
                
            </div>
            <div class='set-range-tips' >{{$t('message.setting.bg.tips')}}</div>
            <div class='btn-box' >
                <el-button type="info" class='cancel-btn' @click='editShow'>{{$t('message.common.cancel')}}</el-button>
                <el-button type="primary"  class='confirm-btn' @click="saveTarget" :loading="loading">{{$t('message.common.confirm')}}</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import TChart from '@/views/components/TChart'
import {mapGetters} from "vuex"
import {getPreferences,setPreferences} from '@/api/setting'
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
                        height:300,
                        left:80,
                        right:80,
                        top:50,
                        show:true,
                        borderColor:'#666'
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
                        },
                        axisLine: {
                            show: false,
                        },
                        data:Array.from({length:60*24},(item, index) => index),
                        axisLabel: {
                            formatter: function (value, index) {
                                if (index  % 360 === 0) {
                                    let h =  Math.floor(value/60)<10 ? '0'+ Math.floor(value/60) : Math.floor(value/60) 
                                    let m =  value%60 < 10 ? '0' + value%60 : value%60
                                    let moment = h+':'+m
                                    return moment;
                                }
                                if(index+1===24*60){
                                    return '00:00'
                                }
                            },
                            interval:0,
                            color: 'var(--color-black-40)',
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
                                color:'var(--color-black-20)'
                            }
                        },
                        axisLabel: {
                            formatter: '{value}',
                            color: 'var(--color-black-40)',
                            fontSize: 20,
                            margin:14
                        }
                    }
                ],
                series: [
                    {   
                        type: 'line',
                        data:[],
                        markLine: {
                            silent: true, // 不高亮辅助线
                            symbol: 'none',
                            animation:false,
                            data: [
                                {
                                type: 'min',
                                yAxis:3.9,
                                lineStyle: {
                                    color: 'var(--color-error)',
                                    width: 0,
                                    type:'solid'
                                },
                                label: {
                                    color: 'var(--color-error)',
                                    fontSize: 20,
                                    distance: 14,
                                    position:'end'
                                },
                                },
                                {
                                type: 'max',
                                yAxis:10,
                                lineStyle: {
                                    color: 'var(--color-warning)',
                                    width: 0,
                                    type:'solid'
                                },
                                label: {
                                    color: 'var(--color-warning)',
                                    fontSize: 20,
                                    distance:14,
                                    position:'end'
                                },
                                },
                            ],
                        },
                        markArea:{
                            data:[
                                [{
                                    yAxis: 3.9
                                },
                                {   
                                    yAxis: 10
                                }]
                            ],
                            itemStyle:{
                                color:'rgba(72, 160, 220, 0.2)'
                            }
                        },
                    }
                ],
            },
            options:{
                grid:[
                    {
                        height:300,
                        left:80,
                        right:80,
                        top:50,
                        show:true,
                        borderColor:'#666'
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
                        },
                        axisLine: {
                            show: false,
                        },
                        data:Array.from({length:60*24},(item, index) => index),
                        axisLabel: {
                            formatter: function (value, index) {
                                if (index  % 360 === 0) {
                                    let h =  Math.floor(value/60)<10 ? '0'+ Math.floor(value/60) : Math.floor(value/60) 
                                    let m =  value%60 < 10 ? '0' + value%60 : value%60
                                    let moment = h+':'+m
                                    return moment;
                                }
                                if(index+1===24*60){
                                    return '00:00'
                                }
                            },
                            interval:0,
                            color: 'var(--color-black-40)',
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
                                color:'var(--color-black-20)'
                            }
                        },
                        axisLabel: {
                            formatter: '{value}',
                            color: 'var(--color-black-40)',
                            fontSize: 20,
                            margin:14
                        }
                    }
                ],
                series: [
                    {   
                        type: 'line',
                        data:[],
                        markLine: {
                            silent: true, // 不高亮辅助线
                            symbol: 'none',
                            animation:false,
                            data: [
                                {
                                type: 'min',
                                yAxis:3.9,
                                lineStyle: {
                                    color: 'var(--color-error)',
                                    width: 0,
                                    type:'solid'
                                },
                                label: {
                                    color: 'var(--color-error)',
                                    fontSize: 20,
                                    distance: 14,
                                    position:'end'
                                },
                                },
                                {
                                type: 'max',
                                yAxis:10,
                                lineStyle: {
                                    color: 'var(--color-warning)',
                                    width: 0,
                                    type:'solid'
                                },
                                label: {
                                    color: 'var(--color-warning)',
                                    fontSize: 20,
                                    distance:14,
                                    position:'end'
                                },
                                },
                            ],
                        },
                        markArea:{
                            data:[
                                [{
                                    yAxis: 3.9
                                },
                                {   
                                    yAxis: 10
                                }]
                            ],
                            itemStyle:{
                                color:'rgba(72, 160, 220, 0.2)'
                            }
                        },
                    }
                ],
            },
            bgInfo:'',
            edit:false,
            timeShow:[{value:24,checked:true},{value:12,checked:false}],
            bgUnit:[{value:0,checked:false},{value:1,checked:false}], //0 mmol/L, 1 mg/dL
            minTarget:'',
            maxTarget:'',
            unit:'',
            loading:false
        }
    },
    components:{
        TChart
    },
    mounted(){
        this.getTarget()
    },
    computed:{
        ...mapGetters([
           'timeFormat']),
        targetMin(){
            let up_target = this.maxTarget
            let  targetMin
            if(this.unit==0){
                targetMin = []
                for( var i=3.5;i<=up_target-0.1;i+=0.1){
                    targetMin.push(_.round(i,1))
                }

            }else{
                targetMin = []
                for( var i=63;i<=up_target-1;i++){
                    targetMin.push(_.round(i,1))
                }
            } 
            return targetMin
        },
        targetMax(){
            let low_target = this.minTarget
            let targetMin = [],targetMax=[]
            if(this.unit==0){
                let maxMin = low_target<4.4? 4.4:low_target+0.1
                for(var i=maxMin; i<=13.8; i+=0.1){
                    targetMax.push(_.round(i,1))
                }
            }else{
                let maxMin = low_target<79? 79:low_target+1
                for(var i=maxMin; i<=249; i++){
                    targetMax.push(_.round(i,1))
                }
            }
            return targetMax
        }
    },
    methods:{
        // 从云获取数据
        getTarget(){
            getPreferences({}).then(response => {
                    if(response.code == 1000){
                        let target = null
                        if(response.data.glucose_unit==0){
                            target = [GlucoseUtils.mgdlToMmol(response.data.glucose_range_lower_limit),GlucoseUtils.mgdlToMmol(response.data.glucose_range_lupper_limit)]
                        }else{
                            target = [response.data.glucose_range_lower_limit,response.data.glucose_range_lupper_limit]
                        }
                        this.option.series[0].markLine.data[0].yAxis = target[0]
                        this.option.series[0].markLine.data[1].yAxis = target[1]
                        this.option.series[0].markArea.data[0][0].yAxis = target[0]
                        this.option.series[0].markArea.data[0][1].yAxis = target[1]
                        this.option.yAxis[0].max = response.data.glucose_unit == 1?270:15
                        this.option.yAxis[0].interval = response.data.glucose_unit == 1?3*18:3
                        this.options.series[0].markLine.data[0].yAxis = target[0]
                        this.options.series[0].markLine.data[1].yAxis = target[1]
                        this.options.series[0].markArea.data[0][0].yAxis = target[0]
                        this.options.series[0].markArea.data[0][1].yAxis = target[1]
                        this.options.yAxis[0].max = response.data.glucose_unit == 1?270:15
                        this.options.yAxis[0].interval = response.data.glucose_unit == 1?3*18:3
                        if(this.timeFormat == 12){
                            this.options.xAxis[0].axisLabel.formatter = function (value, index) {
                                if (index  % 360 === 0) {
                                    let h = Math.floor(value/60) 
                                    let moment = h
                                    if(h>12){
                                        moment = h-12+'PM'
                                    }else if(h==12){
                                        moment = h+'PM'
                                    }else{
                                        if(h==0){h=12}
                                        moment = h+'AM'
                                    }
                                    return moment;
                                }
                                if(index+1===24*60){
                                    return '12AM'
                                }
                            }
                            this.option.xAxis[0].axisLabel.formatter = function (value, index) {
                                if (index  % 360 === 0) {
                                    let h = Math.floor(value/60) 
                                    let moment = h
                                    if(h>12){
                                        moment = h-12+'PM'
                                    }else if(h==12){
                                        moment = h+'PM'
                                    }else{
                                        if(h==0){h=12}
                                        moment = h+'AM'
                                    }
                                    return moment;
                                }
                                if(index+1===24*60){
                                    return '12AM'
                                }
                            }
                            this.timeShow[1].checked = true
                            this.timeShow[0].checked = false
                        }else{
                            this.timeShow[0].checked = true
                            this.timeShow[1].checked = false
                        }
                        this.minTarget = target[0]
                        this.maxTarget = target[1]
                        this.unit =  response.data.glucose_unit
                        this.bgUnit.forEach(item=>{
                            if(response.data.glucose_unit==item.value){
                                item.checked = true
                            }
                        })
                        this.bgInfo =  response.data
                        this.bgInfo.glucose_range_lower_limit = target[0]
                        this.bgInfo.glucose_range_lupper_limit = target[1]
                    }else{
                        this.$message({
                            type: 'error',
                            message: response.msg
                        });
                    }
            }).catch((res) => {
                   console.log(res)
            })
        },
        // 保存设置
        saveTarget(){
            let timeFormat = _.filter(this.timeShow,'checked')[0].value
            this.$store.dispatch('setTimeFormat',timeFormat)
            this.$store.dispatch('setUnit',this.unit==0?'mmol/L':'mg/dL')
            this.edit = false
            this.$emit('bgShow',false)
            // this.loading = true
            // let targetmin = this.unit==0? GlucoseUtils.mmolToMgdl(this.minTarget):this.minTarget
            // let targetmax = this.unit==0? GlucoseUtils.mmolToMgdl(this.maxTarget):this.maxTarget
            // setPreferences({glucose_unit:this.unit,glucose_range_lower_limit:targetmin,glucose_range_lupper_limit:targetmax}).then(response =>{
            //     if(response.code == 1000){
            //         this.edit = false
            //         this.loading = false
            //         this.$emit('bgShow',false)
            //         this.getTarget()
            //         let timeFormat = _.filter(this.timeShow,'checked')[0].value
            //         this.$store.dispatch('setTimeFormat',timeFormat)
            //         this.$store.dispatch('setUnit',this.unit==0?'mmol/L':'mg/dL')
            //         this.$store.dispatch('setTargetScope',[this.minTarget,this.maxTarget])
            //         this.$store.dispatch('setOrginTargetScope',[this.minTarget,this.maxTarget])
            //     }
            // }).catch((res) => {
            //        console.log(res)
            // })
        },
        // 时间格式设置
        timeSelect(index){
            let timeShow = this.timeShow
            timeShow.forEach(item=>item.checked = false)
            timeShow[index].checked = !timeShow[index].checked
            if(timeShow[index].value==12){
                this.options.xAxis[0].axisLabel.formatter = function (value, index) {
                    if (index  % 360 === 0) {
                        let h = Math.floor(value/60) 
                        let moment = h
                        if(h>12){
                            moment = h-12+'pm'
                        }else if(h==12){
                            moment = h+'pm'
                        }else{
                            if(h==0){h=12}
                            moment = h+'am'
                        }
                        return moment;
                    }
                    if(index+1===24*60){
                        return '12am'
                    }
                }
            }else{
                    this.options.xAxis[0].axisLabel.formatter = function (value, index) {
                        if (index  % 360 === 0) {
                            let h =  Math.floor(value/60)<10 ? '0'+ Math.floor(value/60) : Math.floor(value/60) 
                            let m =  value%60 < 10 ? '0' + value%60 : value%60
                            let moment = h+':'+m
                            return moment;
                        }
                        if(index+1===24*60){
                            return '00:00'
                        }
                    }
            }
        },
        // 单位设置
        unitSelect(index){
            let bgUnit = this.bgUnit
            bgUnit.forEach(item=>item.checked = false)
            bgUnit[index].checked = !bgUnit[index].checked
            if( bgUnit[index].checked ){
                this.unit = bgUnit[index].value
                if(bgUnit[index].value==0){
                    this.minTarget =  GlucoseUtils.mgdlToMmol(this.minTarget)
                    this.maxTarget =  GlucoseUtils.mgdlToMmol(this.maxTarget)
                    this.options.series[0].markLine.data[0].yAxis =  this.minTarget
                    this.options.series[0].markLine.data[1].yAxis = this.maxTarget
                    this.options.series[0].markArea.data[0][0].yAxis =  this.minTarget
                    this.options.series[0].markArea.data[0][1].yAxis = this.maxTarget
                    this.options.yAxis[0].max = 15
                    this.options.yAxis[0].interval = 3
                }else{
                    this.minTarget =  GlucoseUtils.mmolToMgdl(this.minTarget)
                    this.maxTarget =  GlucoseUtils.mmolToMgdl(this.maxTarget)
                    this.options.series[0].markLine.data[0].yAxis =this.minTarget
                    this.options.series[0].markLine.data[1].yAxis =  this.maxTarget
                    this.options.series[0].markArea.data[0][0].yAxis =this.minTarget
                    this.options.series[0].markArea.data[0][1].yAxis =  this.maxTarget
                    this.options.yAxis[0].max = 270
                    this.options.yAxis[0].interval =3*18
                }
            }
        },
        // 目标下线设置
        minChange(val){
            this.options.series[0].markLine.data[0].yAxis =val
            this.options.series[0].markArea.data[0][0].yAxis =val
        },
        // 目标上线设置
        maxChange(val){
            this.options.series[0].markLine.data[1].yAxis =  val
            this.options.series[0].markArea.data[0][1].yAxis =  val
        },
        // 编辑框
        editShow(){
            this.edit = !this.edit
            this.$emit('bgShow',this.edit)
        }
    }
}
</script>
<style scoped>
    .set-bg{
        width:100%;
        background:#fff;
        border-radius:10px;
        padding:20px;
        box-sizing: border-box;
    }
    .setting-item-title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom:30px;
    }
    .item-title{
        font-size:var(--fontSize-smax);
        color:var(--color-black-100);
        border-left:3px solid var(--color-primary);
        padding-left:10px;
        height:24px;
        line-height: 24px;
        font-weight: 700;
    }
    .item-edit{
        font-size:var(--fontSize-default);
        color:var(--color-primary);
        text-decoration: underline;
        cursor: pointer;
    }
    .common-set{
        display: flex;
        align-items: center;
        margin-bottom:20px;
        padding-left:14px;
    }
    .common-set-item{
        display: flex;
        align-items: center;
        margin-right: 50px;
        width:400px;
    }
    .common-edit-item{
        width:100%;
    }
    .set-item-label{
        font-size:var(--fontSize-default);
        color:var(--color-black-60);
    }
    .set-item-value{
        font-size:var(--fontSize-default);
        color:var(--color-black-100);
    }
    .set-preview{
        padding-left:14px;
        display: flex;
    }
    .set-item-edit{
        display: flex;
        align-items: center;
    }
    .set-item-edit-item{
        width:120px;
        height:42px;
        border-radius:10px;
        border:1px solid #e5e5e5;
        text-align: center;
        line-height: 42px;
        font-size:var(--fontSize-default);
        color:var(--color-black-80);
        margin-left:20px;
        cursor: pointer;
    }
    .active{
        border:1px solid var(--color-primary);
        color: #fff;
        background: var(--color-primary);

    }
    .btn-box{
        width:100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .el-button{
        border: none;
        padding:0;
        margin:0
    }
    .cancel-btn{
        width:140px;
        height:50px;
        border-radius:10px;
        background:var(--color-black-6);
        text-align: center;
        line-height: 51px;
        font-size:var(--fontSize-big);
        color:var(--color-black-80);
        margin-right:30px;
    }
     .confirm-btn{
        width:140px;
        height:50px;
        border-radius:10px;
        background:var(--color-primary);
        text-align: center;
        line-height: 51px;
        font-size:var(--fontSize-big);
        color:#fff;
    }
    .set-range-tips{
         font-size:var(--fontSize-default);
         color:var(--color-warning);
         padding-left:210px;
         margin-bottom:30px;
    }
</style>