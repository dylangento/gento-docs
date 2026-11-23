import React from 'react';
import {ARMS, LUNA_LABELS, camerasFor, chooseLuna, effectorsFor} from './luna';

function Row({label, options, value, text, isAvailable, onPick}) {
  return (
    <div className="luna-opts__row" role="group" aria-label={label}>
      <span className="luna-opts__label">{label}</span>
      <span className="luna-opts__choices">
        {options.map((o) => (
          <button key={o} type="button" className="luna-opts__btn" aria-pressed={o === value}
            data-unavailable={isAvailable && !isAvailable(o) ? 'true' : undefined} onClick={() => onPick(o)}>
            {text(o)}
          </button>
        ))}
      </span>
    </div>
  );
}

// Arm length → wrist camera → end effector. Every click resolves to a package that exists:
// picking an end effector that needs a different camera switches the camera too.
export default function LunaOptions({model, onChange, showArm = true, locale}) {
  const t = LUNA_LABELS[locale] || LUNA_LABELS.en;
  const cur = {arm: model.arm, camera: model.camera, effector: model.effector};
  const pick = (key) => (v) => onChange(chooseLuna({...cur, [key]: v}, key));
  const withCamera = (e) => effectorsFor(cur.arm).includes(e) && chooseLuna({...cur, effector: e}, 'effector').camera === cur.camera;
  return (
    <div className="luna-opts">
      {showArm && <Row label={t.arm} options={ARMS} value={cur.arm} text={t.mm} onPick={pick('arm')} />}
      <Row label={t.camera} options={camerasFor(cur.arm)} value={cur.camera} text={(o) => t[o]} onPick={pick('camera')} />
      <Row label={t.effector} options={effectorsFor(cur.arm)} value={cur.effector} text={(o) => t[o]}
        isAvailable={withCamera} onPick={pick('effector')} />
    </div>
  );
}
