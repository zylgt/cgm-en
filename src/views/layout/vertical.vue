<template>
    <div class='vertical' >
        <el-aside class='menu vertical'  width='300px'>
            <div class='horizontal-menu'>{{$t('message.route.'+menuList.item[0].meta.title)}}</div>
            <el-menu  theme="dark" router  :default-active="$route.path">
                <el-menu-item v-for="item in menuList.children" :key='item.name'  :index='item.path'  >
                    {{$t('message.route.'+item.meta.title)}}
                </el-menu-item>
            </el-menu>
        </el-aside>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    props:{
        menuList:{
            type:Object,
            default:''
        }
    }
}
</script>
<style >
    .vertical{
        height: 100%;
    }
    .menu{
        width:300px;
        border-right:1px solid #f2f2f2;
        border-top:1px solid var(--color-black-30);
        background:#fff;
    }
    .horizontal-menu{
        height:80px;
        line-height: 80px;
        font-size:var(--fontSize-big);
        color:var(--color-black-40);
        padding-left:76px;
    }
</style>