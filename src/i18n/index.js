import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhcnLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from 'element-ui/lib/locale/lang/en'

import pagesZhcn from '@/i18n/lang/zh-cn.js'
import pagesEn from '@/i18n/lang/en.js'

import Cookies from 'js-cookie'

// 使用插件
Vue.use(VueI18n)

const messages = {
    'zh-cn': {
      ...zhcnLocale,
      message: {
        ...pagesZhcn
      }
    },
    en: {
      ...enLocale,
      message: {
        ...pagesEn
      }
    }
  }
  
  // 导出语言国际化
  export const i18n = new VueI18n({
    locale: Cookies.get('language')?Cookies.get('language'):navigator.language,
    fallbackLocale: 'zh-cn',
    messages,
    // 关闭未翻译的警告
    silentTranslationWarn: true
  })