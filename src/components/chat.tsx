import { useEffect, useState } from "react";

import { FormObject, Message } from "../lib/types";

import { SendHorizontal, Trash2 } from "lucide-react";
import MessageBox from "./message";

export default function Chat({ config }: {config: FormObject}) {

    const [message, setMessage] = useState<string>("")
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)

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
        setIsLoading(false)
    }, [messages]);

    // Solution 1: Use useEffect to respond to messages changes
    useEffect(() => {

        if (messages.length > 0 && messages[messages.length - 1].role === "user") {

            setIsLoading(true)

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
        <div className="p-2">
            {/* Messages */}
            <div className="flex flex-col space-y-2">
                {messages.map(({role, content}, index) => (
                    <MessageBox key={index} role={role} message={content} />
                ))}
                <div className={`${isLoading ? "block" : "hidden"} p-4 m-auto flex flex-row`}>
                    <svg className="mr-3 -ml-1 size-5 animate-spin text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Thinking...
                </div>
            </div>

            {/* Chat input */}
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="p-1 flex flex-row items-center border-[1px] rounded-2xl border-gray-300">
                        <input
                            name="message"
                            id="message"
                            className=""
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message"
                            autoComplete="off"
                            disabled={isLoading}
                        />
                        <button 
                            title="Send Message"
                            className="ml-auto cursor-pointer p-2 bg-blue-200 border-[1px] border-gray-300 rounded-full drop-shadow-gray-300"
                            type="submit"
                            disabled={isLoading}
                        >
                            <SendHorizontal size={16} />
                        </button>
                    </div>
                </form>
                <div className="flex flex-row items-center px-4">
                    <h2 className="text-xs italic text-gray-400">{config.model}</h2>
                    <button title="Clear chat" className="ml-auto cursor-pointer" onClick={clearChatHistory}><Trash2 size={12} /></button>
                </div>
            </div>
        </div>
    )
}