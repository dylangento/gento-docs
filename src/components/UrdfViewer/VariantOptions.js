import React from 'react';
import {VARIANT_LABELS, armsOf, camerasFor, chooseVariant, effectorsFor, versionsOf} from './variants';

function Row({label, options, value, text, isAvailable, onPick}) {
  return (
    <div className="urdf-opts__row" role="group" aria-label={label}>
      <span className="urdf-opts__label">{label}</span>
      <span className="urdf-opts__choices">
        {options.map((o) => (
          <button key={o} type="button" className="urdf-opts__btn" aria-pressed={o === value}
            data-unavailable={isAvailable && !isAvailable(o) ? 'true' : undefined} onClick={() => onPick(o)}>
            {text(o)}
          </button>
        ))}
      </span>
    </div>
  );
}

// Version → arm length → wrist camera → end effector. Every click resolves to a package that exists:
// picking an end effector that needs a different camera switches the camera too (dimmed buttons).
// The version row only appears when a product has more than one version.
export default function VariantOptions({model, onChange, showVersion = true, showArm = true, locale}) {
  const t = VARIANT_LABELS[locale] || VARIANT_LABELS.en;
  const p = model.product;
  const versions = versionsOf(p);
  const cur = {version: model.version, arm: model.arm, camera: model.camera, effector: model.effector};
  const pick = (key) => (v) => onChange(chooseVariant(p, {...cur, [key]: v}, key));
  const withCamera = (e) => chooseVariant(p, {...cur, effector: e}, 'effector').camera === cur.camera;
  const versionText = (v) => `${v} (${v === versions[0] ? t.current : t.earlier})`;
  return (
    <div className="urdf-opts">
      {showVersion && versions.length > 1 && (
        <Row label={t.version} options={versions} value={cur.version} text={versionText} onPick={pick('version')} />
      )}
      {showArm && <Row label={t.arm} options={armsOf(p, cur.version)} value={cur.arm} text={t.mm} onPick={pick('arm')} />}
      <Row label={t.camera} options={camerasFor(p, cur.version, cur.arm)} value={cur.camera} text={(o) => t[o]} onPick={pick('camera')} />
      <Row label={t.effector} options={effectorsFor(p, cur.version, cur.arm)} value={cur.effector} text={(o) => t[o]}
        isAvailable={withCamera} onPick={pick('effector')} />
    </div>
  );
}
