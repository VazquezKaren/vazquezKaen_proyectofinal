import { useEffect } from 'react'
import landingMarkup from './landing.html?raw'
import { initializeLanding } from './landing.js'

export default function App() {
  useEffect(() => initializeLanding(), [])

  return <div dangerouslySetInnerHTML={{ __html: landingMarkup }} />
}
