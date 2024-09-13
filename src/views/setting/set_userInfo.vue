<template>
    <div class='setting-userInfo userinfobox' >
        <div class='setting-item-title' >
            <div class='item-title' >{{$t('message.setting.profile.title')}}</div>
            <div class='item-edit' @click='editShow' v-if='!edit' >{{$t('message.setting.profile.edit')}}</div>
        </div>
        <div class='userInfo-box' v-if='!edit'>
            <div class='userInfo-img' >
                <img :src="info.avatar" alt="" class="userInfo-avater" >
                <div class='userInfo-nickname' >{{info.nickname}}</div>
            </div>
            <div class='userInfo-info' >
                <div class='info-item' >
                    <div class='info-item-label' >{{$t('message.setting.profile.name')}}：</div>
                    <div class='info-item-value' >{{info.nickname}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >{{$t('message.setting.profile.birthday')}}：</div>
                    <div class='info-item-value' >{{info.birthdate?info.birthdate:'--'}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >{{$t('message.setting.profile.gender')}}：</div>
                    <div class='info-item-value' >{{info.gender==0?'男':info.gender==1?'女':'--'}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >{{$t('message.setting.profile.height')}}：</div>
                    <div class='info-item-value' >{{info.height?info.height:'--'}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >{{$t('message.setting.profile.weight')}}：</div>
                    <div class='info-item-value' >{{info.weight?info.weight:'--'}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >{{$t('message.setting.profile.typeDiabetes')}}：</div>
                    <div class='info-item-value' >{{info.show_diabetes_type?info.show_diabetes_type:'--'}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >{{$t('message.setting.profile.diseaseYear')}}：</div>
                    <div class='info-item-value' >{{info.diagnosis_date?info.diagnosis_date:'--'}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >{{$t('message.setting.profile.treatment')}}：</div>
                    <div class='info-item-value' >{{info.show_treatment_regimen?info.show_treatment_regimen:'--'}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >{{$t('message.setting.profile.comorbidty')}}：</div>
                    <div class='info-item-value' >{{info.show_comorbidities?info.show_comorbidities:'--'}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >{{$t('message.setting.profile.complication')}}：</div>
                    <div class='info-item-value' >{{info.show_complications?info.show_complications:'--'}}</div>
                </div>
            </div>
        </div>
        <div class='edit-userinfo-box userInfo-box' v-else>
            <div class='userInfo-img' >
                <img :src="formData.avatar" alt="" class="userInfo-avater" >
                <div class='userInfo-nickname' >{{formData.nickname}}</div>
                <div class='userInfo-change' >{{$t('message.setting.profile.change')}}</div>
                 <el-upload
                        class="upload-demo"
                        ref='upload'
                        list-type="picture-card"
                        accept='image/*'
                        :show-file-list="false"
                        :on-change="handleChange"
                        :on-remove="handleRemove"
                        :auto-upload='false'
                        :limit='1'
                        action="#"
                        :multiple='false'>
                        <i class="el-icon-plus"></i>
                        </el-upload>
            </div>
            <div>
                <el-form ref="formData"  label-width="150px" label-position="left"  :model="formData" :inline="true">
                        <el-form-item :label="$t('message.setting.profile.firstName')+':'">
                            <input type="text" v-model="formData.nickname" maxlength='15' class='user-inp el-input el-input__inner' @input="limitLength" >
                        </el-form-item>
                        <el-form-item :label="$t('message.setting.profile.lastName')+':'">
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
                            <el-date-picker v-model="formData.birthdate" type="date"   placeholder=" "
                            :picker-options="pickerOptions"
                            :default-value='defaultBirthday'
                            :append-to-body='false'
                            prefix-icon =' '
                            value-format="yyyy-MM-dd"	>
                            </el-date-picker>
                            <i class="el-icon-arrow-down picker-date-icon "></i>
                            <span class='age-span' v-if='age'>（{{age}}）</span>
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
                                prefix-icon =' ' placeholder=" " :append-to-body='false' :picker-options="diagnosisPickerOptions"></el-date-picker>
                                <i class="el-icon-arrow-down picker-date-icon "></i>
                                <span class='age-span' v-if='diabetes_year' >（{{diabetes_year}}{{$t('message.setting.profile.year')}}）</span>
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
                            <el-button type="info" class='cancel-btn' @click='editShow'>{{$t('message.common.cancel')}}</el-button>
                            <el-button type="primary"  class='confirm-btn' @click="saveSubmit" :loading="loading">{{$t('message.common.confirm')}}</el-button>
                        </div>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
import maskPhoneNumber from '@/utils/phone'
import {getInfo,configs,saveInfo,upAvatar} from '@/api/userApi'
export default {
    data(){
        return{
            info:'',
            configs:[],
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
            loading:false,
            edit:false,
            queryParams:{
                file:''
            },
            username:Cookies.get("username")? maskPhoneNumber(Cookies.get("username") ):'',
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
    mounted(){
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
        handleRemove(file, fileList){
            this.queryParams.file = ''
        },
        handleChange(file, fileList){
            this.queryParams.file = fileList[0].raw
            this.upLoad()
        },
        // 编辑框
        editShow(){
            this.edit = !this.edit
            this.$emit('editUser',this.edit)
        },
        // 上传头像
        upLoad(){
            const formData = new FormData()
            formData.append('logo', this.queryParams.file)
            upAvatar(formData).then(response => {
                        if(response.code == 1000){
                            // this.formData.avatar = response.data.url+response.data.key
                            this.$refs.upload.clearFiles()
                            this.$set(this.formData,'avatar',response.data.url+response.data.key)
                        }else{
                            this.$message({
                                type: 'error',
                                message: response.msg
                            });
                        }
            }).catch((res) => {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
            })
        },
        // 选择
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
                                this.$message({
                                    type: 'success',
                                    message: '保存成功'
                                });
                                this.getInfo()
                                this.edit = false
                                this.$emit('editUser',false)
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
.setting-userInfo{
        width:100%;
        background:#fff;
        border-radius:10px;
        padding:20px;
        box-sizing: border-box;
        margin-bottom:20px;
    }
    .setting-item-title{
        display: flex;
        align-items: center;
        justify-content: space-between;
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
    .userInfo-box{
        display: flex;
        align-items: flex-start;
        width:90%;
        margin:0 auto;
        padding:50px 0;
    }
    .userInfo-img{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-right:80px;
        position: relative;
    }
    .upload-demo{
        width:80px;
        height:80px;
        position: absolute;
        left:35px;
        top:0;
        opacity: 0;
        overflow: hidden;
    }
    .userInfo-change{
        width:80px;
        height:80px;
        position: absolute;
        left:35px;
        top:0;
        background: rgba(0,0,0,0.5);
        text-align: center;
        line-height: 80px;
        color:#fff;
        font-size:14px;
        text-decoration: underline;
        overflow: hidden;
        border-radius:50%;
    }
    .userInfo-avater{
        width:80px;
        height:80px;
        border-radius:50%;
        margin-bottom:10px;
    }
    .userInfo-nickname{
        font-size:var(--fontSize-smax);
        color:var(--color-black-100);
        width:150px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .userInfo-info{
        display: grid;
        grid-template-columns:1fr 1fr 1fr;
        column-gap:20px;
        row-gap:40px;
        width:100%;
    }
    .info-item{
        display: flex;
        align-items: baseline;
        width:350px;
    }
    .info-item-label{
        width:200px;
        font-size:var(--fontSize-default);
        color:var(--color-black-60);
    }
    .info-item-value{
        width:200px;
        font-size:var(--fontSize-default);
        color:var(--color-black-100);
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
    .select-item.active{
        color: var(--color-primary);
    }
    .select-title{
        color:#000;
        font-size:var(--fontSize-big);
        border-bottom:1px solid #e5e5e5;
        height:34px;
        line-height:34px;
    }
    .age-span{
        position: absolute;
        right:-55px;
        top:0;
        width:60px;
    }
</style>
