import { useEffect, useRef, useState } from 'react'
import { questions } from '../../data/content.jsx'

const initialGame = { phase: 'lobby', question: 0, userScore: 0, botScore: 0, seconds: 15, selected: null, botSelected: null }

export default function Battle() {
  const [game, setGame] = useState(initialGame)
  const botTimer = useRef()
  const question = questions[game.question]
  const start = () => setGame({ ...initialGame, phase: 'playing' })

  useEffect(() => {
    if (game.phase !== 'playing' || game.selected !== null) return
    const countdown = window.setInterval(() => setGame(current => current.seconds <= 1 ? { ...current, selected: -1, seconds: 0 } : { ...current, seconds: current.seconds - 1 }), 1000)
    botTimer.current = window.setTimeout(() => setGame(current => ({ ...current, botSelected: Math.random() < .75 ? questions[current.question].correctIndex : 0 })), 2200)
    return () => { clearInterval(countdown); clearTimeout(botTimer.current) }
  }, [game.phase, game.question, game.selected])

  const selectAnswer = selected => {
    if (game.selected !== null) return
    const botCorrect = game.botSelected === question.correctIndex
    setGame(current => ({ ...current, selected, userScore: current.userScore + (selected === question.correctIndex ? 100 : 0), botScore: current.botScore + (botCorrect ? 100 : 0) }))
  }
  const next = () => game.question + 1 < questions.length ? setGame(current => ({ ...current, question: current.question + 1, seconds: 15, selected: null, botSelected: null })) : setGame(current => ({ ...current, phase: 'finished' }))

  return <section className="section section-bg-light" id="batalla"><div className="container battle-sec-container"><div><span className="section-tag">Estudio Competitivo</span><h2 className="section-title align-left">Reta a tus amigos en modo batalla</h2><p className="section-subtitle align-left battle-copy">Convierte el estudio en un reto activo. Responde preguntas médicas en tiempo real contra oponentes y escala puestos en el ranking nacional.</p><div className="battle-features"><Feature icon="⏱️" title="Retroalimentación inmediata">Revisa la explicación médica detallada para aprender de tus errores al instante.</Feature><Feature icon="🔥" title="Puntos y streak">Acumula experiencia, mantén tu racha diaria y desbloquea insignias médicas.</Feature></div><button className="btn btn-primary" onClick={start}>Crear Mi Banco y Retar</button></div><div className="battle-game-console">{game.phase === 'lobby' && <Lobby onStart={start} />}{game.phase === 'playing' && <div className="battle-game-screen react-game-screen"><div className="game-header"><div className="game-score-board"><div className="player-score-info"><div className="player-avatar-small">TÚ</div><span className="score-num">{game.userScore}</span></div><strong>VS</strong><div className="player-score-info"><span className="score-num">{game.botScore}</span><div className="player-avatar-small opponent">BOT</div></div></div><div className="game-timer">{game.seconds}</div></div><div className="game-question-wrap"><div className="question-text">{question.question}</div><div className="options-list">{question.options.map((option, index) => <button key={option} className={`option-btn${game.selected !== null && index === question.correctIndex ? ' correct' : ''}${game.selected === index && index !== question.correctIndex ? ' incorrect' : ''}`} disabled={game.selected !== null} onClick={() => selectAnswer(index)}>{option}{game.botSelected === index && <span className="opponent-indicator">BOT</span>}</button>)}</div></div>{game.selected !== null && <div className="battle-feedback"><strong>Explicación:</strong> {question.explanation}<button className="btn btn-secondary feedback-next" onClick={next}>Siguiente</button></div>}</div>}{game.phase === 'finished' && <div className="battle-game-lobby"><div className="battle-icon-xl">🏁</div><h3>Batalla terminada</h3><p className="battle-lobby-desc">Marcador final: {game.userScore} - {game.botScore}</p><button className="btn btn-secondary" onClick={start}>Volver a intentar</button></div>}</div></div></section>
}

function Lobby({ onStart }) { return <div className="battle-game-lobby"><div className="battle-icon-xl">⚔️</div><h3>Simulador de Batalla</h3><p className="battle-lobby-desc">Experimenta una pregunta médica en tiempo real contra nuestro robot de estudio <strong>TM-Bot</strong>.</p><button className="btn btn-secondary" onClick={onStart}>Comenzar Desafío</button></div> }
function Feature({ icon, title, children }) { return <div className="battle-feature"><div className="battle-feature-icon">{icon}</div><div><h4>{title}</h4><p>{children}</p></div></div> }
