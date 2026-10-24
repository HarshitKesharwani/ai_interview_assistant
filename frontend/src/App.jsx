import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import VoiceRecorder from './voiceRecorder'

function  App() {
  const [count, setCount] = useState(0)
// const stream = await navigator.mediaDevices.getUserMedia({
// audio: true,
// });
  return (
    <>
<VoiceRecorder/>
    </>
  )
}

export default App
