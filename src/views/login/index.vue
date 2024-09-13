<template>
    <div class='main-login' >
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
        <div class='login-content' >
            <Login v-show='loginShow' @registerTab='registerTab' @forgetTab='forgetTab' />
            <Register v-show='registerShow' @logTab='loginTab'/>
            <ForgetPassword v-show='forgetShow' @loginTab='loginTab' />
        </div>
    </div>
</template>
<script>
import Login from "./login"
import Register from "./register"
import ForgetPassword from "./password"
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
            loginShow:true,
            registerShow:false,
            forgetShow:false
        }
    },
    components:{
        Login,Register,ForgetPassword
    },
    methods:{
        registerTab(){
            this.registerShow = true
            this.loginShow = false
            this.forgetShow = false
        },
        forgetTab(){
            this.registerShow = false
            this.loginShow = false
            this.forgetShow = true
        },
        loginTab(){
            this.registerShow = false
            this.loginShow = true
            this.forgetShow = false
        }
    }
}
</script>
<style>
    .error-tips{
        font-size:12px;
        color:var(--color-error);
        position: absolute;
        left:0;
        top:32px;
    }
    .main-login{
        width:100%;
        height: 100%;
        overflow: hidden;
        background: url('~@/assets/image/bg.png') no-repeat center;
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
    
</style>