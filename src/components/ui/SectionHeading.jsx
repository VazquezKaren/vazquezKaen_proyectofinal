export default function SectionHeading({ tag, title, description }) {
  return <div className="section-title-wrapper"><span className="section-tag">{tag}</span><h2 className="section-title">{title}</h2><p className="section-subtitle">{description}</p></div>
}
