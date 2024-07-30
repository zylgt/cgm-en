<template>
    <div class='TIR' >
        <div class='tir-bar' >
            <div class='tir-bar-item'  v-for='item in levels' :key='item.key' :style='{backgroundColor:item.color,height:item.leftItemH+"px",marginTop:"1.2px"}' ></div>
        </div>
        <div class='tir-info' >
            <div class='tir-info-item' v-for='item in levels' :key='item.key' :style='{height:item.rightItemH+"px",marginTop:item.rightItemTop}'>
                <div class='tir-info-line'>
                    <div class='tir-line-one' :style='{ width: 12,height: 0.5,backgroundColor:"#e5e5e5"}' v-if='item.lineLocH === 0' ></div>
                    <div class='tir-line-two' v-if='item.lineLocH > 0'  :style='{  width: item.lineLocW1,height: 0.5,backgroundColor:"#e5e5e5",marginTop: 0,}'></div>
                    <div class='tir-line-three' v-if='item.lineLocH > 0' :style='{  width: 0.5,
                            height: item.lineLocH,
                            backgroundColor:"#e5e5e5",}'></div>
                </div>
                <div class='tir-info-legend'></div>
                <div class='tir-info-desc'></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'TIR',
    data(){
        return{
            levels: [
                {key: '2 级高血糖', value: 96.0, color: '#E98C41', desc: '>13.9mmol/L'},
                {
                    key: '1 级高血糖',
                    value: 1.0,
                    color: '#F6C059',
                    desc: '10.1-13.9mmol/L',
                },
                {
                    key: '目标范围内',
                    value: 1.0,
                    color: '#32BAC0',
                    desc: '3.9~10.0mmol/L',
                },
                {key: '1 级低血糖', value: 1.0, color: '#F43F31', desc: '3.0~3.8mmol/L'},
                {key: '2 级低血糖', value: 1.0, color: '#96251C', desc: '<3.0mmol/L'},
            ], 
        }
    },
    created(){
        this.setTirView()
    },
    methods:{
        setTirView(){
            const ChartLeftBarH = 260; // 左侧条形高度
            const ChartLeftBarMargin = 1.2; // 左侧条形间距

            const ChartRightTextH = 42; // 右侧单个Item文字高度

            var leftItemCenterY = ChartRightTextH;
            var preLeftItemH = 0;
            const levels_1 = this.levels.map((item, index) => {
                // 左侧Item间距
                const leftMarginH = (this.levels.length - 1) * ChartLeftBarMargin;
                // 左侧Item高度
                const leftItemH = ((ChartLeftBarH - leftMarginH) * item.value) / 100.0;
                const margin = index === 0 ? 0 : ChartLeftBarMargin;
                leftItemCenterY =
                leftItemCenterY + preLeftItemH / 2 + margin + leftItemH / 2;
                preLeftItemH = leftItemH;
                // 右侧Item文字高度
                let rightItemTextH = ChartRightTextH;
                if (index === 2) rightItemTextH = ChartRightTextH * 2; //两行文字
                return {
                ...item,
                leftItemH: leftItemH,
                leftItemY: leftItemCenterY - leftItemH / 2,
                leftItemCenterY: leftItemCenterY,
                rightItemTextH: rightItemTextH,
                };
            });
            var preRightItemBottom = 0;
            var rightItemH = 0;
            var rightItemTop = 0;
            var lineLocW1 = 0; // 折线第一段横线
            var lineLocH = 0; // =0:居中、>0:向下
            var lineLocW2 = 0; // 折线第二段横线

            const levels_2 = levels_1.map((item, index) => {
                const cu_item = item;
                if (index === 0) {
                rightItemH = item.rightItemTextH;
                rightItemTop = item.leftItemCenterY - rightItemH / 2;
                lineLocW1 = 0;
                lineLocH = 0;
                lineLocW2 = 0;
                preRightItemBottom = rightItemTop + rightItemH;
                } else {
                const cu_rightItemY = item.leftItemCenterY - item.rightItemTextH / 2;
                const r_margin = cu_rightItemY - preRightItemBottom;

                if (r_margin >= 0) {
                    // 当前Item能放下，居中显示
                    rightItemH = item.rightItemTextH;
                    rightItemTop = r_margin;
                    lineLocW1 = 0;
                    lineLocH = 0;
                    lineLocW2 = 0;
                    preRightItemBottom = preRightItemBottom + rightItemTop + rightItemH;
                } else {
                    // 当前Item不能放下，向下显示
                    const lc_rb_margin = item.leftItemCenterY - preRightItemBottom;
                    if (lc_rb_margin >= 0) {
                    rightItemH = item.rightItemTextH;
                    rightItemTop = lc_rb_margin;
                    lineLocH = item.rightItemTextH / 2;
                    preRightItemBottom = preRightItemBottom + rightItemTop + rightItemH;
                    } else {
                    rightItemH = item.rightItemTextH + Math.abs(lc_rb_margin);
                    rightItemTop = lc_rb_margin;
                    lineLocH = item.rightItemTextH / 2 + Math.abs(lc_rb_margin);
                    preRightItemBottom = preRightItemBottom + item.rightItemTextH;
                    }
                    // 12 - 0.5 = 11.5 分前后两段横线
                    if (index === 1) {
                    lineLocW1 = 6.5;
                    lineLocW2 = 5;
                    } else if (index === 2) {
                    lineLocW1 = 5;
                    lineLocH = lineLocH - 8; // 目标顶部对齐
                    lineLocW2 = 6.5;
                    } else if (index === 3) {
                    lineLocW1 = 3.5;
                    lineLocW2 = 8;
                    } else if (index === 4) {
                    lineLocW1 = 2;
                    lineLocW2 = 9.5;
                    }
                }
                }
                return {
                ...item,
                rightItemH: rightItemH,
                rightItemTop: rightItemTop,
                lineLocW1: lineLocW1,
                lineLocH: lineLocH,
                lineLocW2: lineLocW2,
                };
            });

            this.levels = levels_2
            console.log(this.levels)
        }
    }
}
</script>
<style scoped>
    .TIR{
        display: flex;
    }
    .tir-bar{
        width:40px;
    }
</style>