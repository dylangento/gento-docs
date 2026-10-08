export default {docs: [
  'index',
  {type: 'category', label: 'Marvin Pro', collapsed: false, items: [
    'marvin-pro/overview','marvin-pro/specifications','marvin-pro/compatibility',
    {type: 'category', label: 'Installation & first connection', collapsed: false, items: ['marvin-pro/safety','marvin-pro/unboxing','marvin-pro/wiring','marvin-pro/first-connection']},
  ]},
  {type: 'category', label: 'Marvin', collapsed: true, items: ['marvin/overview','marvin/specifications','marvin/installation','marvin/wiring','marvin/first-connection']},
  {type: 'category', label: 'Luna', collapsed: true, items: ['luna/overview','luna/specifications','luna/first-use','luna/interfaces','luna/gentoplatform','luna/sdk-teleoperation','luna/maintenance']},
  'skye/overview',
  {type: 'category', label: 'Software & development', collapsed: false, items: ['software/connect-pc','software/sdk-directory','software/marvin-platform','software/control-modes','software/sdk-quickstart','software/ros2']},
  {type: 'category', label: 'Teleoperation & data', collapsed: false, items: ['teleoperation/setup','teleoperation/operation','teleoperation/data']},
  {type: 'category', label: 'Integration & support', collapsed: false, items: ['integration/models','integration/end-effectors','support/troubleshooting','resources/downloads','videos']},
]};
