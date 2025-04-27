// Ollama version
export async function getOllamaVersion() {

    try {

        const response = await fetch("http://localhost:11434/api/version");

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        return json.version

    } catch (error: any) {

        return error.message

    }

}

// List Models
export async function getOllamaLocalModels() {

    try {

        const response = await fetch("http://localhost:11434/api/tags");

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        const modelsNames = json.models.map((model: any) => (model.name))

        return modelsNames

    } catch (error: any) {

        return error.message

    }

}

// Chat