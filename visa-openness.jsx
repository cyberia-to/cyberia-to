import { useState } from "react";

// GDP% = доля мирового ВВП национальностей которые могут въехать без визы
// США 26%, Китай 17%, ЕС27 17%, Япония 4%, Индия 3.5%, UK 3%, Канада 2%
// Ю.Корея 2%, Россия 2%, Австралия 1.7%, Бразилия 2%, Мексика 1.5%
// Шенген (93 нац): остальной ЕС + США + JP + UK + KR + CA + AU + LatAm ≈ 65%
// США (46 нац): EU+JP+UK+KR+CA+AU — без Китая/Индии/РФ/Бразилии ≈ 33%

const data = [
  // ─── АФРИКА
  {country:"Мозамбик",     flag:"🇲🇿",nat:198,gdp:97,pop:98,region:"Африка",note:"Принимает всех"},
  {country:"Руанда",       flag:"🇷🇼",nat:198,gdp:97,pop:98,region:"Африка",note:"Безвизово для всех с 2021"},
  {country:"Сейшелы",      flag:"🇸🇨",nat:196,gdp:96,pop:97,region:"Африка",note:"VoA всем туристам"},
  {country:"Кения",        flag:"🇰🇪",nat:190,gdp:95,pop:96,region:"Африка",note:"Безвизово для всех с 2024"},
  {country:"Уганда",       flag:"🇺🇬",nat:188,gdp:94,pop:95,region:"Африка",note:"VoA широко"},
  {country:"Гвинея-Бисау", flag:"🇬🇼",nat:185,gdp:93,pop:95,region:"Африка",note:"VoA большинству"},
  {country:"Экв.Гвинея",   flag:"🇬🇶",nat:185,gdp:93,pop:95,region:"Африка",note:"VoA широко"},
  {country:"Эфиопия",      flag:"🇪🇹",nat:183,gdp:93,pop:95,region:"Африка",note:"VoA большинству"},
  {country:"Сан-Томе",     flag:"🇸🇹",nat:182,gdp:93,pop:95,region:"Африка",note:"VoA большинству"},
  {country:"Коморы",       flag:"🇰🇲",nat:182,gdp:93,pop:94,region:"Африка",note:"VoA большинству"},
  {country:"Того",         flag:"🇹🇬",nat:182,gdp:93,pop:94,region:"Африка",note:"e-Visa широко"},
  {country:"Джибути",      flag:"🇩🇯",nat:180,gdp:92,pop:94,region:"Африка",note:"VoA широко"},
  {country:"Мадагаскар",   flag:"🇲🇬",nat:175,gdp:90,pop:93,region:"Африка",note:"VoA широко"},
  {country:"Малави",       flag:"🇲🇼",nat:172,gdp:90,pop:93,region:"Африка",note:"VoA широко"},
  {country:"Бурунди",      flag:"🇧🇮",nat:168,gdp:89,pop:92,region:"Африка",note:"VoA многим"},
  {country:"Буркина-Фасо", flag:"🇧🇫",nat:168,gdp:89,pop:92,region:"Африка",note:"VoA широко"},
  {country:"Нигер",        flag:"🇳🇪",nat:168,gdp:89,pop:92,region:"Африка",note:"VoA широко"},
  {country:"Танзания",     flag:"🇹🇿",nat:165,gdp:88,pop:91,region:"Африка",note:"VoA широко"},
  {country:"Бенин",        flag:"🇧🇯",nat:165,gdp:88,pop:91,region:"Африка",note:"e-Visa широко"},
  {country:"ЦАР",          flag:"🇨🇫",nat:162,gdp:88,pop:91,region:"Африка",note:"VoA многим"},
  {country:"Чад",          flag:"🇹🇩",nat:162,gdp:88,pop:91,region:"Африка",note:"VoA многим"},
  {country:"Зимбабве",     flag:"🇿🇼",nat:162,gdp:88,pop:91,region:"Африка",note:"VoA широко"},
  {country:"Гвинея",       flag:"🇬🇳",nat:162,gdp:88,pop:91,region:"Африка",note:"VoA многим"},
  {country:"Сьерра-Леоне", flag:"🇸🇱",nat:162,gdp:88,pop:91,region:"Африка",note:"VoA широко"},
  {country:"Либерия",      flag:"🇱🇷",nat:162,gdp:88,pop:91,region:"Африка",note:"VoA многим"},
  {country:"Габон",        flag:"🇬🇦",nat:158,gdp:87,pop:90,region:"Африка",note:"e-Visa широко"},
  {country:"ДР Конго",     flag:"🇨🇩",nat:158,gdp:87,pop:91,region:"Африка",note:"VoA некоторым"},
  {country:"Гамбия",       flag:"🇬🇲",nat:158,gdp:87,pop:90,region:"Африка",note:"VoA широко"},
  {country:"Кабо-Верде",   flag:"🇨🇻",nat:155,gdp:87,pop:91,region:"Африка",note:"VoA всем туристам"},
  {country:"Замбия",       flag:"🇿🇲",nat:155,gdp:87,pop:91,region:"Африка",note:"VoA широко"},
  {country:"Мали",         flag:"🇲🇱",nat:155,gdp:87,pop:91,region:"Африка",note:"VoA широко"},
  {country:"Юж.Судан",     flag:"🇸🇸",nat:152,gdp:86,pop:90,region:"Африка",note:"VoA широко"},
  {country:"Лесото",       flag:"🇱🇸",nat:150,gdp:86,pop:89,region:"Африка",note:"VoA многим"},
  {country:"Ботсвана",     flag:"🇧🇼",nat:150,gdp:86,pop:89,region:"Африка",note:"Умеренно открытая"},
  {country:"Эсватини",     flag:"🇸🇿",nat:148,gdp:85,pop:88,region:"Африка",note:"VoA многим"},
  {country:"Намибия",      flag:"🇳🇦",nat:148,gdp:85,pop:88,region:"Африка",note:"Умеренно открытая"},
  {country:"Мавритания",   flag:"🇲🇷",nat:145,gdp:84,pop:88,region:"Африка",note:""},
  {country:"Конго",        flag:"🇨🇬",nat:145,gdp:84,pop:88,region:"Африка",note:"VoA некоторым"},
  {country:"Ангола",       flag:"🇦🇴",nat:140,gdp:83,pop:87,region:"Африка",note:"e-Visa широко"},
  {country:"Камерун",      flag:"🇨🇲",nat:130,gdp:82,pop:85,region:"Африка",note:"Умеренно открытый"},
  {country:"Сенегал",      flag:"🇸🇳",nat:128,gdp:82,pop:85,region:"Африка",note:"Умеренно открытый"},
  {country:"Маврикий",     flag:"🇲🇺",nat:125,gdp:81,pop:84,region:"Африка",note:"Туристический хаб"},
  {country:"Гана",         flag:"🇬🇭",nat:125,gdp:81,pop:84,region:"Африка",note:"VoA всем с 2019"},
  {country:"Кот-д'Ивуар",  flag:"🇨🇮",nat:120,gdp:80,pop:83,region:"Африка",note:"Умеренно открытый"},
  {country:"Нигерия",      flag:"🇳🇬",nat:115,gdp:78,pop:81,region:"Африка",note:"Крупнейшая экономика Африки"},
  {country:"Египет",       flag:"🇪🇬",nat:105,gdp:73,pop:76,region:"Африка",note:"VoA многим"},
  {country:"Тунис",        flag:"🇹🇳",nat:95, gdp:68,pop:72,region:"Африка",note:"Открытый для туристов"},
  {country:"Марокко",      flag:"🇲🇦",nat:95, gdp:68,pop:72,region:"Африка",note:"Много соглашений"},
  {country:"ЮАР",          flag:"🇿🇦",nat:72, gdp:54,pop:62,region:"Африка",note:"Региональный хаб"},
  {country:"Алжир",        flag:"🇩🇿",nat:65, gdp:46,pop:56,region:"Африка",note:"Относительно закрытый"},
  {country:"Судан",        flag:"🇸🇩",nat:50, gdp:36,pop:44,region:"Африка",note:"Конфликт"},
  {country:"Сомали",       flag:"🇸🇴",nat:28, gdp:14,pop:22,region:"Африка",note:"Нестабильность"},
  {country:"Эритрея",      flag:"🇪🇷",nat:25, gdp:12,pop:20,region:"Африка",note:"Одна из самых закрытых"},
  {country:"Ливия",        flag:"🇱🇾",nat:20, gdp:10,pop:15,region:"Африка",note:"Конфликт"},

  // ─── ЛАТИНСКАЯ АМЕРИКА
  {country:"Гаити",         flag:"🇭🇹",nat:186,gdp:93,pop:95,region:"ЛА",note:"VoA всем практически"},
  {country:"Эквадор",       flag:"🇪🇨",nat:170,gdp:90,pop:92,region:"ЛА",note:"Исторически самый открытый"},
  {country:"Боливия",       flag:"🇧🇴",nat:165,gdp:89,pop:91,region:"ЛА",note:"Открытая политика"},
  {country:"Никарагуа",     flag:"🇳🇮",nat:148,gdp:85,pop:88,region:"ЛА",note:"VoA многим"},
  {country:"Гватемала",     flag:"🇬🇹",nat:138,gdp:83,pop:87,region:"ЛА",note:"CA-4 зона"},
  {country:"Гондурас",      flag:"🇭🇳",nat:138,gdp:83,pop:87,region:"ЛА",note:"CA-4 зона"},
  {country:"Сальвадор",     flag:"🇸🇻",nat:138,gdp:83,pop:87,region:"ЛА",note:"CA-4 зона"},
  {country:"Доминика",      flag:"🇩🇲",nat:145,gdp:85,pop:88,region:"ЛА",note:"VoA широко"},
  {country:"Сент-Китс",     flag:"🇰🇳",nat:140,gdp:84,pop:87,region:"ЛА",note:"VoA широко"},
  {country:"Антигуа",       flag:"🇦🇬",nat:140,gdp:84,pop:87,region:"ЛА",note:"VoA широко"},
  {country:"Сент-Люсия",    flag:"🇱🇨",nat:140,gdp:84,pop:87,region:"ЛА",note:"VoA широко"},
  {country:"Гренада",       flag:"🇬🇩",nat:140,gdp:84,pop:87,region:"ЛА",note:"VoA широко"},
  {country:"Сент-Винсент",  flag:"🇻🇨",nat:138,gdp:83,pop:87,region:"ЛА",note:"VoA широко"},
  {country:"Доминикана",    flag:"🇩🇴",nat:132,gdp:82,pop:86,region:"ЛА",note:"VoA широко, туризм"},
  {country:"Тринидад",      flag:"🇹🇹",nat:130,gdp:82,pop:85,region:"ЛА",note:"Умеренно открытый"},
  {country:"Багамы",        flag:"🇧🇸",nat:130,gdp:82,pop:85,region:"ЛА",note:"VoA широко"},
  {country:"Ямайка",        flag:"🇯🇲",nat:128,gdp:82,pop:85,region:"ЛА",note:"Туристическая политика"},
  {country:"Барбадос",      flag:"🇧🇧",nat:128,gdp:82,pop:85,region:"ЛА",note:"Открытая политика"},
  {country:"Коста-Рика",    flag:"🇨🇷",nat:128,gdp:82,pop:85,region:"ЛА",note:"Открытая туристическая"},
  {country:"Панама",        flag:"🇵🇦",nat:125,gdp:81,pop:85,region:"ЛА",note:"Финансовый хаб"},
  {country:"Гайана",        flag:"🇬🇾",nat:125,gdp:81,pop:84,region:"ЛА",note:"VoA некоторым"},
  {country:"Суринам",       flag:"🇸🇷",nat:125,gdp:81,pop:84,region:"ЛА",note:"Умеренно открытый"},
  {country:"Белиз",         flag:"🇧🇿",nat:120,gdp:80,pop:83,region:"ЛА",note:"Умеренно открытый"},
  {country:"Колумбия",      flag:"🇨🇴",nat:150,gdp:86,pop:89,region:"ЛА",note:"Открытая политика"},
  {country:"Перу",          flag:"🇵🇪",nat:130,gdp:83,pop:86,region:"ЛА",note:"Умеренно открытая"},
  {country:"Аргентина",     flag:"🇦🇷",nat:128,gdp:82,pop:85,region:"ЛА",note:"Открытая политика"},
  {country:"Уругвай",       flag:"🇺🇾",nat:125,gdp:81,pop:84,region:"ЛА",note:"Открытая политика"},
  {country:"Парагвай",      flag:"🇵🇾",nat:120,gdp:80,pop:83,region:"ЛА",note:"Умеренно открытый"},
  {country:"Бразилия",      flag:"🇧🇷",nat:115,gdp:78,pop:81,region:"ЛА",note:"Умеренно открытая"},
  {country:"Чили",          flag:"🇨🇱",nat:112,gdp:77,pop:80,region:"ЛА",note:"Много соглашений"},
  {country:"Куба",          flag:"🇨🇺",nat:80, gdp:58,pop:64,region:"ЛА",note:"Санкции США"},
  {country:"Венесуэла",     flag:"🇻🇪",nat:60, gdp:45,pop:53,region:"ЛА",note:"Политический кризис"},

  // ─── СЕВЕРНАЯ АМЕРИКА
  {country:"Мексика", flag:"🇲🇽",nat:125,gdp:82,pop:85,region:"Сев. Америка",note:"Принимает большинство"},
  {country:"США",     flag:"🇺🇸",nat:46, gdp:33,pop:39,region:"Сев. Америка",note:"EU+JP+UK+KR+CA+AU — без Китая/Индии/РФ/Бразилии"},
  {country:"Канада",  flag:"🇨🇦",nat:44, gdp:32,pop:38,region:"Сев. Америка",note:"Схожа с США"},

  // ─── ЕВРОПА — ШЕНГЕН (93 нац, GDP ~65%)
  {country:"Германия",          flag:"🇩🇪",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген: без Китая/Индии/РФ"},
  {country:"Франция",           flag:"🇫🇷",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Испания",           flag:"🇪🇸",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Италия",            flag:"🇮🇹",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Нидерланды",        flag:"🇳🇱",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Бельгия",           flag:"🇧🇪",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Швейцария",         flag:"🇨🇭",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген (не ЕС)"},
  {country:"Австрия",           flag:"🇦🇹",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Швеция",            flag:"🇸🇪",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Дания",             flag:"🇩🇰",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Финляндия",         flag:"🇫🇮",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Норвегия",          flag:"🇳🇴",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген (не ЕС)"},
  {country:"Ирландия",          flag:"🇮🇪",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Португалия",        flag:"🇵🇹",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Греция",            flag:"🇬🇷",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Чехия",             flag:"🇨🇿",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Польша",            flag:"🇵🇱",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Венгрия",           flag:"🇭🇺",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Словакия",          flag:"🇸🇰",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Словения",          flag:"🇸🇮",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Литва",             flag:"🇱🇹",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Латвия",            flag:"🇱🇻",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Эстония",           flag:"🇪🇪",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Люксембург",        flag:"🇱🇺",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Мальта",            flag:"🇲🇹",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Хорватия",          flag:"🇭🇷",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген с 2023"},
  {country:"Румыния",           flag:"🇷🇴",nat:90,gdp:64,pop:67,region:"ЕС",note:"Частичный Шенген"},
  {country:"Болгария",          flag:"🇧🇬",nat:88,gdp:63,pop:66,region:"ЕС",note:"Вступает в Шенген"},
  {country:"Кипр",              flag:"🇨🇾",nat:88,gdp:63,pop:66,region:"ЕС",note:"Не в Шенгене"},
  {country:"Исландия",          flag:"🇮🇸",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген (не ЕС)"},
  {country:"Лихтенштейн",       flag:"🇱🇮",nat:93,gdp:65,pop:68,region:"ЕС",note:"Шенген"},
  {country:"Великобритания",    flag:"🇬🇧",nat:90,gdp:64,pop:67,region:"ЕС",note:"Post-Brexit"},
  {country:"Сербия",            flag:"🇷🇸",nat:95,gdp:65,pop:68,region:"ЕС",note:"Безвизово: ЕС+РФ+КНР одновременно"},
  {country:"Черногория",        flag:"🇲🇪",nat:90,gdp:64,pop:67,region:"ЕС",note:""},
  {country:"Северная Македония",flag:"🇲🇰",nat:78,gdp:57,pop:62,region:"ЕС",note:""},
  {country:"Албания",           flag:"🇦🇱",nat:80,gdp:60,pop:65,region:"ЕС",note:""},
  {country:"Босния",            flag:"🇧🇦",nat:70,gdp:53,pop:59,region:"ЕС",note:""},
  {country:"Косово",            flag:"🇽🇰",nat:58,gdp:43,pop:51,region:"ЕС",note:""},

  // ─── ЕВРАЗИЯ / СНГ
  {country:"Грузия",       flag:"🇬🇪",nat:110,gdp:77,pop:80,region:"Евразия",note:"Открыта: и Запад и СНГ"},
  {country:"Армения",      flag:"🇦🇲",nat:115,gdp:78,pop:81,region:"Евразия",note:"Открытая политика"},
  {country:"Турция",       flag:"🇹🇷",nat:75, gdp:55,pop:62,region:"Евразия",note:"СНГ+Азия+часть Запада"},
  {country:"Азербайджан",  flag:"🇦🇿",nat:65, gdp:47,pop:54,region:"Евразия",note:"e-Visa, умеренно"},
  {country:"Узбекистан",   flag:"🇺🇿",nat:65, gdp:47,pop:54,region:"Евразия",note:"e-Visa расширяется"},
  {country:"Казахстан",    flag:"🇰🇿",nat:55, gdp:38,pop:50,region:"Евразия",note:"СНГ+часть Азии"},
  {country:"Кыргызстан",   flag:"🇰🇬",nat:58, gdp:40,pop:51,region:"Евразия",note:""},
  {country:"Таджикистан",  flag:"🇹🇯",nat:50, gdp:36,pop:47,region:"Евразия",note:""},
  {country:"Украина",      flag:"🇺🇦",nat:90, gdp:60,pop:65,region:"Евразия",note:"Безвизово с ЕС, конфликт"},
  {country:"Молдова",      flag:"🇲🇩",nat:70, gdp:52,pop:58,region:"Евразия",note:"Тяготеет к ЕС"},
  {country:"Беларусь",     flag:"🇧🇾",nat:50, gdp:37,pop:44,region:"Евразия",note:"Санкции, ограничена"},
  {country:"Россия",       flag:"🇷🇺",nat:70, gdp:30,pop:52,region:"Евразия",note:"После 2022: Запад закрыт, СНГ+Азия+ЛА открыты"},
  {country:"Туркменистан", flag:"🇹🇲",nat:12, gdp:8, pop:10,region:"Евразия",note:"Одна из самых закрытых стран"},

  // ─── БЛИЖНИЙ ВОСТОК
  {country:"ОАЭ",               flag:"🇦🇪",nat:125,gdp:81,pop:84,region:"Ближний Восток",note:"VoA многим, богатая страна"},
  {country:"Иордания",          flag:"🇯🇴",nat:110,gdp:76,pop:79,region:"Ближний Восток",note:"VoA многим"},
  {country:"Катар",             flag:"🇶🇦",nat:88, gdp:65,pop:70,region:"Ближний Восток",note:"VoA многим"},
  {country:"Оман",              flag:"🇴🇲",nat:85, gdp:63,pop:68,region:"Ближний Восток",note:"e-Visa широко"},
  {country:"Саудовская Аравия", flag:"🇸🇦",nat:85, gdp:63,pop:69,region:"Ближний Восток",note:"Открывается для туризма"},
  {country:"Бахрейн",           flag:"🇧🇭",nat:82, gdp:61,pop:67,region:"Ближний Восток",note:"e-Visa широко"},
  {country:"Кувейт",            flag:"🇰🇼",nat:68, gdp:50,pop:57,region:"Ближний Восток",note:"Умеренно открытый"},
  {country:"Израиль",           flag:"🇮🇱",nat:73, gdp:56,pop:60,region:"Ближний Восток",note:"Принимает Запад, часть Азии"},
  {country:"Ливан",             flag:"🇱🇧",nat:50, gdp:37,pop:44,region:"Ближний Восток",note:"Кризис, ограничен"},
  {country:"Ирак",              flag:"🇮🇶",nat:30, gdp:22,pop:30,region:"Ближний Восток",note:"VoA некоторым"},
  {country:"Сирия",             flag:"🇸🇾",nat:25, gdp:15,pop:22,region:"Ближний Восток",note:"Конфликт, крайне закрытая"},
  {country:"Йемен",             flag:"🇾🇪",nat:20, gdp:12,pop:18,region:"Ближний Восток",note:"Война, практически закрыт"},
  {country:"Иран",              flag:"🇮🇷",nat:15, gdp:10,pop:18,region:"Ближний Восток",note:"Санкции+закрытая политика"},

  // ─── АЗИЯ
  {country:"Мальдивы",    flag:"🇲🇻",nat:196,gdp:96,pop:97,region:"Азия",note:"VoA всем туристам"},
  {country:"Тимор-Лесте", flag:"🇹🇱",nat:180,gdp:92,pop:94,region:"Азия",note:"VoA широко"},
  {country:"Камбоджа",    flag:"🇰🇭",nat:175,gdp:91,pop:93,region:"Азия",note:"VoA почти всем"},
  {country:"Непал",       flag:"🇳🇵",nat:165,gdp:89,pop:91,region:"Азия",note:"VoA широко"},
  {country:"Шри-Ланка",   flag:"🇱🇰",nat:160,gdp:88,pop:90,region:"Азия",note:"e-Visa широко"},
  {country:"Лаос",        flag:"🇱🇦",nat:158,gdp:87,pop:90,region:"Азия",note:"VoA многим"},
  {country:"Мьянма",      flag:"🇲🇲",nat:150,gdp:86,pop:89,region:"Азия",note:"VoA многим"},
  {country:"Таиланд",     flag:"🇹🇭",nat:130,gdp:83,pop:86,region:"Азия",note:"VoA+безвизовые, туристический хаб"},
  {country:"Вьетнам",     flag:"🇻🇳",nat:118,gdp:79,pop:82,region:"Азия",note:"e-Visa расширяется"},
  {country:"Индонезия",   flag:"🇮🇩",nat:120,gdp:80,pop:83,region:"Азия",note:"VoA многим"},
  {country:"Малайзия",    flag:"🇲🇾",nat:108,gdp:75,pop:78,region:"Азия",note:"VoA+безвизовые"},
  {country:"Сингапур",    flag:"🇸🇬",nat:110,gdp:76,pop:79,region:"Азия",note:"Строгий отбор, богатый пул"},
  {country:"Филиппины",   flag:"🇵🇭",nat:95, gdp:68,pop:72,region:"Азия",note:"30 дней всем без визы"},
  {country:"Бруней",      flag:"🇧🇳",nat:100,gdp:72,pop:75,region:"Азия",note:"VoA многим"},
  {country:"Япония",      flag:"🇯🇵",nat:100,gdp:72,pop:76,region:"Азия",note:"+Китай в 2025, богатый пул"},
  {country:"Южная Корея", flag:"🇰🇷",nat:98, gdp:71,pop:75,region:"Азия",note:"Схожа с Японией"},
  {country:"Тайвань",     flag:"🇹🇼",nat:95, gdp:69,pop:73,region:"Азия",note:"Не в ООН, в Henley есть"},
  {country:"Китай",       flag:"🇨🇳",nat:77, gdp:48,pop:58,region:"Азия",note:"+40 стран за 2024-25, без США/Индии/UK/CA/AU"},
  {country:"Монголия",    flag:"🇲🇳",nat:65, gdp:47,pop:54,region:"Азия",note:"Умеренно открытая"},
  {country:"Индия",       flag:"🇮🇳",nat:60, gdp:42,pop:55,region:"Азия",note:"e-Visa для многих"},
  {country:"Бангладеш",   flag:"🇧🇩",nat:50, gdp:38,pop:45,region:"Азия",note:"Строгий контроль"},
  {country:"Бутан",       flag:"🇧🇹",nat:20, gdp:11,pop:17,region:"Азия",note:"Сбор $200/день — de facto закрыт"},
  {country:"Пакистан",    flag:"🇵🇰",nat:30, gdp:20,pop:28,region:"Азия",note:"Ограниченная открытость"},
  {country:"Афганистан",  flag:"🇦🇫",nat:8,  gdp:4, pop:8, region:"Азия",note:"Практически закрыт"},
  {country:"Сев.Корея",   flag:"🇰🇵",nat:3,  gdp:2, pop:3, region:"Азия",note:"Закрыта для всего мира"},

  // ─── ОКЕАНИЯ
  {country:"Самоа",           flag:"🇼🇸",nat:198,gdp:97,pop:98,region:"Океания",note:"Принимает всех — 198 национальностей"},
  {country:"Маршалловы о-ва", flag:"🇲🇭",nat:192,gdp:95,pop:97,region:"Океания",note:"VoA широко"},
  {country:"Микронезия",      flag:"🇫🇲",nat:194,gdp:96,pop:97,region:"Океания",note:"Открыта почти всем"},
  {country:"Палау",           flag:"🇵🇼",nat:194,gdp:96,pop:97,region:"Океания",note:"VoA всем"},
  {country:"Тувалу",          flag:"🇹🇻",nat:192,gdp:95,pop:96,region:"Океания",note:"VoA всем"},
  {country:"Кирибати",        flag:"🇰🇮",nat:192,gdp:95,pop:96,region:"Океания",note:"VoA всем"},
  {country:"Науру",           flag:"🇳🇷",nat:185,gdp:94,pop:96,region:"Океания",note:"VoA широко"},
  {country:"Тонга",           flag:"🇹🇴",nat:170,gdp:90,pop:93,region:"Океания",note:"VoA многим"},
  {country:"Соломоны",        flag:"🇸🇧",nat:165,gdp:88,pop:91,region:"Океания",note:"VoA широко"},
  {country:"Вануату",         flag:"🇻🇺",nat:165,gdp:88,pop:91,region:"Океания",note:"VoA широко"},
  {country:"Папуа-Н.Г.",      flag:"🇵🇬",nat:130,gdp:82,pop:85,region:"Океания",note:"VoA ряду стран"},
  {country:"Фиджи",           flag:"🇫🇯",nat:120,gdp:79,pop:83,region:"Океания",note:"Умеренно открытая"},
  {country:"Новая Зеландия",  flag:"🇳🇿",nat:60, gdp:42,pop:47,region:"Океания",note:"Схожа с Австралией"},
  {country:"Австралия",       flag:"🇦🇺",nat:44, gdp:33,pop:39,region:"Океания",note:"Самый закрытый богатый паспорт"},
];

const SORT_OPTIONS = [
  {key:"nat",   label:"Кол-во стран"},
  {key:"gdp",   label:"GDP вес %"},
  {key:"pop",   label:"Население %"},
  {key:"smart", label:"∛(нац×GDP×нас)"},
];

const REGIONS = ["Все","Африка","ЛА","Сев. Америка","ЕС","Евразия","Ближний Восток","Азия","Океания"];

export default function VisaOpenness() {
  const [sortBy, setSortBy]   = useState("nat");
  const [region, setRegion]   = useState("Все");
  const [hovered, setHovered] = useState(null);

  const geoMean = (d) => Math.pow((d.nat/198)*(d.gdp/97)*(d.pop/98), 1/3)*100;

  const sorted = [...data]
    .filter(d => region==="Все" || d.region===region)
    .sort((a,b) => sortBy==="smart" ? geoMean(b)-geoMean(a) : b[sortBy]-a[sortBy]);

  const getBarWidth = (d) => {
    if(sortBy==="nat")  return (d.nat/198)*100;
    if(sortBy==="gdp")  return (d.gdp/97)*100;
    if(sortBy==="pop")  return (d.pop/98)*100;
    return geoMean(d);
  };

  const getColor = (d) => {
    const s = sortBy==="smart" ? geoMean(d)/100
            : sortBy==="nat"   ? d.nat/198
            : sortBy==="gdp"   ? d.gdp/97
            :                    d.pop/98;
    if(s>0.80) return "#4ade80";
    if(s>0.60) return "#86efac";
    if(s>0.40) return "#fbbf24";
    if(s>0.20) return "#f97316";
    return "#ef4444";
  };

  const getVal = (d) => {
    if(sortBy==="nat")  return `${d.nat} стран`;
    if(sortBy==="gdp")  return `${d.gdp}% ВВП`;
    if(sortBy==="pop")  return `${d.pop}% нас.`;
    return geoMean(d).toFixed(1);
  };

  return (
    <div style={{fontFamily:"'Georgia',serif",background:"#0a0a0a",minHeight:"100vh",color:"#e5e5e5",padding:"20px 14px"}}>
      <div style={{maxWidth:"800px",margin:"0 auto"}}>

        <div style={{marginBottom:"20px"}}>
          <div style={{fontSize:"9px",letterSpacing:"5px",color:"#333",marginBottom:"6px",textTransform:"uppercase"}}>
            Henley Openness × GDP × Population 2026
          </div>
          <h1 style={{fontSize:"clamp(18px,4vw,30px)",fontWeight:"400",margin:"0 0 4px",color:"#f0f0f0",lineHeight:"1.1"}}>
            Визовая открытость — {sorted.length} из {data.length} стран
          </h1>
        </div>

        <div style={{background:"#0d0d0d",border:"1px solid #181818",borderRadius:"6px",padding:"10px 14px",marginBottom:"16px",fontSize:"11px",color:"#666",lineHeight:"1.6"}}>
          <span style={{color:"#fbbf24"}}>⚡ Парадокс:</span> Самоа (198 нац.) → ~97% мирового ВВП.
          США (46 нац.) → ~33% ВВП — без Китая (17%), Индии (3.5%), РФ, Бразилии.
          <span style={{color:"#4ade80"}}> ∛ метрика = геометрическое среднее трёх показателей (как HDI).</span>
        </div>

        <div style={{display:"flex",gap:"5px",flexWrap:"wrap",marginBottom:"16px",alignItems:"center"}}>
          {SORT_OPTIONS.map(o=>(
            <button key={o.key} onClick={()=>setSortBy(o.key)} style={{
              padding:"5px 10px",background:sortBy===o.key?"#4ade80":"#0d0d0d",
              color:sortBy===o.key?"#000":"#555",
              border:`1px solid ${sortBy===o.key?"#4ade80":"#181818"}`,
              borderRadius:"4px",cursor:"pointer",fontSize:"11px",fontFamily:"Georgia,serif",transition:"all 0.15s",
            }}>{o.label}</button>
          ))}
          <select value={region} onChange={e=>setRegion(e.target.value)} style={{
            padding:"5px 9px",background:"#0d0d0d",color:"#555",border:"1px solid #181818",
            borderRadius:"4px",fontSize:"11px",fontFamily:"Georgia,serif",cursor:"pointer",marginLeft:"3px",
          }}>
            {REGIONS.map(r=><option key={r}>{r}</option>)}
          </select>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:"2px"}}>
          {sorted.map((d,i)=>(
            <div key={d.country+i}
              onMouseEnter={()=>setHovered(d.country)}
              onMouseLeave={()=>setHovered(null)}
              style={{
                background:hovered===d.country?"#0d0d0d":"transparent",
                border:`1px solid ${hovered===d.country?"#181818":"transparent"}`,
                borderRadius:"4px",padding:"7px 9px",transition:"all 0.1s",
              }}
            >
              <div style={{display:"flex",alignItems:"center",gap:"7px"}}>
                <div style={{fontSize:"10px",color:"#222",width:"22px",textAlign:"right",flexShrink:0}}>{i+1}</div>
                <div style={{display:"flex",alignItems:"center",gap:"6px",width:"150px",flexShrink:0}}>
                  <span style={{fontSize:"14px"}}>{d.flag}</span>
                  <span style={{fontSize:"11px",color:"#aaa",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{d.country}</span>
                </div>
                <div style={{flex:1}}>
                  <div style={{height:"4px",background:"#0f0f0f",borderRadius:"2px",overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${getBarWidth(d)}%`,background:getColor(d),borderRadius:"2px",transition:"width 0.3s ease"}}/>
                  </div>
                </div>
                <div style={{fontSize:"11px",color:getColor(d),width:"70px",textAlign:"right",flexShrink:0,fontVariantNumeric:"tabular-nums"}}>{getVal(d)}</div>
              </div>
              {hovered===d.country&&(
                <div style={{marginLeft:"29px",display:"flex",gap:"12px",flexWrap:"wrap",fontSize:"10px",color:"#3a3a3a",marginTop:"4px"}}>
                  <span>🌍 {d.nat}</span>
                  <span>💰 {d.gdp}%</span>
                  <span>👥 {d.pop}%</span>
                  <span>∛ {geoMean(d).toFixed(1)}</span>
                  {d.note&&<span style={{color:"#2a2a2a"}}>— {d.note}</span>}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{marginTop:"18px",padding:"10px 14px",background:"#060606",border:"1px solid #101010",borderRadius:"6px",fontSize:"9px",color:"#2a2a2a",lineHeight:"1.8"}}>
          <div><span style={{color:"#4ade80"}}>Кол-во стран</span> — Henley Openness Index 2026 (~199 паспортов)</div>
          <div><span style={{color:"#fbbf24"}}>GDP %</span> — доля мирового ВВП принятых нац. (World Bank 2024, расчётные оценки)</div>
          <div><span style={{color:"#f97316"}}>Население %</span> — доля мирового населения принятых нац.</div>
          <div><span style={{color:"#86efac"}}>∛</span> — геометрическое среднее трёх нормированных показателей. Наказывает дисбаланс.</div>
        </div>
      </div>
    </div>
  );
}
