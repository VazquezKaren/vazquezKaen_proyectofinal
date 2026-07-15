import { useEffect, useState } from 'react'

const links = [['inicio', 'Inicio'], ['beneficios', 'Beneficios'], ['modulos', 'Módulos'], ['batalla', 'Modo Batalla'], ['progreso', 'Progreso'], ['como-funciona', 'Cómo Funciona']]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 50); onScroll(); window.addEventListener('scroll', onScroll); return () => window.removeEventListener('scroll', onScroll) }, [])
  return <header className={`header${scrolled ? ' scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}><div className="container nav-wrapper"><a href="#inicio" className="logo"><div className="logo-icon">P</div><div className="logo-text">Praxia<span>by TM</span></div></a><ul className="nav-links">{links.map(([id, label]) => <li key={id}><a href={`#${id}`} className="nav-link" onClick={() => setMenuOpen(false)}>{label}</a></li>)}</ul><div className="nav-cta"><a href="#descargar" className="btn btn-outline nav-button">Descargar App</a><a href="#batalla" className="btn btn-secondary nav-button">Ingresar ahora</a></div><button className="hamburger" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}><span /><span /><span /></button></div></header>
}
