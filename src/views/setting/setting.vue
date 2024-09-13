<template>
    <div class='setting' >
        <div class='setting-main' >
            <div class='agp-top' >
                <div class='agp-top-fl' >
                    <div class='report-title'> {{$t('message.route.'+$route.meta.title)}}</div>
                    <div class='report-sub-title' > {{$t('message.setting.synctime')}}：2024年3月14日</div>
                </div>
                <div class='agp-fr' >
                    <el-button type="primary" @click="upload">
                        <img src="~@/assets/image/btn-upload.png" alt="" class='btn-upload' >
                         {{$t('message.reports.upLoad')}}
                    </el-button>
                </div>
            </div>
            <setUserInfo v-if='!bgBox' @editUser='userShow' />
            <setBg v-if='!userBox'  @bgShow ='bgShow' />
        </div>
    </div>
</template>
<script>
import setUserInfo from '@/views/setting/set_userInfo'
import setBg from '@/views/setting/set_bg'
export default {
    data(){
        return{
            userBox:false,
            bgBox:false
        }
    },
    components:{
        setUserInfo,setBg
    },
    mounted(){
    },
    methods:{
        upload(){
            this.$router.push('/upLoad')
        },
        userShow(val){
            this.userBox = val
        },
        bgShow(val){
            this.bgBox = val
        }
    }
}
</script>
<style scoped>
    .setting-main{
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
        font-size:30px;
        color:var(--color-black-100);
        font-weight: 700;
    }
    .report-sub-title{
        font-size:var(--fontSize-default);
        color:var(--color-black-60);
    }
    .btn-upload{
        display: inline-block;
        vertical-align: middle;
        margin-right:4px;
        width:20px;
        height:20px;
    }
    
</style>