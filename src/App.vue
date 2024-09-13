<template>
  <div id="app"  :style="{'height':resultHeight+'px'}">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      height:1080,
      resultHeight:1080
    }
  },
  created(){
  },
  mounted(){
    let borwerWidth = window.innerWidth
    let baseWidth = 1920
    let borwerHeight = window.innerHeight
    let zoom = borwerWidth/baseWidth
    document.body.style.transform="scale("+zoom+")"
    this.$store.dispatch('setHeight',borwerHeight/zoom - 90)
    this.resultHeight  = borwerHeight/zoom
    document.body.style.height = borwerHeight/zoom+'px'
    window.onresize = ()=>{
      borwerWidth = window.innerWidth
      zoom = borwerWidth/baseWidth
      borwerHeight = window.innerHeight
      document.body.style.transform = "scale("+zoom+")"
      this.$store.dispatch('setHeight',borwerHeight/zoom - 90)
      document.body.style.height = borwerHeight/zoom+'px'
      this.resultHeight  = borwerHeight/zoom
    }
  },
  methods: {
    beforeunloadHandler(e){
      if(this.$store.getters.upStep == 4){
       e = e || window.event;
        if (e) {
            e.returnValue = '关闭提示';
        }
        return '关闭提示';
      }
     
    },
  },
  destroyed(){
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e));
  }
}
</script>

<style>
[v-cloak]{
  display: none;
}
html{
  overflow-x: hidden;
}
body{
  display: flex;
}
html,body{
  width:1920px !important;
  height:100%;
  padding:0;
  margin:0;
  transform-origin: 0 0;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* width:100%; */
  /* height:100%; */
  width: 1920px;
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
</style>
