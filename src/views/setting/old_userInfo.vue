<template>
    <div class='userinfo' id='old_userinfo' v-loading='pageLoading'>
        <div class='userinfo-title' >
            <div class='userinfo-label' >
                <div class='userinf-diver' ></div>
                <div class='userinfo-text' >个人信息</div>
            </div>
            <div class='jump' @click="saveSubmit">跳过</div>
        </div>
        <div class='tips' >请填写您的健康信息，将为您制定个性化管理方案！</div>
        <div class='step-box'>
            <div :class="[step>index?'active':'','step-item']" v-for='(item,index) in stepList' :key='index' ></div>
        </div>
        <div class='config'>
            <!-- 糖尿病信息 -->
            <div v-if='configs.length>step-1' >
                <div v-for='(item,index) in configs' :key='item.config_key' >
                    <div class='config-title' v-if='index+1==step' >{{item.config_name}}</div>
                    <div  v-for='(ele,indexs) in item.items' :key='ele.item_key'>
                        <div class='config-item'  @click="changeConfig(index,indexs)" v-if='index+1==step'>
                            <div class='config-choose' >
                                <img src="~@/assets/image/radio-check.png" alt="" class='choose-img'  v-if='ele.checked'>
                                <img src="~@/assets/image/no-check.png" alt="" class='choose-img' v-else >
                            </div>
                            <div class='config-text' >{{ele.item_name}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 个人基础信息 -->
            <div class='config-message' v-else>
                <div class='config-title'>基础信息</div>
                <div class='message-box' >
                    <el-form ref="formData"  label-width="80px" label-position="left" :model="formData">
                        <el-form-item label="出生日期" >
                            <el-date-picker v-model="formData.birthdate" type="date"  placeholder="选择日期"
                            :picker-options="pickerOptions"
                            :default-value='defaultBirthday'
                            value-format="yyyy-MM-dd"	></el-date-picker>
                        </el-form-item>
                        <el-form-item label="性别"  >
                            <el-select v-model="formData.gender" placeholder="请选择">
                                <el-option label="男" :value="0" ></el-option>
                                <el-option label="女" :value='1'></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="身高" >
                            <el-input v-model="formData.height" class='user-inp'>
                                <span slot='suffix' >cm</span>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="体重" >
                            <el-input v-model="formData.weight"  class='user-inp'>
                                <span slot='suffix' >kg</span>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="确诊日期" v-if='diagnosisShow'>
                            <el-date-picker v-model="formData.diagnosis_date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="diagnosisPickerOptions"></el-date-picker>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class='config-btn' v-if='step>1'>
                <el-button type="info" round @click="prevStep">上一步</el-button>
                <el-button type="primary" round @click="saveSubmit" :loading="loading"  v-if='step==configs.length+1'>完成配置</el-button>
                <el-button type="primary" round @click="nextStep" :loading="loading" v-else>下一步</el-button>
            </div>
             <div class='configs-btn' v-if='step<=1'>
                <el-button type="primary" round @click="nextStep" :loading="loading" >下一步</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import {configs,saveInfo,getInfo} from '@/api/userApi'
import Cookies from "js-cookie"
import maskPhoneNumber from '@/utils/phone'
export default {
    data(){
        return{
            stepList:[],
            step:1,
            configs:[],
            loading:false,
            pageLoading:true,
            formData:{
                diabetes_type:null,
                treatment_regimen:[],
                comorbidities:[],
                complications:[],
                birthdate:null,
                weight:null,
                height:null,
                gender:null,
                diagnosis_date:null,
                nickname:maskPhoneNumber(Cookies.get("username")),
                avatar:null
            },
            defaultBirthday:new Date().setFullYear(new Date().getFullYear()-40),
            pickerOptions:{
                disabledDate (time) {
                        return time.getTime() > new Date().setFullYear(new Date().getFullYear()-4)||time.getTime()<new Date('1900-01-01')
                }
                    
            },
            diagnosisPickerOptions:{
                disabledDate (time) {
                        return time.getTime()<new Date('1900-01-01')||time.getTime() > new Date()
                }
            }
        }
    },
    computed:{
        diagnosisShow(){
            return this.formData.diabetes_type&&this.formData.diabetes_type!=0
        }
    },
    created(){
        this.getConfig()
    },
    methods:{
        // 获取配置项
        getConfig(){
            configs({}).then(response => {
                    if(response.code == 1000){
                       this.stepList = response.data.length+1
                       this.configs = response.data
                       this.getInfo()
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
        // 选择配置项
        changeConfig(index,indexs){
            let item = this.configs[index].items[indexs]
            let formData = this.formData
            if(this.configs[index].config_key=='diabetes_type' || item.item_key==0){
                this.configs[index].items.forEach(item=>{
                    item.checked = false
                })
                item.checked = true
                if(this.configs[index].config_key=='diabetes_type'){
                    this.formData.diabetes_type = item.item_key
                }else{
                    this.formData[this.configs[index].config_key] = [0]
                }
            }else{
                item.checked = !item.checked
                this.configs[index].items.forEach(item=>{
                    if(item.item_key==0){
                         item.checked=false
                    }
                })
                let arr = this.configs[index].items.filter(item=>item.checked)
                let new_arr = []
                arr.forEach(item=>{
                    new_arr.push(item.item_key)
                })
                this.formData[this.configs[index].config_key] = new_arr
            }
            this.$set(this.configs[index].items,indexs,item)
        },
        // 下一步
        nextStep(){
            if(this.step<this.configs.length+1){
                 this.step+=1
            }
            this.saveSubmit()
            
        },
        // 上一步
        prevStep(){
            if(this.step>=1){
                this.step-=1
            }
        },
         // 保存用户配置
        saveSubmit(){
            this.loading = true
            this.formData.height = this.formData.height?Number(this.formData.height):null
            this.formData.weight = this.formData.weight?Number(this.formData.weight):null
            this.formData.gender = this.formData.gender?Number(this.formData.gender):null
            saveInfo(this.formData).then(response => {
                    this.loading = false
                    if(response.code == 1000){
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
        // 获取用户配置
        getInfo(){
            let configs = this.configs
            getInfo().then(response => {
                this.pageLoading = false
                    if(response.code == 1000){
                        this.formData = response.data
                        configs.forEach((ele,index)=>{
                            ele.items.forEach(item=>{
                                if(ele.config_key=='diabetes_type'){
                                    if(item.item_key == response.data[ele.config_key]){
                                        item.checked = true
                                    }
                                }else  if(response.data[ele.config_key].length>0){
                                    response.data[ele.config_key].forEach(Element=>{
                                        if(Element == item.item_key){
                                            item.checked = true
                                        }
                                    })
                                }
                            })
                            this.$set(this.configs,index,ele)
                        })
                        
                    }else{
                        this.$message({
                            type: 'error',
                            message: response.msg
                        });
                    }
            }).catch((res) => {
                this.pageLoading = false
                   console.log(res)
            })
        }
    }
}
</script>
<style scoped>
    .userinfo{
        width: 600px;
        margin:0 auto;
        background: #fff;
        padding:20px;
        border-radius: 4px;
    }
    .userinfo-title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom:20px;
    }
    .userinfo-label{
        display: flex;
        align-items: center;
    }
    .userinf-diver{
        width:2px;
        height:17px;
        background-color: var(--color-primary);
    }
    .userinfo-text{
        color:var(--color-black-100);
        font-size:20px;
        margin-left:6px;
        font-weight: 440;
    }
    .jump{
        font-size:var(--fontSize-big);
        color: var(--color-blue);
        cursor: pointer;
    }
    .tips{
        font-size:var(-fontSize-default);
        color:var(--color-black-60);
        text-align: center;
        margin-bottom:10px;
    }
    .step-box{
        width:340px;
        margin:0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom:20px;
    }
    .step-item{
        width:60px;
        height:5px;
        border-radius:1px;
        background-color: #f0f0f0;
        margin:0 1px;
    }
    .step-item.active{
         background-color: var(--color-primary);
    }
    .config{
        width:400px;
        margin:0 auto;
    }
    .config-title{
        text-align: center;
        font-size:18px;
        color:var(--color-black-80);
        font-weight:400;
        margin-bottom:20px;
    }
    .config-item{
        width:336px;
        height:60px;
        border:1px solid #dcdfe6;
        border-radius:10px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding:0 20px;
        margin:0 auto;
        margin-bottom:10px;
    }
    .choose-img{
        display: block;
        margin-right:10px;
        width:22px;
        height:22px;
    }
    .config-text{
        font-size:var(--fontSize-big);
        color:var(--color-black-100);
        font-weight: 440;
    }
    .config-btn{
         width:336px;
         margin:0 auto;
         display: flex;
         align-items: center;
         justify-content: space-around;
         margin-top:30px;
    }
    .configs-btn{
         width:336px;
         margin:0 auto;
         display: flex;
         align-items: center;
         justify-content: space-around;
         margin-top:30px;
    }
</style>