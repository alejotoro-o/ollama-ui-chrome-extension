import { useEffect, useState } from 'react'
import './App.css'
import Config from './components/config'
import Chat from './components/chat';

import { Settings, PanelRight } from "lucide-react";

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

    // Open extension as Side Panel
    function openSidePanel() {
        chrome.windows.getCurrent((window) => {
            if (window.id) {
                chrome.sidePanel.open({windowId: window.id})
            }
        })
    }

    return (
        <main className='py-2'>

            {/* Toolbar */}
            <section className='flex flex-row items-center px-2'>
                <div className='flex flex-row'>
                    <img src='/images/icon-16.png' />
                    <h1 className='text-base font-bold'>Ollama UI Extension</h1>
                </div>
                <div className='ml-auto flex flex-row space-x-1'>
                    <button title='Open Side Panel' className='cursor-pointer' onClick={openSidePanel}>
                        <PanelRight size={16} />
                    </button>
                    <button title='Settings' className='cursor-pointer' onClick={() => setIsConfig(!isConfig)} disabled={!hasConfig}>
                        <Settings size={16} />
                    </button>
                </div>
            </section>

            <div className='my-2 w-full h-[1px] bg-gray-300'></div>

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
