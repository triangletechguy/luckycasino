import { ButtonMenu, CloseIcon, QuestionMarkIcon, } from "./ButtonMenu";
import { getAssetUrl, GAME_ASSETS } from "../config/gameconfig";
import { useEffect, useState } from "react";
import { resolveAssetUrl, useGame } from "../hooks/useGameHook";
export function HistoryIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <circle cx="7.5" cy="7.5" r="4.8" stroke="#12F49E" strokeWidth="1.2" />
            <path d="M7.5 5.1V7.7" stroke="#12F49E" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M7.5 7.7L9.3 8.9" stroke="#12F49E" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}

type RankingProps = {
    onCloseRanking: () => void;
    onOpenPrizeDistribution: () => void;
};

export default function Ranking({ onCloseRanking, onOpenPrizeDistribution }: RankingProps) {
    const [isTodayRanking, setIsTodayRanking] = useState(true)
    const [result, setResult] = useState(0);
    const [time, setTime] = useState("");
    const { handleRanking, handleJackPot, handleRemainingToday, ranking, jackpot } = useGame()
    useEffect(() => {
        handleRanking()
        handleJackPot()
    }, [])
    useEffect(() => {
        const load = async () => {
            const data = await handleRemainingToday();
            setResult(Math.floor(Number(data.data.remaining_seconds)));
        };
        void load();
    }, []);
    useEffect(() => {
        if (!result) return;

        const updateTime = () => {
            const res = result;
            const hours = Math.floor(res / 3600);
            const minutes = Math.floor((res % 3600) / 60);
            const seconds = res % 60;

            setTime(
                `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
                    .toString()
                    .padStart(2, "0")}`
            );
        };

        updateTime();

        const interval = setInterval(() => {
            setResult((prev) => {
                const next = prev - 1;
                return next >= 0 ? next : 0;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [result]);

    return (
        <div className="h-[530px] bg-gradient-to-t from-[#120D25] to-[#43308B] w-[343px] rounded-t-[20px]">
            <div className="absolute top-[12px] right-[12px] z-20">
                <ButtonMenu
                    borderColor="none"
                    borderWidth="0px"
                    icon={<CloseIcon />}
                    background={"#2D1F76"}
                    onClick={() => onCloseRanking()}
                />
            </div>
            <div className="absolute top-[12px] right-[42px] z-20">
                <ButtonMenu
                    borderColor="none"
                    borderWidth="0px"
                    icon={<QuestionMarkIcon />}
                    background={"#2D1F76"}
                    onClick={() => onOpenPrizeDistribution()}
                />
            </div>
            <img src={getAssetUrl(GAME_ASSETS.jackpot)} alt="rank" className="absolute top-[13px] left-1/2 -translate-x-1/2" />
            <span className="absolute right-[5px] top-[86px]  text-[#fffc59] text-[24px] font-sans tracking-[12px]">{Number(jackpot)}</span>
            <div className="absolute  top-[135px] left-1/2 w-[170px] h-[20px] rounded-full -translate-x-1/2 bg-[#28105C] item-center justify-center flex">
                {isTodayRanking && (<span className="relative mt-[2px]"><HistoryIcon /></span>)}
                <span className="text-[#12F49E] text-[12px] font-sans">{isTodayRanking ? time : "Yesterday Ranking"}</span>
            </div>
            <span className="absolute top-[155px] h-[45px] w-[250px] left-1/2 -translate-x-1/2 text-center font-sans text-[12px]">The top 15 players on the leaderboard can receiver a large number of diamonds based on the amount of diamonds played.</span>
            <div className="absolute w-[316px] h-[266px] top-[210px] left-1/2 -translate-x-1/2 bg-[#000000]/25 rounded-[5px]">
                <div className="flex items-center justify-between w-[280px] pl-[20px] pt-[10px]">
                    <span className="relative font-sans text-[#ffffff]/60">Ranking</span>
                    <span className=" relative pr-[20px] font-sans text-[#ffffff]/60">Name</span>
                    <span className=" relative font-sans text-[#ffffff]/60">Diamonds Play</span>
                </div>
                <div className="absolute top-[35px] w-[292px] h-[201px] left-1/2 -translate-x-1/2 scrollbar-hidden overflow-x-hidden overflow-y-auto">
                    {isTodayRanking ?
                        <>
                            {ranking?.today?.map((element, index) => (
                                <>
                                    {index === 0 && (
                                        <div className="relative w-[292px] h-[47px] mt-[5px] flex ">
                                            <div className="relative h-[47px] w-[47px] bg-gradient-to-br from-[#cf9800] from-1%  via-50% via-[#FFF987] to-[#fdc21f] to-90% rounded-l-[10px]">
                                                <img src={getAssetUrl(GAME_ASSETS.first)} alt="prize" className=" absolute h-[35px] w-[35px] left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" />
                                            </div>
                                            <div className="relative flex h-[47px] w-[245px] bg-gradient-to-t from-[#FBBA07]   to-[#FFF987] items-center rounded-r-[10px] {resolveAssetUrl(rankingToday[0].player?.">
                                                <img src={resolveAssetUrl(element?.user?.avater ?? "")} alt="avatar" className="ml-[10px] h-[45px] w-[45px] rounded-full" />
                                                <span className="absolute left-[60px] text-[#fde4c7] font-bold  h-[40px] w-[80px] content-center">{element?.user?.username}</span>
                                                <img src={getAssetUrl(GAME_ASSETS.diamond)} alt="diamond" className="absolute left-[130px] h-[30px] w-[30px]" />
                                                <span className="absolute left-[160px] text-[#fde4c7] font-bold  h-[40px] w-[80px] content-center">{element?.total_win}</span>
                                            </div>
                                        </div>
                                    )}
                                    {index === 1 && (
                                        <div className="relative w-[292px] h-[47px] mt-[5px] flex">
                                            <div className="relative h-[47px] w-[47px] bg-gradient-to-br from-[#7fd5fd] from-1%  via-50% via-[#fbfdff] to-[#7fd5fd] to-90% rounded-l-[10px]">
                                                <img src={getAssetUrl(GAME_ASSETS.second)} alt="prize" className=" absolute h-[35px] w-[35px] left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" />
                                            </div>
                                            <div className="relative flex h-[47px] w-[245px] bg-gradient-to-t from-[#7fd5fd]   to-[#b8d6f8] items-center rounded-r-[10px]">
                                                <img src={resolveAssetUrl(element?.user?.avater ?? "")} alt="avatar" className="ml-[10px] h-[45px] w-[45px] rounded-full" />
                                                <span className="absolute left-[60px] text-[#fde4c7] font-bold  h-[40px] w-[80px] content-center">{element?.user?.username}</span>
                                                <img src={getAssetUrl(GAME_ASSETS.diamond)} alt="diamond" className="absolute left-[130px] h-[30px] w-[30px]" />
                                                <span className="absolute left-[160px] text-[#fde4c7] font-bold  h-[40px] w-[80px] content-center">{element.total_win}</span>
                                            </div>
                                        </div>
                                    )}
                                    {index === 2 && (
                                        <div className="relative w-[292px] h-[47px] mt-[5px] flex">
                                            <div className="relative h-[47px] w-[47px] bg-gradient-to-br from-[#f1a362] from-1%  via-50% via-[#ffe6d2] to-[#f1a362] to-90% rounded-l-[10px]">
                                                <img src={getAssetUrl(GAME_ASSETS.thirdP)} alt="prize" className=" absolute h-[35px] w-[35px] left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" />
                                            </div>
                                            <div className="relative flex h-[47px] w-[245px] bg-gradient-to-t from-[#f1a362]   to-[#fec79a] items-center rounded-r-[10px]">
                                                <img src={resolveAssetUrl(element?.user?.avater ?? "")} alt="avatar" className="ml-[10px] h-[45px] w-[45px] rounded-full" />
                                                <span className="absolute left-[60px] text-[#fde4c7] font-bold  h-[40px] w-[80px] content-center">{element?.user?.username}</span>
                                                <img src={getAssetUrl(GAME_ASSETS.diamond)} alt="diamond" className="absolute left-[130px] h-[30px] w-[30px]" />
                                                <span className="absolute left-[160px] text-[#fde4c7] font-bold  h-[40px] w-[80px] content-center">{element.total_win}</span>
                                            </div>
                                        </div>
                                    )}
                                    {index > 2 && (
                                        <div className="relative w-[292px] h-[47px] mt-[5px] flex">
                                            <div className="relative content-center pl-[20px] h-[47px] w-[47px] text-[#ffcf68] text-[20px] bg-gradient-to-br from-[#d6b579] from-1%  via-50% via-[#fdfaf5] to-[#d6b579] to-90% [text-shadow:1px_0_0_brown,-1px_0_0_brown,0_1px_0_brown,0_-1px_0_brown] rounded-l-[10px]">
                                                {index + 1}
                                            </div>
                                            <div className="relative flex h-[47px] w-[245px] bg-gradient-to-t from-[#d6b579]   to-[#fffae6] items-center rounded-r-[10px]">
                                                <img src={resolveAssetUrl(element?.user?.avater ?? "")} alt="avatar" className=" ml-[10px] h-[45px] w-[45px] rounded-full" />
                                                <span className="absolute left-[60px] text-[#fde4c7] font-bold  h-[40px] w-[80px] content-center">{element?.user?.username}</span>
                                                <img src={getAssetUrl(GAME_ASSETS.diamond)} alt="diamond" className="absolute left-[130px] h-[30px] w-[30px]" />
                                                <span className="absolute left-[160px] text-[#fde4c7] font-bold  h-[40px] w-[80px] content-center">{element.total_win}</span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ))}
                        </>
                        :
                        <>
                            {ranking?.yesterday?.map((element, index) => (
                                <>
                                    {index === 0 && (
                                        <div className="relative w-[292px] h-[47px] mt-[5px] flex ">
                                            <div className="relative h-[47px] w-[47px] bg-gradient-to-br from-[#cf9800] from-1%  via-50% via-[#FFF987] to-[#fdc21f] to-90% rounded-l-[10px]">
                                                <img src={""} alt="prize" className=" absolute h-[35px] w-[35px] left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" />
                                            </div>
                                            <div className="relative flex h-[47px] w-[245px] bg-gradient-to-t from-[#FBBA07]   to-[#FFF987] items-center rounded-r-[10px] {resolveAssetUrl(rankingToday[0].player?.">
                                                <img src={resolveAssetUrl(element?.user?.avater ?? "")} alt="avatar" className="ml-[10px] h-[45px] w-[45px] rounded-full" />
                                                <span className="absolute left-[60px] text-[#fde4c7] font-bold  h-[40px] w-[80px] content-center">{element?.user?.username}</span>
                                                <img src={getAssetUrl(GAME_ASSETS.diamond)} alt="diamond" className="absolute left-[130px] h-[30px] w-[30px]" />
                                                <span className="absolute left-[160px] text-[#fde4c7] font-bold  h-[40px] w-[80px] content-center">{element.total_win}</span>
                                            </div>
                                        </div>
                                    )}
                                    {index === 1 && (
                                        <div className="relative w-[292px] h-[47px] mt-[5px] flex">
                                            <div className="relative h-[47px] w-[47px] bg-gradient-to-br from-[#7fd5fd] from-1%  via-50% via-[#fbfdff] to-[#7fd5fd] to-90% rounded-l-[10px]">
                                                <img src={""} alt="prize" className=" absolute h-[35px] w-[35px] left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" />
                                            </div>
                                            <div className="relative flex h-[47px] w-[245px] bg-gradient-to-t from-[#7fd5fd]   to-[#b8d6f8] items-center rounded-r-[10px]">
                                                <img src={resolveAssetUrl(element?.user?.avater ?? "")} alt="avatar" className=" ml-[10px] h-[45px] w-[45px] rounded-full" />
                                                <span className="absolute left-[60px] text-[#fde4c7] font-bold  h-[40px] w-[80px] content-center">{element?.user?.username}</span>
                                                <img src={getAssetUrl(GAME_ASSETS.diamond)} alt="diamond" className="absolute left-[130px] h-[30px] w-[30px]" />
                                                <span className="absolute left-[160px] text-[#fde4c7] font-bold  h-[40px] w-[80px] content-center">{element.total_win}</span>
                                            </div>
                                        </div>
                                    )}
                                    {index === 2 && (
                                        <div className="relative w-[292px] h-[47px] mt-[5px] flex">
                                            <div className="relative h-[47px] w-[47px] bg-gradient-to-br from-[#f1a362] from-1%  via-50% via-[#ffe6d2] to-[#f1a362] to-90% rounded-l-[10px]">
                                                <img src={""} alt="prize" className=" absolute h-[35px] w-[35px] left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" />
                                            </div>
                                            <div className="relative flex h-[47px] w-[245px] bg-gradient-to-t from-[#f1a362]   to-[#fec79a] items-center rounded-r-[10px]">
                                                <img src={resolveAssetUrl(element?.user?.avater ?? "")} alt="avatar" className="  ml-[10px] h-[45px] w-[45px] rounded-full" />
                                                <span className="absolute left-[60px] text-[#fde4c7] font-bold  h-[40px] w-[80px] content-center">{element?.user?.username}</span>
                                                <img src={getAssetUrl(GAME_ASSETS.diamond)} alt="diamond" className="absolute left-[130px] h-[30px] w-[30px]" />
                                                <span className="absolute left-[160px] text-[#fde4c7] font-bold  h-[40px] w-[80px] content-center">{element.total_win}</span>
                                            </div>
                                        </div>
                                    )}
                                    {index > 2 && (
                                        <div className="relative w-[292px] h-[47px] mt-[5px] flex">
                                            <div className="relative content-center pl-[20px] h-[47px] w-[47px] text-[#ffcf68] text-[20px] bg-gradient-to-br from-[#d6b579] from-1%  via-50% via-[#fdfaf5] to-[#d6b579] to-90% [text-shadow:1px_0_0_brown,-1px_0_0_brown,0_1px_0_brown,0_-1px_0_brown] rounded-l-[10px]">
                                                {index + 1}
                                            </div>
                                            <div className="relative flex h-[47px] w-[245px] bg-gradient-to-t from-[#d6b579]   to-[#fffae6] items-center rounded-r-[10px]">
                                                <img src={resolveAssetUrl(element?.user?.avater ?? "")} alt="avatar" className="ml-[10px] h-[45px] w-[45px] rounded-full" />
                                                <span className="absolute left-[60px] text-[#fde4c7] font-bold  h-[40px] w-[80px] content-center">{element?.user?.username}</span>
                                                <img src={getAssetUrl(GAME_ASSETS.diamond)} alt="diamond" className="absolute left-[130px] h-[30px] w-[30px]" />
                                                <span className="absolute left-[160px] text-[#fde4c7] font-bold  h-[40px] w-[80px] content-center">{element.total_win}</span>
                                            </div>
                                        </div>)}
                                </>))}
                        </>}
                </div>
                <div className="absolute flex items-center top-[232px] left-1/2 -translate-x-1/2 w-[316px] h-[48px] bg-gradient-to-br from-[#FBBA07] from-1%  via-30% via-[#FFF987] to-[#D5831F] to-90% rounded-[9px]">
                    <div className="absolute flex items-center top-[2px] left-1/2 -translate-x-1/2 w-[312px] h-[44px] bg-gradient-to-t from-[#D2D9FF] to-[#4C2EDE] rounded-[9px]">
                        <div className="relative content-center pl-[20px] h-[47px] w-[47px] font-sans text-[#ffcf68] text-[20px] [text-shadow:1px_0_0_brown,-1px_0_0_brown,0_1px_0_brown,0_-1px_0_brown] rounded-l-[10px]">
                            99+
                        </div>
                        <span className="text-[#A45721] font-bold">Sumiya BD</span>
                        {/* <img src="" alt="" /> */}
                        <span></span>
                    </div>
                </div>
                <div className="absolute top-[284px] left-1/2 -translate-x-1/2 w-[269px]  h-[31px] justify-between flex">
                    {isTodayRanking ?
                        <>
                            <button className="relative w-[131px] h-[31px] bg-gradient-to-t from-[#705FEC] to-[#C990F7] rounded-[5px] border-[#fde453] border-[1px] text-[#FFFFFF] font-sans" onClick={() => { }}>Today</button>
                            <button className="relative w-[131px] h-[31px] bg-gradient-to-t from-[#705FEC]/40 to-[#C990F7]/40 rounded-[5px] border-[#fde453]/40 border-[1px] text-[#FFFFFF]/40 font-sans" onClick={() => { setIsTodayRanking(false) }}>Yesterday</button>
                        </> : <>
                            <button className="relative w-[131px] h-[31px] bg-gradient-to-t from-[#705FEC]/40 to-[#C990F7]/40 rounded-[5px] border-[#fde453]/40 border-[1px] text-[#FFFFFF]/40  font-sans" onClick={() => { setIsTodayRanking(true) }}>Today</button>
                            <button className="relative w-[131px] h-[31px] bg-gradient-to-t from-[#705FEC] to-[#C990F7] rounded-[5px] border-[#fde453]/40 border-[1px] text-[#FFFFFF] font-sans" onClick={() => { }}>Yesterday</button>
                        </>}
                </div>
            </div >
        </div>
    )
}