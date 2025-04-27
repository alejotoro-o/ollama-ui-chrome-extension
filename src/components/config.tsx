import { useEffect, useState } from "react";

import * as ollama from "../lib/ollama"

interface FormObject {
    [key: string]: string
}

interface ConfigProps {
    config: FormObject
    setConfig: (value: FormObject) => void
}

export default function Config({ config, setConfig }: ConfigProps) {

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
            console.log("Config saved successfully!");
        });

        setConfig(formObject)
    }
    
    return (
        <div className="flex flex-col">
            <h2>Ollama {ollamaVersion}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="model">Model</label>
                    <select name="model" id="model" value={config.model || ""}>
                        {ollamaLocalModels.map((model) => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    )
}