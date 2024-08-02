<template>
    <div class='setting-userInfo userinfobox' >
        <div class='setting-item-title' >
            <div class='item-title' >个人信息</div>
            <div class='item-edit' @click='editShow' v-if='!edit' >修改个人信息</div>
        </div>
        <div class='userInfo-box' v-if='!edit'>
            <div class='userInfo-img' >
                <img :src="info.avatar" alt="" class="userInfo-avater" >
                <div class='userInfo-nickname' >{{info.nickname}}</div>
            </div>
            <div class='userInfo-info' >
                <div class='info-item' >
                    <div class='info-item-label' >姓名：</div>
                    <div class='info-item-vale' >{{info.nickname}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >出生日期：</div>
                    <div class='info-item-vale' >{{info.birthdate?info.birthdate:'--'}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >性别：</div>
                    <div class='info-item-vale' >{{info.gender==0?'男':info.gender==1?'女':'--'}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >身高：</div>
                    <div class='info-item-vale' >{{info.height?info.height:'--'}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >体重：</div>
                    <div class='info-item-vale' >{{info.weight?info.weight:'--'}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >糖尿病类型：</div>
                    <div class='info-item-vale' >{{info.show_diabetes_type?info.show_diabetes_type:'--'}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >确诊日期：</div>
                    <div class='info-item-vale' >{{info.diagnosis_date?info.diagnosis_date:'--'}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >治疗方案：</div>
                    <div class='info-item-vale' >{{info.treatment_regimen?info.show_treatment_regimen:'--'}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >合并症：</div>
                    <div class='info-item-vale' >{{info.comorbidities?info.show_comorbidities:'--'}}</div>
                </div>
                <div class='info-item' >
                    <div class='info-item-label' >并发症：</div>
                    <div class='info-item-vale' >{{info.complications?info.show_complications:'--'}}</div>
                </div>
            </div>
        </div>
        <div class='edit-userinfo-box userInfo-box' v-else>
            <div class='userInfo-img' >
                <img :src="formData.avatar" alt="" class="userInfo-avater" >
                <div class='userInfo-nickname' >{{formData.nickname}}</div>
                 <el-upload
                        class="upload-demo"
                        ref='upload'
                        list-type="picture-card"
                        accept='image/*'
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
                <el-form ref="formData"  label-width="120px" label-position="left" :rules="rules"  :model="formData" :inline="true">
                     <el-form-item label="姓名:" prop='nickname'>
                            <el-input v-model="formData.nickname" class='user-inp'>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="出生日期:" >
                            <el-date-picker v-model="formData.birthdate" type="date"  placeholder="未填写"
                            :picker-options="pickerOptions"
                            :default-value='defaultBirthday'
                            prefix-icon =' '
                            value-format="yyyy-MM-dd"	>
                            </el-date-picker>
                            <i class="el-icon-arrow-down picker-date-icon "></i>
                            <span class='age-span' v-if='age'>（{{age}}岁）</span>
                        </el-form-item>
                        <el-form-item label="性别:"  >
                            <el-select v-model="formData.gender" placeholder="未填写">
                                <el-option label="男" :value="0" ><div :class='[formData.gender?"":"active","select-item"]'>男</div></el-option>
                                <el-option label="女" :value='1'><div>女</div></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="身高:" >
                                <el-select v-model="formData.height" placeholder="未填写">
                                <el-option  v-for='item in heightArray' :key='item' :label="item+'cm'" :value="item" >
                                    <div :class='[item==175&&!formData.height?"active":"","select-item"]'>{{item}}cm</div>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="体重:" >
                                <el-select v-model="formData.weight" placeholder="未填写">
                                <el-option  v-for='item in weightArray' :key='item' :label="item+'kg'" :value="item" >
                                        <div :class='[item==60&&!formData.weight?"active":"","select-item"]'>{{item}}kg</div>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="糖尿病类型:" >
                                <el-select v-model="formData.diabetes_type" popper-class='edit-select' placeholder="未填写">
                                    <el-option  :disabled="true">
                                        <div class='select-title'>糖尿病类型</div>
                                        </el-option>
                                    <el-option  v-for='item in diabetes_type_arr' :key='item.item_key' :label="item.item_name" :value="item.item_key" >
                                    </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="确诊日期:" v-if='diagnosisShow'>
                            <el-date-picker v-model="formData.diagnosis_date" type="date" value-format="yyyy-MM-dd"
                                prefix-icon =' ' placeholder="未填写" :picker-options="diagnosisPickerOptions"></el-date-picker>
                                <i class="el-icon-arrow-down picker-date-icon "></i>
                                <span class='age-span' v-if='diabetes_year' >（{{diabetes_year}}年）</span>
                        </el-form-item>
                         <el-form-item label="治疗方案:"  class='multiple'>
                            <el-select v-model="formData.treatment_regimen" popper-class='edit-select' multiple placeholder="未填写" @change='chooseTreatmentRegimen'>
                                <el-option  :disabled="true">
                                    <div class='select-title'>治疗方案</div>
                                </el-option>
                                <el-option  v-for='item in treatment_regimen_arr' :key='item.item_key' :label="item.item_name" :value="item.item_key" >
                                </el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item label="合并症:"  class='multiple'>
                                <el-select v-model="formData.comorbidities" popper-class='edit-select' multiple placeholder="未填写" @change='chooseComorbidities' >
                                    <el-option  :disabled="true">
                                        <div class='select-title'>合并症</div>
                                    </el-option>
                                    <el-option  v-for='item in comorbidities_arr' :key='item.item_key' :label="item.item_name" :value="item.item_key" >
                                    </el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item label="并发症:"  class='multiple'>
                                <el-select v-model="formData.complications" popper-class='edit-select' multiple placeholder="未填写" @change='chooseComplications'>
                                     <el-option  :disabled="true">
                                        <div class='select-title'>并发症</div>
                                    </el-option>
                                    <el-option  v-for='item in complications_arr' :key='item.item_key' :label="item.item_name" :value="item.item_key" >
                                    </el-option>
                            </el-select>
                        </el-form-item>
                        <div class='btn-box' >
                            <el-button type="info" class='cancel-btn' @click='editShow'>取消</el-button>
                            <el-button type="primary"  class='confirm-btn' @click="saveSubmit" :loading="loading">保存</el-button>
                        </div>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
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
            rules:{
                nickname: [
                    { required: true, message: '姓名栏不能为空', trigger: 'blur' },
                    { pattern:/^[^*+?.[\]{}()|]/,  message: '姓名不能包含特殊字符', trigger: 'blur' }
                ],
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
            }
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
                            console.log(this.formData)
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
                        obj.show_diabetes_type = _.filter(this.diabetes_type_arr,['item_key',obj.diabetes_type])[0].item_name
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
        font-size:var(--fontSize-max);
        color:var(--color-black-100);
        border-left:3px solid var(--color-primary);
        padding-left:10px;
        height:24px;
        line-height: 24px;
        font-weight: 700;
    }
    .item-edit{
        font-size:var(--fontSize-big);
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
        margin-right:100px;
        position: relative;
    }
    .upload-demo{
        width:80px;
        height:80px;
        position: absolute;
        left:17px;
        top:0;
        opacity: 0;
        overflow: hidden;
    }
    .userInfo-avater{
        width:80px;
        height:80px;
        border-radius:50%;
        margin-bottom:10px;
    }
    .userInfo-nickname{
        font-size:var(--fontSize-max);
        color:var(--color-black-100);
        width:100px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .userInfo-info{
        display: grid;
        grid-template-columns:1fr 1fr 1fr;
        column-gap:20px;
        row-gap:30px;
        width:100%;
    }
    .info-item{
        display: flex;
        align-items: center;
    }
    .info-item-label{
        width:130px;
        font-size:var(--fontSize-big);
        color:var(--color-black-60);
    }
    .info-item-value{
        width:320px;
        font-size:var(--fontSize-big);
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
        /* color:#000; */
       font-size:var(--fontSize-smax);
    }
    .age-span{
        position: absolute;
        right:-55px;
        top:0;
        width:55px;
    }
</style>
