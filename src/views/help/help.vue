<template>
    <div>
        <div class='unit' >
            <div class='unit-item'  @click='setUnit("mg/dL")'>mg/dL</div>
            <div class='unit-item' @click='setUnit("mmol/L")'>mmol/L</div>
        </div>
    </div>
</template>
<style scoped>
    .unit{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .unit-item{
        width:100px;
        height:40px;
        border-radius:6px;
        border:1px solid #ccc;
        text-align: center;
        line-height: 40px;
        color: #333;
        margin-right:10px;
    }
</style>
<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        setUnit(unit){
            this.$store.dispatch('setUnit',unit)
        }
    }
}
</script>