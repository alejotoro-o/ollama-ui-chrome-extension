import { useState } from "react";

interface FormObject {
    [key: string]: string
}

interface Message {
    role: string
    content: string
}

export default function Chat({ config }: {config: FormObject}) {

    const [message, setMessage] = useState<string>("")
    const [messages, setMessages] = useState<Message[]>([])

    const handleSubmit = (e: any) => {

        e.preventDefault();

        console.log(message)

        setMessages([...messages, {role: "user", content: message}])

        fetch("http://localhost:11434/api/chat", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: config.model,
                messages: messages,
                stream: false
            }),
        }).then(response => response.json())
        .then(data => { 
            console.log('Success:', data);
            setMessages([...messages, data.message])
        }) 
        .catch(error => { 
            console.error('Error:', error); 
        });

        setMessage("");

    }

    return (
        <div>
            {/* Messages */}
            <div>
                {messages.map(({role, content}) => (
                    <div>
                        {role}
                        {content}
                    </div>
                ))}
            </div>

            {/* Chat input */}
            <div>
                <form onSubmit={handleSubmit}>
                    <input
                        name="message"
                        id="message"
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                        autoComplete="off"
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    )
}