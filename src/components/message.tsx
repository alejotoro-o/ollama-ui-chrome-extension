interface MessageProps {
    role: string,
    message: string
}

export default function MessageBox({ role, message }: MessageProps) {
    return (
        <div className={`${role == "user" ? "ml-auto bg-blue-200 border-[1px] rounded-2xl border-gray-300 drop-shadow-gray-300" : "mr-auto"} w-[80%] p-2`}>
            {message}
        </div>
    )
}