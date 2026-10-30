import React, {useEffect, useRef, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import MODELS from './models.json';

const LABELS = {
  en: {
    model: 'Model', joints: 'Joints', resetPose: 'Reset pose', resetView: 'Reset view',
    loading: 'Loading the 3D model…', error: "The 3D model couldn't be loaded.", partial: "Some parts of the model couldn't be loaded.",
    download: 'Download the full URDF ↗', downloadCad: 'Download the CAD files ↗', hint: 'Drag to rotate · scroll to zoom · right-drag to pan', noJoints: 'This model has no movable joints.',
  },
  'zh-CN': {
    model: '模型', joints: '关节', resetPose: '复位姿态', resetView: '复位视角',
    loading: '正在加载 3D 模型…', error: '3D 模型加载失败。', partial: '模型的部分零件加载失败。',
    download: '下载完整 URDF ↗', downloadCad: '下载 CAD 文件 ↗', hint: '拖动旋转 · 滚轮缩放 · 右键拖动平移', noJoints: '该模型没有可动关节。',
  },
};
const GROUP_LABELS = {
  en: {leftArm: 'Left arm', rightArm: 'Right arm', body: 'Body', base: 'Mobile base', head: 'Head', leftGripper: 'Left gripper', rightGripper: 'Right gripper', gripper: 'Gripper', other: 'Other'},
  'zh-CN': {leftArm: '左臂', rightArm: '右臂', body: '躯干', base: '移动底盘', head: '头部', leftGripper: '左夹爪', rightGripper: '右夹爪', gripper: '夹爪', other: '其他'},
};
const GROUP_ORDER = ['leftArm', 'rightArm', 'body', 'base', 'head', 'leftGripper', 'rightGripper', 'gripper', 'other'];

const sideOf = (s) => {
  if (/(^|[^a-z])left|(^|_)l(\d|_|$)/.test(s)) return 'left';
  if (/(^|[^a-z])right|(^|_)r(\d|_|$)/.test(s)) return 'right';
  return null;
};

// Sort joints into body-part groups from their URDF names (Joint1_L, Arm_R10_Joint, right_gripper_left_finger_joint, ...).
function groupOf(name) {
  const s = name.toLowerCase();
  if (/wheel|chassis|underpan|caster/.test(s)) return 'base';
  if (/head|neck/.test(s)) return 'head';
  const g = s.match(/^(.*?)gripper/);
  if (g) return sideOf(g[1]) ? `${sideOf(g[1])}Gripper` : 'gripper';
  if (/finger|claw|chipper/.test(s)) return 'gripper';
  const arm = s.match(/^arm_([lr])(\d+)_joint$/);
  if (arm && Number(arm[2]) >= 8) return arm[1] === 'l' ? 'leftGripper' : 'rightGripper';
  if (/leg|waist|lift|torso|body|column|spine/.test(s)) return 'body';
  const side = sideOf(s);
  return side ? `${side}Arm` : 'other';
}

// Shorter slider labels: drop a leading robot-name prefix such as "Gento Luna_" (the full name stays in the tooltip).
const shortName = (n) => n.replace(/^Gento [A-Za-z]+_/, '');

const PRODUCTS = [['marvin-pro', 'Marvin Pro'], ['marvin', 'Marvin'], ['luna', 'Luna'], ['skye', 'Skye'], ['omni-gripper', 'Omni-Gripper']];

const fmt = (j, v) => (j.type === 'prismatic' ? `${Math.round(v * 1000)} mm` : `${Math.round((v * 180) / Math.PI)}°`);

// Interactive preview of the simplified URDF models (and CAD-only parts, kind: 'cad') in static/models/ (see models.json).
// ?model=<id> in the page URL selects a model, so download rows can link straight to one.
export default function UrdfViewer() {
  const {i18n} = useDocusaurusContext();
  const zh = i18n.currentLocale === 'zh-CN';
  const t = LABELS[i18n.currentLocale] || LABELS.en;
  const stage = useRef(null);
  const viewer = useRef(null);
  const [ready, setReady] = useState(false);
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [status, setStatus] = useState('loading');
  const [joints, setJoints] = useState([]);
  const [values, setValues] = useState({});

  useEffect(() => {
    let cancelled = false;
    const q = new URLSearchParams(window.location.search).get('model');
    if (q && MODELS.some((m) => m.id === q)) setModelId(q);
    import('./scene')
      .then(({createViewer}) => {
        if (cancelled || !stage.current) return;
        viewer.current = createViewer(stage.current, {
          onStatus: setStatus,
          onJoints: (js) => {
            setJoints(js);
            setValues(Object.fromEntries(js.map((j) => [j.name, j.value])));
          },
        });
        setReady(true);
      })
      .catch(() => setStatus('error'));
    return () => {
      cancelled = true;
      if (viewer.current) viewer.current.dispose();
      viewer.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ready || !viewer.current) return;
    const m = MODELS.find((x) => x.id === modelId) || MODELS[0];
    viewer.current.load(`/models/${m.path}`);
    const url = new URL(window.location.href);
    url.searchParams.set('model', m.id);
    window.history.replaceState(window.history.state, '', url);
  }, [ready, modelId]);

  const current = MODELS.find((x) => x.id === modelId) || MODELS[0];
  const setJoint = (name, v) => {
    setValues((s) => ({...s, [name]: v}));
    if (viewer.current) viewer.current.setJoint(name, v);
  };
  const resetPose = () => joints.forEach((j) => setJoint(j.name, j.value));

  const gl = GROUP_LABELS[i18n.currentLocale] || GROUP_LABELS.en;
  const groups = GROUP_ORDER.map((g) => [g, joints.filter((j) => groupOf(j.name) === g)]).filter(([, js]) => js.length);

  return (
    <div className="urdf-viewer">
      <div className="urdf-viewer__bar">
        <label className="urdf-viewer__select">
          <span>{t.model}</span>
          <select value={modelId} onChange={(e) => setModelId(e.target.value)}>
            {PRODUCTS.filter(([p]) => MODELS.some((m) => m.product === p)).map(([p, name]) => (
              <optgroup key={p} label={name}>
                {MODELS.filter((m) => m.product === p).map((m) => (
                  <option key={m.id} value={m.id}>{zh ? m.zh : m.en}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <span className="urdf-viewer__actions">
          <button type="button" className="urdf-viewer__btn" onClick={resetPose} disabled={!joints.length}>{t.resetPose}</button>
          <button type="button" className="urdf-viewer__btn" onClick={() => viewer.current && viewer.current.resetView()}>{t.resetView}</button>
        </span>
      </div>
      <div className="urdf-viewer__main">
        <div className="urdf-viewer__view">
          <div className="urdf-viewer__stage" ref={stage}>
            {status !== 'ready' && (
              <div className={`urdf-viewer__status urdf-viewer__status--${status}`} role="status">
                {status === 'loading' ? t.loading : status === 'partial' ? t.partial : t.error}
              </div>
            )}
          </div>
          <div className="urdf-viewer__meta">
            <span>{t.hint}</span>
            {current.drive && (
              <a href={`https://drive.google.com/file/d/${current.drive}/view`} target="_blank" rel="noopener noreferrer">{current.kind === 'cad' ? t.downloadCad : t.download}</a>
            )}
          </div>
        </div>
        <aside className="urdf-viewer__panel" aria-label={t.joints}>
          <div className="urdf-viewer__panel-head">{t.joints} ({joints.length})</div>
          {joints.length ? (
            groups.map(([g, js]) => (
              <details key={g} className="urdf-viewer__group" open>
                <summary>
                  <span>{gl[g]}</span>
                  <span className="urdf-viewer__count">{js.length}</span>
                </summary>
                <div className="urdf-viewer__joint-list">
                  {js.map((j) => {
                    const v = values[j.name] ?? j.value;
                    return (
                      <label key={j.name} className="urdf-viewer__joint">
                        <span className="urdf-viewer__joint-name" title={j.name}>{shortName(j.name)}</span>
                        <input type="range" min={j.lower} max={j.upper} step={(j.upper - j.lower) / 400 || 0.01} value={v}
                          onChange={(e) => setJoint(j.name, parseFloat(e.target.value))} />
                        <output>{fmt(j, v)}</output>
                      </label>
                    );
                  })}
                </div>
              </details>
            ))
          ) : (
            <p className="urdf-viewer__empty">{status === 'loading' ? t.loading : t.noJoints}</p>
          )}
        </aside>
      </div>
    </div>
  );
}
