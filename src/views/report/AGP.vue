<template>
    <div class='agp' ref='agp'>
        <div class='agp-main' >
            <div class='agp-top' >
                <div class='agp-top-fl' >
                    <div class='report-title'> {{$t('message.route.'+$route.meta.title)}}</div>
                    
                </div>
                <div class='agp-fr' >
                    <img src="~@/assets/image/printer.png" alt="" class='edit-agp-icon'   @click='handelPrint'>
                    <img src="~@/assets/image/down-icon.png" alt="" class='edit-agp-icon'  @click='handleExport' >
                    <img src="~@/assets/image/mail.png" alt="" class='edit-agp-icon agp-fr-icon'  @click='handleShare'>
                    <!-- <el-button type="primary" @click='handelPrint'>ceshi</el-button> -->
                    <el-button type="primary" @click="upload">
                        <img src="~@/assets/image/btn-upload.png" alt="" class='btn-upload' >
                         {{$t('message.reports.upLoad')}}
                    </el-button>
                </div>
            </div>
            <div class='report-agp-date-box'  v-popover:datePopover @click='openPopover("date")' >
                <img src="~@/assets/image/date-calendar.png" alt="" class='agp-icon' >
                <div class='agp-date' > {{start_time}}-{{end_time}}（{{dayDate}}{{$t('message.common.day')}}）</div>
                <img src="~@/assets/image/select-icon.png" alt="" class='select-icon' >
            </div>
            <div class='main-box' ref='printMe' id='printContent'>
                <Progress v-if='progressShow' />
                <!-- 基本信息 -->
                <div class="agp-main-box" :style='{"opacity":progressShow?0:1}' >
                    <!-- 第一页 -->
                    <div class='reports-box'>
                        <div class='reportss-box'>
                        <!-- 头信息 -->
                        <div class='report-main-title-infos' v-if='printFlag' >
                            <img src="~@/assets/image/report-logo.png" alt="" class='report-logo' >
                            <div class='report-main-title' > {{$t('message.reports.reportTitle1')}}</div>
                            <div class='report-main-date' >
                                {{start_time}}<div class='repart-main-dirver-box'><span class='repart-main-dirver' ></span></div>{{end_time}}（{{dayDate}}{{$t('message.common.day')}}）
                            </div>
                        </div>
                        <!-- 内容 -->
                        <div class='agp-cont-main'>
                            <div class='cgm-cont-title'><span class='title-border' ></span>{{$t('message.infomation.basicTitle')}}</div>
                            <div class='report-base-user' >
                                <div class='report-base-user-item' >
                                    <div class='report-base-user-label'>{{$t('message.infomation.name')}}：</div>
                                    <div class='report-base-user-value'>{{info.nickname?info.nickname:'--'}}</div>
                                </div>  
                                <div class='report-base-user-item' >
                                    <div class='report-base-user-label'>{{$t('message.infomation.age')}}：</div>
                                    <div class='report-base-user-value'>{{info.age?info.age:'--'}}</div>
                                </div>  
                                <div class='report-base-user-item' >
                                    <div class='report-base-user-label'>{{$t('message.bgInfo.typeDiabetes')}}：</div>
                                    <div class='report-base-user-value'>{{info.diabetes_type?info.diabetes_type:'--'}}</div>
                                </div>  
                                <div class='report-base-user-item' >
                                    <div class='report-base-user-label'>{{$t('message.bgInfo.diseaseYear')}}：</div>
                                    <div class='report-base-user-value'>{{info.diabetes_year?info.diabetes_year:'--'}}</div>
                                </div>  
                                <div class='report-base-user-item' >
                                    <div class='report-base-user-label'>{{$t('message.bgInfo.targerRange')}}：</div>
                                    <div class='report-base-user-value'>{{info.glucose_range_lower_limit}}-{{info.glucose_range_lupper_limit}}{{unit}}</div>
                                </div>  
                            </div>
                            <div class='report-data-source'>
                                <div class='report-base-user-item0' >
                                    <div class='report-base-user-label'>{{$t('message.sensorcode')}}</div>
                                </div>  
                                <div class='report-base-user-item1' >
                                    <div class='report-base-user-label'>{{$t('message.source')}}</div>
                                </div>  
                                <div class='report-base-user-item2' >
                                    <div class='report-base-user-label'>{{$t('message.synctime')}}</div>
                                </div>  
                            </div>
                            <div class='report-data-sources' v-if='info.device.length<=0'>
                                <div class='report-base-user-item0' >
                                    <div class='report-base-user-value'>--</div>
                                </div>  
                                <div class='report-base-user-item1' >
                                    <div class='report-base-user-value'>--</div>
                                </div>  
                                <div class='report-base-user-item2' >
                                    <div class='report-base-user-value'>--</div>
                                </div>  
                            </div>
                            <div v-else >
                                <div class='report-data-sources' v-for='(item,index) in info.device' :key='index'>
                                    <div class='report-base-user-item0' >
                                        <div class='report-base-user-value'>{{item.nickname?item.nickname:'--'}}</div>
                                    </div>  
                                    <div class='report-base-user-item1' >
                                        <div class='report-base-user-value'>{{item.data_source?item.data_source:'--'}}</div>
                                    </div>  
                                    <div class='report-base-user-item2' >
                                        <div class='report-base-user-value'>{{item.upDate?item.upDate:'--'}}</div>
                                    </div>  
                                </div>
                            </div>
                            <el-row type="flex" justify="space-between">
                                <el-col :span="12" class='agp-cont-main agp-cont-main1' >
                                    <div class='cgm-cont-title'>  <span class='title-border' ></span>{{$t('message.reports.glucoseStatistics')}}</div>
                                    <!-- <div class='cgm-agp-info-box cgm-agp-info-box1'>
                                        <div class='cgm-agp-info'></div>
                                        <img src="~@/assets/image/reason-icon.png" alt="" class='reason-icon' >
                                    </div> -->
                                    <div class='bg-data-item' >
                                        <div class='bg-data-label' >
                                            <div>{{$t('message.reports.wearingDay')}}</div>
                                            <div class='bg-data-tip' ></div>
                                        </div>
                                        <div class='bg-data-val' >{{bgInfo.wearsDay}}</div>
                                    </div>
                                    <div class='bg-data-item' >
                                        <div class='bg-data-label' >
                                            <div>{{$t('message.reports.activeTime')}}</div>
                                            <div class='bg-data-tip' >{{$t('message.common.target')}}>70%</div>
                                        </div>
                                        <div :class='[bgInfo.effective>70?"":"active","bg-data-val"]' >{{bgInfo.effective}}%</div>
                                    </div>
                                    <div class='bg-data-item' v-if='unit=="mg/dL"'>
                                        <div class='bg-data-label' >
                                            <div>{{$t('message.mean')}}</div>
                                            <div class='bg-data-tip' >{{$t('message.common.target')}}＜118 mg/dL</div>
                                        </div>
                                        <div class='bg-data-val' >{{bgInfo.mean}}mg/dL</div>
                                    </div>
                                    <div class='bg-data-item' v-else>
                                        <div class='bg-data-label' >
                                            <div>{{$t('message.mean')}}</div>
                                            <div class='bg-data-tip' >{{$t('message.common.target')}}＜6.6mmol/L</div>
                                        </div>
                                        <div class='bg-data-val' >{{bgInfo.mean}}mmol/L</div>
                                    </div>
                                    <div class='bg-data-item' >
                                        <div class='bg-data-label' >
                                            <div>{{$t('message.cmi')}}</div>
                                            <div class='bg-data-tip' >{{$t('message.common.target')}}＜7%</div>
                                        </div>
                                        <div class='bg-data-val'  >{{resultDay>=10?bgInfo.GMI+'%':$t('message.common.noData')}}</div>
                                    </div>
                                    <div class='bg-data-item' >
                                        <div class='bg-data-label' >
                                            <div>CV{{$t('message.cv')}}</div>
                                            <div class='bg-data-tip' >{{$t('message.common.target')}}＜33%</div>
                                        </div>
                                        <div class='bg-data-val' >{{bgInfo.CV}}%</div>
                                    </div>
                                </el-col>
                                <el-col :span="12" class='agp-cont-main agp-cont-main1'>
                                    <div class='cgm-cont-title'>  <span class='title-border' ></span>{{$t('message.tir')}}</div>
                                    <div class='cgm-agp-info-box'>
                                        <div class='cgm-agp-info'>{{$t('message.reports.tirs.explain')}}</div>
                                        <img src="~@/assets/image/reason-icon.png" alt="" class='reason-icon'  v-popover:tirPopover @click='openPopover("tir")' >
                                    </div>
                                    <TIR :dataList='tir'/>
                                </el-col>
                            </el-row>
                            <div class='agp-cont-main' >
                                <div class='cgm-cont-title'><span class='title-border' ></span>{{$t('message.reports.agp.title')}}</div>
                                <div class='cgm-agp-info-box'>
                                    <div class='cgm-agp-info'>{{$t('message.reports.agp.explain')}}</div>
                                    <img src="~@/assets/image/reason-icon.png" alt="" class='reason-icon'  v-popover:agpPopover @click='openPopover("agp")'>
                                </div>
                                <AGP  :dataList='agpList' :height='370'/>
                            </div>
                            <div class='agp-cont-main' >
                                    <div class='cgm-cont-title'><span class='title-border' ></span>{{$t('message.reports.day.title')}}</div>
                                    <div class='cgm-agp-info-box'>
                                        <div class='cgm-agp-info'>{{$t('message.reports.day.explain')}}</div>
                                        <img src="~@/assets/image/reason-icon.png" alt="" class='reason-icon' v-popover:dayPopover @click='openPopover("day")'>
                                    </div>
                                    <DayChart :dataList='agpdayList' @readerIng='dayReader'  />
                            </div>
                        </div>
                        <!-- 参数解释 -->
                        <div class='report-main-params'  v-if='printFlag'>
                            <div class='report-main-params-title' >{{$t('message.reports.pdfFooter.title1')}}</div>
                            <div class='report-main-params-item' >
                                {{$t('message.reports.pdfFooter.explain1')}}<br/>
                                {{$t('message.reports.pdfFooter.explain2')}}<br/>
                                {{$t('message.reports.pdfFooter.explain3')}}<br/>
                                {{$t('message.reports.pdfFooter.explain4')}}<br/>
                                {{$t('message.reports.pdfFooter.explain5')}}<br/>
                                {{$t('message.reports.pdfFooter.explain6')}}<br/>
                            </div>
                            <div class='report-main-params-title' >{{$t('message.reports.pdfFooter.title2')}}</div>
                            <div class='report-main-params-item' >
                                {{$t('message.reports.pdfFooter.from')}}
                            </div>
                        </div>
                        </div>
                    </div>
                   <!-- 第二页 -->
                   <div  class='reports-box'>
                        <div class='reportss-box'>
                        <!-- 头信息 -->
                        <div class='report-main-title-infos'  v-if='printFlag'>
                            <img src="~@/assets/image/report-logo.png" alt="" class='report-logo' >
                            <div class='report-main-title' >{{$t('message.reports.reportTitle2')}}</div>
                            <div class='report-main-date' >
                                {{start_time}}<div class='repart-main-dirver-box'><span class='repart-main-dirver' ></span></div>{{end_time}}（{{dayDate}}{{$t('message.common.day')}}）
                            </div>
                        </div>
                        <!-- 内容 -->
                        <div class='agp-cont-main' >
                                <div class='cgm-cont-title'><span class='title-border' ></span>{{$t('message.reports.summaryDay.title')}}</div>
                                <DaySummary :dataList='agpdayList' @readerIng='dayReader'/>
                        </div>
                         <div class='agp-cont-main' v-if='pageTwoList.length>0'>
                                <div class='cgm-cont-title'><span class='title-border' ></span>{{$t('message.reports.trendDay.title')}}</div>
                                <div class='event-type'>
                                    <div class='event-type-item' >
                                        <img src="~@/assets/image/event-icon0.png" alt="" class='event-icon' >
                                        <p class='event-type-label' >{{$t('message.reports.trendDay.eventType0')}}</p>
                                    </div>
                                    <div class='event-type-item' >
                                        <img src="~@/assets/image/event-icon1.png" alt="" class='event-icon' >
                                        <p class='event-type-label' >{{$t('message.reports.trendDay.eventType1')}}</p>
                                    </div>
                                    <div class='event-type-item' >
                                        <img src="~@/assets/image/event-icon2.png" alt="" class='event-icon' >
                                        <p class='event-type-label' >{{$t('message.reports.trendDay.eventType2')}}</p>
                                    </div>
                                    <div class='event-type-item' >
                                        <img src="~@/assets/image/event-icon3.png" alt="" class='event-icon' >
                                        <p class='event-type-label' >{{$t('message.reports.trendDay.eventType3')}}</p>
                                    </div>
                                    <div class='event-type-item' >
                                        <img src="~@/assets/image/event-icon4.png" alt="" class='event-icon' >
                                        <p class='event-type-label' >{{$t('message.reports.trendDay.eventType4')}}</p>
                                    </div>
                                    <div class='event-type-item' >
                                        <img src="~@/assets/image/event-icon5.png" alt="" class='event-icon' >
                                        <p class='event-type-label' >{{$t('message.reports.trendDay.eventType5')}}</p>
                                    </div>
                                    <div class='event-type-item' >
                                        <img src="~@/assets/image/event-icon6.png" alt="" class='event-icon' >
                                        <p class='event-type-label' >{{$t('message.reports.trendDay.eventType6')}}</p>
                                    </div>
                                </div>
                                <div v-for='(item,index) in pageTwoList' :key='index'>
                                    <DayAnalysis :dataList='item' :eventList='item.events' :eventChecked='eventChecked'/>
                                </div>
                        </div>
                        </div>
                   </div>
                  <!-- 第三页 -->
                  <div  class='reports-box'  v-for='(item,indexs) in pdfDayData' :key='indexs'>
                        <div class='reportss-box'>
                        <!-- 头信息 -->
                        <div class='report-main-title-infos'  v-if='printFlag'>
                            <img src="~@/assets/image/report-logo.png" alt="" class='report-logo' >
                            <div class='report-main-title' >{{$t('message.reports.reportTitle2')}}</div>
                            <div class='report-main-date' >
                                {{start_time}}<div class='repart-main-dirver-box'><span class='repart-main-dirver' ></span></div>{{end_time}}（{{dayDate}}{{$t('message.common.day')}}）
                            </div>
                        </div>
                        <!-- 内容 -->
                         <div class='agp-cont-main' >
                                <div class='cgm-cont-title' v-if='indexs==0&&pageTwoList.length==0' ><span class='title-border' ></span>{{$t('message.reports.trendDay.title')}}</div>
                                <div class='event-type'  v-if='indexs==0&&pageTwoList.length==0'>
                                    <div class='event-type-item' >
                                        <img src="~@/assets/image/event-icon0.png" alt="" class='event-icon' >
                                        <p class='event-type-label' >{{$t('message.reports.trendDay.eventType0')}}</p>
                                    </div>
                                    <div class='event-type-item' >
                                        <img src="~@/assets/image/event-icon1.png" alt="" class='event-icon' >
                                        <p class='event-type-label' >{{$t('message.reports.trendDay.eventType1')}}</p>
                                    </div>
                                    <div class='event-type-item' >
                                        <img src="~@/assets/image/event-icon2.png" alt="" class='event-icon' >
                                        <p class='event-type-label' >{{$t('message.reports.trendDay.eventType2')}}</p>
                                    </div>
                                    <div class='event-type-item' >
                                        <img src="~@/assets/image/event-icon3.png" alt="" class='event-icon' >
                                        <p class='event-type-label' >{{$t('message.reports.trendDay.eventType3')}}</p>
                                    </div>
                                    <div class='event-type-item' >
                                        <img src="~@/assets/image/event-icon4.png" alt="" class='event-icon' >
                                        <p class='event-type-label' >{{$t('message.reports.trendDay.eventType4')}}</p>
                                    </div>
                                    <div class='event-type-item' >
                                        <img src="~@/assets/image/event-icon5.png" alt="" class='event-icon' >
                                        <p class='event-type-label' >{{$t('message.reports.trendDay.eventType5')}}</p>
                                    </div>
                                    <div class='event-type-item' >
                                        <img src="~@/assets/image/event-icon6.png" alt="" class='event-icon' >
                                        <p class='event-type-label' >{{$t('message.reports.trendDay.eventType6')}}</p>
                                    </div>
                                </div>
                                <div v-for='(items,index) in item.value' :key='index'>
                                    <DayAnalysis :dataList='items' :eventList='items.events' :eventChecked='eventChecked'/>
                                </div>
                        </div>
                         <!-- 参数解释 -->
                        <div class='report-main-params'   v-if='indexs==pdfDayData.length-1&&printFlag' >
                            <div class='report-main-params-title' >{{$t('message.reports.pdfFooter.title1')}}</div>
                            <div class='report-main-params-item' >
                                {{$t('message.reports.pdfFooter.explain1')}}<br/>
                                {{$t('message.reports.pdfFooter.explain2')}}<br/>
                                {{$t('message.reports.pdfFooter.explain3')}}<br/>
                                {{$t('message.reports.pdfFooter.explain4')}}<br/>
                                {{$t('message.reports.pdfFooter.explain5')}}<br/>
                                {{$t('message.reports.pdfFooter.explain6')}}<br/>
                            </div>
                            <div class='report-main-params-title' >{{$t('message.reports.pdfFooter.title2')}}</div>
                            <div class='report-main-params-item' >
                                {{$t('message.reports.pdfFooter.from')}}
                            </div>
                        </div>
                        </div>
                   </div>
                </div>
            </div>
        </div>
        <!-- 日期选择弹窗 -->
        <el-popover
            placement="bottom-start"
            width="740"
            trigger="manual"
            ref="datePopover"
            v-model='dateVisible'
            :append-to-body="false">
            <div class='datePop-box' >
                <div class='datePop-title'>{{$t('message.reports.selectDate.title')}}</div>
                <div class='datePop-sub-title'>{{$t('message.reports.selectDate.subTitle')}}</div>
                <div class='datePop-days'>
                    <div :class='[dateValue==7?"active":"","datePop-days-item"]' @click='selectDay(7)'>{{$t('message.reports.selectDate.day7')}}</div>
                    <div :class='[dateValue==14?"active":"","datePop-days-item"]' @click='selectDay(14)'>{{$t('message.reports.selectDate.day14')}}</div>
                    <div :class='[dateValue==30?"active":"","datePop-days-item"]' @click='selectDay(30)'>{{$t('message.reports.selectDate.day30')}}</div>
                    <div :class='[dateValue==90?"active":"","datePop-days-item"]' @click='selectDay(90)'>{{$t('message.reports.selectDate.day90')}}</div>
                </div>
                <div class='datePop-change-day' >
                    {{start_times}}-{{end_times}}
                </div>
                <div class='datePop-btn' >
                    <div class='cancel-btn'  @click='dateVisible=false'>{{$t('message.common.cancel')}}</div>
                    <div class='confirm-btn' @click='confirmDate'>{{$t('message.common.confirm')}}</div>
                </div>
            </div>
        </el-popover>
        <!-- 解释弹窗 -->
        <el-popover
            ref="tirPopover"
            placement="top"
            width="550"
            v-model='tirVisible'
            :append-to-body="false"
            trigger="manual">
            <div class='slot-popover' >
                <div class='slot-popover-title' >数据分析</div>
                <div class='slot-popover-cont'>内容暂定</div>
                <div class='slot-popover-btn'>
                     <el-button type="primary" @click='tirVisible=false' >我知道了</el-button>
                </div>
            </div>
        </el-popover>
        <el-popover
            ref="agpPopover"
            placement="top"
            width="550"
            v-model='agpVisible'
            trigger="manual">
            <div class='slot-popover' >
                <div class='slot-popover-title' >AGP图谱</div>
                <div class='slot-popover-cont'>
                    1、AGP图谱又称动态葡萄糖图谱，是以1个标准日(24h)的形式将多天的血糖监测数据叠加在相应时间点呈现，由5个平滑曲线表示血糖监测系统的数据，1个葡萄糖目标范围协助判断血糖是否达标。<br/>
                    2、中位数葡萄糖曲线反映了日内葡萄糖波动情况，曲线越平坦表示血糖稳定性越好。中位线葡萄糖曲线是否处于葡萄糖目标范围内，也进一步提示血糖控制达标情况。<br/>
                    3、由第 25和第75百分位数两条曲线组成25%-75%区间由第5和 95 百分位数两条曲线组成的5%-95%区间，均显示日间血糖波动情况，区间越宽提示相应时间段血糖波动越大，其中影响 25%-75%区间的因素主要是是生理状态(如胰岛素抵抗等)和药物治疗等。影响5%-95%区间的因素主要是饮食，运动等。<br/>
                </div>
                <div class='slot-popover-btn'>
                     <el-button type="primary" @click='agpVisible=false' >我知道了</el-button>
                </div>
            </div>
        </el-popover>
        <el-popover
            ref="dayPopover"
            placement="top"
            width="550"
            v-model='dayVisible'
            trigger="manual">
            <div class='slot-popover' >
                <div class='slot-popover-title' >每日血糖</div>
                <div class='slot-popover-cont'>
                    1、AGP图谱又称动态葡萄糖图谱，是以1个标准日(24h)的形式将多天的血糖监测数据叠加在相应时间点呈现，由5个平滑曲线表示血糖监测系统的数据，1个葡萄糖目标范围协助判断血糖是否达标。<br/>
                    2、中位数葡萄糖曲线反映了日内葡萄糖波动情况，曲线越平坦表示血糖稳定性越好。中位线葡萄糖曲线是否处于葡萄糖目标范围内，也进一步提示血糖控制达标情况。<br/>
                    3、由第 25和第75百分位数两条曲线组成25%-75%区间由第5和 95 百分位数两条曲线组成的5%-95%区间，均显示日间血糖波动情况，区间越宽提示相应时间段血糖波动越大，其中影响 25%-75%区间的因素主要是是生理状态(如胰岛素抵抗等)和药物治疗等。影响5%-95%区间的因素主要是饮食，运动等。<br/>
                </div>
                <div class='slot-popover-btn'>
                     <el-button type="primary" @click='dayVisible=false' >我知道了</el-button>
                </div>
            </div>
        </el-popover>
        <!-- 下载打印弹窗 -->
        <div class="print-dialog" :style='{transform:(dialogType=="export"?"scale("+scale+")":"scale(1)")}' v-if='dialogVisible' ref='printBox'>
            <div class='print-dialog-box'>
                <div class='slot-popover'  id='popover'>
                    <div class='slot-progress' >
                        <img src="~@/assets/image/downdata.png" alt="" class='down-icon' >
                        <div class='cgm-progress' >
                            <div class='cgm-bg-progress' >
                                <div class='cgm-resulr-progress' :style='{"width":percentage*4+"px"}'></div>
                            </div>
                            <div class='progress-result' >{{percentage}}%</div>
                        </div>
                        <div class='slot-progress-title' >{{$t('message.reports.generationReport')}}</div>
                        <div class='slot-progress-tips' >
                           {{$t('message.reports.tips')}} <span style='opacity:0;' > {{PdfLoad}}</span>
                        </div>
                    </div>
                </div>
                <img src="~@/assets/image/close-icon.png" alt="" class='dialog-close' @click='dialogVisible=false' >
            </div>
        </div>
         <!-- 下载成功弹窗 -->
        <div class="print-dialog" v-if='successDialog'>
            <div class='print-dialog-box'>
                <div class='slot-popover'  id='popover'>
                    <div class='slot-progress' >
                        <img src="~@/assets/image/success-icon.png" alt="" class='down-icon' >
                        <div class='slot-progress-title' v-if='dialogType=="export"'>{{$t('message.reports.success.downTitle')}}</div>
                        <div class='slot-progress-title' v-if='dialogType=="print"'>{{$t('message.reports.success.printTitle')}}</div>
                        <div class='slot-progress-title' v-if='dialogType=="share"'>{{$t('message.reports.success.sharesuccess')}}</div>
                        <div class='slot-progress-tips' v-if='dialogType=="export"'>
                            {{$t('message.reports.success.downTips')}}
                            <span style='color:var(--color-primary);' @click='successDialog=false,handleExport'>{{$t('message.reports.success.downAgain')}}</span>
                        </div>
                        <div class='slot-progress-tips' v-if='dialogType=="print"'>{{$t('message.reports.success.printTips')}}</div>
                        <div class='slot-progress-tips' v-if='dialogType=="share"'>{{$t('message.reports.success.sharetips')}}</div>
                        <div class='success-btn' @click='successDialog=false'>{{$t('message.botton.confirm')}}</div>
                    </div>
                </div>
                <img src="~@/assets/image/close-icon.png" alt="" class='dialog-close' @click='successDialog=false' >
            </div>
        </div>
         <!-- 失败弹窗 -->
        <div class="print-dialog" v-if='failDialog'>
            <div class='print-dialog-box'>
                <div class='slot-popover'  id='popover'>
                    <div class='slot-progress' >
                        <img src="~@/assets/image/fail-icon.png" alt="" class='down-icon' >
                        <div class='slot-progress-title'>{{$t('message.reports.success.shareFail')}}</div>
                       
                        <div class='slot-progress-tips'>{{$t('message.reports.success.sharefailtips')}}</div>
                        <div class='success-btn' @click='failDialog=false,sentEmail'>{{$t('message.botton.share')}}</div>
                    </div>
                </div>
                <img src="~@/assets/image/close-icon.png" alt="" class='dialog-close' @click='failDialog=false' >
            </div>
        </div>
        <!-- 邮件分享 -->
        <div class="print-dialog" v-if='emailDialog'>
            <div class='print-dialog-box'>
                <div class='email-popover'  id='popover'>
                   <div class='emailDiaolg-title' >{{$t('message.reports.email.title')}}</div>
                   <div class='emailForm'>
                        <div class='email-form-label'>{{$t('message.reports.email.to')}}:</div>
                        <el-input  :placeholder='$t("message.reports.email.email")' v-model="emailForm.email" clearable></el-input>
                   </div>
                    <div class=' emailForms'>
                        <div class='email-form-label'>{{$t('message.reports.email.selectLabel')}}:</div>
                        <div class='email-list' >
                            <div :class='[item.checked?"active":"","email-item"]' v-for='(item,index) in emailList' :key='item.value' @click='chooseEmail(index)'>
                                {{item.value}}
                            </div>
                        </div>
                   </div>
                   <div class=' emailForms'>
                    <el-input type="textarea"  :rows="4"
                       :placeholder='$t("message.reports.email.message")'
                        v-model="emailForm.message">
                        </el-input>
                   </div>
                    <el-button  :loading="loading" class="login-submit"  :disabled="comDiabled"  style="margin:0 auto;" type="primary" @click.native.prevent="sentEmail"  >
                        <span v-if="!loading">{{$t("message.botton.send")}}</span>
                        <span v-else>{{$t("message.botton.send")}}</span>
                    </el-button>
                </div>
                <img src="~@/assets/image/close-icon.png" alt="" class='dialog-close' @click='emailDialog=false' >
            </div>
        </div>
         <iframe id="iframe" style="display: none;"></iframe>
    </div>
</template>
<script>
import {formatDate,formatTime,formatEn,formatWeekEn} from '@/utils/formatTime'
import { AGPUtils } from "@/utils/algorithm/AGP";
import { TIRUtils } from "@/utils/algorithm/TIR";
import { GlucoseUtils } from "@/utils/algorithm/Glucose";
import {getAgpInfo,getShareList,shareWeb} from '@/api/dataApi'
import TIR from '@/views/components/Chart/TIR'
import AGP from '@/views/components/Chart/AGPchart'
import DayChart from '@/views/components/Chart/DayChart'
import DaySummary from '@/views/components/Chart/Daysummary'
import DayAnalysis from '@/views/report/components/dayAnalysis'
import Empty from '@/views/components/Empty/empty'
import Progress from '@/views/report/components/Progress'
import Cookies from 'js-cookie'
import {mapGetters} from "vuex"
import PdfLoader from "@/utils/htmlpdf";

export default {
    data(){
        let that = this
        return{
            agpDate:['',''], //日期选中值
            loading:false,
            tirVisible:false,
            agpVisible:false,
            dayVisible:false,
            dateVisible:false,
            info:{
                nickname:'',
                diabetes_type:'',
                age:'',
                diabetes_year:'',
                glucose_range_lower_limit:'',
                glucose_range_lupper_limit:'',
                device:[]
            },
            nowdate:'',
            agpdayList:[],//每日血糖
            tir:{},//tir
            agpList:{},//agp
            bgInfo:{},//血糖数据
            resultDay:'',//实际血糖数据天数
            dateValue:'',//选择的天数
            start_time:'', //开始时间
            end_time:'', //结束时间
            start_times:'',
            end_times:"",
            dayDate:14,
            empty:true,
            downProgress:0,
            progressShow:false,
            eventList:[],
            dialogVisible:false, //下载打印弹窗开关
            percentage:2,
            page:0,  //pdf页数，
            pageTwoList:[],
            pdfDayData:[],
            printFlag:false, //打印开关
            successDialog:false, //成功弹窗开关
            failDialog:false, //失败弹窗
            emailDialog:false, //邮件分享弹窗
            dialogType:'export',
            eventChecked:false, //事件显示开关
            progressTimer:null , //进度条定时器
            emailForm:{
                email:'',
                message:'',
            },
            emailRule:{
                 email: [{ required: true, message: 'Invalid email adress.', trigger: 'blur' },
                            { pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, message: 'Invalid email adress.', trigger: 'blur'}],
            },
            emailList:[]
        }
    },
    components: {
        TIR,AGP,DayChart,Empty,DaySummary,DayAnalysis,Progress
    },
    computed:{
        ...mapGetters([
           'unit','targetScope','scale']),
        PdfLoad(){
            if(this.$store.getters.PdfLoad){
                clearInterval(this.progressTimer)
                this.dialogVisible = false
                this.printFlag = false
                this.eventChecked = false
                this.$store.dispatch('setPdfLoad',false)
                if(this.dialogType!='share'){
                    this.successDialog = true
                }else if(this.dialogType=='share'){
                    this.emailDialog = true
                }
            }
        },
        comDiabled(){
              let upattern =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
              if(upattern.test(this.emailForm.email)&&this.emailForm.email&&this.$store.getters.pdfFile){
                 return false
              }else{
                 return true
              }
        }
    },
    created(){
    },
    mounted(){
        let end_ts = new Date()
        let start_ts = new Date().setDate(end_ts.getDate() - 13)
        if(Cookies.get('choose_s')){
            this.start_time = formatEn( Cookies.get('choose_s')*1000)
            this.end_time =formatEn( Cookies.get('choose_e')*1000)
            this.agpDate = [Cookies.get('choose_s')*1000,Cookies.get('choose_e')*1000]
            this.chooseDay(new Date(Cookies.get('choose_s')*1000),new Date(Cookies.get('choose_e')*1000))
        }else{
            this.start_time = formatEn(start_ts)
            this.end_time = formatEn(end_ts)
            this.agpDate = [start_ts,end_ts]
            this.chooseDay(new Date(start_ts),end_time)
        }
        this.chooseGetData()
    },
    methods:{
        // 打印下载分享进度条
        interProgress(){
            let that = this
            this.progressTimer = setInterval(function(){
               let percentage = that.percentage
               percentage += 1
               if(percentage>=90){
                    percentage = 90
               }
               that.percentage = percentage
            },100)
        },
        // 选择天数
        chooseDay(date1,date2){
            this.progressShow = true
            let s_date = date1.setHours(0,0,0)/1000
            let e_date = date2.setHours(23,59,59)/1000
            let oneDay = 24 * 60 * 60 ; // 每天的毫秒数
            let diff = Math.abs(s_date - e_date); // 计算差值的绝对值
            this.dayDate  = Math.ceil(diff / oneDay)
        },
        // 判断从哪里拉取数据
        chooseGetData(){
            let indexOfDate = [formatDate(this.agpDate[0],'YYYY-mm-dd'),formatDate(this.agpDate[1],'YYYY-mm-dd')]
            if( _.indexOf(this.$store.state.report.chooseDateList,indexOfDate.join('/'))==-1){
                this.getData()
            }else{
                let result  = this.$store.state.report.data[indexOfDate.join('/')]
                let events  = this.$store.state.report.events[indexOfDate.join('/')]
                let bg_events  = this.$store.state.report.bgevents[indexOfDate.join('/')]
                if(result.length>0){
                    this.empty = false
                }else{
                    this.empty = true
                }
                this.handelTemplateDay(result,events,bg_events)
                this.info =  this.$store.state.report.info[indexOfDate.join('/')]
            }
        },
        // 从云拉取数据
        getData(){
            let s = new Date(this.agpDate[0])
            let e = new Date(this.agpDate[1])
            let start_ts =parseInt(s.setHours(0,0,0)/1000) 
            let end_ts = parseInt(e.setHours(23,59,59)/1000)
            getAgpInfo({start_ts:start_ts,end_ts:end_ts}).then(response => {
                    let checkDate = [formatDate(this.agpDate[0],'YYYY-mm-dd'),formatDate(this.agpDate[1],'YYYY-mm-dd')]
                    if(response.code == 1000){
                        if(response.data.devices.length>0){
                            response.data.devices.forEach(item=>{
                                item.upDate = formatEn(item.update_ts*1000)
                            })
                        }

                        let target = null
                        if(response.data.glucose_unit==0){
                            target = [GlucoseUtils.mgdlToMmol(response.data.glucose_range_lower_limit),GlucoseUtils.mgdlToMmol(response.data.glucose_range_lupper_limit)]
                        }else{
                            target = [response.data.glucose_range_lower_limit,response.data.glucose_range_lupper_limit]
                        }
                        let params = {
                            nickname:response.data.nickname,
                            diabetes_type:response.data.diabetes_type,
                            age:response.data.age,
                            diabetes_year:response.data.diabetes_year,
                            glucose_range_lower_limit:target[0],
                            glucose_range_lupper_limit:target[1],
                            device:response.data.devices
                        }
                        this.$store.dispatch('setInfo',{key:checkDate.join('/'),value:params}) //处理完数据存vuex
                        this.$store.dispatch('setTargetScope',target)
                        this.$store.dispatch('setUnit',response.data.glucose_unit==0?'mmol/L':'mg/dL')
                        this.info = params

                        let arrayData = response.data.datas
                       
                        if(arrayData.length>0){
                            console.log(formatTime(new Date()),'得到数据')   
                            this.empty = false
                            this.handelTemplateDay(this.handleData(arrayData,start_ts,end_ts),this.handelEventDay(response.data.events),this.handelWarningDay(arrayData))
                            
                            this.$store.dispatch('setChooseDateList',checkDate.join('/'))
                        }else{
                            this.empty = true
                            this.progressShow = false
                        }
                    }else{
                        this.progressShow = false
                        this.$message({
                            type: 'error',
                            message: response.msg
                        });
                    }
            }).catch((res) => {
                this.progressShow = false
                console.log(res)
            })
        },
        processArray(arr, interval) {
            let result = [];

            for (let i = 0; i < arr.length - 1; i++) {
                result.push(arr[i]);

                let diff = arr[i + 1].DataTs - arr[i].DataTs;
                let addTs = arr[i].DataTs + interval;
                while (diff > interval) {
                result.push({DataTs: addTs, value: undefined});
                diff = arr[i + 1].DataTs - addTs;
                addTs += interval;
                }
            }
            result.push(arr[arr.length - 1]);

            return result;
        },

        filterArray  (data) {
            const result = [];

            const seenTimes = new Set();
            let levelTooLowMg = this.$store.getters.bgRange[0]
            let levelTooHighMg = this.$store.getters.bgRange[1]
            data.forEach(item => {
                const timeStr = formatDate(item.DataTs*1000,'YYYY-mm-dd HH:MM')

                if (!seenTimes.has(timeStr)) {
                seenTimes.add(timeStr);
                if (item.Value < levelTooLowMg) {
                    result.push({
                    ...item,
                    value: levelTooLowMg,
                    });
                } else if (item.Value > levelTooHighMg) {
                    result.push({
                    ...item,
                    value: levelTooHighMg,
                    });
                } else {
                    result.push({
                    ...item,
                    value: item.Value,
                    });
                }
                }
            });
            // console.log(result)
            return result;
        },

        handleData (objects, s_ts, e_ts)  {
            let measuringInterval = 60
            objects = this.processArray(objects, measuringInterval);
            objects = this.filterArray(objects);
            let that = this
            let startTs = objects[0].DataTs;
            while (startTs - measuringInterval >= s_ts) {
                objects.unshift({
                DataTs: startTs - measuringInterval,
                value: undefined,
                Value:undefined
                });
                startTs = startTs - measuringInterval;
            }

            let endTs = objects[objects.length - 1].DataTs;
            while (endTs + measuringInterval < e_ts) {
                objects.push({
                DataTs: endTs + measuringInterval,
                value: undefined,
                Value:undefined
                });
                endTs = endTs + measuringInterval;
            }
             let checkDate = [formatDate(this.agpDate[0],'YYYY-mm-dd'),formatDate(this.agpDate[1],'YYYY-mm-dd')]
            this.$store.dispatch('setData',{key:checkDate.join('/'),value:objects}) //处理完数据存vuex
            return objects;
        },
        // 全部事件分割为每天事件
        handelEventDay(datas){
            let data = _.sortBy(_.clone(datas),'event_ts')
            let unit = this.unit
            let eventList ={};
            let repeatNum = 1
            let repeatTs = 0
            data.forEach(item=>{
                let key = formatDate(item.event_ts*1000,'YYYY-mm-dd')
                let zeroTs = new Date(key).setHours(0,0,0)/1000
                item.xIndex = (item.event_ts-zeroTs)/60
                if(Math.abs(repeatTs-item.event_ts)<900){
                    repeatNum++
                }else{
                    repeatNum = 1
                }
                repeatTs = item.event_ts
                item.yPosition = unit=='mmol/L'?2*repeatNum:36*repeatNum
                item.type = 1 //普通事件
                if(eventList[key]){
                    eventList[key].push(item)
                }else{
                    eventList[key] = [item]
                }
            })
            let checkDate = [formatDate(this.agpDate[0],'YYYY-mm-dd'),formatDate(this.agpDate[1],'YYYY-mm-dd')]
           this.$store.dispatch('setEvents',{key:checkDate.join('/'),value:eventList}) //处理完数据存vuex
           return eventList
        },
         // 警告信息分割为每天事件
        handelWarningDay(datas){
            let checkDate = [formatDate(this.agpDate[0],'YYYY-mm-dd'),formatDate(this.agpDate[1],'YYYY-mm-dd')]
            if(datas&&datas.length>0){
                let DdatArray = _.clone(datas)
                let warningList ={};
                for (let i = 0; i < DdatArray.length; i+=20) {
                    let key = formatDate(DdatArray[i].DataTs*1000,'YYYY-mm-dd')
                    console.log(DdatArray[i])
                    if(warningList[key]){
                        if(DdatArray[i].Value<54&&DdatArray[i].Value>=this.$store.getters.bgRange[0]){
                                warningList[key].push({
                                event_ts:DdatArray[i].DataTs,
                                Value:DdatArray[i].Value,
                                message_type:1,
                                type:2
                            })
                        }else if(DdatArray[i].Value>=54&&DdatArray[i].Value<=69){
                                 warningList[key].push({
                                event_ts:DdatArray[i].DataTs,
                                Value:DdatArray[i].Value,
                                message_type:2,
                                type:2
                            })
                        }else if(DdatArray[i].Value>250&&DdatArray[i].Value<=this.$store.getters.bgRange[1]){
                                 warningList[key].push({
                                event_ts:DdatArray[i].DataTs,
                                Value:DdatArray[i].Value,
                                message_type:3,
                                type:2
                            })
                        }
                    }else{
                        if(DdatArray[i].Value<54&&DdatArray[i].Value>=this.$store.getters.bgRange[0]){
                                 warningList[key] = [{
                                event_ts:DdatArray[i].DataTs,
                                Value:DdatArray[i].Value,
                                message_type:1
                            }]
                        }else if(DdatArray[i].Value>=54&&DdatArray[i].Value<=69){
                                 warningList[key] = [{
                                event_ts:DdatArray[i].DataTs,
                                Value:DdatArray[i].Value,
                                message_type:2
                            }]
                        }else if(DdatArray[i].Value>250&&DdatArray[i].Value<=this.$store.getters.bgRange[1]){
                                 warningList[key] = [{
                                event_ts:DdatArray[i].DataTs,
                                Value:DdatArray[i].Value,
                                message_type:3
                            }]
                        }
                    }
                }
                this.$store.dispatch('setBgEvents',{key:checkDate.join('/'),value:warningList}) //处理完数据存vuex
                return warningList
                
            }else{
                 this.$store.dispatch('setBgEvents',{key:checkDate.join('/'),value:[]}) //处理完数据存vuex
                return []
            }
           
        },
        // 打开解释弹窗
        openPopover(key){
            switch(key){
                case 'tir':
                    this.tirVisible = true
                    this.agpVisible = false
                    this.dayVisible = false
                    break;
                case 'agp':
                    this.tirVisible = false
                    this.dayVisible = false
                    this.agpVisible = true
                    break;
                case 'day':
                    this.dayVisible = true
                    this.tirVisible = false
                    this.agpVisible = false
                    break;
                case 'date':
                    this.dateVisible = true

            }
        },
        // 自组件需要的数据
        handelTemplateDay(data,events,bg_events){
            this.handelAgp(data)
            this.handelTir(data)
            this.handelDay(data,events,bg_events)
            this.handelBg(data)
        },
        // agp图谱
        handelAgp(data){
            let datArray = _.cloneDeep(data)
            let newArr = []
            datArray.forEach((item,index)=>{
                if(index == index%1440){
                    newArr.push([datArray[index].Value])
                }else{
                    newArr[index%1440].push(datArray[index].Value)
                }
            })
            function momentAgp05(val){
                val = _.compact(val)
                return AGPUtils.calculateYValue(val)?AGPUtils.calculateYValue(val).p05:AGPUtils.calculateYValue(val)
            }
            function momentAgp25(val){
                val = _.compact(val)
                return AGPUtils.calculateYValue(val)?AGPUtils.calculateYValue(val).p25:AGPUtils.calculateYValue(val)
            }
            function momentAgp50(val){
                val = _.compact(val)
                return AGPUtils.calculateYValue(val)?AGPUtils.calculateYValue(val).p50:AGPUtils.calculateYValue(val)
            }
            function momentAgp75(val){
                val = _.compact(val)
                return AGPUtils.calculateYValue(val)?AGPUtils.calculateYValue(val).p75:AGPUtils.calculateYValue(val)
            }
            function momentAgp95(val){
                val = _.compact(val)
                return AGPUtils.calculateYValue(val)?AGPUtils.calculateYValue(val).p95:AGPUtils.calculateYValue(val)
            }
            let xData =  Array.from({length:60*24},(item, index) => index)
            let agp05 = _.map(newArr,momentAgp05)
            let agp25 = _.map(newArr,momentAgp25)
            let agp50 = _.map(newArr,momentAgp50)
            let agp75 = _.map(newArr,momentAgp75)
            let agp95 = _.map(newArr,momentAgp95)

            let params = {
                    xData:xData,
                    agp05:agp05,
                    agp25:agp25,
                    agp50:agp50,
                    agp75:agp75,
                    agp95:agp95
                }
            this.agpList = params
        },
        // tir
        handelTir(data){
            let tirTarget =  this.unit=='mmol/L'?[_.round(GlucoseUtils.mmolToMgdl(this.targetScope[0]),1),_.round(GlucoseUtils.mmolToMgdl(this.targetScope[1]),1)]:this.targetScope
            let datArrays = _.cloneDeep(data)
            let new_data = _.uniqBy(datArrays,'DataTs')
            let v_data = _.map(new_data,'Value')
            let result = TIRUtils.getTIRResult(_.compact(v_data),tirTarget[1],tirTarget[0])
            this.tir = result
        },
         // 计算总值为100
        handelRoundTir(result){
            let veryHighRate = (result.veryHighRate * 100).toFixed(1);
            let highRate = (result.highRate * 100).toFixed(1);
            let normalRate = (result.normalRate * 100).toFixed(1);
            let lowRate = (result.lowRate * 100).toFixed(1);
            let veryLowRate = (result.veryLowRate * 100).toFixed(1);

            var rateObjs = [
                {origV: result.veryHighRate * 100, resultV: veryHighRate},
                {origV: result.highRate * 100, resultV: highRate},
                {origV: result.normalRate * 100, resultV: normalRate},
                {origV: result.lowRate * 100, resultV: lowRate},
                {origV: result.veryLowRate * 100, resultV: veryLowRate},
            ];

            // 求和
            let rateSumMax = 100;
            let rateSum = rateObjs.reduce(function (total, rateObj) {
                return total + parseFloat(rateObj.resultV);
            }, 0);
            if (rateSum !== rateSumMax) {
                const changeValue = 0.1;
                let changeCount = 0;
                if (rateSum > rateSumMax) {
                // >100，5入的需减
                const changeRateCount =
                    parseFloat((rateSum - rateSumMax).toFixed(1)) / changeValue;
                rateObjs.forEach((rateObj, i) => {
                    if (
                    rateObj.resultV > changeValue &&
                    rateObj.resultV > rateObj.origV &&
                    changeCount < changeRateCount
                    ) {
                    rateObjs[i] = {
                        origV: rateObj.origV,
                        resultV: (parseFloat(rateObj.resultV) - changeValue).toFixed(1),
                    };
                    changeCount++;
                    }
                });
                } else {
                // <100，4舍的需加
                const changeRateCount =
                    parseFloat((rateSumMax - rateSum).toFixed(1)) / changeValue;
                rateObjs.forEach((rateObj, i) => {
                    if (
                    rateObj.resultV < rateObj.origV &&
                    changeCount < changeRateCount
                    ) {
                    rateObjs[i] = {
                        origV: rateObj.origV,
                        resultV: (parseFloat(rateObj.resultV) + changeValue).toFixed(1),
                    };
                    changeCount++;
                    }
                });
                }
                veryHighRate = rateObjs[0].resultV;
                highRate = rateObjs[1].resultV;
                normalRate = rateObjs[2].resultV;
                lowRate = rateObjs[3].resultV;
                veryLowRate = rateObjs[4].resultV;
            }
            return {
                veryHighRate,
                highRate,
                normalRate,
                lowRate,
                veryLowRate
            }
        },
        // 每日血糖
        handelDay(data,events,bg_events){
            let tirTarget =  this.unit=='mmol/L'?[_.round(GlucoseUtils.mmolToMgdl(this.targetScope[0]),1),_.round(GlucoseUtils.mmolToMgdl(this.targetScope[1]),1)]:this.targetScope
            let DdatArray = _.cloneDeep(data)
            let singleDay  = _.chunk(DdatArray,60*24) ;
            let max = _.maxBy(DdatArray,'Value').Value>400?400:_.maxBy(DdatArray,'Value').Value
            let dayList = new Array()
            let event_length = 0 //事件条数用来计算高度
            singleDay.forEach(item=>{
                let value = _.map(item, 'value');
                let originValue = _.map(item, 'Value');
                let eventArray = events?events[formatDate(item[0].DataTs*1000,'YYYY-mm-dd')]:[]
                let bgEventsArray =bg_events?bg_events[formatDate(item[0].DataTs*1000,'YYYY-mm-dd')]:[]
                let e_l = eventArray==undefined?0:eventArray.length
                let b_e_l =  bgEventsArray==undefined?0:bgEventsArray.length
                event_length = e_l + b_e_l
                 let all_events = null
                if(eventArray&&bgEventsArray){
                    all_events = _.concat(eventArray,bgEventsArray)
                }else if(eventArray){
                    all_events = eventArray
                }else{
                    all_events = bgEventsArray
                }
                let result = TIRUtils.getTIRResult(_.compact(originValue),tirTarget[1],tirTarget[0])?TIRUtils.getTIRResult(_.compact(originValue),tirTarget[1],tirTarget[0]):''
                dayList.push({
                    date:formatDate(item[0].DataTs*1000,'YYYY-mm-dd'),
                    day: formatDate(item[0].DataTs*1000,'mm-dd'),
                    week: formatWeekEn(item[0].DataTs*1000),
                    value:value,
                    resultValue:_.compact(originValue),
                    max:max,
                    tir:this.handelRoundTir(result).normalRate,
                    height:720+event_length*55,
                    events:all_events
                })
            })
            this.agpdayList =  dayList
            this.padPage(dayList)
            this.resultDay = _.filter(dayList,function(o){return o.resultValue.length>0}).length
        },
        // pdf分页
        padPage(dayLists){
            let dayList = _.reverse(_.clone(dayLists))
           let pageTwoHeight = 1605 //剩余高度
           let pdfHeight = 2375
           let pdfDayData = [{value:[],pdfPage:1}]
           let page = 0;
            dayList.forEach((item,index)=>{
                item.pdfPage = Math.ceil(item.height/2375)
                if(pageTwoHeight-item.height>0&&pdfDayData.length<=0){
                        this.pageTwoList.push(item) //第二页的内容
                        pageTwoHeight = pageTwoHeight-item.height
                }else{  //剩余的进行分页处理
                    if(pdfHeight-item.height>0||pdfHeight==2375){
                        pdfDayData[page].value.push(item)
                        pdfDayData[page].pdfPage = item.pdfPage
                    }else{
                        pdfHeight = 2375
                        page++
                        pdfDayData.push({value:[item],pdfPage:item.pdfPage})
                    }
                    pdfHeight = pdfHeight-item.height
                }
            
            })
            this.pdfDayData = pdfDayData
        },
        // 血糖数据
        handelBg(data){
            let BdatArray = _.cloneDeep(data)
            let originList = _.compact(_.map(BdatArray,'Value'))
            let bgInfo = GlucoseUtils.calculateMeanCvGmi(_.compact(_.map(BdatArray,'Value')))
            bgInfo.mean = Math.round(bgInfo.mean)
            let unit = this.unit
            if(unit=='mmol/L'){
                bgInfo.mean = GlucoseUtils.mgdlToMmol(bgInfo.mean)
            }
            let filteredArray = BdatArray.filter(item => item.Value >= 40 && item.Value <= 400);
            bgInfo.effective = _.round((filteredArray.length/originList.length)*100,1)
            bgInfo.wearsDay = Math.ceil(Number(_.compact(BdatArray).length)/1440)
            bgInfo.allData = filteredArray
            this.bgInfo = bgInfo
        },
        // 每日血糖渲染完成
        dayReader(val){
            this.progressShow = val
        },
        upload(){
            this.$router.push('/upLoad')
        },
          // 选择下载。打印的内容
        handleCheckedCitiesChange(val){
            let checkedCount = val.length;
            this.checkAll = checkedCount === this.downloadList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.downloadList.length;
        },
        // 全选
        handleCheckAllChange(val){
            this.checkedDowns = val ? this.downloadList : [];
            this.isIndeterminate = false;
        },
        // 打印
        handelPrint(){
            if(this.progressShow){
                return
            }
            this.percentage = 0
            this.interProgress()
            this.successDialog = false
            this.dialogVisible = true
            this.printFlag = true
            this.dialogType='print'
            this.eventChecked = true
            let that = this
            const document = window.document;
            const iframe = window.frames[0];
            setTimeout(function(){
                let html = document.querySelector('.agp').innerHTML
                iframe.document.head.innerHTML = document.head.innerHTML; // 获取当前文档的头部给iframe
                iframe.document.body.innerHTML =html; // 把传过来的html给iframe头部
                iframe.document.body.classList.add('export-boxs');
                iframe.document.body.style.transform="scale(1)"
            },200)
           
            setTimeout(function(){
                let pdf = new PdfLoader(
                iframe.document.querySelector(".main-box"),
                "pdf",
                '',
                'print'
                );
                pdf.outPutPdfFn()
            },500)
            
        },
        // 导出pdf
        handleExport() {
            if(this.progressShow){
                return
            }
             this.percentage = 0
            this.interProgress()
            this.successDialog = false
            this.printFlag = true
            this.dialogVisible = true
            this.eventChecked = true
            this.dialogType='export'
            let that = this
            // document.body.classList.add('export-boxs');
            // document.body.style.transform="scale(1)"
            const document = window.document;
            const iframe = window.frames[0];
            setTimeout(function(){
                let html = document.querySelector('.agp').innerHTML
                iframe.document.head.innerHTML = document.head.innerHTML; // 获取当前文档的头部给iframe
                iframe.document.body.innerHTML =html; // 把传过来的html给iframe头部
                iframe.document.body.classList.add('export-boxs');
                iframe.document.body.style.transform="scale(1)"
            },200)
            setTimeout(function(){
                let pdf = new PdfLoader(
                iframe.document.querySelector(".main-box"),
                "pdf",
                '',
                'export'
                );
                pdf.outPutPdfFn()
            },500)
           
        },
        // 分享share
        handleShare(){
            if(this.progressShow){
                return
            }
            this.percentage = 0
            this.interProgress()
            this.printFlag = true
            this.dialogVisible = true
            this.eventChecked = true
            this.dialogType='share'
            this.successDialog = false
            let that = this
            // document.body.classList.add('export-boxs');
            // document.body.style.transform="scale(1)"
            const document = window.document;
            const iframe = window.frames[0];
            setTimeout(function(){
                let html = document.querySelector('.agp').innerHTML
                iframe.document.head.innerHTML = document.head.innerHTML; // 获取当前文档的头部给iframe
                iframe.document.body.innerHTML =html; // 把传过来的html给iframe头部
                iframe.document.body.classList.add('export-boxs');
                iframe.document.body.style.transform="scale(1)"
            },200)
            setTimeout(function(){
                let pdf = new PdfLoader(
                 iframe.document.querySelector(".main-box"),
                "pdf",
                '',
                'share'
                );
                pdf.outPutPdfFn()
            },500)
            let emailList=[]
            getShareList().then(response=>{
                if(response.code==1000){
                    response.data.forEach(item=>{
                        emailList.push({
                            checked:false,
                            value:item
                        })
                    })
                    this.emailList = emailList
                }
            }).catch((res) => {
                this.progressShow = false
                console.log(res)
            })
        },
        // 选择天数
        selectDay(val){
            this.dateValue = val
            const end = new Date();
            const start = new Date();
            let start_ts = start.setTime(start.getTime() - 3600 * 1000 * 24 *( val-1));
            this.start_times = formatEn(start_ts)
            this.end_times = formatEn(end)
            this.agpDate = [start_ts,end.getTime()]
        },
        // 根据日期获取数据
        confirmDate(){
            this.pageTwoList = []
            this.chooseGetData()
            this.start_time = formatEn(this.agpDate[0])
            this.end_time = formatEn(this.agpDate[1])
            this.chooseDay(new Date(this.agpDate[0]),new Date(this.agpDate[1]))
            this.dateVisible = false
        },
        // 选择邮箱发送
        chooseEmail(index){
            let emailList = this.emailList
            emailList.forEach((item,indexs)=>{
                if(index==indexs){
                    item.checked = !item.checked
                }else{
                    item.checked = false
                }
               
            })
            if(emailList[index].checked){
                this.emailForm.email = emailList[index].value
            }
        },
        // 发送邮件
        sentEmail(){
            this.loading = true
            let upattern =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
            if(upattern.test(this.emailForm.email)&&this.emailForm.email&&this.$store.getters.pdfFile){
                const formData = new FormData()
                formData.append('report',this.$store.getters.pdfFile)
                formData.append('to',this.emailForm.email)
                formData.append('message',this.emailForm.message)
                shareWeb(formData).then(response=>{
                    this.loading = false
                    if(response.code==1000){
                        this.emailDialog = false
                        this.successDialog = true
                    }else{
                        this.emailDialog = false
                        this.failDialog = true
                    }
                }).catch((res) => {
                   
                    console.log(res)
                })
            }
        }
    },
}
</script>
<style scoped>
    .edit-agp-icon{
        cursor: pointer;
    }
/* 头部信息 */
    .print-boxs .reports-box{
        height: 1663px;
    }
    .print-boxs .reportss-box{
        transform: scale(0.7);
        transform-origin: 0 0;
    }
    .print-boxs .agp-main-box{
        padding:0 40px
    }
    .export-boxs .reports-box{
        /* height:2375px; */
    }
    .export-boxs .print-dialog{
        /* transform: scale(0.7857); */
        transform-origin: 0 0;
    }
     .reports-box{
        /* height:2375px; */
        overflow: hidden;
    }
    .report-main-title-infos{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom:50px;
        height:66px;
        position: relative;
        padding:0 20px;
        padding-top:73px;
        box-sizing: border-box;
    }
    .report-logo{
        width:158px;
        height:50px;
        display: block;
    }
    .report-main-title{
        font-size:50px;
        color:var(--color-primary);
        /* font-family:MiLan-Medium; */
        font-weight: 440;
        text-align: center;
        position: absolute;
        left:0;
        top:0;
        width:100%;
        padding-top:36.5px;
    }
    .report-main-date{
        font-size:20px;
        color:var(--color-black-100);
        display: flex;
        align-items: center;
    }
    .repart-main-dirver-box{
        width:20px;
        height:20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin:0 2px;
    }
    .repart-main-dirver{
        width:16px;
        height:1px;
        background:var(--color-black-100);
    }
    .agp{
        width:1680px;
        height:100%;
    }
    .agp-cont-main1{
        height:450px;
        position: relative;
    }
    .agp-cont-main1:nth-child(1){
         margin-right:20px;
    }
    .agp-main-box{
        width:1680px;
        padding:0 80px;
    }
    
    /* 基本信息 */
    .report-main-base-info{
        width:100%;
        height:209px;
    }
    .report-base-user{
        width:100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin:20px 0;
        height:35px;
        box-sizing: border-box;
        padding:0px 20px 0px 10px;
    }
    .report-base-user-item{
        display: flex;
        align-items: center;
        font-size:18px;
    }
    .report-base-user-item0{
         width:35%;
    }
    .report-base-user-item1{
        font-size:18px;
        flex-grow: 2;
         width:45%;
    }
     .report-base-user-item2{
        font-size:18px;
        width:20%;
    }
    .report-base-user-label{
        font-size: var(--fontSize-smax);
        color:var(--color-black-60);
    }
    .report-base-user-value{
        font-size: var(--fontSize-smax);
        color:var(--color-black-100);
        width:140px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 600;
    }
    .report-data-source{
        width:100%;
        height:52px;
        padding-left:20px;
        padding-right:60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background:#f7f7f7;
    }
      .report-data-sources{
        width:100%;
        height:52px;
        padding-left:20px;
        padding-right:60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
 
    /* 标准 */
    .bg-data-item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin:0;
        height:74px;
        padding:0 6px;
        border-bottom:1px solid var(--color-black-30);
    }
    .bg-data-item:last-child{
        border: none;
    }
    .bg-data-label{
        font-size:var(--fontSize-smax);
        color:var(--color-black-100);
        font-weight: 600;
    }
    .bg-data-tip{
        font-size:var(--fontSize-default);
        color:var(--color-black-60);
        font-weight: 400;
    }
    .bg-data-val{
        font-size:var(--fontSize-max);
        color:var(--color-black-100);
        font-weight: 440;
        font-family:MiLan-Medium;
    }
    .bg-data-val.active{
        color:var(--color-error);
    }
    .printToask{
        height:1080px;
    }
    .event-type{
        display: flex;
        align-items: center;
        margin-top:20px;
    }
    .event-type-item{
        display: flex;
        align-items: center;
        margin-right:30px;
    }
    .event-icon{
        width:30px;
        height:30px;
    }
    .event-type-label{
        font-size:var(--fontSize-default);
        color: var(--color-black-60);
        margin-left:6px;
    }
    /* pdf弹框 */
    .slot-progress{
        width:460px;
        margin:0 auto;
        padding:50px 0;
    }
    .down-icon{
        width:80px;
        height:80px;
        display: block;
        margin:0 auto;
        margin-bottom:30px;
    }
    .cgm-progress{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .cgm-bg-progress{
        width:400px;
        margin-right:10px;
        position: relative;
        border-radius:80px;
        background:#eaeaea;
        height:12px;
    }
    .cgm-resulr-progress{
        height: 12px;
        border-radius:80px;
        background:var(--color-primary);
    }
    .progress-result{
        font-size:var(--fontSize-max);
        color:var(--color-primary);
        width:50px;
    }
    .slot-progress-title{
        text-align: center;
        width:100%;
        font-size:var(--fontSize-smax);
        color:var(--color-primary);
        margin-bottom:20px;
    }
    .slot-progress-tips{
        font-size:var(--fontSize-default);
        color:var(--color-black-60);
        text-align: center;
    }
/* 参数解释 */
    .report-main-params{
        width:1480px;
        height:239px;
        background:#f7f7f7;
        border-radius:10px;
        padding:26px 20px 20px 20px;
        margin:0 auto;
    }
    .report-main-params-title{
        font-size:16px;
        color:var(--color-black-100);
        line-height: 21px;
    }
     .report-main-params-item{
        font-size:16px;
        color:var(--color-black-60);
        line-height: 21px;
        margin-bottom:8px;
     }
/* 弹窗 */
.print-dialog{
    width:100%;
    height:100%;
    background:rgba(0,0,0,0.6);
    position: fixed;
    left:0;
    top:0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.print-dialog-box{
    width:1060px;
    height:450px;
    background:#fff;
    border-radius: 10px;;
    position: relative;
}
.success-btn{
    width:140px;
    height:48px;
    border-radius:10px;
    background: var(--color-primary);
    margin:0 auto;
    text-align: center;
    line-height: 48px;
    color:#fff;
    margin-top:80px;
    cursor: pointer;
}
.email-popover{
    padding:20px;
}
.emailDiaolg-title{
    font-size:var(--fontSize-smax);
    font-weight: 700;
    margin-bottom:20px;
}
.emailForm{
    display: flex;
    align-items: center;
    margin-bottom:20px;
}
.emailForms{
     margin-bottom:20px;
}
.email-form-label{
    font-size:var(--fontSize-big);
    color:var(--color-black-60);
    margin-right:20px;
}
.email-list{
    display: flex;
    flex-wrap: wrap;
}
.email-item{
    padding:9px 15px;
    border:1px solid var(--color-black-10);
    background:#f7f7f7;
    border-radius:10px;
    color:var(--color-black-40);
    margin-right:30px;
    margin-top:20px;
    cursor: pointer;
}
.email-item.active{
    background:var(--color-primary);
    color:#fff;
    border:1px solid var(--color-primary);
}
.login-submit{
    display: block;
    margin:0 auto;
}
</style>
