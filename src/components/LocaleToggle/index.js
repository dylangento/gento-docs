import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useAlternatePageUtils} from '@docusaurus/theme-common/internal';
import {useHistorySelector} from '@docusaurus/theme-common';
import IconLanguage from '@theme/Icon/Language';

// Phone language switch: one tap flips between English and 简体中文 on the same page.
// Shown only on narrow screens (see custom.css); desktop keeps the regular language dropdown,
// and the hamburger menu keeps its "Languages" entry.
export default function LocaleToggle({mobile}) {
  const {i18n: {currentLocale, locales, localeConfigs}} = useDocusaurusContext();
  const alternatePageUtils = useAlternatePageUtils();
  const search = useHistorySelector((history) => history.location.search);
  const hash = useHistorySelector((history) => history.location.hash);
  if (mobile) {
    return null;
  }
  const target = locales.find((locale) => locale !== currentLocale) ?? currentLocale;
  const href = `${alternatePageUtils.createUrl({locale: target, fullyQualified: false})}${search}${hash}`;
  const lang = localeConfigs[target]?.htmlLang;
  return (
    <a
      className="navbar__item navbar__link locale-toggle"
      href={href}
      hrefLang={lang}
      lang={lang}
      aria-label={`Switch language to ${localeConfigs[target]?.label ?? target}`}>
      <IconLanguage width={18} height={18} />
      <span>{target === 'zh-CN' ? '中文' : 'EN'}</span>
    </a>
  );
}
