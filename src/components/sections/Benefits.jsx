import SectionHeading from '../ui/SectionHeading'
import { benefits } from '../../data/content'

export default function Benefits() {
  return <section className="section section-bg-light" id="beneficios"><div className="container"><SectionHeading tag="¿Por qué estudiar con nosotros?" title="Domina cada especialidad médica" description="Diseñado bajo metodologías de aprendizaje activo que garantizan la retención a largo plazo y mejoran tu puntaje en exámenes reales." /><div className="benefits-grid">{benefits.map(([icon, title, description], index) => <article className={`benefit-card benefit-card-${index + 1}`} key={title}><div className="benefit-icon">{icon}</div><h3 className="benefit-title">{title}</h3><p className="benefit-desc">{description}</p></article>)}</div></div></section>
}
