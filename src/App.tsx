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
                <div className='flex flex-row items-center'>
                    <img src='/images/icon-16.png' />
                    <h1 className='ms-1 text-base font-bold'>Ollama UI Extension</h1>
                </div>
                <div className='ml-auto flex flex-row space-x-1'>
                    <button title='Open Side Panel' className='cursor-pointer' onClick={openSidePanel}>
                        <PanelRight size={16} />
                    </button>
                    <button
                        title="Settings"
                        className="cursor-pointer flex items-center"
                        onClick={() => setIsConfig(!isConfig)}
                        disabled={!hasConfig}
                    >
                        <Settings size={16} />

                        <div className="relative w-4 h-4">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`absolute top-0 left-0 transition-all duration-300 transform ${isConfig ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
                            >
                                <path d="M10 6 L16 12 L10 18" stroke="black" strokeWidth="2" fill="none" />
                            </svg>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`absolute top-0 left-0 transition-all duration-300 transform ${isConfig ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                            >
                                <line x1="6" y1="6" x2="18" y2="18" stroke="black" strokeWidth="2" />
                                <line x1="18" y1="6" x2="6" y2="18" stroke="black" strokeWidth="2" />
                            </svg>
                        </div>
                    </button>
                </div>
            </section>

            <div className='my-2 w-full h-[1px] bg-gray-300'></div>

            {/* Config Tab */}
            <section className={`${isConfig ? "block" : "hidden"}`}>
                <Config setConfig={setConfig} hasConfig={hasConfig} setHasConfig={setHasConfig} />
            </section>

            {/* Message Tab */}
            <section className={`${isConfig ? "hidden" : "block"} flex flex-col h-full`}>
                <Chat config={config} />
            </section>
        </main>
    )
}
