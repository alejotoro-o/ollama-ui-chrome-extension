interface MessageProps {
    role: string,
    message: string
}

export default function MessageBox({ role, message }: MessageProps) {
    return (
        <div className="flex flex-col">
            <div>
                {message}
            </div>
            <div>
                {role}
            </div>
        </div>
    )
}