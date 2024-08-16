<template>
    <div class='account' >
        <div class='account-main' >
            <div class='agp-top' >
                <div class='agp-top-fl' >
                    <div class='report-title'> {{$t('message.route.'+$route.meta.title)}}</div>
                </div>
                <div class='agp-fr' >
                    <el-button type="primary" @click="upload">
                        <img src="~@/assets/image/btn-upload.png" alt="" class='btn-upload' >
                        上传数据
                    </el-button>
                </div>
            </div>
            <div class="userinfo" >
                <img :src="info.avatar" alt="" class='avatar' >
                <div class='nickname' >{{username}}</div>
                <div class='edit_password' @click='passwordDialog = true'>修改密码</div>
                <div class='remove_account' @click='accountDialog = true'>注销账号</div>
            </div>
        </div>
        <!-- 注销账号 -->
        <el-dialog
        :visible.sync="accountDialog"
        :show-close="false"
        title='注销账号'
        custom-class='printToask'
        width="1060"
        >   
            <div class='remove-box' >
                <div class='remove-title' >
                    申请注销{{username}}绑定的账号
                </div>
                <div class='remove-tips' >
                    <img src="~@/assets/image/warning-icon.png" alt="" class='warning-icon' >
                    请认真阅读以下重要提醒慎重操作
                </div>
                <div class='warning-item' >
                    1.注销账号为不可恢复的操作，您的身份信息、账户信息等将被清空且无法恢复。<br/>
                    2.注销成功后，我们将删除您账号下所有的数据，包括但不限于个人资料、佩戴记录、事件记录、数据报告、报告解读、控糖方案。<br/>
                    3.注销后，手机号可以注册新的账号，新账号不会存在之前账号的任何信息。
                </div>
                <div class='remove-rule' >
                    <el-checkbox v-model="agree" ></el-checkbox>
                    <div class='login-text'>请阅读并同意  <a :href="delete_account_url" target="_blank" rel="noopener noreferrer">《账号注销须知》</a></div>
                </div>
            </div>
            <img src="~@/assets/image/close-icon.png" alt="" class='dialog-close' @click='accountDialog=false' >
             <el-button :loading="loading" class="remove-submit"  :disabled="!agree"   type="info" @click.native.prevent="removeSubmit"  >
                <span v-if="!loading">申请注销</span>
                <span v-else>注销中</span>
            </el-button>
        </el-dialog>
        <!-- 修改密码 -->
        <el-dialog
        :visible.sync="passwordDialog"
        :show-close="false"
        title='修改密码'
        custom-class='printToask'
        width="1060"
        >   
            <el-form :model="form" ref='form' :rules='phoneRules' label-width="120px" class='passwordForm' v-if='!passwordSuccess' >
                <el-form-item label="手机号：" prop='phone_number' >
                    <el-input v-model="form.phone_number" :disabled="true" ></el-input>
                </el-form-item>

                <el-form-item label="请输入验证码：" prop='code'>
                    <div class='code-item' >
                        <el-input v-model="form.code"  placeholder=""></el-input>
                        <div class='get-code' @click='getCode(0)' v-if='codeType==1' >获取验证码</div>
                        <div class='code-time'  v-if='codeType==2'>{{codeTime}}s</div>
                        <div class='get-code'  v-if='codeType==3' @click='getCode(0)'>重新发送</div>
                    </div>
                </el-form-item>
                 <el-form-item  label="请输入新密码：" prop='password' >
                    <el-input v-model="form.password"
                        placeholder="请输入6-20位新密码" show-password></el-input>
                </el-form-item>
                <el-form-item  label="请确认新密码：" prop='new_password' >
                    <el-input v-model="form.new_password"
                        placeholder="请确认新密码"
                        show-password></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button  :loading="loading" class="password-submit"  :disabled="passwordDisabled"  type="primary" @click.native.prevent="changePassword"  >
                        <span>确认</span>
                    </el-button>
                </el-form-item>
            </el-form>
            <div class='success-box' v-else>
                <img src="~@/assets/image/success-icon.png" alt="" class='success-icon' >
                <div class='success-text'>已成功修改密码</div>
                <div class='success-btn' @click="passwordDialog = false" >确认</div>
            </div>
            <img src="~@/assets/image/close-icon.png" alt="" class='dialog-close' @click='passwordDialog=false' >
        </el-dialog>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
import maskPhoneNumber from '@/utils/phone'
import {getInfo,protocol,deleteAccount,sendsmscode,verifysmscode,setPassword} from '@/api/userApi'
export default {
    data(){
        var validateCheckPass = (rule,value,callback)=>{
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return{
            info:'',
            accountDialog:false,
            agree:false,
            loading:false,
            passwordDialog:false,
            delete_account_url:'',
            username:Cookies.get("username")? maskPhoneNumber(Cookies.get("username") ):'',
            form:{
                phone_number:Cookies.get("username")? maskPhoneNumber(Cookies.get("username") ):'',
                code:'',
                password:'',
                new_password:''
            },
            phoneRules: {
                phone_number: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
                code: [{ required: true, trigger: 'blur', message: "请输入验证码" }],
                password: [{ required: true, trigger: "blur", message: "请输入密码" },
                {pattern: /^.{6,20}$/, message: '密码位数必须在6~20位之内', trigger: ['blur', 'change']}],
                new_password: [{validator: validateCheckPass,required: true, trigger: 'blur'}],
            },
            codeType:1, //1获取验证码 2倒计时 3重新发送
            codeTime:60,
            passwordSuccess:false
        }
    },
    computed:{
        passwordDisabled(){
            let pattern =  /^[12][3456789]\d{9}$/
            let patterns = /^.{6,20}$/
            if(pattern.test(this.form.phone_number)&&this.form.code&&patterns.test(this.form.password)&&patterns.test(this.form.new_password)){
                return false
            }else{
                return true
            }
        }
    },
    created(){
        this.getprotocol()
        this.getInfo()
    },  
    methods:{
        upload(){
            this.$router.push('/upLoad')
        },
         // 获取隐私和条款
        getprotocol(){
            protocol({}).then(response => {
                    if(response.code == 1000){
                       this.delete_account_url = response.data.delete_account_url
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
            getInfo().then(response => {
                    if(response.code == 1000){
                        this.info = response.data
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
        // 注销账号
        removeSubmit(){
            this.loading = true
            deleteAccount({}).then(response => {
                    if(response.code == 1000){
                        this.loading = false
                        this.$router.push('/login')
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
          // 获取验证码
        getCode(smsType){
            console.log(123)
             this.$refs['form'].validateField('phone_number',value => {
                console.log(value)
                if(!value){
                    this.codeType=2
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
             sendsmscode({phone_number:Cookies.get("username"),type:2}).then(response => {
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
        changePassword(){
            this.$refs.form.validate((valid) => {
                if(valid){
                    this.loading = true
                    verifysmscode({phone_number:this.form.phone_number,code:this.form.code,type:2}).then(response => {
                            this.loading=false
							if(response.code == 1000){
                                setPassword({password:this.$md5(this.form.password),new_password:this.$md5(this.form.new_password)}).then(response => {
                                        if(response.code == 1000){
                                            this.passwordSuccess = true
                                        }else{
                                            
                                            this.$message({
                                                type: 'error',
                                                message: response.msg
                                            });
                                        }
                                }).catch((res) => {
                                    console.log(res)
                                })
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
        }
    }
}
</script>
<style scoped>
    .account-main{
        width:76%;
        margin:0 auto;
    }
  .agp-top{
        display: flex;
        display: -webkit-flex;
        display:-webkit-inline-flex;
        align-items: center;
        justify-content: space-between;
        width:100%;
        margin-bottom:20px;
    }
    .report-title{
        font-size:var(--fontSize-max);
        color:var(--color-black-100);
        font-weight: 700;
    }
    .report-sub-title{
        font-size:var(--fontSize-big);
        color:var(--color-black-60);
        margin-top:20px;
    }
    .btn-upload{
        display: inline-block;
        vertical-align: middle;
        margin-right:4px;
        width:20px;
        height:20px;
    }
    .userinfo{
        width:100%;
        height:470px;
        background:#fff;
        border-radius:10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: relative;
    }
    .nickname{
        font-size:var(--fontSize-max);
        color:var(--color-black-100);
        height:40px;
        line-height: 40px;
    }
    .edit_password{
        font-size:var(--fontSize-default);
        color:var(--color-primary);
        text-decoration: underline;
        cursor: pointer;
    }
    .remove_account{
        font-size:var(--fontSize-default);
        color:var(--color-error);
        text-decoration: underline;
        position: absolute;
        left:40px;
        bottom:20px;
        cursor: pointer;
    }
    .avatar{
        width:80px;
        height:80px;
        border-radius:50%;
    }
    .remove-box{
        width:600px;
        margin:0 auto;
    }
    .passwordForm{
        width:600px;
        margin:30px auto;
    }
    .remove-title{
        font-size:var(--fontSize-max);
        color:var(--color-black-100);
        text-align: center;
        margin-bottom:20px;
    }
    .remove-tips{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size:var(--fontSize-big);
        color:var(--color-black-60);
        margin-bottom:10px;
    }
    .warning-icon{
        width:16px;
        height:16px;
        margin-right:10px;
    }
    .warning-item{
        font-size:var(--fontSize-big);
        color:var(--color-warning);
        line-height: 22px;
        margin-bottom:80px;
    }
    .remove-rule{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom:20px;
    }
    .login-text{
        font-size:var(--fontSize-small);
        color:var(--color-black-40);
        margin-left:6px;
    }
    .login-text a{
        text-decoration: none;
        color:#0d84ff;
    }
    .remove-submit{
        display: block;
        color:var(--color-error);
        border:none;
        background: #f0f0f0;
        margin:0 auto;
        margin-bottom:30px;
    }
    .code-item{
        position: relative;
    }
    .get-code{
        color:#0D84FF;
        font-size: var(--fontSize-small);
        position: absolute;
        right:14px;
        top:0;
        cursor: pointer;
    }
    .code-time{
        font-size: var(--fontSize-small);
        position: absolute;
        right:14px;
        top:0;
        color:var(--color-black-30);
    }
    .password-submit{
        display: block;
        margin:20px auto;
        width:140px;
    }
    .success-box{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .success-icon{
        width:80px;
        height:80px;
        margin-bottom:20px;
    }
    .success-text{
        font-size:var(--fontSize-max);
        color:var(--color-primary);
        margin-bottom:70px;
    }
    .success-btn{
        width:140px;
        height:50px;
        border-radius:10px;
        background:var(--color-primary);
        text-align: center;
        line-height:50px;
        color:#fff;
        font-size:var(--fontSize-big);
        margin-bottom:30px;
        cursor: pointer;
    }
</style>