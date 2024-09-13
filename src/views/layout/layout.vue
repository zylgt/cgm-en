<template>
    <el-container class='layout'>
        <el-header class='header' height='84px' >
            <div class='header-title' >
                <img src="~@/assets/image/logo.png" alt="" class='logo' >
               <span style='color:#666;font-size:14px' >（0.0.4）</span>
            </div>
            <Horizontal/>
            <div class='header-other '>
                <el-select v-model="language" class='language-select' >
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <div class='header-user' >
                    <img :src="info.avatar" alt="" class='header-avatar' >
                    <div :class="[dropDown?'active':'','username']" >{{info.nickname}}</div>
                    <el-dropdown  @command="userCommand" @visible-change='dropChange' >
                        <div class='user-info' >
                            <i :class="[dropDown?'user-more':'','el-icon-arrow-down']"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown" :append-to-body="false" class='drop-menu' >
                            <el-dropdown-item command="account" style='text-align:center;' >{{$t("message.accounts")}}</el-dropdown-item>
                            <el-dropdown-item command="signout" style='text-align:center;' >{{$t("message.logout")}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </el-header>
        <el-container :style='{"height":PageHeight+"px",width:1580+"px"}' class='container'  >
            <el-main class='main'  >
                 <router-view></router-view>
            </el-main>
        </el-container>
      
    </el-container>
</template>
<script>
import Cookies from 'js-cookie'
import {removeToken} from '@/utils/auth'
import Horizontal from "./horizontal"
import Vertical from "./vertical"
import {mapGetters} from "vuex"
import {getInfo} from '@/api/userApi'
export default {
    data(){
        return{
            height:1080,
            language:'English',
            menuList:[],
            dropDown:false,
            info:'',
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
        }
    },
    computed:{
         ...mapGetters([
            'PageHeight']),
    },
    components:{
        Horizontal,
        Vertical
    },
    created(){
        this.setSendChildren()
        this.getInfo()
    },
    mounted(){
    },
    methods:{
        userCommand(command){
            if(command=='signout'){
                this.dropDown = true
                this.$message({
                    type: 'success',
                    message: '退出成功'
                });
                this.$websocket.close()
                this.$router.push('/login');
                removeToken()
            }else{
                 this.$router.push('/account');
            }
            
        },
        languageCommand(commoand){
             this.language=commoand
             this.$i18n.locale=commoand
             Cookies.set('language',commoand)
        },
        dropChange(val){
            this.dropDown = val
        },
        // 传送当前子级数据到菜单中
        setSendChildren() {
            let path = this.$route.path
            let columnsAsideList= this.$router.options.routes[1].children
            const currentPathSplit = path.split("/")
            let currentData = {}
            columnsAsideList.map((v, k) => {
                if (v.path === `/${currentPathSplit[1]}`) {
                    v["k"] = k
                    currentData["item"] = [{ ...v }]
                    currentData["children"] = [{ ...v }]
                    if (v.children){
                        currentData["children"] = v.children
                    }else{
                        currentData["children"] = []
                    }
                }
            })
            this.menuList = currentData
            return currentData
        },
        // 获取用户信息
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
    },
    watch: {
         // 监听路由的变化
        $route: {
            handler(to) {
                this.setSendChildren(to.path)
            },
            deep: true
        }
    }

    
}
</script>
<style  scoped>
    .layout{
        /* height:100%; */
    }
    .container{
        margin: 0 auto;
    }
    .header{
        height:84px;
        display: flex;
        align-items: center;
        background: #fff;
        justify-content: space-between;
    }
    .header-title{
        font-size:24px;
        color:var(--color-primary);
        width:270px;
        font-weight: 440;
        display: flex;
        align-items: center;
    }
    .logo{
        width:184px;
        height:35px;
        display: block;
        margin:0 14px;
    }
    .header-other{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height:100%;
    }
    .header-avatar{
        width:30px;
        height:30px;
        border-radius: 5px;
        margin-right:5px;
    }
    .language{
        width:140px;
        position: relative;
    }
    .el-dropdown-link{
        font-size:var(--fontSize-big);
    }
    .header-user{
        width:140px;
        height: 40px;
        border-radius:10px;
        background: rgba(72, 160, 220, 0.1);
        position: relative;
        display: flex;
        align-items: center;
        padding:0 5px;
    }
    .drop-menu{
        width:100px;
    }
    .username{
        font-size:var(--fontSize-default);
        color:var(--color-black-80);
        margin:0 10px;
        width:70px;
        overflow: hidden;
        text-overflow: ellipsis;

    }
    .username.active{
        color: var(--color-primary);
    }
    .user-info{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .user-more{
        color: var(--color-primary);
    }
    .avatars{
        width:30px;
        height:30px;
        border-radius:50%;
        display: block;
    }
    .el-avatar{
        font-size: 24px;
    }
    .contain{
        width:100%;
        display: flex;
        flex-grow: 1;
    }
    .layout .main{
        background:#f7f7f7;
        padding:30px;
        width:1580px;
        margin:0 auto;
        overflow-y: auto;
        box-sizing: content-box;
    }
    .record-btn{
        display: flex;
        justify-content: flex-end;
    }
    .box-card{
        padding:30px 60px;
    }
    .el-container{
        /* overflow-y: auto; */
    }
    .language-select{
        margin-right:40px;
        width:100px;
    }
</style>