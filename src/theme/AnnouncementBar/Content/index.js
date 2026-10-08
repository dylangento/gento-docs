import React from 'react';
import Content from '@theme-original/AnnouncementBar/Content';
// Pass-through: no announcement bar is configured. Add one in docusaurus.config.js if needed.
export default function AnnouncementContent(props) {
  return <Content {...props}/>;
}
