import { useEffect, useState } from 'react'
import './App.css'
import Config from './components/config'
import Chat from './components/chat'

import { FormObject } from "./lib/types";

export default function App() {

    const [hasConfig, setHasConfig] = useState(false)
    const [isConfig, setIsConfig] = useState(false)
    const [config, setConfig] = useState<FormObject>({})

    useEffect(() => {

        chrome.storage.local.get(["config"]).then((result) => {
            // console.log(result.config);
            if (result.config) {
                setConfig(result.config);
                setHasConfig(true)
                console.log("Loaded config:", result.config);
            } else {
                setIsConfig(true);
            }
        });

    }, [])

    return (
        <main>

            {/* Toolbar */}
            <section className='flex flex-row'>
                <img src='/images/icon-16.png' />
                <h1>Ollama UI Extension</h1>
                <button className='ml-auto' onClick={() => setIsConfig(!isConfig)} disabled={!hasConfig}>Config</button>
            </section>

            {/* Config Tab */}
            <section className={`${isConfig ? "block" : "hidden"}`}>
                <Config setConfig={setConfig} hasConfig={hasConfig} setHasConfig={setHasConfig} />
            </section>

            {/* Message Tab */}
            <section className={`${isConfig ? "hidden" : "block"}`}>
                <Chat config={config} />
            </section>
        </main>
    )
}
