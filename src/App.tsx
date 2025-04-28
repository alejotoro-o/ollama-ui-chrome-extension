import { useEffect, useState } from 'react'
import './App.css'
import Config from './components/config'
import Chat from './components/chat'

interface FormObject {
    [key: string]: string
}

export default function App() {

    const [isConfig, setIsConfig] = useState(false)
    const [config, setConfig] = useState<FormObject>({})

    useEffect(() => {

        chrome.storage.local.get(["config"]).then((result) => {
            // console.log(result.config);
            setConfig(result.config)
        });

    }, [])

    return (
        <main>

            {/* Toolbar */}
            <section className='flex flex-row'>
                <h1>Ollama UI Extension</h1>
                <button className='ml-auto' onClick={() => setIsConfig(!isConfig)}>Config</button>
            </section>

            {/* Config Tab */}
            <section className={`${isConfig ? "block" : "hidden"}`}>
                <Config config={config} setConfig={setConfig} />
            </section>

            {/* Message Tab */}
            <section className={`${isConfig ? "hidden" : "block"}`}>
                <Chat config={config} />
                {config.model}
            </section>
        </main>
    )
}
