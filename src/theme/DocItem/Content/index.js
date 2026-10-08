import React from 'react';
import Content from '@theme-original/DocItem/Content';

// Pass-through. (Earlier drafts appended a "Source revision" note here; source tracking now lives only in front matter and review/.)
export default function DocContent(props) {
  return <Content {...props}/>;
}
