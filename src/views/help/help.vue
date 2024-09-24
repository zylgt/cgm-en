<template>
    <div>
         <div class='help-main' >
            <div class='agp-top help-top' >
                <div class='agp-top-fl' >
                    <div class='report-title'> {{$t('message.route.'+$route.meta.title)}}</div>
                </div>
            </div>
            <div class='help-list' v-for='(item) in list' :key='item.path' @click="go(item.path)">{{$t('message.route.'+item.meta.title)}}</div>
        </div>
    </div>
</template>
<style scoped>
    .help-top{
        margin-bottom:50px;
    }
   .help-main{
     width:100%;
     margin:0 auto;
   }
   .help-list{
        width:100%;
        height:80px;
        line-height: 80px;
        padding-left:20px;
        box-sizing: border-box;
        background: #fff;
        border-radius:10px;
        margin-bottom:20px;
        cursor: pointer;
   }
</style>
<script>
export default {
    data(){
        return{
            list:[]
        }
    },
    mounted(){
        this.$nextTick(()=>{
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
            this.list = _.clone(currentData.children)
            this.list.splice(0,1)

         })
    },
    methods:{
      go(path){
        this.$router.push(path)
      }
    }
}
</script>