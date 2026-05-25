import React from "react";


type ButtonMenuProps = {
    icon: React.ReactNode;
    background: string;
    onClick: () => void;
    borderColor: string;
    borderWidth: string;
};
export function HistoryIcon() {
    return (
        <svg width="25" height="25" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <circle cx="7.5" cy="7.5" r="4.8" stroke="white" strokeWidth="1.2" />
            <path d="M7.5 5.1V7.7" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M7.5 7.7L9.3 8.9" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}
export function SpeakerHighIcon() {
    return (
        <svg width="25" height="25" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path
                d="M2.2 8.8H4.4L7.45 11V4L4.4 6.2H2.2V8.8Z"
                fill="white"
                stroke="white"
                strokeWidth="0.5"
                strokeLinejoin="round"
            />
            <path
                d="M9.25 6C9.8 6.45 10.1 7.1 10.1 7.75C10.1 8.4 9.8 9.05 9.25 9.5"
                stroke="white"
                strokeWidth="1.1"
                strokeLinecap="round"
            />
            <path
                d="M10.8 4.75C11.7 5.5 12.2 6.6 12.2 7.75C12.2 8.9 11.7 10 10.8 10.75"
                stroke="white"
                strokeWidth="1.1"
                strokeLinecap="round"
            />
        </svg>
    );
}
export function QuestionMarkIcon() {
    return (
        <svg width="25" height="25" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path
                d="M5.55 5.4C5.55 4.35 6.4 3.5 7.45 3.5C8.5 3.5 9.35 4.25 9.35 5.2C9.35 5.95 8.95 6.45 8.25 6.9C7.6 7.3 7.2 7.7 7.2 8.45V8.7"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="7.2" cy="11.1" r="0.8" fill="white" />
        </svg>
    );
}
export function CloseIcon() {
    return (
        <svg width="25" height="25" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path
                d="M4.2 4.2L10.8 10.8"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
            />
            <path
                d="M10.8 4.2L4.2 10.8"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
            />
        </svg>
    );
}
export function PlusIcon() {
    return (
        <svg width="25" height="25" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path
                d="M7.5 3.2V11.8"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
            />
            <path
                d="M3.2 7.5H11.8"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
            />
        </svg>
    );
}
export function SpeakerMuteIcon() {
    return (
        <svg width="25" height="25" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path
                d="M2.2 8.8H4.4L7.45 11V4L4.4 6.2H2.2V8.8Z"
                fill="white"
                stroke="white"
                strokeWidth="0.5"
                strokeLinejoin="round"
            />
            <path
                d="M9.35 6.05L12.05 8.75"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
            <path
                d="M12.05 6.05L9.35 8.75"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
        </svg>
    );
}

export const ButtonMenu
    : React.FC<ButtonMenuProps> = ({
        icon,
        background,
        onClick,
    }) => {
        return (
            <button
                type="button"
                aria-label="menu button"
                onClick={onClick}
                style={{
                    background: "linear-gradient(135deg, #34596A 0%, #66AFD0 100%)",
                    cursor: "pointer",
                    padding: 0,
                }}
                className="relative flex h-6 w-6 items-center justify-center rounded-full p-[2px]"
            >
                {/* Background circle */}
                <div
                    className="absolute inset-[2px] rounded-full"
                    style={{
                        backgroundColor: background || "#2D1F76",
                    }}
                ></div>

                {/* Icon */}
                <div className="relative flex h-full w-full items-center justify-center">
                    {icon}
                </div>
            </button>
        );
    };
