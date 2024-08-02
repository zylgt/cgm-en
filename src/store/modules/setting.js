const setting = {
    state:{
        unit:'mmol/L', //单位切换,默认mmol/L
        targetScope:[3.9,13.9],//目标范围,默认标准范围
        timeFormat:localStorage.getItem('timeFormat')==null||localStorage.getItem('timeFormat')=='undefined'?24:localStorage.getItem('timeFormat'), //时间格式,默认24小时制
        height:1080 ,//网页的高度，尺寸变化跟着变化
    },
    mutations:{
        SET_UNIT(state,unit){
            state.unit = unit
        },
        SET_TARGET_SCOPE(state,targetScope){
            state.targetScope = targetScope
        },
        SET_TIME_FORMAT(state,timeFormat){
            state.timeFormat = timeFormat
            localStorage.setItem('timeFormat',timeFormat)
        },
        SET_HEIGHT(state,height){
            state.height = height
        }
    },
    actions:{
        setUnit({commit},data){
            commit('SET_UNIT',data)
        },
        setTargetScope({commit},data){
            commit('SET_TARGET_SCOPE',data)
        },
        setTimeFormat({commit},data){
            commit('SET_TIME_FORMAT',data)
        },
        setHeight({commit},data){
            commit('SET_HEIGHT',data)
        }
    }
}

export default setting