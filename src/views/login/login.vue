<template>
    <div class='login-box'>
        <div class='login-main' >
            <div class='login-title' >{{$t('message.register.login')}}</div>
            <el-form ref="loginForm" :model="loginForm" label-position="top"  :validate-on-rule-change="false" :rules="loginRules" >
                <el-form-item  prop='username' :class='[responseEmailError?"is-error":"","form-item-normal"]' :label='$t("message.register.email")' >
                    <el-input v-model="loginForm.username"
                        @focus="inputFocus"
                        :placeholder="$t('message.register.email')"></el-input>
                    <div class='error-tips' v-if='responseEmailError'>{{$t('message.errorCode.'+errorCode)}}</div>
                </el-form-item>
                <el-form-item  prop='password' :class='[responsePasswordError?"is-error":"","form-item-special"]' :label='$t("message.register.password")' >
                    <el-input v-model="loginForm.password"
                        @focus="inputFocus"
                        :placeholder='$t("message.register.password")'
                        show-password></el-input>
                        <div class='error-tips' v-if='responsePasswordError'>{{$t('message.errorCode.'+errorCode)}}</div>
                </el-form-item>
                <el-form-item >
                    <el-button  :loading="loading" class="login-submit"  :disabled="comDiabled"  style="width: 100%" type="primary" @click.native.prevent="accountLogin"  >
                        <span v-if="!loading">{{$t("message.botton.continue")}}</span>
                        <span v-else>{{$t("message.botton.continue")}}</span>
                    </el-button>
                </el-form-item>
            </el-form>
            <div class='forget' @click="forgetBtn">{{$t("message.register.forget")}}</div>
            <div class='account' >{{$t("message.register.noAccount")}}? <span class='register-account' @click='registerBtn'>{{$t("message.register.creat")}}</span> </div>
        </div>
    </div>
</template>
<script>
import Cookies from "js-cookie"
import {account} from '@/api/userApi'
import {getToken, removeToken, setToken} from '@/utils/auth'
export default {
    data(){
        return{
            loading:false,
            loginForm:{
                username:'',
                password:''
            },
            loginRules: {
                username: [{ required: true, message: 'Invalid email adress.', trigger: 'blur' },
                            { pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, message: 'Invalid email adress.', trigger: 'blur'}],
                password: [{ required: true, trigger: "blur", message: "The account or password do not match. Please re-enter." },
                {pattern: /^.{6,20}$/, message: '6-20 characters required.', trigger: 'blur'}],
            },
            responseEmailError:false,
            responsePasswordError:false,
            errorCode:''
        }
    },
     computed:{
        comDiabled(){
            let upattern =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
            let ppattern = /^.{6,20}$/
            if(upattern.test(this.loginForm.username)&&ppattern.test(this.loginForm.password)){
                return false
            }else{
                return true
            }
        }
    },
    methods:{
         inputFocus(){
            this.responseEmailError = false
        },
        registerBtn(){
            this.$emit('registerTab')
        },
        forgetBtn(){
            this.$emit('forgetTab')
        },
        accountLogin(){
            this.$refs.loginForm.validate((valid) => {
                if(valid){
                    this.loading = true
                    account({username:this.loginForm.username,password:this.$md5(this.loginForm.password)}).then(response => {
                            this.loading=false
							if(response.code == 1000){
								this.$message({
									type: 'success',
									message: '登录成功'
								});
								setToken(response.data.token)
                                Cookies.set("username", this.loginForm.username, { expires: 30 })
                                this.$router.push('/')
							}else if(response.code == 2204){
								this.responsePasswordError = true
                                  this.responseEmailError = false
                                this.errorCode = response.code
							}else{
                                this.responseEmailError = true
                                this.responsePasswordError = false
                                this.errorCode = response.code
                            }
					}).catch((res) => {
						console.log(res)
					})
                   
                  
                }
            })
        }
    }
}
</script>
<style scoped>
    .login-box{
       width:100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .login-main{
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
    }
    .login-submit{
        margin-top:80px;
        font-size:var(--fontSize-default);
    }
    .forget{
        text-align: center;
        font-size:var(--fontSize-default);
        color:var(--color-black-60);
        margin-bottom:40px;
        cursor: pointer;
    }
    .account{
        text-align: center;
        font-size:var(--fontSize-big);
        color:var(--color-black-100);
        cursor: pointer;
    }
    .register-account{
       color:var(--color-primary);
       text-decoration: underline;
    }
</style>