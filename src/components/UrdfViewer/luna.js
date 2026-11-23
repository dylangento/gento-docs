import MODELS from './models.json';

// Luna URDF packages, described by arm length, wrist camera and end effector (see models.json).
// The downloads page and the 3D preview both pick a package from these three choices.
export const LUNA = MODELS.filter((m) => m.product === 'luna');
export const ARMS = ['615', '680', '750'];
const CAMERAS = ['none', 'd405ga', 'shw5g'];
const EFFECTORS = ['none', 'gripper', 'sharpa', 'wuji2'];

export const LUNA_LABELS = {
  en: {
    arm: 'Arm length', camera: 'Wrist camera', effector: 'End effector',
    none: 'None', d405ga: 'D405GA', shw5g: 'SHW5G', gripper: 'Gripper', sharpa: 'Sharpa hand', wuji2: 'Wuji Hand 2',
    mm: (a) => `${a} mm`, model: (a) => `Luna · ${a} mm arm`,
  },
  'zh-CN': {
    arm: '臂长', camera: '腕部相机', effector: '末端执行器',
    none: '无', d405ga: 'D405GA', shw5g: 'SHW5G', gripper: '夹爪', sharpa: 'Sharpa 灵巧手', wuji2: 'Wuji 二代灵巧手',
    mm: (a) => `${a} mm`, model: (a) => `Luna · ${a} mm 臂长`,
  },
};

const find = (arm, camera, effector) => LUNA.find((m) => m.arm === arm && m.camera === camera && m.effector === effector);
export const camerasFor = (arm) => CAMERAS.filter((c) => LUNA.some((m) => m.arm === arm && m.camera === c));
export const effectorsFor = (arm) => EFFECTORS.filter((e) => LUNA.some((m) => m.arm === arm && m.effector === e));
export const isLuna = (m) => Boolean(m && m.product === 'luna');

// Resolve a choice to an existing package, keeping as much of the current choice as possible.
// `prefer` says which choice the user just made, so that one wins when the others have to change.
export function chooseLuna({arm, camera, effector}, prefer) {
  if (prefer === 'effector') {
    const c = [camera, ...camerasFor(arm)].find((x) => find(arm, x, effector));
    if (c) return find(arm, c, effector);
  }
  return (
    find(arm, camera, effector) ||
    find(arm, camera, 'none') ||
    LUNA.find((m) => m.arm === arm && m.camera === camera) ||
    LUNA.find((m) => m.arm === arm && m.effector === effector) ||
    LUNA.find((m) => m.arm === arm) ||
    LUNA[0]
  );
}

// Old ids from before the arm-length picker, so shared ?model= links keep working.
export const LEGACY_IDS = {
  'luna-v3-615-gripper': 'luna-615-shw5g-gripper',
  'luna-v3-750-gripper': 'luna-750-shw5g-gripper',
  'luna-v3-615': 'luna-615',
  'luna-v3-680': 'luna-680',
};
