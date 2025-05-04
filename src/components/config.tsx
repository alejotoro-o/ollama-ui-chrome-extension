import { useEffect, useState } from "react";

import * as ollama from "../lib/ollama"
import { FormObject } from "../lib/types";

import { Save } from "lucide-react";

interface ConfigProps {
    // config: FormObject,
    setConfig: (value: FormObject) => void,
    hasConfig: boolean,
    setHasConfig: (value: boolean) => void,
}

export default function Config({ setConfig, hasConfig, setHasConfig }: ConfigProps) {

    const [ollamaVersion, setOllamaVersion] = useState("Loading...")
    const [ollamaLocalModels, setOllamaLocalModels] = useState([])

    useEffect(() => {
        // Get Ollama Version
        const fetchVersion = async () => {
            try {
                const version = await ollama.getOllamaVersion()
                setOllamaVersion(version)
            } catch (error) {
                console.error("Failed to get Ollama version:", error)
                setOllamaVersion("Error: Couldn't connect to Ollama")
            }
        }
        
        // Get Local Models
        const fetchModels = async () => {
            try {
                const models = await ollama.getOllamaLocalModels()
                setOllamaLocalModels(models)
            } catch (error) {
                console.error("Failed to get Ollama local models:", error)
            }
        }

        fetchVersion()
        fetchModels()
    }, []);

    const handleSubmit = (e: any) => {

        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const formObject: FormObject = {};

        formData.forEach((value, key) => {
            formObject[key] = value as string;
        });

        // console.log(formObject);

        chrome.storage.local.set({ "config": formObject }).then(() => {
            if (!hasConfig) {
                setHasConfig(true)
            }
            console.log("Config saved successfully!");
        });

        setConfig(formObject)
    }
    
    return (
        <div className="p-2 flex flex-col space-y-2">
            <h2>Ollama {ollamaVersion}</h2>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-2 w-fit">
                    <label htmlFor="model">Model</label>
                    <select name="model" id="model" className="border-[1px] rounded-xl border-gray-300">
                        {ollamaLocalModels.map((model) => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                </div>
                <button 
                    title="Save Settings" 
                    className="mt-2 cursor-pointer" 
                    type="submit"
                >
                    <Save size={16} />
                </button>
            </form>
        </div>
    )
}