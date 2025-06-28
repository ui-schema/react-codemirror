import { Profiler } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

createRoot(document.querySelector('#root')!)
    .render(
        <Profiler id="App" onRender={() => null}>
            <App/>
        </Profiler>,
    )
