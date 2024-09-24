<template>
    <div class='empty' >
        <img src="~@/assets/image/empty-icon.png" alt="" class='empty-icon' >
        <div class='empty-text' >{{$t('message.common.noDatas')}}</div>
    </div>
</template>
<style scoped>
    .empty{
        width:100%;
        height: 250px;
        background: #fff;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    .empty-icon{
        width:80px;
        height:80px;
        display: block;
        margin:0 auto;
        margin-bottom:30px;
    }
    .empty-text{
        font-size:var(--fontSize-max);
        color:var(--color-black-40);
        text-align: center;
    }
</style>