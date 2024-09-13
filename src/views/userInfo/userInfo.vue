<template>
    <div class='userinfobox' id='old_userinfo' v-loading='pageLoading'>
        <div class='login-nav' >
            <img src="~@/assets/image/logo.png" alt="" class='logo' >
            <el-select v-model="language" class='language-select' >
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class='userinfo' >
            <div class='userinfo-title' >
                <div class='userinfo-label' >
                    <div class='userinfo-text' >{{$t('message.setting.profile.title')}}</div>
                    <div class='userinfo-tips' >{{$t('message.setting.profile.tip')}}</div>
                </div>
                <div class='jump' @click="saveSubmit">{{$t('message.setting.profile.skip')}}</div>
            </div>
            <div class='edit-userinfo-box userInfo-box'>
                <el-form ref="formData"  label-width="150px" label-position="left"  :model="formData" :inline="true">
                        <el-form-item :label="$t('message.setting.profile.name')+':'">
                            <input type="text" v-model="formData.nickname" maxlength='15' class='user-inp el-input el-input__inner' @input="limitLength" >
                        </el-form-item>
                        <el-form-item :label="$t('message.setting.profile.gender')+':'"  >
                            <el-select v-model="formData.gender"  popper-class='edit-select' placeholder=" " :popper-append-to-body='false'>
                                <el-option  :disabled="true">
                                    <div class='select-title'>{{$t('message.setting.profile.gender')}}</div>
                                </el-option>
                                <el-option :label="$t('message.setting.profile.male')" :value="0" ><div :class='[formData.gender?"":"active","select-item"]'>{{$t('message.setting.profile.male')}}</div></el-option>
                                <el-option :label="$t('message.setting.profile.female')" :value='1'><div>{{$t('message.setting.profile.female')}}</div></el-option>
                                <el-option :label="$t('message.setting.profile.nosay')" :value='2'><div>{{$t('message.setting.profile.nosay')}}</div></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('message.setting.profile.birthday')+':'"  >
                            <div class="picker-box" >
                                <el-date-picker v-model="formData.birthdate" type="date"   placeholder=" "
                                :picker-options="pickerOptions"
                                :default-value='defaultBirthday'
                                :append-to-body='false'
                                prefix-icon =' '
                                value-format="yyyy-MM-dd"
                                class='special-picker'
                                @change="birthdayChange"
                                ref='birthdayPicker'>
                                </el-date-picker>
                                <i class="el-icon-arrow-down picker-date-icon "></i>
                                <span class='age-span' v-if='age'>（{{age}}）</span>
                                <div class='special-data' @click="birthdayPicker">{{showBirthday}}</div>
                            </div>
                           
                        </el-form-item>
                        <el-form-item :label="$t('message.setting.profile.height')+':'" >
                                <el-select v-model="formData.height"  popper-class='edit-select' placeholder=" " :popper-append-to-body='false'>
                                <el-option  :disabled="true">
                                    <div class='select-title'>{{$t('message.setting.profile.height')}}</div>
                                </el-option>
                                <el-option  v-for='item in heightArray' :key='item' :label="item+'cm'" :value="item" >
                                    <div :class='[item==175&&!formData.height?"active":"","select-item"]'>{{item}}cm</div>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('message.setting.profile.weight')+':'" >
                                <el-select v-model="formData.weight"  popper-class='edit-select' placeholder=" " :popper-append-to-body='false'>
                                <el-option  :disabled="true">
                                    <div class='select-title'>{{$t('message.setting.profile.weight')}}</div>
                                </el-option>
                                <el-option  v-for='item in weightArray' :key='item' :label="item+'kg'" :value="item" >
                                        <div :class='[item==60&&!formData.weight?"active":"","select-item"]'>{{item}}kg</div>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('message.setting.profile.typeDiabetes')+':'" >
                                <el-select v-model="formData.diabetes_type" popper-class='edit-select' placeholder=" " :popper-append-to-body='false'>
                                    <el-option  :disabled="true">
                                        <div class='select-title'>{{$t('message.setting.profile.typeDiabetes')}}</div>
                                    </el-option>
                                    <el-option  v-for='item in diabetes_type_arr' :key='item.item_key' :label="item.item_name" :value="item.item_key" >
                                    </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('message.setting.profile.diseaseYear')+':'"  >
                            <el-date-picker v-model="formData.diagnosis_date" type="date" value-format="yyyy-MM-dd"
                                prefix-icon =' ' placeholder=" " :append-to-body='false' :picker-options="diagnosisPickerOptions" 
                                @change="diabeteChange"
                                ref='diabetePicker'></el-date-picker>
                                <i class="el-icon-arrow-down picker-date-icon "></i>
                                <span class='age-span' v-if='diabetes_year' >（{{diabetes_year}}{{$t('message.setting.profile.year')}}）</span>
                                 <div class='special-data' @click="diabetePicker">{{diabetesShow}}</div>
                        </el-form-item>
                         <el-form-item :label="$t('message.setting.profile.treatment')+':'"   class='multiple specialLabel'>
                            <el-select v-model="formData.treatment_regimen" popper-class='edit-select' multiple placeholder=" " @change='chooseTreatmentRegimen' :popper-append-to-body='false'>
                                <el-option  :disabled="true">
                                    <div class='select-title'>{{$t('message.setting.profile.treatment')}}</div>
                                </el-option>
                                <el-option  v-for='item in treatment_regimen_arr' :key='item.item_key' :label="item.item_name" :value="item.item_key" >
                                </el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item :label="$t('message.setting.profile.comorbidty')+':'"   class='multiple'>
                                <el-select v-model="formData.comorbidities" popper-class='edit-select' multiple placeholder=" " @change='chooseComorbidities' :popper-append-to-body='false'>
                                    <el-option  :disabled="true">
                                        <div class='select-title'>{{$t('message.setting.profile.comorbidty')}}</div>
                                    </el-option>
                                    <el-option  v-for='item in comorbidities_arr' :key='item.item_key' :label="item.item_name" :value="item.item_key" >
                                    </el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item :label="$t('message.setting.profile.complication')+':'"  class='multiple'>
                                <el-select v-model="formData.complications" popper-class='edit-select' multiple placeholder=" " @change='chooseComplications' :popper-append-to-body='false'>
                                     <el-option  :disabled="true">
                                        <div class='select-title'>{{$t('message.setting.profile.complication')}}</div>
                                    </el-option>
                                    <el-option  v-for='item in complications_arr' :key='item.item_key' :label="item.item_name" :value="item.item_key" >
                                    </el-option>
                            </el-select>
                        </el-form-item>
                        <div class='btn-box' >
                            <el-button type="primary"  class='confirm-btn' @click="saveSubmit" :loading="loading">{{$t('message.common.save')}}</el-button>
                        </div>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import {configs,saveInfo,getInfo} from '@/api/userApi'
import Cookies from "js-cookie"
import maskPhoneNumber from '@/utils/phone'
import {formatDate,formatTime,formatEn} from '@/utils/formatTime'
export default {
    data(){
        return{
            language:'English',
            options:[{
                value:'English',
                label:'English'
            },{
                value:'Español',
                label:'Español'
            },{
                value:'Français',
                label:'Français'
            }],
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
                nickname:null,
                avatar:null
            },
            showBirthday:'',
            diabetesShow:'',
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
            },
            heightArray:[],
            weightArray:[],
            diabetes_type_arr:[],
            treatment_regimen_arr:[],
            comorbidities_arr:[],
            complications_arr:[],
            showPicker:true
        }
    },
     computed:{
        diagnosisShow(){
            return this.formData.diabetes_type&&this.formData.diabetes_type!=0
        },
        age() {
            if(this.formData.birthdate){
                const today = new Date();
                const birthDate = new Date(this.formData.birthdate);
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            }else{
                return null
            }
        },
        diabetes_year(){
            if(this.formData.diagnosis_date){
                const today = new Date();
                const diagnosisDate = new Date(this.formData.diagnosis_date);
                let diabetes_year = today.getFullYear() - diagnosisDate.getFullYear();
                const m = today.getMonth() - diagnosisDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < diagnosisDate.getDate())) {
                    diabetes_year--;
                }
                return diabetes_year;
            }else{
                return null
            }
        }
    },
    created(){
        this.getConfig()
        for(var i=50;i<=255;i++){
            this.heightArray.push(i)
        }
        for(var i=10;i<=200;i++){
            this.weightArray.push(i)
        }
    },
    methods:{
        // 昵称长度限制
        limitLength(event) {
            const maxLength = 15;
            console.log(event.target.value)
            const currentInput = event.target.value;
            const fullWidthRegex = /[^\u0000-\u007F]/g; // 匹配全角字符的正则
            const halfWidthRegex = /[\u0000-\u007F]/g; // 匹配半角字符的正则
        
            // 计算输入的全角半角字符数量
            const fullWidthCount = (currentInput.match(fullWidthRegex) || []).length;
            const halfWidthCount = (currentInput.match(halfWidthRegex) || []).length;
        
            // 如果全角半角字符超出限制，截取输入
            if (fullWidthCount + halfWidthCount > maxLength) {
                this.formData.nickname = currentInput.substring(0, maxLength - (fullWidthCount - halfWidthCount));
            }
        },
        // 选择
        birthdayPicker(){
            this.$nextTick(()=>{
                this.$refs.birthdayPicker.focus()
            })
        },
        birthdayChange(val){
            this.showBirthday = formatEn(val)
        },
        diabetePicker(){
            this.$nextTick(()=>{
                this.$refs.diabetePicker.focus()
            })
        },
        diabeteChange(val){
            this.diabetesShow = formatEn(val)
        },
        chooseComorbidities(val){
            if(val[val.length-1] == 0){
                this.formData.comorbidities = [0]
            }else{
                this.formData.comorbidities=_.without(this.formData.comorbidities,0)
            }
        },
        chooseTreatmentRegimen(val){
             if(val[val.length-1] == 0){
                this.formData.treatment_regimen = [0]
            }else{
                this.formData.treatment_regimen=_.without(this.formData.treatment_regimen,0)
            }
        },
        chooseComplications(val){
            if(val[val.length-1] == 0){
                this.formData.complications = [0]
            }else{
                this.formData.complications=_.without(this.formData.complications,0)
            }
        },
        // 获取配置项
        getConfig(){
            configs({}).then(response => {
                    if(response.code == 1000){
                       this.configs = response.data
                       this.getInfo()
                       response.data.forEach(item=>{
                            switch(item.config_key){
                                case 'diabetes_type' :
                                    this. diabetes_type_arr = item.items
                                    break;
                                case 'treatment_regimen' :
                                    this. treatment_regimen_arr = item.items
                                    break;
                                case 'comorbidities' :
                                    this. comorbidities_arr = item.items
                                    break;
                                case 'complications' :
                                    this. complications_arr = item.items
                                    break;
                            }
                       })
                       this.pageLoading = false
                       console.log(this. complications_arr)
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
                    if(response.code == 1000){
                        this.formData = response.data
                        let obj = _.cloneDeep(response.data)
                        let show_comorbidities = _.filter(this.comorbidities_arr,(item)=>{
                            return _.indexOf(obj.comorbidities,item.item_key)!=-1
                        })
                        let show_complications = _.filter(this.complications_arr,(item)=>{
                            return _.indexOf(obj.complications,item.item_key)!=-1
                        })
                        let show_treatment_regimen = _.filter(this.treatment_regimen_arr,(item)=>{
                            return _.indexOf(obj.treatment_regimen,item.item_key)!=-1
                        })
                        obj.show_diabetes_type = obj.diabetes_type!=null?_.filter(this.diabetes_type_arr,['item_key',obj.diabetes_type])[0].item_name:obj.diabetes_type
                        obj.show_comorbidities = _.map(show_comorbidities,'item_name').join(',')
                        obj.show_complications = _.map(show_complications,'item_name').join(',')
                        obj.show_treatment_regimen =_.map(show_treatment_regimen,'item_name').join(',')
                        this.info = obj
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
        // 保存用户配置
        saveSubmit(){
            this.formData.height = this.formData.height?Number(this.formData.height):null
            this.formData.weight = this.formData.weight?Number(this.formData.weight):null
            this.formData.gender = this.formData.gender?Number(this.formData.gender):null
              this.$refs.formData.validate((valid)=>{
                    if(valid){
                        this.loading = true
                        saveInfo(this.formData).then(response => {
                            this.loading = false
                            if(response.code == 1000){
                               this.$router.push('/')
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: response.msg
                                });
                            }
                        }).catch((res) => {
                            console.log(res)
                        })
                }
              })
            
        },
    }
}
</script>
<style scoped>
    .userinfobox{
        width:100%;
    }
     .login-nav{
        width:100%;
        height:84px;
        background:#fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .logo{
        width:184px;
        height:35px;
        display: block;
        margin-left:400px;
    }
    .language-select{
        margin-right:400px;
        width:100px;
    }
    .login-content{
        display: flex;
        justify-content: center;
        padding-top:120px;
    }
     
    .el-dropdown-link{
        font-size:var(--fontSize-big);
    }
    .userinfo{
        width: 1520px;
        margin:0 auto;
        background: #fff;
        padding:50px 225px;
        border-radius: 4px;
        margin-top:60px;
    }
    .userinfo-title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom:20px;
    }
    .userinfo-label{
        display: block;
        width:520px;
    }
    .userinfo-text{
        color:var(--color-black-100);
        font-size:var(--fontSize-smax);
        margin-left:6px;
        font-weight: 440;
        margin-bottom:10px;
    }
    .userinfo-tips{
        color:var(--color-black-80);
        font-size:var(--fontSize-default);
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
    .config-message{
        width:300px;
        margin:0 auto;
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
    .el-button{
        border: none;
        padding:0;
        margin:0
    }
    .select-item.active{
        color: var(--color-primary);
    }
    .btn-box{
        display: flex;
        justify-content: center;
    }
    .age-span{
        position: absolute;
        right:-55px;
        top:0;
        width:60px;
    }
    .special-data{
        position: absolute;
        left:0;
        top:0;
        padding-left:20px;
        border:1px solid var(--color-black-10);
        width:100%;
        height:40px;
        border-radius:7px;
        line-height: 40px;
        z-index:999;
        background:#fff;
    }
    .picker-box{
        width:300px;
        position: relative;
    }
</style>