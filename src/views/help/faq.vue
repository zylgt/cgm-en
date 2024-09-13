<template>
    <div>
        <div class='agp-top help-top' >
            <div class='agp-top-fl' >
                <div class='report-title'> {{$t('message.route.'+$route.meta.title)}}</div>
            </div>
        </div>
        <div :class='[item.checked?"active":"","faq-list"]' v-for='(item,index) in faqList' :key='item.question' @click='tab(index)' >
            <div class='faq-label' >
                {{index+1}}.{{item.question}}?
            </div>
            <div class='faq-cont' >
                {{item.answer}}
            </div>
        </div>
    </div>
</template>
<style scoped>
    .faq-list{
        width:100%;
        height:80px;
        background:#fff;
        padding:0 30px;
        margin-bottom:20px;
        overflow: hidden;
        border-radius: 10px;
        border:1px solid #fff;
    }

    .faq-list.active{
        height: auto;
    }
    .faq-list:hover{
        border:1px solid var(--color-primary);
        color:var(--color-primary);
        background:rgba(72, 160, 220, 0.1) ;
    }
    .faq-label{
        width:100%;
        height:80px;
        line-height:80px;
        font-size:var(--fontSize-smax);
        color:var(--color-black-100);
    }
    .faq-cont{
        font-size:var(--fontSize-default);
        color:var(--color-black-60);
        padding-bottom:30px;
    }
</style>
<script>
export default {
    data(){
        return{
            faqList:[{
                question:'How to uninstall driver?',
                answer:'Fill in your personal information to receive more accurate data inter. If you skipped this page, please go to settings later to update your profile.',
                checked:false
            },{
                question:'How to uninstall driver?',
                answer:'Fill in your personal information to receive more accurate data inter. If you skipped this page, please go to settings later to update your profile.',
                checked:false
            },{
                question:'How to uninstall driver?',
                answer:'Fill in your personal information to receive more accurate data inter. If you skipped this page, please go to settings later to update your profile.',
                checked:false
            }]
        }
    },
    methods:{
        tab(index){
            let faqList = this.faqList
            faqList[index].checked = !faqList[index].checked
        }
    }
}
</script>