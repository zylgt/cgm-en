<template>
        <div class="login" id='login'>
            <div class='login-main' >
                <div class='login-box' v-if='!forgetPassword&&!setPasswordTab'>
                    <el-tabs v-model="activeName" @tab-click='tabClick'>
                        <el-tab-pane label="登录" name="login"></el-tab-pane>
                        <el-tab-pane label="注册" name="register"></el-tab-pane>
                    </el-tabs>
                    <div  class='login-form'>
                        <el-form ref="accountForm" :model="accountForm"  :validate-on-rule-change="false" :rules="accountRules" v-show='loginType==1' >
                            <el-form-item  prop='username' class='form-item-normal'>
                                <el-input v-model="accountForm.username"
                                    placeholder="请输入您的手机号"></el-input>
                            </el-form-item>
                            <el-form-item  prop='password' class='form-item-special'>
                                <el-input v-model="accountForm.password"
                                    placeholder="密码"
                                    show-password></el-input>
                            </el-form-item>
                            <el-form-item prop='agree' class='login-rules' >
                                <div class='login-rule' >
                                    <el-checkbox v-model="accountForm.agree" ></el-checkbox>
                                    <div class='login-text'>请阅读并同意  <a :href="user_agreement_url" target="_blank" rel="noopener noreferrer">《用户服务协议》</a>及<a :href="privacy_policy_url" target="_blank" rel="noopener noreferrer">《隐私政策》</a></div>
                                </div>
                            </el-form-item>
                            <el-form-item >
                                <el-button  :loading="loading" class="login-submit"  :disabled="comDiabled"  style="width: 100%" type="primary" @click.native.prevent="accountLogin"  >
                                    <span v-if="!loading">登录</span>
                                    <span v-else>登录中</span>
                                </el-button>
                            </el-form-item>
                        </el-form>
                        <el-form ref="phoneForm" :model="phoneForm"  :rules="phoneRules" v-show='loginType==2'>
                            <el-form-item  prop='username' class='form-item-normal'>
                                <el-input v-model="phoneForm.username"
                                    placeholder="请输入您的手机号"></el-input>
                            </el-form-item>
                            <el-form-item  prop='code'  class='form-item-special'>
                                <div class='code-item' >
                                    <el-input v-model="phoneForm.code"  placeholder="请输入验证码"></el-input>
                                    <div class='get-code' @click='getCode(0)' v-if='codeType==1' >获取验证码</div>
                                    <div class='code-time'  v-if='codeType==2'>{{codeTime}}s</div>
                                    <div class='get-code'  v-if='codeType==3' @click='getCode(0)'>重新发送</div>
                                </div>
                            </el-form-item>
                            <el-form-item prop='agree' class='login-rules' >
                                <div class='login-rule' >
                                    <el-checkbox v-model="phoneForm.agree"></el-checkbox>
                                    <div class='login-text'>请阅读并同意  <a :href="user_agreement_url" target="_blank" rel="noopener noreferrer">《用户服务协议》</a>及<a :href="privacy_policy_url" target="_blank" rel="noopener noreferrer">《隐私政策》</a></div>
                                </div>
                            </el-form-item>
                            <el-form-item >
                                 <el-button v-if='activeName=="login"' :loading="loading" class="login-submit"  :disabled="comDiableds"  style="width: 100%" type="primary" @click.native.prevent="phoneSubmit"  >
                                    <span v-if="!loading">登录</span>
                                    <span v-else>登录中</span>
                                </el-button>
                                 <el-button v-else :loading="loading" class="login-submit"  :disabled="comDiableds"  style="width: 100%" type="primary" @click.native.prevent="registerSubmit"  >
                                    <span v-if="!loading">注册</span>
                                    <span v-else>注册中</span>
                                </el-button>
                            </el-form-item>
                        </el-form>
                        <div class='login-item' v-if='activeName=="login"'>
                            <p @click='showForget'>忘记密码</p>
                            <p @click='changeLogin(2)' v-if='loginType==1' >验证码登录</p>
                            <p @click='changeLogin(1)' v-if='loginType==2'>密码登录</p>
                        </div>
                         <div class='login-item' v-else>
                        </div>
                        <div  class='san'>
                            <el-divider >第三方账号登录</el-divider>
                            <div class='san-logo' >
                                <img src="~@/assets/image/login-mi.png" alt="" class='san-icon' >
                                <img src="~@/assets/image/login-wechat.png" alt="" class='san-icon' > 
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 设置密码 -->
                <div class='login-box' v-show='setPasswordTab'>
                    <div class='module-title'>{{passwordType==1?"设置密码":"重置密码"}}</div>
                    <div  class='login-form'>
                        <el-form ref="passData" :model="passData" :validate-on-rule-change="false" :rules="passRules">
                            <el-form-item  prop='password' class='form-item-normal'>
                                <el-input v-model="passData.password"
                                    placeholder="请输入6-20位新密码" show-password></el-input>
                            </el-form-item>
                            <el-form-item  prop='new_password' class='form-item-special'>
                                <el-input v-model="passData.new_password"
                                    placeholder="请确认新密码"
                                    show-password></el-input>
                            </el-form-item>
                            <el-form-item v-if='passwordType==1'>
                                <el-button  :loading="loading" class="password-submit"  :disabled="passwordDisabled"  style="width: 100%" type="primary" @click.native.prevent="changePassword"  >
                                    <span>确认</span>
                                </el-button>
                            </el-form-item>
                            <el-form-item v-else>
                                <el-button  :loading="loading" class="password-submit"  :disabled="passwordDisabled"  style="width: 100%" type="primary" @click.native.prevent="resetPassword"  >
                                    <span>确认</span>
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!-- 成功提示 -->
                    <div class='set-success'  v-if='resetSuccess' >
                        <img src="~@/assets/image/success-icon.png" alt="" class='success-icon' >
                        <div class='success-tips' >密码重置成功！</div>
                    </div>
                </div> 
                <!-- 找回密码 -->
                <div class='login-box' v-if='forgetPassword' >
                    <div class='module-title' @click='handelBack' > <img src="~@/assets/image/back-icon.png" alt="" class="back-icon" > 找回密码</div>
                     <div  class='login-form'>
                         <el-form ref="phoneForm" :model="phoneForm" :validate-on-rule-change="false"   :rules="phoneRules" v-show='loginType==2'>
                            <el-form-item  prop='username' class='form-item-normal'>
                                <el-input v-model="phoneForm.username"
                                    placeholder="请输入您的手机号"></el-input>
                            </el-form-item>
                            <el-form-item  prop='code'  class='form-item-special'>
                                <div class='code-item' >
                                    <el-input v-model="phoneForm.code"  placeholder="请输入验证码"></el-input>
                                    <div class='get-code' @click='getCode(2)' v-if='codeType==1' >获取验证码</div>
                                    <div class='code-time'  v-if='codeType==2'>{{codeTime}}s</div>
                                    <div class='get-code'  v-if='codeType==3' @click='getCode(2)'>重新发送</div>
                                </div>
                            </el-form-item>
                            <el-form-item >
                                 <el-button :loading="loading"   class="password-submit"  :disabled="comDiableds"  style="width: 100%" type="primary" @click.native.prevent="verifyCode"  >
                                    <span>下一步</span>
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div> 
                <div class='divider' ></div>
                <div class='login-design' >
                    <img src="~@/assets/image/login-img.png" alt="" class='login-img' >
                </div>
            </div>
        </div>
</template>

<script>
import Cookies from "js-cookie"
import {account,phoneLogin,sendsmscode,protocol,verifysmscode,setPassword,phoneRegister,resetPassword} from '@/api/userApi'
import {getToken, removeToken, setToken} from '@/utils/auth'
export default {
    data(){
        var validateCheckPass = (rule,value,callback)=>{
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.passData.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            accountForm:{
                username:'',
                password:'',
                agree:[]
            },
            phoneForm:{
                username:'',
                code:'',
                agree:[]
            },
            passData:{
                password:'',
                new_password:''
            },
            timer:'',
            forgetPassword:false,
            setPasswordTab:false,
            PasswordLoading:false,
            resetSuccess:false,
            passRules:{
                password: [{ required: true, trigger: "blur", message: "请输入密码" },
                {pattern: /^.{6,20}$/, message: '密码位数必须在6~20位之内', trigger: ['blur', 'change']}],
                new_password: [{validator: validateCheckPass,required: true, trigger: 'blur'}],
            },
            loading:false,
            activeName:'login',
            loginType:2, //1验证码登录，2密码登录
            codeType:1, //1获取验证码 2倒计时 3重新发送
            codeTime:60,
            smsCodeType:0, //0登录、注册 2找回密码
            passwordType:1, //1设置密码 2找回密码
            user_agreement_url:'',
            privacy_policy_url:'',
            accountRules: {
                username: [{ required: true, message: '请输入手机号', trigger: 'blur' },
                            { pattern: /^[12][3456789]\d{9}$/, message: '请输入有效的11位数字手机号码', trigger: 'blur'}],
                password: [{ required: true, trigger: "blur", message: "请输入密码" },
                {pattern: /^.{6,20}$/, message: '请输入6-20位密码', trigger: 'blur'}],
                agree: [{required: true, trigger: "blur", message: "请先阅读并同意勾选协议" }]
            },
             phoneRules: {
                username: [{ required: true, message: '请输入手机号', trigger: 'blur' },
                            { pattern: /^[12][3456789]\d{9}$/, message: '请输入有效的11位数字手机号码', trigger: 'blur'}],
                code: [{ required: true, trigger: 'blur', message: "请输入验证码" }],
                agree: [{required: true, trigger: "blur", message: "请先阅读并同意勾选协议" }]
            },
        }
    },
    computed:{
        comDiabled(){
            let upattern =  /^[12][3456789]\d{9}$/
            let ppattern = /^.{6,20}$/
            if(upattern.test(this.accountForm.username)&&ppattern.test(this.accountForm.password)){
                return false
            }else{
                return true
            }
        },
        comDiableds(){
            let pattern =  /^[12][3456789]\d{9}$/
            if(pattern.test(this.phoneForm.username)&&this.phoneForm.code){
                return false
            }else{
                return true
            }
        },
        passwordDisabled(){
            if(this.passData.password&&this.passData.new_password){
                return false
            }else{
                return true
            }
        }
    },
    created(){
        
    },
    mounted(){
        this.getprotocol()
    },
    methods:{
        getCookie() {
            const username = Cookies.get("username")
            const password = Cookies.get("password")
            const rememberMe = Cookies.get("rememberMe")
            this.loginForm = {
                username: username === undefined ? this.loginForm.username : username,
                password: password === undefined ? this.loginForm.password :  password,
            }
        },
        // 登录注册切换
        tabClick(tab,e){
            this.$refs['phoneForm'].resetFields();
            if(this.timer){
                clearTimeout(this.timer)
            }
            this.codeTime = 60
            this.codeType = 1
            if(tab.name=='register'){
                this.loginType = 2
            }
        },
        // 切换登录方式
        changeLogin(loginType){
            this.loginType = loginType
            this.activeName='login'
            let self = this
            this.$refs['phoneForm'].resetFields();
            this.$refs['accountForm'].resetFields();
            this.$nextTick(() => {
                self.$refs['phoneForm'].clearValidate();
                self.$refs['accountForm'].clearValidate();
            })
            
        },
        // 注册
        registerSubmit(){
             this.$refs.phoneForm.validate((valid) => {
                if(valid){
                    this.loading = true
                     phoneRegister({phone_number:this.phoneForm.username,code:this.phoneForm.code}).then(response => {
                            this.loading=false
							if(response.code == 1001){
								this.$message({
									type: 'success',
									message: '注册成功,请设置密码'
								});
								setToken(response.data.token)
                                Cookies.set("username", this.phoneForm.username, { expires: 30 })
                                this.passwordType = 1
                                this.setPasswordTab = true
							}else if(response.code == 1002){
                                setToken(response.data.token)
                                this.setPasswordTab = true
                            }else{
                                var msg = ''
                                switch(response.code){
                                    case 2101 :
                                        msg='手机号码不合法'
                                        break;
                                    case 2102 :
                                        msg='验证码发送过于频繁'
                                        break;
                                    case 2103 :
                                        msg='无效的验证码'
                                        break;
                                    case 2104 :
                                        msg='验证码已失效，请重新获取'
                                        break;
                                    case 2201 :
                                        msg='该账号已注册，请登录'
                                        break;
                                    case 2208 :
                                        msg='尝试次数超过上限，请稍后重试'
                                        break;
                                }
								this.$message({
                                    type: 'error',
                                    message: msg
								});
							}
					}).catch((res) => {
						console.log(res)
					})
                  
                }
             })
        },
        // 账号密码
        accountLogin(){
             this.$refs.accountForm.validate((valid) => {
                if(valid){
                    this.loading = true
                    account({username:this.accountForm.username,password:this.$md5(this.accountForm.password)}).then(response => {
                            this.loading=false
							if(response.code == 1000){
								this.$message({
									type: 'success',
									message: '登录成功'
								});
								setToken(response.data.token)
                                Cookies.set("username", this.accountForm.username, { expires: 30 })
                                this.$router.push('/')
							}else if(response.code == 1002){
                                setToken(response.data.token)
                                 this.passwordType = 1
                                 this.setPasswordTab = true
                            }else{
								 var msg = ''
                                switch(response.code){
                                    case 2202 :
                                        msg='用户不存在'
                                        break;
                                    case 2203 :
                                        msg='请先设置密码'
                                        break;
                                    case 2204 :
                                        msg='密码不正确'
                                        break;
                                    case 2208 :
                                        msg='尝试次数超过上限，请稍后重试'
                                        break;
                                }
								this.$message({
                                    type: 'error',
                                    message: msg
								});
							}
					}).catch((res) => {
						console.log(res)
					})
                   
                  
                }
             })
        },
        // 手机号登录
        phoneSubmit(){
             this.$refs.phoneForm.validate((valid) => {
                if(valid){
                    this.loading = true
                     phoneLogin({phone_number:this.phoneForm.username,code:this.phoneForm.code}).then(response => {
                            this.loading=false
							if(response.code == 1000){
								this.$message({
									type: 'success',
									message: '登录成功'
								});
								setToken(response.data.token)
                                Cookies.set("username", this.phoneForm.username, { expires: 30 })
                                this.$router.push('/')
							}else if(response.code == 1002){
                                setToken(response.data.token)
                                 this.passwordType = 1
                                this.setPasswordTab = true
                            }else{
                                var msg = ''
                                switch(response.code){
                                    case 2101 :
                                        msg='手机号码不合法'
                                        break;
                                    case 2102 :
                                        msg='验证码发送过于频繁'
                                        break;
                                    case 2103 :
                                        msg='无效的验证码'
                                        break;
                                    case 2104 :
                                        msg='验证码已失效，请重新获取'
                                        break;
                                    case 2208 :
                                        msg='尝试次数超过上限，请稍后重试'
                                        break;
                                }
								this.$message({
                                    type: 'error',
                                    message: msg
								});
							}
					}).catch((res) => {
						console.log(res)
					})
                  
                }
             })
        },
        // 获取验证码
        getCode(smsType){
             this.$refs['phoneForm'].validateField('username',value => {
                if(!value){
                    this.codeType=2
                    this.smsCodeType = smsType
                    this.timeOut()
                    this.setCode()
                }
             })
        },
        // 验证码倒计时
        timeOut(){
            let time = this.codeTime
            let that = this
            let timer = setTimeout(function(){
                if(time>1){
                    time--
                    that.codeTime = time
                    that.timeOut()
                }else{
                    that.codeType=3
                    that.codeTime = 60
                }
            },1000)
            this.timer = timer
        },
        // 发送验证码
        setCode(){
            let type = this.smsCodeType
            sendsmscode({phone_number:this.phoneForm.username,type:type}).then(response => {
                    this.loading=false
                    if(response.code == 1000){
                        this.$message({
                            type: 'success',
                            message: '发送成功'
                        });
                    }else{
                        var msg = ''
                        switch(response.code){
                            case 2102 :
                                msg='验证码发送过于频繁'
                                break;
                            case 2103 :
                                msg='验证码不正确'
                                break;
                            case 2104 :
                                msg='验证码已过期'
                                break;
                        }
                        this.$message({
                            type: 'error',
                            message: msg
                        });
                    }
            }).catch((res) => {
                console.log(res)
            })
        },
        // 验证验证码
        verifyCode(){
            this.$refs.phoneForm.validate((valid) => {
                if(valid){
                    this.loading = true
                    verifysmscode({phone_number:this.phoneForm.username,code:this.phoneForm.code,type:2}).then(response => {
                            this.loading=false
							if(response.code == 1000){
                                this.forgetPassword = false
								this.setPasswordTab = true
                                this.passwordType = 2
							}else{
                                var msg = ''
                                switch(response.code){
                                    case 2101 :
                                        msg='手机号码不合法'
                                        break;
                                    case 2102 :
                                        msg='验证码发送过于频繁'
                                        break;
                                    case 2103 :
                                        msg='无效的验证码'
                                        break;
                                    case 2202 :
                                        msg='用户不存在'
                                        break;
                                    case 2208 :
                                        msg='尝试次数超过上限，请稍后重试'
                                        break;
                                }
								this.$message({
                                    type: 'error',
                                    message: msg
								});
							}
					}).catch((res) => {
						console.log(res)
					})
                  
                }
             })
        },
        // 忘记密码
        showForget(){
            this.forgetPassword = true
             if(this.timer){
                clearTimeout(this.timer)
            }
            this.codeTime = 60
            this.codeType = 1
            this.phoneForm.username = ''
            this.phoneForm.code=''
        },
        // 返回登录框
        handelBack(){
            this.forgetPassword = false
            if(this.timer){
                clearTimeout(this.timer)
            }
            this.codeTime = 60
            this.codeType = 1
            this.phoneForm.username = ''
            this.phoneForm.code=''
        },
        // 获取隐私和条款
        getprotocol(){
            protocol({}).then(response => {
                    if(response.code == 1000){
                       this.user_agreement_url = response.data.user_agreement_url
                       this.privacy_policy_url = response.data.privacy_policy_url
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
        // 设置密码
        changePassword(){
            this.$refs.passData.validate((valid) =>{
                if(valid){
                    setPassword({password:this.$md5(this.passData.password),new_password:this.$md5(this.passData.new_password)}).then(response => {
                        this.PasswordLoading=false
                        if(response.code == 1000){
                            this.$message({
                                type: 'success',
                                message: '设置成功'
                            });
                            this.$router.push('/userInfo')
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
        // 重置密码
        resetPassword(){
            this.$refs.passData.validate((valid) =>{
                if(valid){
                    resetPassword({phone_number:this.phoneForm.username,code:this.phoneForm.code,new_password:this.$md5(this.passData.new_password)}).then(response => {
                        this.PasswordLoading=false
                        if(response.code == 1000){
                           this.resetSuccess = true
                            this.phoneForm.username = ''
                            this.phoneForm.code=''
                           let self = this
                           setTimeout(function(){
                               self.setPasswordTab = false
                               self.forgetPassword = false
                           },1000)
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
        }
    }
}
</script>

<style >
    .login{
        height: 100%;
        width:100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background:#f7fcfd;
    }
    #login .login-main{
        display: flex;
        align-items: center;
    }
    #login .login-box{
        width:400px;
        height:490px;
        box-shadow: 0px 4px 20px 0px #0000001A;
        background:rgba(255,255,255,0.9);
        border-radius:10px;
        box-sizing: border-box;
        padding:50px 46px;
        position: relative;
    }
    #login .login-box .el-tabs__nav-wrap::after{
        background:none;
        height:3px;
    }
    .el-tabs__active-bar{
        height:3px;
        border-radius:1px;
    }
    #login .set-success{
        width:100%;
        height:100%;
        position: absolute;
        left:0;
        top:0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background:#fff;
    }
    #login .success-icon{
        width:80px;
        height:80px;
        margin-bottom:40px;
    }
     #login .success-tips{
        font-size:var(--fontSize-max);
        color:var(--color-black-80);
        text-align: center;
    }
    #login .title{
        text-align: center;
        margin-bottom:50px;
        font-size:28px;
        font-weight: bold;
        color:var(--color-black-80);
    }
    .module-title{
        font-size: var(--fontSize-max);
        color:var(--color-black-80);
        margin-bottom:25px;
        display: flex;
        align-items: center;
    }
    .back-icon{
        margin-right:10px;
    }
    #login .el-input__inner{
        background: none;
    }
    #login .el-tabs__item{
        font-size:20px;
        font-weight:305;
    }
    #login .el-tabs__item.is-active{
        font-weight: 440;
    }
    #login .form-item-normal{
        margin-bottom:22px;
    }
    #login .form-item-special{
         margin-bottom:6px;
    }
    #login .el-checkbox{
        font-size:var(-fontSize-small);
    }
    #login .divider{
        margin:0 100px;
        width:1px ;
        height:590px;
        background:#e3e3e3;
        margin-left:150px;
    }
    #login .login-rule{
        display: flex;
        align-items: center;
    }
    #login .login-rules .el-form-item__error{
        top:70%;
    }
    #login .check-img{
        width:20px;
        display: block;
    }
    #login .login-text{
        font-size:var(-fontSize-small);
        color:var(--color-black-40);
        margin-left:6px;
    }
    #login .login-text a{
        text-decoration: none;
        color:#0d84ff;
    }
    #login .login-item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size:var(-fontSize-default);
        color:rgba(0,0,0,0,.6);
        height:28px;
    }
    #login .el-divider__text{
        font-size:var(-fontSize-small);
        color:var(--color-black-60);
    }
    #login .san-logo{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    #login .san-icon{
        width:36px;
        height:36px;
        display: block;;
    }
    #login .san-icon:nth-child(1){
        margin-right:30px;
    }
    #login .login-item p{
        cursor: pointer;
    }
    #login .code-item{
        position: relative;
    }
    #login .get-code{
        color:#0D84FF;
        font-size: var(-fontSize-small);
        position: absolute;
        right:14px;
        top:0;
        cursor: pointer;
    }
    #login .code-time{
        font-size: var(-fontSize-small);
        position: absolute;
        right:14px;
        top:0;
        color:var(--color-black-30);
    }
    #login .record-btn{
        display: flex;
        justify-content: flex-end;
    }
    #login .password-submit{
        margin-top:60px;
    }
</style>