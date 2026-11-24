import MODELS from './models.json';

// URDF packages that come in several configurations (Luna, Skye) are described in models.json by
// version, arm length, wrist camera and end effector. The downloads page and the 3D preview both
// pick a package from these choices instead of listing every package. Versions are kept apart:
// each choice below the version only offers what exists for that version.
const CAMERAS = ['none', 'd405ga', 'shw5g'];
const EFFECTORS = ['none', 'gripper', 'sharpa', 'wuji2'];
const num = (v) => parseFloat(String(v).replace(/^V/i, ''));

export const isVariant = (m) => Boolean(m && m.arm);
const all = (product, version) => MODELS.filter((m) => m.product === product && m.arm && (!version || m.version === version));
// Array.from, not [...set]: the site build compiles spread in loose mode, which turns [...set] into [set].
// Newest version first.
export const versionsOf = (product) => Array.from(new Set(all(product).map((m) => m.version))).sort((a, b) => num(b) - num(a));
export const latestVersion = (product) => versionsOf(product)[0];
export const variantsOf = (product, version) => all(product, version);
export const armsOf = (product, version) => Array.from(new Set(all(product, version).map((m) => m.arm))).sort((a, b) => Number(a) - Number(b));
export const camerasFor = (product, version, arm) => CAMERAS.filter((c) => all(product, version).some((m) => m.arm === arm && m.camera === c));
export const effectorsFor = (product, version, arm) => EFFECTORS.filter((e) => all(product, version).some((m) => m.arm === arm && m.effector === e));

export const VARIANT_LABELS = {
  en: {
    version: 'Version', arm: 'Arm length', camera: 'Wrist camera', effector: 'End effector',
    none: 'None', d405ga: 'D405GA', shw5g: 'SHW5G', gripper: 'Gripper', sharpa: 'Sharpa hand', wuji2: 'Wuji Hand 2',
    current: 'current', earlier: 'earlier',
    mm: (a) => `${a} mm`, model: (name, v, a) => `${name} ${v} · ${a} mm arm`,
  },
  'zh-CN': {
    version: '版本', arm: '臂长', camera: '腕部相机', effector: '末端执行器',
    none: '无', d405ga: 'D405GA', shw5g: 'SHW5G', gripper: '夹爪', sharpa: 'Sharpa 灵巧手', wuji2: 'Wuji 二代灵巧手',
    current: '当前', earlier: '旧版',
    mm: (a) => `${a} mm`, model: (name, v, a) => `${name} ${v} · ${a} mm 臂长`,
  },
};

const find = (list, arm, camera, effector) => list.find((m) => m.arm === arm && m.camera === camera && m.effector === effector);

// Resolve a choice to an existing package of that version, keeping as much of the current choice as possible.
// `prefer` says which choice the user just made, so that one wins when the others have to change.
export function chooseVariant(product, {version, arm, camera, effector}, prefer) {
  const v = versionsOf(product).includes(version) ? version : latestVersion(product);
  const list = all(product, v);
  const a = list.some((m) => m.arm === arm) ? arm : armsOf(product, v)[0];
  if (prefer === 'effector') {
    const c = [camera, ...camerasFor(product, v, a)].find((x) => find(list, a, x, effector));
    if (c) return find(list, a, c, effector);
  }
  return (
    find(list, a, camera, effector) ||
    find(list, a, camera, 'none') ||
    list.find((m) => m.arm === a && m.camera === camera) ||
    list.find((m) => m.arm === a && m.effector === effector) ||
    list.find((m) => m.arm === a) ||
    list[0]
  );
}

// Old ids from before the arm-length picker, so shared ?model= links keep working.
export const LEGACY_IDS = {
  'luna-v3-615-gripper': 'luna-615-shw5g-gripper',
  'luna-v3-750-gripper': 'luna-750-shw5g-gripper',
  'luna-v3-615': 'luna-615',
  'luna-v3-680': 'luna-680',
};
