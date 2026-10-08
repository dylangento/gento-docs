import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const LABELS = {
  en: {play: 'Play video', watch: 'Watch on YouTube', docs: 'Product docs', by: 'By'},
  'zh-CN': {play: '播放视频', watch: '在 YouTube 观看', docs: '产品文档', by: '来源：'},
};

// Click-to-play YouTube embed: shows the thumbnail first and loads the player
// (privacy-enhanced youtube-nocookie.com) only when the viewer presses play.
export default function VideoCard({id, title, tag, docs, credit, featured = false}) {
  const [playing, setPlaying] = useState(false);
  const {i18n} = useDocusaurusContext();
  const t = LABELS[i18n.currentLocale] || LABELS.en;
  const watchUrl = `https://www.youtube.com/watch?v=${id}`;

  return (
    <figure className={`video-card${featured ? ' video-card--featured' : ''}`}>
      <div className="video-card__frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button type="button" className="video-card__play" onClick={() => setPlaying(true)} aria-label={`${t.play}: ${title}`}>
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" />
            <span className="video-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5z" /></svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="video-card__body">
        {tag && <span className="video-card__tag">{tag}</span>}
        <strong className="video-card__title">{title}</strong>
        {credit && <span className="video-card__credit">{t.by} {credit}</span>}
        <span className="video-card__links">
          {docs && <Link to={docs}>{t.docs}</Link>}
          <a href={watchUrl} target="_blank" rel="noopener noreferrer">{t.watch} ↗</a>
        </span>
      </figcaption>
    </figure>
  );
}
