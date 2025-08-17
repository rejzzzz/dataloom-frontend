import { Loader2 } from "lucide-react";

interface LoadingProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    className?: string;
}

const Loading = ({ size = "md", text, className = "" }: LoadingProps) => {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    return (
        <div
            className={`flex flex-col items-center justify-center gap-2 ${className}`}
        >
            <Loader2
                className={`animate-spin text-indigo-600 ${sizeClasses[size]}`}
            />
            {text && (
                <p className="text-sm text-gray-600 animate-pulse">{text}</p>
            )}
        </div>
    );
};

export default Loading;
