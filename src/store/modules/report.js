import PdfLoader from '@/utils/htmlpdf';
import Vue from 'vue'
const report = {
    state:{
        chooseDateList:[],//选择过的日期集
        data:{}, //选择过的日期数据集
        info:{},//报告基本信息
        events:{}, //事件列表信息
        bgevents:{}, //事件列表
        PdfLoad:false,
        pdfFile:''
    },
    mutations:{
        SET_CHOOSE_DATE_LIST(state,chooseDate){
            if(state.chooseDateList.length>0&& _.indexOf(state.chooseDateList,chooseDate)!=-1) return;
            state.chooseDateList.push(chooseDate)
        },
        SET_INFO(state,data){
            if(_.has(state.info, data))return;
            Vue.set(state.info,data.key,data.value)
        },
        SET_DATA(state,data){
            if(_.has(state.data, data))return;
            Vue.set(state.data,data.key,data.value)
        },
        SET_EVENTS(state,data){
            if(_.has(state.events, data))return;
            Vue.set(state.events,data.key,data.value)
        },
        SET_BG_EVENTS(state,data){
            if(_.has(state.bgevents, data))return;
            Vue.set(state.bgevents,data.key,data.value)
        },
        SET_PDF_LOAD(state,data){
            state.PdfLoad = data
        },
        SET_PDF(state,data){
            state.pdfFile = data
        }
    },
    actions:{
        setChooseDateList({commit},data){
            commit('SET_CHOOSE_DATE_LIST',data)
        },
        setInfo({commit},data){
            commit('SET_INFO',data)
        },
        setData({commit},data){
            commit('SET_DATA',data)
        },
        setEvents({commit},data){
            commit('SET_EVENTS',data)
        },
        setBgEvents({commit},data){
            commit('SET_BG_EVENTS',data)
        },
        setPdfLoad({commit},data){
            commit('SET_PDF_LOAD',data)
        },
        setPdf({commit},data){
            commit('SET_PDF',data)
        }
    }
}

export default report