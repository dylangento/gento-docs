import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import VariantOptions from '../UrdfViewer/VariantOptions';
import {latestVersion, variantsOf} from '../UrdfViewer/variants';

const LABELS = {
  en: {view: 'View in 3D', version: 'Version', file: 'File'},
  'zh-CN': {view: '3D 预览', version: '版本', file: '文件'},
};

// Downloads page: choose a URDF package (product="luna" or "skye") by arm length, wrist camera and end effector.
export default function UrdfPicker({product, initial}) {
  const {i18n} = useDocusaurusContext();
  const locale = i18n.currentLocale;
  const zh = locale === 'zh-CN';
  const t = LABELS[locale] || LABELS.en;
  const all = variantsOf(product);
  const [model, setModel] = useState(all.find((m) => m.id === initial) || variantsOf(product, latestVersion(product))[0]);
  if (!model) return null;
  return (
    <div className="urdf-picker">
      <VariantOptions model={model} onChange={setModel} locale={locale} />
      <div className="urdf-picker__result" aria-live="polite">
        <div className="urdf-picker__text">
          <strong className="urdf-picker__name">{zh ? model.zh : model.en}</strong>
          <span className="urdf-picker__meta">
            {t.version} {model.version} · {t.file} <code>{model.file}</code>
          </span>
        </div>
        <span className="dl-group">
          <a className="dl-btn dl-btn--file" href={`https://drive.google.com/file/d/${model.drive}/view`} target="_blank" rel="noopener noreferrer">
            {model.format}
          </a>
          <Link className="dl-btn dl-btn--preview" to={`/resources/models/?model=${model.id}`}>{t.view}</Link>
        </span>
      </div>
    </div>
  );
}
