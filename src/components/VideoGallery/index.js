import React, {useContext, useEffect, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import VideoCard from '../VideoCard';
import {VideoFilterContext, seriesOf} from './context';

const LABELS = {
  en: {group: 'Filter videos by product series', all: 'All', marvin: 'Marvin Series', gento: 'Gento Series', marvinHint: 'Marvin and Marvin Pro', gentoHint: 'Luna and Skye'},
  'zh-CN': {group: '按产品系列筛选视频', all: '全部', marvin: 'Marvin 系列', gento: 'Gento 系列', marvinHint: 'Marvin 与 Marvin Pro', gentoHint: 'Luna 与 Skye'},
};
const FILTERS = ['all', 'marvin', 'gento'];

// Props of every VideoCard nested anywhere in `children`.
function cardsIn(children, out = []) {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === VideoCard) out.push(child.props);
    else if (child.props && child.props.children) cardsIn(child.props.children, out);
  });
  return out;
}

// Wraps the Video demos page: filter buttons for All / Marvin Series / Gento Series.
// The choice is kept in the URL (?series=marvin or ?series=gento) so filtered views can be shared.
export default function VideoGallery({children}) {
  const {i18n} = useDocusaurusContext();
  const t = LABELS[i18n.currentLocale] || LABELS.en;
  const [filter, setFilter] = useState('all');
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('series');
    if (FILTERS.includes(q)) setFilter(q);
  }, []);
  const choose = (f) => {
    setFilter(f);
    const url = new URL(window.location.href);
    if (f === 'all') url.searchParams.delete('series');
    else url.searchParams.set('series', f);
    window.history.replaceState(window.history.state, '', url);
  };
  const cards = cardsIn(children);
  const count = (f) => (f === 'all' ? cards.length : cards.filter((c) => seriesOf(c) === f).length);
  return (
    <VideoFilterContext.Provider value={filter}>
      <div className="video-filter" role="group" aria-label={t.group}>
        {FILTERS.map((f) => (
          <button key={f} type="button" className="video-filter__btn" aria-pressed={filter === f} title={t[`${f}Hint`]} onClick={() => choose(f)}>
            {t[f]}
            <span className="video-filter__count">{count(f)}</span>
          </button>
        ))}
      </div>
      {children}
    </VideoFilterContext.Provider>
  );
}

// A heading plus its grid of videos. Hidden when the active filter leaves it with no videos.
export function VideoSection({children}) {
  const filter = useContext(VideoFilterContext);
  if (filter !== 'all' && !cardsIn(children).some((c) => seriesOf(c) === filter)) return null;
  return <>{children}</>;
}
