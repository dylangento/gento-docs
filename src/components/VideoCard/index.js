import React, {useContext, useState} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {VideoFilterContext, seriesOf} from '../VideoGallery/context';

const LABELS = {
  en: {play: 'Play video', watch: 'Watch on YouTube', watchDrive: 'Watch on Google Drive', docs: 'Related docs', by: 'By'},
  'zh-CN': {play: '播放视频', watch: '在 YouTube 观看', watchDrive: '在 Google Drive 观看', docs: '相关文档', by: '来源：'},
};

// Click-to-play video card. Shows the thumbnail first and loads the player only when the
// viewer presses play: YouTube (`id`, privacy-enhanced youtube-nocookie.com) or a Google
// Drive file shared "anyone with the link" (`drive`). Inside a VideoGallery, the card hides
// itself when it doesn't match the series filter (see VideoGallery/context.js).
export default function VideoCard({id, drive, title, tag, docs, credit, series, featured = false}) {
  const filter = useContext(VideoFilterContext);
  const [playing, setPlaying] = useState(false);
  const [thumbOk, setThumbOk] = useState(true);
  const {i18n} = useDocusaurusContext();
  const t = LABELS[i18n.currentLocale] || LABELS.en;
  const isDrive = Boolean(drive);
  const vid = drive || id;
  const embedUrl = isDrive
    ? `https://drive.google.com/file/d/${vid}/preview`
    : `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0`;
  const thumbUrl = isDrive
    ? `https://drive.google.com/thumbnail?id=${vid}&sz=w960`
    : `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;
  const watchUrl = isDrive ? `https://drive.google.com/file/d/${vid}/view` : `https://www.youtube.com/watch?v=${vid}`;
  if (filter !== 'all' && seriesOf({series, tag}) !== filter) return null;

  return (
    <figure className={`video-card${featured ? ' video-card--featured' : ''}`}>
      <div className={`video-card__frame${isDrive ? ' video-card__frame--drive' : ''}${playing ? ' is-playing' : ''}`}>
        {playing ? (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button type="button" className="video-card__play" onClick={() => setPlaying(true)} aria-label={`${t.play}: ${title}`}>
            {thumbOk && (
              <img src={thumbUrl} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setThumbOk(false)} />
            )}
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
          <a href={watchUrl} target="_blank" rel="noopener noreferrer">{isDrive ? t.watchDrive : t.watch} ↗</a>
        </span>
      </figcaption>
    </figure>
  );
}
