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
                        {{$t('message.reports.upLoad')}}
                    </el-button>
                </div>
            </div>
            <div class="userinfo" >
                <img :src="info.avatar" alt="" class='avatar' >
                <div class='nickname' >{{$t('message.account.email')}}:{{username}}</div>
                <div class='edit_password' @click='passwordDialog = true'>{{$t('message.account.change')}}</div>
                <div class='remove_account' @click='accountDialog = true'>{{$t('message.account.deactivated')}}</div>
            </div>
        </div>
        <!-- 注销账号 -->
        <el-dialog
        :visible.sync="accountDialog"
        :show-close="false"
        custom-class='printToask'
        width="1060"
        >   
          <div class='dialog-title' >
                <img src="~@/assets/image/warning.png" alt="" class='title-icon' >
                <img src="~@/assets/image/dialog-close.png" alt="" class='dialog-closes' @click='accountDialog=false' >
          </div>
            <div class='remove-box' >
                <div class='remove-title' >
                    {{$t('message.account.deactivatedTitle')}}:{{username}}
                </div>
                <div class='remove-tips' >
                    {{$t('message.account.tips')}}
                </div>
                <div class='warning-item' >
                    {{$t('message.account.explain1')}}<br/>
                   {{$t('message.account.explain2')}}<br/>
                   {{$t('message.account.explain3')}}
                </div>
                <div class='remove-rule' >
                    <el-checkbox v-model="agree" ></el-checkbox>
                    <div class='login-text'>{{$t('message.account.agree')}}  <a :href="delete_account_url" target="_blank" rel="noopener noreferrer">{{$t('message.account.notic')}}</a></div>
                </div>
            </div>
             <el-button :loading="loading" class="remove-submit"  :disabled="!agree"   type="info" @click.native.prevent="removeSubmit"  >
                <span v-if="!loading">{{$t('message.account.deactivated')}}</span>
                <span v-else>{{$t('message.account.deactivated')}}</span>
            </el-button>
        </el-dialog>
        <!-- 修改密码 -->
        <el-dialog
        :visible.sync="passwordDialog"
        :show-close="false"
        :title='$t("message.account.change")'
        custom-class='printToask'
        width="1060"
        >   
            <el-form :model="form" ref='form' :rules='phoneRules' label-width="150px" class='passwordForm' label-position="left" v-if='!passwordSuccess' >
                <el-form-item  :label="$t('message.account.origin')" prop='oldPassword' >
                    <el-input v-model="form.oldPassword"
                        :placeholder="$t('message.placeholder.oldPassword')" show-password></el-input>
                </el-form-item>
                <el-form-item  :label="$t('message.account.new')" prop='password' >
                    <el-input v-model="form.password"
                        :placeholder="$t('message.placeholder.password')" show-password></el-input>
                </el-form-item>
                <el-form-item  :label="$t('message.account.confirm')" prop='new_password' >
                    <el-input v-model="form.new_password"
                        :placeholder="$t('message.placeholder.confirmPassword')"
                        show-password></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button  :loading="loading" class="password-submit"  :disabled="passwordDisabled"  type="primary" @click.native.prevent="changePassword"  >
                        <span>{{$t('message.button.continue')}}</span>
                    </el-button>
                </el-form-item>
            </el-form>
            <div class='success-box' v-else>
                <img src="~@/assets/image/success-icon.png" alt="" class='success-icon' >
                <div class='success-text'>{{$t('message.button.passwordUp')}}</div>
                <div class='success-btn' @click="passwordDialog = false" >{{$t('message.button.confirm')}}</div>
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
                callback(new Error(this.$t('message.placeholder.confirmPassword')));
            } else if (value !== this.form.password) {
                callback(new Error(this.$t('message.rule.match')));
            } else {
                callback();
            }
        };
        return{
            info:'',
            accountDialog:false,
            agree:true,
            loading:false,
            passwordDialog:false,
            delete_account_url:'',
            username:Cookies.get("username")? maskPhoneNumber(Cookies.get("username") ):'',
            form:{
                oldPassword:'',
                password:'',
                new_password:''
            },
            phoneRules: {
                oldPassword: [{ required: true, trigger: "blur", message: this.$t('message.placeholder.password') },
                {pattern: /^.{6,20}$/, message: this.$t('message.placeholder.password'), trigger: ['blur', 'change']}],
                password: [{ required: true, trigger: "blur", message:this.$t('message.placeholder.password') },
                {pattern: /^.{6,20}$/, message: this.$t('message.placeholder.password'), trigger: ['blur', 'change']}],
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
            if(patterns.test(this.form.oldPassword)&&patterns.test(this.form.password)&&patterns.test(this.form.new_password)){
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
        font-size:var(--fontSize-smax);
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
        width:800px;
        margin:0 auto;
    }
    .passwordForm{
        width:600px;
        margin:30px auto;
    }
    .remove-title{
        font-size:var(--fontSize-smax);
        color:var(--color-black-100);
        text-align: center;
        margin-top:120px;
        margin-bottom:30px;
        font-weight: 700;
    }
    .remove-tips{
        display: flex;
        align-items: center;
        font-size:var(--fontSize-default);
        color:#E98C41;
        margin-bottom:20px;
    }
    .warning-item{
        font-size:var(--fontSize-default);
        color:var(--color-black-80);
        line-height: 24px;
        margin-bottom:50px;
    }
    .remove-rule{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom:20px;
    }
    .login-text{
        font-size:var(--fontSize-small);
        color:var(--color-black-100);
        margin-left:6px;
    }
    .login-text a{
        text-decoration: none;
        color:var(--color-primary);
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
    .dialog-title{
        width:100%;
        height:100px;
        background:#E98C41;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left:0;
        top:0;
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
    }
    .title-icon{
        width:50px;
        height:50px;
    }
    .dialog-closes{
        width:40px;
        height:40px;
        position: absolute;
        right:30px;
        top:30px;
        cursor: pointer;
    }
</style>