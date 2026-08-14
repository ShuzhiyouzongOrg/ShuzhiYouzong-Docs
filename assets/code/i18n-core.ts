type TranslationTuple = readonly [
  zh: string, // 简体中文
  en: string, // 英文（全局回退语言）
  ko: string, // 韩文
  zhTw: string, // 繁体中文
  ja: string // 日文
]
const languageOrder = [ // 界面语言展示顺序
  LanguageEnum.ZH,
  LanguageEnum.EN,
  LanguageEnum.KO,
  LanguageEnum.ZH_TW,
  LanguageEnum.JA
] as const
const messages = { // 合并框架词典与业务词典
  [LanguageEnum.EN]: { ...enMessages, app: appMessages[LanguageEnum.EN] },
  [LanguageEnum.ZH]: { ...zhMessages, app: appMessages[LanguageEnum.ZH] },
  [LanguageEnum.KO]: mergeMessages(enMessages, { // 韩文以英文为基底
    ...frameworkMessages[LanguageEnum.KO],
    app: appMessages[LanguageEnum.KO]
  }),
  [LanguageEnum.ZH_TW]: mergeMessages(zhMessages, { // 繁体以简体为基底
    ...frameworkMessages[LanguageEnum.ZH_TW],
    app: appMessages[LanguageEnum.ZH_TW]
  }),
  [LanguageEnum.JA]: mergeMessages(enMessages, { // 日文以英文为基底
    ...frameworkMessages[LanguageEnum.JA],
    app: appMessages[LanguageEnum.JA]
  })
}
const i18n = createI18n({ // 创建全局唯一 i18n 实例
  locale: getDefaultLanguage(), // 读取持久化的语言偏好
  legacy: false,
  globalInjection: true,
  fallbackLocale: LanguageEnum.EN, // 未命中项回退英文
  messages
})
function changeLanguage(lang: LanguageEnum) { // 全局切换语言
  if (i18n.global.locale.value === lang) return
  i18n.global.locale.value = lang
  useUserStore().setLanguage(lang) // 写入用户状态并持久化
  document.documentElement.lang = lang // 同步 HTML lang 属性
}
