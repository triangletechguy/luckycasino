import { motion, } from "framer-motion";
import { Fragment, useState, useEffect } from "react";
import { useGame, resolveAssetUrl } from "../hooks/useGameHook";
import { getAssetUrl, GAME_ASSETS } from "../config/gameconfig";
export const Triangle: React.FC = () => {
    return (
        <div className="w-0 h-0 z-[60] border-l-8 border-r-8 border-b-16 border-l-transparent color dome border-black"></div>
    );
};
export function RectangleIcon() {
    return (
        <svg
            width="298"
            height="35"
            viewBox="0 0 298 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M295.43 0H3.07L54.26 17.13C56.09 17.75 57.66 18.97 58.7 20.59L70.89 39.48C71.9 41.05 73.64 42 75.51 42H238.61C240.79 42 242.77 40.71 243.64 38.71L251.73 20.28C252.62 18.25 254.27 16.65 256.33 15.82L295.43 0Z"
                transform="translate(0 -7.5)"
                fill="url(#rectangle-fill)"
                stroke="url(#rectangle-stroke)"
            />
            <defs>
                <linearGradient
                    id="rectangle-fill"
                    x1="149"
                    y1="-8"
                    x2="149"
                    y2="35"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#4C34AC" />
                    <stop offset="1" stop-color="#7456D0" />
                </linearGradient>
                <linearGradient
                    id="rectangle-stroke"
                    x1="156.5"
                    y1="35"
                    x2="156.5"
                    y2="-1.5"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-opacity="0" />
                    <stop offset="0.5" stop-color="#9E85EB" />
                    <stop offset="1" stop-color="#333333" stop-opacity="0" />
                </linearGradient>
            </defs>
        </svg>
    )
}
export function DarkStarIcon() {
    return (
        <svg width="11" height="10" viewBox="0 0 11 10" fill="none" aria-hidden="true">
            <polygon
                points="5.5,0.8 6.7,3.2 9.4,3.6 7.45,5.45 7.9,8.1 5.5,6.85 3.1,8.1 3.55,5.45 1.6,3.6 4.3,3.2"
                fill="#D9D9D9"
            />
        </svg>
    );
}
export function PinkStarIcon() {
    return (
        <svg width="11" height="10" viewBox="0 0 11 10" fill="none" aria-hidden="true">
            <polygon
                points="5.5,0.8 6.7,3.2 9.4,3.6 7.45,5.45 7.9,8.1 5.5,6.85 3.1,8.1 3.55,5.45 1.6,3.6 4.3,3.2"
                fill="#e673fd"
            />
        </svg>
    );
}
export function BlueStarIcon() {
    return (
        <svg width="11" height="10" viewBox="0 0 11 10" fill="none" aria-hidden="true">
            <polygon
                points="5.5,0.8 6.7,3.2 9.4,3.6 7.45,5.45 7.9,8.1 5.5,6.85 3.1,8.1 3.55,5.45 1.6,3.6 4.3,3.2"
                fill="#2b67d6"
            />
        </svg>
    );
}
// export function LightStarIcon() {
//     return (
//         <svg width="23" height="22" viewBox="0 0 23 22" fill="none" aria-hidden="true">
//             <polygon
//                 points="11.5,6.2 12.9,9.1 16.1,9.55 13.8,11.75 14.35,14.9 11.5,13.4 8.65,14.9 9.2,11.75 6.9,9.55 10.1,9.1"
//                 fill="#FFFFFF"
//                 opacity="0.45"
//             />
//             <polygon
//                 points="11.5,6.2 12.9,9.1 16.1,9.55 13.8,11.75 14.35,14.9 11.5,13.4 8.65,14.9 9.2,11.75 6.9,9.55 10.1,9.1"
//                 fill="#FBFBFC"
//             />
//         </svg>
//     );
// }
export function PendingAni({ active }: { active: boolean }) {
    return (
        <div className="relative inline-block">
            <motion.div
                className="absolute inset-0"
                animate={{
                    scale: active ? 2.2 : 1,
                    opacity: active ? 0.7 : 0,
                    filter: active ? "brightness(3) blur(2px)" : "brightness(1) blur(0px)",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <DarkStarIcon />
            </motion.div>

            <motion.div
                className="relative"
                animate={{
                    scale: active ? 1.5 : 1,
                    filter: active ? "brightness(2)" : "brightness(1)",
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                <DarkStarIcon />
            </motion.div>
        </div>
    );
}
export function ResultAni({ active, color }: { active: boolean; color: number }) {
    return (
        <div className="relative inline-block">
            <motion.div
                className="absolute inset-0"
                animate={{
                    scale: active ? 2.2 : 1,
                    opacity: active ? 0.7 : 0,
                    filter: active ? "brightness(3) blur(2px)" : "brightness(1) blur(0px)",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                {color === 1 ? <BlueStarIcon /> : <PinkStarIcon />}
            </motion.div>

            <motion.div
                className="relative"
                animate={{
                    scale: active ? 1.5 : 1,
                    filter: active ? "brightness(2)" : "brightness(1)",
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                {color === 1 ? <BlueStarIcon /> : <PinkStarIcon />}
            </motion.div>
        </div>
    );
}
export function PendingStar() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % 6);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    const topPosition = [20, 56, 90, 124, 158, 192];
    const leftPosition1 = [8, 7, 6, 6, 7, 8];
    const leftPosition2 = [292, 293, 294, 294, 293, 292];

    return (
        <>
            {topPosition.map((top, i) => (
                <div
                    key={`left-edge-${i}`}
                    className="absolute"
                    style={{ left: `${leftPosition1[i]}px`, top: `${top}px` }}
                >
                    <PendingAni active={i === activeIndex} />
                </div>
            ))}
            {topPosition.map((top, i) => (
                <div
                    key={`left-inner-${i}`}
                    className="absolute"
                    style={{ left: "101px", top: `${top}px` }}
                >
                    <PendingAni active={i === activeIndex} />
                </div>
            ))}
            {topPosition.map((top, i) => (
                <div
                    key={`right-inner-${i}`}
                    className="absolute"
                    style={{ left: "199px", top: `${top}px` }}
                >
                    <PendingAni active={i === activeIndex} />
                </div>
            ))}
            {topPosition.map((top, i) => (
                <div
                    key={`right-edge-${i}`}
                    className="absolute"
                    style={{ left: `${leftPosition2[i]}px`, top: `${top}px` }}
                >
                    <PendingAni active={i === activeIndex} />
                </div>
            ))}

        </>
    );
}
export function RollingStar() {
    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
        const timers = Array.from({ length: 9 }, (_, index) =>
            setTimeout(() => {
                setActiveIndex(index);
            }, index * 200)
        );

        return () => {
            timers.forEach((timer) => clearTimeout(timer));
        };
    }, []);

    const topPosition = [24, 58, 92, 126, 160, 194];
    const leftPosition1 = [8, 7, 6, 6, 7, 8];
    const leftPosition2 = [292, 293, 294, 294, 293, 292];

    return (
        <>
            {topPosition.map((top, i) => (
                <div
                    key={`left-edge-${i}`}
                    className="absolute"
                    style={{ left: `${leftPosition1[i]}px`, top: `${top}px` }}
                >
                    <PendingAni active={activeIndex - 2 <= i && i <= activeIndex} />
                </div>
            ))}
            {topPosition.map((top, i) => (
                <div
                    key={`left-inner-${i}`}
                    className="absolute"
                    style={{ left: "101px", top: `${top}px` }}
                >
                    <PendingAni active={activeIndex - 2 <= i && i <= activeIndex} />
                </div>
            ))}
            {topPosition.map((top, i) => (
                <div
                    key={`right-inner-${i}`}
                    className="absolute"
                    style={{ left: "199px", top: `${top}px` }}
                >
                    <PendingAni active={activeIndex - 2 <= i && i <= activeIndex} />
                </div>
            ))}
            {topPosition.map((top, i) => (
                <div
                    key={`right-edge-${i}`}
                    className="absolute"
                    style={{ left: `${leftPosition2[i]}px`, top: `${top}px` }}
                >
                    <PendingAni active={activeIndex - 2 <= i && i <= activeIndex} />
                </div>
            ))}
        </>
    );
}
export function ResultStar() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % 2);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    const topPosition = [24, 58, 92, 126, 160, 194];
    const leftPosition1 = [8, 7, 6, 6, 7, 8];
    const leftPosition2 = [292, 293, 294, 294, 293, 292];

    return (
        <>
            {topPosition.map((top, i) => (
                <div
                    key={`left-edge-${i}`}
                    className="absolute"
                    style={{ left: `${leftPosition1[i]}px`, top: `${top}px` }}
                >
                    <ResultAni active={i % 2 === activeIndex} color={activeIndex + 1} />
                </div>
            ))}
            {topPosition.map((top, i) => (
                <div
                    key={`left-inner-${i}`}
                    className="absolute"
                    style={{ left: "101px", top: `${top}px` }}
                >
                    <ResultAni active={i % 2 === activeIndex} color={activeIndex + 1} />
                </div>
            ))}
            {topPosition.map((top, i) => (
                <div
                    key={`right-inner-${i}`}
                    className="absolute"
                    style={{ left: "199px", top: `${top}px` }}
                >
                    <ResultAni active={i % 2 === activeIndex} color={activeIndex + 1} />
                </div>
            ))}
            {topPosition.map((top, i) => (
                <div
                    key={`right-edge-${i}`}
                    className="absolute"
                    style={{ left: `${leftPosition2[i]}px`, top: `${top}px` }}
                >
                    <ResultAni active={i % 2 === activeIndex} color={activeIndex + 1} />
                </div>
            ))}
        </>
    );
}
export function LightsAni() {
    const lights = [59, 134, 154, 232, 251, 326];
    return (
        lights.map((left, i) => (
            <Fragment key={`light-${left}-${i}`}>
                <div
                    className="absolute overflow-hidden pointer-events-none"
                    style={{ left: `${left}px`, top: `${238}px`, width: "5px", height: "214px" }}
                >
                    <motion.div
                        className="absolute left-0 top-0 w-[5px] h-[60px] rounded-full"
                        initial={{ y: -60, opacity: 1 }}
                        animate={{ y: 220, opacity: 1 }}
                        transition={{
                            duration: 1.6,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                        style={{
                            background: "linear-gradient(to bottom, transparent, white, transparent)",
                            filter: "blur(1px)",
                        }}
                    />
                    <motion.div
                        className="absolute left-0 top-0 my-[25px] w-[5px] h-[10px] rounded-full"
                        initial={{ y: -60, opacity: 1 }}
                        animate={{ y: 220, opacity: 1 }}
                        transition={{
                            duration: 1.6,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                        style={{
                            background: "white",
                            filter: "blur(2px)",
                        }}
                    />
                </div>
            </Fragment>
        ))
    )
}
export function WinAni() {
    const win_duration = [0.9, 0.9, 0.9, 0.9, 0.9,
        0.9, 0.9, 0.9, 0.9, 0.9,
    ];
    const win_rotateX = [360, 326, 360, 326, 297,
        110, 38, 200, 320, 194,
    ];
    const win_rotateY = [310, 310, 360, 1, 110,
        17, 324, 20, 331, 90,
    ];
    const win_rotateZ = [211, 100, 3, 360, 360,
        330, 111, 141, 335, 320,
    ];
    const win_positionYStart = [470, 471, 476, 472, 474,
        475, 472, 473, 475, 478,
    ];
    const win_positionYMiddle = [422, 523, 502, 416, 549,
        477, 519, 436, 524, 453,
    ];
    const win_positionYEnd = [180, 200, 200, 200, 200,
        200, 200, 200, 200, 200,
    ];
    const win_positionXStart = [100, 104, 105, 103, 105,
        102, 123, 105, 106, 106,
    ];
    const win_positionXMiddle = [122, 160, 135, 146, 111,
        131, 152, 139, 150, 138,
    ];
    const win_positionXEnd = [-150, -150, -150, -150, -150,
    -150, -150, -150, -150, -150,
    ];
    return (
        win_duration.map((index, i) => (<motion.img
            key={i}
            src={getAssetUrl(GAME_ASSETS.coin)}
            className="absolute w-10 h-10 left-1/2 -translate-x-1/2 scale-50"
            animate={{
                x: [win_positionXStart[i], win_positionXMiddle[i], win_positionXEnd[i]],
                y: [win_positionYStart[i], win_positionYMiddle[i], win_positionYEnd[i]],   // rise then drop
                rotateX: [0, win_rotateX[i]],
                rotateY: [0, win_rotateY[i]],
                rotateZ: [0, win_rotateZ[i]],
                opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
            }}
            transition={{
                duration: index,
                ease: "easeInOut",
                // repeat: Infinity,
            }}
        />))
    );
}
export function RiseAni({ left, top }: { left: number, top: number }) {
    const duration = [0.9, 0.9, 1.1, 1.2, 1.1,
        0.9, 0.8, 0.7, 1.2, 1.3,
        2.5, 0.9, 1.4, 1.6, 1.7];
    const rotateX = [360, 326, 360, 326, 297,
        110, 38, 10, 320, 194,
        110, 38, 10, 320, 194,];
    const rotateY = [310, 310, 0, 1, 110,
        17, 24, 10, 31, 90,
        110, 38, 10, 320, 194,];
    const rotateZ = [211, 100, 3, 0, 0,
        110, 38, 10, 320, 194,
        0, 1, 4, 35, 20];
    const positionYStart = [70, 68, 70, 70, 69,
        67, 69, 66, 60, 73,
        68, 70, 70, 69, 67,];
    const positionYMiddle = [42, 40, 38, 37, 39,
        42, 40, 38, 37, 39,
        37, 42, 44, 45, 51];
    const positionYEnd = [90, 90, 90, 88, 85,
        90, 90, 90, 88, 85,
        90, 90, 83, 84, 85];
    const positionXStart = [0, -3, -7, -10, -10,
        12, 8, -2, 10, 6,
        10, -10, 12, 8, -2];
    const positionXMiddle = [10, -20, -15, -16, -21,
        18, -14, -17, -10, -9,
        21, 12, -19, 20, 0];
    const positionXEnd = [16, -18, -21, -18, -19,
        29, -19, -14, -10, -18,
        18, 29, -13, 25, 21];

    const duration1 = [2.5, 0.9, 1.4, 1.6, 1.7,
        0.9, 0.8, 0.7, 1.2, 1.3,
        0.9, 0.8, 0.7, 1.2, 1.3,];
    const rotateX1 = [297, 326, 360, 326, 360,
        110, 38, 10, 320, 194,
        326, 360, 326, 297, 320];
    const rotateY1 = [178, 384, 330, 221, 110,
        110, 38, 10, 320, 194,
        143, 44, 10, 31, 90,];
    const rotateZ1 = [211, 100, 3, 300, 290,
        47, 2, 234, 315, 230,
        110, 38, 10, 320, 194,];
    const positionYStart1 = [70, 38, 60, 60, 74,
        74, 68, 70, 70, 69,
        67, 69, 66, 70, 68];
    const positionYMiddle1 = [42, 40, 38, 37, 39,
        45, 38, 35, 37, 39,
        37, 42, 44, 45, 41];
    const positionYEnd1 = [90, 90, 90, 88, 85,
        90, 90, 90, 88, 85,
        90, 90, 90, 93, 84,];
    const positionXStart1 = [0, -3, -7, -10, -10,
        0, -3, -9, -10, -10,
        12, 8, -2, 10, 6];
    const positionXMiddle1 = [18, -14, -17, -10, -9,
        10, -20, -15, -16, -21,
        12, 18, -19, 20, 8];
    const positionXEnd1 = [29, -19, -14, -10, -18,
        18, 29, -13, 25, 21,
        14, 4, -13, 25, 24];

    return (<>
        {
            duration.map((index, i) => (<motion.img
                key={i}
                src={getAssetUrl(GAME_ASSETS.coin)}
                className="absolute  w-3 h-3 z-[20]"
                style={{ top: `${top}px`, left: `${left}px` }}
                animate={{
                    x: [positionXStart[i], positionXMiddle[i], positionXEnd[i]],
                    y: [positionYStart[i], positionYMiddle[i], positionYEnd[i]],   // rise then drop
                    rotateX: [0, rotateX[i]],
                    rotateY: [0, rotateY[i]],
                    rotateZ: [0, rotateZ[i]],    // spin
                }}
                transition={{
                    duration: index,
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
            />))
        }
        {
            duration1.map((index, i) => (<motion.img
                key={i}
                src={getAssetUrl(GAME_ASSETS.coin)}
                className="absolute w-3 h-3 z-[20]"
                style={{ top: `${top}px`, left: `${left}px` }}
                animate={{
                    x: [positionXStart1[i], positionXMiddle1[i], positionXEnd1[i]],
                    y: [positionYStart1[i], positionYMiddle1[i], positionYEnd1[i]],   // rise then drop
                    rotateX: [0, rotateX1[i]],
                    rotateY: [0, rotateY1[i]],
                    rotateZ: [0, rotateZ1[i]],    // spin
                }}
                transition={{
                    duration: index,
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
            />))
        }
    </>
    )
}
export function RainMoney() {
    const delay = [0.1, 0.8, 0, 0.6, 0.4, 0, 0.7, 0,
        0.3, 0.6, 0.5, 0.3, 0.4, 0,
        0.4, 0.3, 0, 0.5, 0, 0.3, 0.5, 0,
        0.6, 0.4, 0.6, 0.3, 0.3, 0,
        0.6, 0.7, 0.4, 0.7, 0.3, 0,
        0.6, 0.3, 0.6, 0.5, 0.8, 0,
    ]
    const duration = [1.9, 1.2, 1.2, 2.1, 1.7,
        1.5, 2.4, 1.6, 2.2, 1.1,
        2.3, 1.6, 1.5, 1.7, 1.6,
        1.7, 1.8, 1.5, 1.8, 2,
        2.9, 1.2, 1.2, 2.1, 1.7,
        1.5, 1.4, 1.6, 1.2, 2.1,
        1.3, 1.6, 1.5, 1.7, 1.6,
        1.7, 1.8, 2.5, 1.8, 2];
    const rotateX = [360, 326, 360, 326, 297,
        110, 38, 10, 320, 194,
        360, 326, 360, 326, 297,
        110, 38, 10, 320, 194,
        360, 326, 360, 326, 297,
        110, 38, 10, 320, 194,
        360, 326, 360, 326, 297,
        110, 38, 10, 320, 194];
    const rotateY = [310, 310, 210, 331, 110,
        157, 24, 310, 31, 90,
        360, 326, 360, 326, 297,
        110, 38, 10, 320, 194,
        360, 326, 360, 326, 297,
        110, 38, 10, 320, 194,
        360, 326, 360, 326, 297,
        110, 38, 10, 320, 194];
    const rotateZ = [211, 100, 333, 230, 230,
        330, 321, 324, 35, 20,
        360, 326, 360, 326, 297,
        110, 38, 120, 320, 194,
        360, 326, 360, 326, 297,
        110, 38, 10, 320, 194,
        360, 326, 360, 326, 297,
        110, 38, 10, 320, 194];
    const positionYStart = [370, 310, 420, 330, 320,
        360, 326, 360, 326, 297,
        360, 326, 360, 326, 297,
        210, 338, 310, 320, 394,
        360, 326, 360, 326, 297,
        310, 238, 210, 320, 394,
        211, 300, 333, 230, 230,
        274, 415, 314, 412, 211,
    ];
    const positionYMiddle = [274, 215, 314, 212, 211,
        260, 225, 260, 249, 264,
        160, 235, 254, 223, 217,
        117, 178, 207, 270, 298,
        278, 237, 273, 226, 167,
        132, 163, 154, 232, 141,
        121, 230, 235, 150, 140,
        142, 234, 232, 322, 121,
    ];
    const positionXStart = [
        200, 200, 200, 200, 200,
        200, 200, 200, 200, 200,
        200, 200, 200, 200, 200,
        200, 200, 200, 200, 200,
        200, 200, 200, 200, 200,
        200, 200, 200, 200, 200,
        200, 200, 200, 200, 200,
        200, 200, 200, 200, 200,
    ];

    const duration1 = [1.9, 1.2, 1.2, 2.1, 1.7,
        2.5, 2.4, 1.6, 1.9, 1.1,
        2.3, 1.6, 1.5, 1.7, 1.6,
        1.7, 1.8, 1.5, 1.8, 2,
        2.3, 2.6, 2.5, 3.7, 1.6,
        1.7, 1.8, 1.5, 1.8, 2,
        2.9, 1.2, 1.2, 2.1, 2.7,
        2.5, 2.4, 2.6, 2.2, 2.1,];
    const rotateX1 = [297, 326, 360, 326, 360,
        110, 38, 10, 320, 194,
        178, 384, 330, 221, 110,
        143, 44, 10, 31, 90,
        360, 326, 360, 326, 297,
        110, 38, 10, 320, 194,
        360, 326, 360, 326, 297,
        110, 38, 10, 320, 194,];
    const rotateY1 = [178, 384, 330, 221, 110,
        143, 44, 10, 31, 90,
        297, 326, 360, 326, 360,
        110, 38, 10, 320, 194,
        360, 326, 360, 326, 297,
        110, 38, 10, 320, 194,
        360, 326, 360, 326, 297,
        110, 38, 10, 320, 194,];
    const rotateZ1 = [211, 100, 3, 300, 290,
        47, 2, 234, 315, 230,
        297, 326, 360, 326, 360,
        110, 38, 10, 320, 194,
        360, 326, 360, 326, 297,
        110, 38, 10, 320, 194,
        360, 326, 360, 326, 297,
        110, 38, 10, 320, 194,];
    const positionYStart1 = [370, 310, 420, 330, 320,
        360, 326, 360, 326, 297,
        360, 326, 360, 326, 297,
        210, 338, 315, 325, 394,
        365, 326, 365, 326, 297,
        315, 238, 215, 320, 394,
        211, 300, 333, 230, 230,
        274, 415, 314, 412, 211,
    ];
    const positionYMiddle1 = [274, 215, 314, 212, 211,
        260, 225, 260, 249, 264,
        160, 235, 254, 223, 217,
        117, 178, 207, 270, 298,
        278, 237, 273, 226, 167,
        132, 163, 154, 232, 141,
        121, 230, 235, 150, 140,
        142, 234, 232, 322, 121,
    ];
    const positionXStart1 = [
        200, 200, 200, 200, 200,
        200, 200, 200, 200, 200,
        200, 200, 200, 200, 200,
        200, 200, 200, 200, 200,
        200, 200, 200, 200, 200,
        200, 200, 200, 200, 200,
        200, 200, 200, 200, 200,
        200, 200, 200, 200, 200,
    ];

    return (
        <>
            {
                duration.map((index, i) => (<motion.img
                    key={i}
                    src={getAssetUrl(GAME_ASSETS.coin)}
                    className="absolute w-10 h-10 left-1/2 -translate-x-1/2 scale-50 z-[30]"
                    animate={{
                        x: [positionXStart[i], positionXStart[i] - 450,],
                        y: [positionYStart[i] + 100, positionYMiddle[i] + 100, positionYStart[i] + 150],   // rise then drop
                        rotateX: [0, rotateX[i]],
                        rotateY: [0, rotateY[i]],
                        rotateZ: [0, rotateZ[i]],    // spin
                    }}
                    transition={{
                        duration: index,
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: delay[i],
                    }}
                />))
            }
            {
                duration1.map((index, i) => (<motion.img
                    key={i}
                    src={getAssetUrl(GAME_ASSETS.coin)}
                    className="absolute w-10 h-10 left-1/2 -translate-x-1/2 z-[30]"
                    animate={{
                        x: [positionXStart1[i] - 450, positionXStart1[i] + 50,],
                        y: [positionYStart1[i] + 100, positionYMiddle1[i] + 100, positionYStart1[i] + 150],   // rise then drop
                        rotateX: [0, rotateX1[i]],
                        rotateY: [0, rotateY1[i]],
                        rotateZ: [0, rotateZ1[i]],    // spin
                    }}
                    transition={{
                        duration: index,
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: delay[i],
                    }}
                />))
            }
        </>
    )
}
export function StartAni({ left, delay, num0, num1, num2 }: { left: number; delay: number; num0: number; num1: number; num2: number }) {
    const rows = [num0, num1, num2]
    const { options } = useGame()
    return (
        <Fragment key={`light-${left}-${1}`}>
            <div
                className="absolute overflow-hidden pointer-events-none"
                style={{ left: `${left}px`, top: `${5}px`, width: "65px", height: "215px" }}
            >
                {rows.map((element, index) => (
                    <motion.img
                        src={resolveAssetUrl(options[element - 13].logo)}
                        className="absolute left-0 top-0 w-[65px] h-[65px]"
                        initial={{ y: 5 + index * 70, opacity: 1 }}
                        animate={{ y: 215, opacity: 1 }}
                        transition={{
                            duration: 0.225 - index * 0.075,
                            ease: "linear",
                            delay: delay,
                            // repeat: Infinity,
                        }}
                        style={{
                            // background: "linear-gradient( green )",
                            // filter: "blur(1px)",
                        }}
                    />
                )
                )
                }
            </div>
        </Fragment>
    )
}
export function StopAni({ left, delay, num0, num1, num2 }: { left: number; delay: number; num0: number; num1: number; num2: number }) {
    const { options } = useGame()
    const rows = [num0, num1, num2]
    return (
        <Fragment key={`light-${left}-${1}`}>
            <div
                className="absolute  overflow-hidden pointer-events-none"
                style={{ left: `${left}px`, top: `${5}px`, width: "65px", height: "215px" }}
            >
                {rows.map((element, index) => (
                    <motion.img
                        src={resolveAssetUrl(options[element - 13].logo)}
                        className="absolute left-0 top-0 w-[65px] h-[65px]"
                        initial={{ y: -65, opacity: 1 }}
                        animate={{ y: 145 - 70 * index, opacity: 1 }}
                        transition={{
                            duration: 0.225 - 0.075 * index,
                            ease: "linear",
                            delay: delay + 0.15 * index,
                        }}
                        style={{
                            // background: "linear-gradient( red )",
                            // filter: "blur(1px)",
                        }}
                    />
                )
                )
                }
            </div>
        </Fragment>
    )
}
export function RepeatAni({ left, delay, num }: { left: number; delay: number; num: number }) {
    const rows = [0, 3, 6, 1]
    const { options } = useGame()
    // const num = Math.floor(Math.random() * 7);
    return (
        <Fragment key={`light-${left}-${1}`}>
            <div
                className="absolute  overflow-hidden pointer-events-none"
                style={{ left: `${left}px`, top: `${5}px`, width: "65px", height: "215px" }}
            >
                {rows.map((element, index) => (
                    <motion.img
                        src={resolveAssetUrl(options[(num + element) % 7].logo)}
                        className="absolute left-0 top-0 w-[65px] h-[65px]"
                        initial={{ y: -65, opacity: 1 }}
                        animate={{ y: 215, opacity: 1 }}
                        transition={{
                            duration: 0.3,
                            ease: "linear",
                            delay: delay + index * 0.075,
                            // repeat: 3,
                        }}
                        style={{
                            // background: "linear-gradient( white )",
                            // filter: "blur(1px)",
                        }}
                    />
                )
                )
                }
            </div>
        </Fragment>
    )
}
export function TopBottomAni() {
    return < div className="absolute inset-0 z-30 pointer-events-none">
        <svg className="" width="600" height="400">
            {/* background path */}
            <path
                d="M30 35 L60 35 L255 185 L280 185"
                stroke="none"
                strokeWidth="10"
                fill="transparent"
            />

            {/* animated progress */}
            <motion.path
                d="M30 35 L60 35 L255 185 L280 185"
                stroke="rgba(255, 220, 0, 0.8)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="500"
                initial={{ strokeDashoffset: 500 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, ease: "linear" }}
            />
            <motion.path
                d="M30 35 L60 35 L255 185 L280 185"
                stroke="rgba(255,255,255,1)"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray="500"
                initial={{ strokeDashoffset: 500 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, ease: "linear" }}
                style={{ filter: "blur(2px)", }}
            />
        </svg>
    </div>
}
export function BottomTopAni() {
    return <div className="absolute inset-0 z-30 pointer-events-none">
        <svg className="" width="600" height="400">
            {/* background path */}
            <path
                d="M30 185 L60 185 L250 35 L280 35"
                stroke="none"
                strokeWidth="10"
                fill="transparent"
            />

            {/* animated progress */}
            <motion.path
                d="M30 185 L60 185 L250 35 L280 35"
                stroke="rgba(180, 80, 255, 0.8)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="500"
                initial={{ strokeDashoffset: 500 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, ease: "linear" }}
            />
            <motion.path
                d="M30 185 L60 185 L250 35 L280 35"
                stroke="rgba(255,255,255,1)"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="500"
                initial={{ strokeDashoffset: 500 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, ease: "linear" }}
                style={{ filter: "blur(2px)", }}
            />
        </svg>
    </div>
}
export function TopAni() {
    return <div className="absolute inset-0 z-30 pointer-events-none">
        <svg className="" width="600" height="400">
            {/* background path */}
            <path
                d="M30 40 L280 40"
                stroke="none"
                strokeWidth="10"
                fill="transparent"
            />

            {/* animated progress */}
            <motion.path
                d="M30 40 L280 40"
                stroke="rgba(0, 150, 255, 0.8)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="500"
                initial={{ strokeDashoffset: 500 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, ease: "linear" }}
            />
            <motion.path
                d="M30 40 L280 40"
                stroke="rgba(255,255,255,1)"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="500"
                initial={{ strokeDashoffset: 500 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, ease: "linear" }}
                style={{ filter: "blur(2px)", }}
            />
        </svg>
    </div>
}
export function MiddleAni() {
    return <div className="absolute inset-0 z-30 pointer-events-none">
        <svg className="" width="600" height="400">
            {/* background path */}
            <path
                d="M30 140 L280 140"
                stroke="none"
                strokeWidth="10"
                fill="transparent"
            />

            {/* animated progress */}
            <motion.path
                d="M30 110 L280 110"
                stroke="rgba(255, 60, 60, 0.8)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="500"
                initial={{ strokeDashoffset: 500 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, ease: "linear" }}
            />
            <motion.path
                d="M30 110 L280 110"
                stroke="rgba(255,255,255,1)"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="500"
                initial={{ strokeDashoffset: 500 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, ease: "linear" }}
                style={{ filter: "blur(2px)", }}
            />
        </svg>
    </div>
}
export function BottomAni() {
    return <div className="absolute inset-0 z-30 pointer-events-none">
        <svg className="" width="600" height="400">
            {/* background path */}
            <path
                d="M30 180 L280 180"
                stroke="none"
                strokeWidth="10"
                fill="transparent"
            />

            {/* animated progress */}
            <motion.path
                d="M30 180 L280 180"
                stroke="rgba(0,255,0,0.8)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="500"
                initial={{ strokeDashoffset: 500 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, ease: "linear" }}
            />
            <motion.path
                d="M30 180 L280 180"
                stroke="rgba(255,255,255,1)"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="500"
                initial={{ strokeDashoffset: 500 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, ease: "linear" }}
                style={{ filter: "blur(2px)", }}
            />
        </svg>
    </div>
}
// export function ResultPending({ status, index0, index1, index2, index3, index4, total }: { status: number[], index0: number, index1: number, index2: number, index3: number, index4: number, total: number }) {
export function ResultPending({ status, }: { status: number[], }) {
    const [second, setSecond] = useState(0);
    const [times, setTimes] = useState(0);
    const [choosed, setChoosed] = useState("")
    let total = 0;
    let index0 = -1
    let index1 = -1
    let index2 = -1
    let index3 = -1
    let index4 = -1
    if (status[0] === 1 && status[4] === 1 && status[8] === 1) {
        index0 = total
        total += 1
    }
    if (status[6] === 1 && status[4] === 1 && status[2] === 1) {
        index1 = total
        total += 1
    }
    if (status[0] === 1 && status[1] === 1 && status[2] === 1) {
        index2 = total
        total += 1
    }
    if (status[3] === 1 && status[4] === 1 && status[5] === 1) {
        index3 = total
        total += 1
    }
    if (status[6] === 1 && status[7] === 1 && status[8] === 1) {
        index4 = total
        total += 1
    }
    useEffect(() => {
        const timer = setInterval(() => {
            if (second === (index0 + (total + 1) * times) * 1000) {
                setChoosed("topbottom")
            }
            if (second === (index1 + (total + 1) * times) * 1000) {
                setChoosed("bottomtop")
            }
            if (second === (index2 + (total + 1) * times) * 1000) {
                setChoosed("top")
            }
            if (second === (index3 + (total + 1) * times) * 1000) {
                setChoosed("middle")
            }
            if (second === (index4 + (total + 1) * times) * 1000) {
                setChoosed("bottom")
            }
            if (second === (total + (total + 1) * times) * 1000) {
                setChoosed("total")
                setTimes((prev) => prev + 1)
            }
            setSecond((s) => s + 1000);
        }, 1000);
        return () => {
            clearInterval(timer)
        };
    }, [second,])
    return (
        <>
            {choosed === "topbottom" && (
                <TopBottomAni />
            )}
            {choosed === "bottomtop" && (
                <BottomTopAni />
            )}
            {choosed === "top" && (
                <TopAni />
            )}
            {choosed === "middle" && (
                <MiddleAni />
            )}
            {choosed === "bottom" && (
                <BottomAni />
            )}
            {choosed === "total" && total > 1 && (
                <>
                    {status[8] && status[4] === 1 && status[0] === 1 &&
                        <TopBottomAni />
                    }
                    {status[6] && status[4] === 1 && status[2] === 1 &&
                        <BottomTopAni />
                    }
                    {status[0] === 1 && status[1] === 1 && status[2] === 1 &&
                        <TopAni />
                    }
                    {status[3] === 1 && status[4] === 1 && status[5] === 1 &&
                        <MiddleAni />
                    }
                    {status[6] === 1 && status[7] === 1 && status[0] === 1 &&
                        <BottomAni />
                    }
                </>
            )}

        </>
    )
}



{/* <div
                                className="absolute bottom-0 left-0 h-[70px] w-full bg-gradient-to-br from-[#D5831F] from-1% via-30% via-[#FFF987]  to-[#D5831F] to-90%"
                                style={{
                                    clipPath: "polygon(0 28%, 4.5% 0, 95.5% 0, 100% 22%, 100% 100%, 0 100%)",
                                }}
                            /> */}
