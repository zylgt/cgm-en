<template>
    <div class='login-box' >
        <div class='box' v-show='registerDialog'>
            <div class='login-titles' >  <img src="~@/assets/image/left-icon.png" alt="" class='left-icon' @click="back(1)">{{$t('message.register.forget')}}</div>
            <div class='tips'>{{$t('message.register.forgetTips')}}</div>
            <el-form ref="registerForm" :model="registerForm" label-position="top"  :validate-on-rule-change="false" :rules="registerRules" >
                <el-form-item  prop='username' :class='[responseEmailError?"is-error":"","form-item-normal"]'  >
                    <el-input v-model="registerForm.username"
                        @focus="inputFocus"
                        :placeholder="$t('message.register.email')"></el-input>
                     <div class='error-tips' v-if='responseEmailError'>{{$t('message.errorCode.'+errorCode)}}</div>
                </el-form-item>
                <el-form-item >
                    <el-button  :loading="loading" class="login-submit"  :disabled="comDiabled"  style="width: 100%" type="primary" @click.native.prevent="sendCode"  >
                        <span v-if="!loading">{{$t('message.register.sendCode')}}</span>
                        <span v-else>{{$t('message.register.sendCode')}}</span>
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class='box'  v-show='codeDialog'>
            <div class='login-titles' > <img src="~@/assets/image/left-icon.png" alt="" class='left-icon' @click="back(2)">{{$t('message.register.forget')}}</div>
            <div class='tips'>{{$t('message.register.verifyTip')}} {{registerForm.username}}</div>
            <el-form ref="codeForm" :model="codeForm" label-position="top"  :validate-on-rule-change="false" :rules="codeRules" >
                <el-form-item  prop='code' :class='[responseCodeError?"is-error":"","form-item-normal"]' :label='$t("message.register.verifyCode")' >
                    <el-input v-model="codeForm.code"
                        @focus="inputFocus"
                        :placeholder="$t('message.register.verifyCode')"></el-input>
                        <div class='error-tips' v-if='responseCodeError'>{{$t('message.errorCode.'+errorCode)}}</div>
                </el-form-item>
                <el-form-item >
                    <el-button  :loading="loading" class="login-submit login-submits"  :disabled="codeDiabled"  style="width: 100%" type="primary" @click.native.prevent="verifyCode"  >
                        <span v-if="!loading">{{$t('message.botton.verify')}}</span>
                        <span v-else>{{$t('message.botton.verify')}}</span>
                    </el-button>
                </el-form-item>
            </el-form>
            <div class='login-codes'>{{$t("message.register.noCode")}}?</div>
            <div class='code-text'>{{$t("message.register.again")}}</div>
        </div>
         <div class='box' v-show='passwordDialog' >
            <div class='login-title' > <img src="~@/assets/image/left-icon.png" alt="" class='left-icon' @click="back(3)">{{$t('message.register.reset')}}</div>
            <el-form ref="passwordForm" :model="passwordForm" label-position="top"  :validate-on-rule-change="false" :rules="passwordRules" >
               <el-form-item  prop='password' :class='[responsePasswordError?"is-error":"","form-item-special"]' :label='$t("message.register.password")' >
                    <el-input v-model="passwordForm.password"
                        @focus="inputFocus"
                        :placeholder="$t('message.placeholder.password')"
                        show-password></el-input>
                         <div class='error-tips' v-if='responsePasswordError'>{{$t('message.errorCode.'+errorCode)}}</div>
                </el-form-item>
                <el-form-item  prop='new_password' class='form-item-special' :label='$t("message.register.confirmPassword")' >
                    <el-input v-model="passwordForm.new_password"
                        :placeholder="$t('message.placeholder.confirmPassword')"
                        show-password></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button  :loading="loading" class="login-submit login-submits"  :disabled="passwordDiabled"  style="width: 100%" type="primary" @click.native.prevent="PasswordSubmit"  >
                        <span v-if="!loading">{{$t("message.botton.continue")}} </span>
                        <span v-else>{{$t("message.botton.continue")}} </span>
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import Cookies from "js-cookie"
import {sendEmailCode,verifymailcode,resetPassword,sendEmailTest,userExit} from '@/api/userApi'
import {getToken, removeToken, setToken} from '@/utils/auth'
export default {
    data(){
         var validateCheckPass = (rule,value,callback)=>{
            if (value === '') {
                callback(new Error('6-20 characters required.'));
            } else if (value !== this.passwordForm.password) {
                callback(new Error('Password must match. Please re-enter.'));
            } else {
                callback();
            }
        };
        return{
            registerForm:{
                username:''
            },
            registerRules: {
                username: [{ required: true, message: 'Invalid email adress.', trigger: 'blur' },
                            { pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, message: 'Invalid email adress.', trigger: 'blur'}]
            },
            codeForm:{
                code:''
            },
            codeRules:{
                code:[{required: true, message: 'Wrong verify code. Please check your code and try again.', trigger: 'blur'}]
            },
            passwordForm:{
                password:'',
                new_password:''
            },
            passwordRules:{
                password: [{ required: true, trigger: "blur", message: "6-20 characters required" },
                {pattern: /^.{6,20}$/, message: '6-20 characters required.', trigger: ['blur', 'change']}],
                new_password: [{validator: validateCheckPass,required: true, trigger: 'blur'},
                {pattern: /^.{6,20}$/, message: '6-20 characters required.', trigger: ['blur', 'change']}],
            },
            loading:false,
            registerDialog:true,
            passwordDialog:false,
            codeDialog:false,
            user_agreement_url:'',
            privacy_policy_url:'',
            responseEmailError:false,
            responseCodeError:false,
            responsePasswordError:false,
            errorCode:''
        }
    },
    computed:{
        comDiabled(){
            let upattern =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
            if(upattern.test(this.registerForm.username)){
                return false
            }else{
                return true
            }
        },
        codeDiabled(){
            if(this.codeForm.code){
                return false
            }else{
                return true
            }
        },
        passwordDiabled(){
            let ppattern = /^.{6,20}$/
            if(ppattern.test(this.passwordForm.password)&&ppattern.test(this.passwordForm.new_password)&&this.passwordForm.new_password==this.passwordForm.password){
                return false
            }else{
                return true
            }
        }
    },
    methods:{
        inputFocus(){
            this.responseEmailError = false
            this.responseCodeError = false
            this.responsePasswordError = false
        },
        // 发送验证码
        sendCode(){
            this.$refs.registerForm.validate((valid) => {
                if(valid){
                    sendEmailTest({email:this.registerForm.username,type:2,lang:'cn'}).then(response => {
                        this.loading=false
                        if(response.code == 1000){
                            this.$message({
                                type: 'success',
                                message: '发送成功'
                            });
                            this.codeDialog = true
                            this.registerDialog = false
                        }else{
                            this.responseEmailError = true
                            this.errorCode = response.code
                        }
                    }).catch((res) => {
                        console.log(res)
                    })
                }
            })
        },
        // 验证验证码
        verifyCode(){
             this.$refs.codeForm.validate((valid) => {
                if(valid){
                    verifymailcode({email:this.registerForm.username,type:0,code:this.codeForm.code}).then(response => {
                        this.loading=false
                        if(response.code == 1000){
                            this.codeDialog = false
                            this.registerDialog = false
                            this.passwordDialog = true
                        }else{
                            this.responseCodeError = true
                            this.errorCode = response.code
                        }
                    }).catch((res) => {
                        console.log(res)
                    })
                   
                }
            })
        },
        // 设置密码
        PasswordSubmit(){
             this.$refs.passwordForm.validate((valid) => {
                if(valid){
                    resetPassword({email:this.registerForm.username,new_password:this.$md5(this.passwordForm.new_password),code:this.codeForm.code}).then(response => {
                        this.loading=false
                        if(response.code == 1000){
                            this.codeDialog = false
                            this.registerDialog = false
                            this.passwordDialog = true
                            setToken(response.data.token)
                            Cookies.set("username", this.registerForm.username, { expires: 30 })
                            this.$router.push('/')
                        }else{
                             this.responsePasswordError = true
                            this.errorCode = response.code
                        }
                    }).catch((res) => {
                        console.log(res)
                    })
                   
                }
            })
            
        },
        // 返回上一步
        back(val){
            if(val==3){
                this.codeDialog = true
                this.registerDialog = false
                this.passwordDialog = false
            }else if(val==2){
                this.codeDialog = false
                this.registerDialog = true
                this.passwordDialog = false
            }else{
                this.$emit('loginTab')
            }
        }
    }
}
</script>
<style scoped>
    .login-box{
        width:520px;
        height:600px;
        background: #fff;
        border-radius:10px;
        box-shadow: 0px 4px 20px 0px #0000001A;
        padding:70px;
        box-sizing: border-box;
    }
    .login-title{
        font-size:var(--fontSize-max);
        color:#000;
        margin-bottom:30px;
        display: flex;
        align-items: center;
        position: relative;
    }
    .login-submit{
        margin-top:30px;
        font-size:var(--fontSize-default);
    }
    .account{
        text-align: left;
        font-size:var(--fontSize-big);
        color:var(--color-black-100);
        margin-top:50px;
    }
    .register-account{
       color:var(--color-primary);
       text-decoration: underline;
    }
    .login-agree{
        display: flex;
        align-items: center;
        padding-top:60px;
    }
    .check-icon{
        width:20px;
        height:20px;
        cursor: pointer;
    }
    .login-text{
        font-size:12px;
        color:var(--color-black-40);
        margin-left:10px;
    }
    .agree-text{
     color:var(--color-primary);
    }
     .login-titles{
        font-size:var(--fontSize-max);
        color:#000;
        margin-bottom:10px;
        display: flex;
        align-items: center;
        position: relative;
    }
    .left-icon{
        width:40px;
        height:40px;
        position: absolute;
        left:-40px;
        top:-5px;
        cursor: pointer;
    }
    .tips{
        font-size:var(--fontSize-default);
        color:var(--color-black-60);
        margin-bottom:30px;
    }
    .login-submits{
        margin-top:80px;
    }
    .login-codes{
        font-size:var(--fontSize-default);
        color:var(--color-black-100);
        text-align: center;
        margin-top:80px;
    }
    .code-text{
        font-size:var(--fontSize-default);
        color:var(--color-primary);
        text-align: center;
        text-decoration:underline;
        cursor: pointer;
    }
</style>