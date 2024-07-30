<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      height:1080
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
    window.onresize = ()=>{
      borwerWidth = window.innerWidth
      zoom = borwerWidth/baseWidth
      borwerHeight = window.innerHeight
      document.body.style.transform = "scale("+zoom+")"
      this.$store.dispatch('setHeight',borwerHeight/zoom - 90)
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
html,body{
  width:1920px !important;
  /* height:100%; */
  padding:0;
  margin:0;
  transform-origin: 0 0;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width:100%;
  /* height:100%; */
}
</style>
