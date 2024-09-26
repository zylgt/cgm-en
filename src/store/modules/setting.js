const setting = {
    state:{
        unit:'mmol/L', //单位切换,默认mmol/L
        targetScope:[3.9,13.9],//目标范围,默认标准范围
        originTargetScope:[70,180],//原始目标范围
        timeFormat:localStorage.getItem('timeFormat')==null||localStorage.getItem('timeFormat')=='undefined'?24:localStorage.getItem('timeFormat'), //时间格式,默认24小时制
        height:1080 ,//网页的高度，尺寸变化跟着变化
        scale:1, //缩放比例
        bgRange:[40,400]
    },
    mutations:{
        SET_UNIT(state,unit){
            state.unit = unit
        },
        SET_TARGET_SCOPE(state,targetScope){
            state.targetScope = targetScope
        },
        SET_ORIGIN_TARGET_SCOPE(state,originTargetScope){
            console.log(originTargetScope)
            state.originTargetScope = originTargetScope
        },
        SET_TIME_FORMAT(state,timeFormat){
            state.timeFormat = timeFormat
            localStorage.setItem('timeFormat',timeFormat)
        },
        SET_HEIGHT(state,height){
            state.height = height
        },
        SET_SCALE(state,scale){
            state.scale = scale
        }
    },
    actions:{
        setUnit({commit},data){
            commit('SET_UNIT',data)
        },
        setTargetScope({commit},data){
            commit('SET_TARGET_SCOPE',data)
        },
        setOrginTargetScope({commit},data){
            commit('SET_ORIGIN_TARGET_SCOPE',data)
        },
        setTimeFormat({commit},data){
            commit('SET_TIME_FORMAT',data)
        },
        setHeight({commit},data){
            commit('SET_HEIGHT',data)
        },
        setScale({commit},data){
            commit('SET_SCALE',data)
        }
    }
}

export default setting