import { useEffect, useState } from "react";

import { FormObject, Message } from "../lib/types";

import { SendHorizontal, Trash2 } from "lucide-react";
import MessageBox from "./message";

export default function Chat({ config }: {config: FormObject}) {

    const [message, setMessage] = useState<string>("")
    const [messages, setMessages] = useState<Message[]>([])

    // Load saved messages when component mounts
    useEffect(() => {
        chrome.storage.local.get(["messages"]).then((result) => {
            if (result.messages && result.messages.length > 0) {
                console.log("Loaded saved messages:", result.messages);
                setMessages(result.messages);
            }
        });
    }, []);

    // Save messages to Chrome storage whenever messages change
    useEffect(() => {
        if (messages.length > 0) {
            chrome.storage.local.set({ "messages": messages }).then(() => {
                console.log("Messages saved successfully!");
            });
        }
    }, [messages]);

    // Solution 1: Use useEffect to respond to messages changes
    useEffect(() => {

        if (messages.length > 0 && messages[messages.length - 1].role === "user") {

            // Only make API call when a user message is added
            console.log("Updated messages:", messages)
            
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
                setMessages(currentMessages => [...currentMessages, data.message])

            }) 
            .catch(error => { 
                console.error('Error:', error); 
            });
        }

    }, [messages, config.model]); // This effect runs when messages changes

    const handleSubmit = (e: any) => {

        e.preventDefault();
        
        console.log("Submitting:", message)
        
        // Add user message and clear input
        setMessages(currentMessages => [...currentMessages, {role: "user", content: message}])

        // Clears input
        setMessage("");
        
    }

    // Add a function to clear chat history
    const clearChatHistory = () => {
        setMessages([]);
        chrome.storage.local.remove("messages", () => {
            console.log("Chat history cleared!");
        });
    }

    return (
        <div>
            {/* Messages */}
            <div>
                {messages.map(({role, content}, index) => (
                    <MessageBox key={index} role={role} message={content} />
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
                    <button type="submit"><SendHorizontal /></button>
                </form>
                <div>
                    {config.model}
                    <button onClick={clearChatHistory}><Trash2 /></button>
                </div>
            </div>
        </div>
    )
}