import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import LunaOptions from '../UrdfViewer/LunaOptions';
import {LUNA} from '../UrdfViewer/luna';

const LABELS = {
  en: {view: 'View in 3D', version: 'Version', file: 'File'},
  'zh-CN': {view: '3D 预览', version: '版本', file: '文件'},
};

// Downloads page: choose a Luna URDF package by arm length, wrist camera and end effector.
export default function LunaUrdfPicker({initial = 'luna-615'}) {
  const {i18n} = useDocusaurusContext();
  const locale = i18n.currentLocale;
  const zh = locale === 'zh-CN';
  const t = LABELS[locale] || LABELS.en;
  const [model, setModel] = useState(LUNA.find((m) => m.id === initial) || LUNA[0]);
  return (
    <div className="luna-picker">
      <LunaOptions model={model} onChange={setModel} locale={locale} />
      <div className="luna-picker__result" aria-live="polite">
        <div className="luna-picker__text">
          <strong className="luna-picker__name">{zh ? model.zh : model.en}</strong>
          <span className="luna-picker__meta">
            {t.version} {model.version} · {t.file} <code>{model.file}</code>
          </span>
        </div>
        <span className="dl-group">
          <a className="dl-btn dl-btn--file" href={`https://drive.google.com/file/d/${model.drive}/view`} target="_blank" rel="noopener noreferrer">
            {model.format || 'RAR'}
          </a>
          <Link className="dl-btn dl-btn--preview" to={`/resources/models/?model=${model.id}`}>{t.view}</Link>
        </span>
      </div>
    </div>
  );
}
