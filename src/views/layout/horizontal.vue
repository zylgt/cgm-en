<template>
    <div class='horizontal' >
         <el-menu mode='horizontal'  theme="dark" router :default-active="defaultActive">
                <el-menu-item v-for="item in menu" :key='item.name'  :index='item.path' >
                    <div v-if='item.meta.isShow' >
                        <img :src="item.meta.icons" alt="" v-if='item.path==defaultActive' >
                        <img :src="item.meta.icon" alt="" v-else>
                        <div class='menu-border'  v-if='item.path==defaultActive' ></div>
                        {{$t('message.route.'+item.meta.title)}}
                    </div>
                </el-menu-item>
        </el-menu>
    </div>
</template>
<script>
export default {
    data(){
        return{
            menu:''
        }
    },
    computed:{
        defaultActive(){
            let index = this.$route.path.lastIndexOf('/')
            return index==0?this.$route.path:this.$route.path.substring(0,index)
        }
    },
    created(){
        this.menu = this.$router.options.routes[1].children
    },
}
</script>