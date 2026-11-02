export default {docs: [
  'index',
  {type: 'category', label: 'Marvin Pro', collapsed: false, items: [
    'marvin-pro/overview','marvin-pro/specifications','marvin-pro/compatibility',
    {type: 'category', label: 'Installation & first connection', collapsed: false, items: ['marvin-pro/safety','marvin-pro/unboxing','marvin-pro/wiring','marvin-pro/first-connection']},
    'marvin-pro/earlier-orin',
  ]},
  {type: 'category', label: 'Marvin', collapsed: true, items: ['marvin/overview','marvin/specifications','marvin/installation','marvin/wiring','marvin/first-connection']},
  {type: 'category', label: 'Luna', collapsed: true, items: ['luna/overview','luna/specifications','luna/first-use','luna/interfaces','luna/gentoplatform','luna/sdk-teleoperation','luna/maintenance']},
  {type: 'category', label: 'Skye', collapsed: true, items: ['skye/overview','skye/specifications','skye/first-use','skye/interfaces','skye/software','skye/maintenance']},
  {type: 'category', label: 'Software & development', collapsed: false, items: [
    'software/connect-pc','software/cameras-firmware','software/cameras','software/realsense','software/sdk-directory','software/install-marvin-platform','software/marvin-platform','software/control-modes','software/sdk-quickstart',
    {type: 'category', label: 'ROS 2', collapsed: true, link: {type: 'doc', id: 'software/ros2'}, items: ['software/ros2-marvin-pro','software/ros2-skye-luna']},
  ]},
  {type: 'category', label: 'Teleoperation (Apex)', collapsed: false, link: {type: 'doc', id: 'teleoperation/index'}, items: [
    'teleoperation/setup','teleoperation/marvin-pro','teleoperation/skye-luna',
    'teleoperation/interface-pro','teleoperation/interface-classic','teleoperation/operation-modes',
    {type: 'category', label: 'VR headset client', collapsed: true, items: ['teleoperation/headset/meta-app-installation','teleoperation/headset/meta','teleoperation/headset/pico-app-installation','teleoperation/headset/pico','teleoperation/headset/privacy-policy']},
    'teleoperation/data-processing-tool',
    {type: 'category', label: 'VLA guide', collapsed: true, link: {type: 'doc', id: 'teleoperation/vla/index'}, items: ['teleoperation/vla/environment','teleoperation/vla/dataset-conversion','teleoperation/vla/dataset-sample','teleoperation/vla/training','teleoperation/vla/deployment','teleoperation/vla/vla-host']},
    'teleoperation/troubleshooting',
    {type: 'category', label: 'Advanced configuration & diagnostics', collapsed: true, items: ['teleoperation/advanced/configuration','teleoperation/advanced/topic-whitelist','teleoperation/advanced/pro-communication-diagnostics','teleoperation/advanced/gento-communication-diagnostics']},
  ]},
  {type: 'category', label: 'Integration & support', collapsed: false, items: [
    'integration/models',
    {type: 'category', label: 'End effectors', collapsed: true, link: {type: 'doc', id: 'integration/end-effectors'}, items: ['integration/apex-tool','integration/dm-gripper-can','integration/wuji-hand-2']},
    'support/troubleshooting','resources/downloads','resources/models','videos',
  ]},
]};
