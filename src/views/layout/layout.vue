<template>
    <el-container class='layout'>
        <el-header class='header' height='84px' >
            <div class='header-title' >
                <img src="~@/assets/image/logo.png" alt="" class='logo' >
                iHealth CGM <span style='color:#666;font-size:14px' >（0.0.2）</span>
            </div>
            <Horizontal/>
            <div class='header-other '>
                <div class='header-user' >
                    <!-- <el-avatar size='medium'>{{name}} </el-avatar> -->
                    <div :class="[dropDown?'active':'','username']" >{{username}}</div>
                    <el-dropdown  @command="userCommand" @visible-change='dropChange'>
                        <div class='user-info' >
                            <i :class="[dropDown?'user-more':'','el-icon-arrow-down']"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <!-- <el-dropdown-item command="change">{{$t("message.changePassword")}}</el-dropdown-item> -->
                            <el-dropdown-item command="signout">{{$t("message.logout")}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </el-header>
        <el-container :style='{"height":PageHeight+"px"}'>
            <Vertical :menuList='menuList' v-if='menuList.children.length>0' />
            <el-main class='main'  >
                 <router-view></router-view>
            </el-main>
        </el-container>
      
    </el-container>
</template>
<script>
import Cookies from 'js-cookie'
import {removeToken} from '@/utils/auth'
import maskPhoneNumber from '@/utils/phone'
import Horizontal from "./horizontal"
import Vertical from "./vertical"
import {mapGetters} from "vuex"
export default {
    data(){
        return{
            height:1080,
            language: Cookies.get('language')?Cookies.get('language'):navigator.language,
            name: Cookies.get("username")?Cookies.get("username").charAt(0):'游',
            menuList:[],
            username:Cookies.get("username")? maskPhoneNumber(Cookies.get("username")) :'游',
            dropDown:false
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
                this.changeDialog = true
            }
            
        },
        languageCommand(commoand){
             this.language=commoand
            if(commoand=='en'){
                this.$i18n.locale='en'
                Cookies.set('language','en')
            }else{
                this.$i18n.locale='zh-cn'
                Cookies.set('language','zh-cn')
            }
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
        margin:0 14px;
    }
    .header-other{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height:100%;
    }
    .language{
        width:140px;
        position: relative;
    }
    .el-dropdown-link{
        font-size:var(--fontSize-big);
    }
    .header-user{
        height: 30px;
        position: relative;
        display: flex;
        align-items: center;
    }
    .username{
        font-size:16px;
        color:var(--color-black-80);
        margin:0 10px;
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
    .main{
        background:#f7f7f7;
        padding:30px;
         overflow-y: auto;
         height: 100%;
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
</style>