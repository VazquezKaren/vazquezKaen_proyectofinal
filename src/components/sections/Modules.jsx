import { useState } from 'react'
import SectionHeading from '../ui/SectionHeading'
import { modules } from '../../data/content.jsx'

export default function Modules() {
  const [activeId, setActiveId] = useState(modules[0].id)
  const activeModule = modules.find(module => module.id === activeId)
  return <section className="section" id="modulos"><div className="container"><SectionHeading tag="Explora la herramienta" title="Todo lo que necesitas para aprobar" description="Praxia by TM reúne múltiples herramientas en una sola aplicación para ofrecerte la preparación más completa." /><div className="modules-container"><div className="modules-list">{modules.map(module => <button type="button" className={`module-item${module.id === activeId ? ' active' : ''}`} key={module.id} onClick={() => setActiveId(module.id)}><span className="module-icon-wrapper">{module.icon}</span><span className="module-info"><span className="module-item-title">{module.title}</span><span className="module-item-desc">{module.description}</span></span></button>)}</div><div className="simulator-visual"><div className="simulator-bg-glow" /><div className="simulator-phone phone-tall"><div className="phone-screen full-height"><img key={activeModule.image} src={activeModule.image} alt={`Pantalla de ${activeModule.title}`} className="phone-image module-screen-image" /></div></div></div></div></div></section>
}
