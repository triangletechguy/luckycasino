import { ButtonMenu, CloseIcon } from "./ButtonMenu";
import { useGame } from "../hooks/useGameHook";
import { useEffect } from "react";
type RankingProps = {
    onClosePrize: () => void;
};

export default function PrizeDistribution({ onClosePrize }: RankingProps) {

    const { prizeDistribution, handlePrizeDistribution } = useGame()

    useEffect(() => {
        handlePrizeDistribution();
    }, [])

    return (
        <div className="h-[490px] bg-gradient-to-t from-[#120D25] to-[#43308B] w-[343px] rounded-t-[20px]">
            <div className="absolute top-[12px] right-[12px] z-20">
                <ButtonMenu
                    borderColor="none"
                    borderWidth="0px"
                    icon={<CloseIcon />}
                    background={"#2D1F76"}
                    onClick={() => onClosePrize()}
                />
            </div>
            <span className="absolute top-[30px] left-1/2 -translate-x-1/2 text-[20px] font-sans text-white">PRIZE distribution</span>
            <div className="absolute w-[316px] h-[270px] top-[73px] left-1/2 -translate-x-1/2 bg-[#000000]/25 rounded-[5px]">
                <div className="flex items-center justify-between w-[280px] pt-[10px]">
                    <span className="relative font-sans ml-[50px] text-[#C499F4]">Ranking</span>
                    <span className=" relative font-sans mr-[30px] text-[#C499F4]">Diamonds</span>
                    <div className="absolute h-[1px] w-[300px] bg-[#C499F4] left-1/2 -translate-x-1/2 top-[30px]"></div>
                </div>
                {prizeDistribution?.ranks.map((element, index) => (
                    (index % 2 ?
                        <div className="absolute h-[35px] w-[300px]  left-1/2 -translate-x-1/2 "
                            style={{ top: `${30 + 40 * index}` }}>
                            <span className="absolute right-3/4 top-1/2 -translate-y-1/2">{element.rank_no}</span>
                            <span className="absolute right-[60px] top-1/2 -translate-y-1/2">{element.price}</span>
                        </div>
                        :
                        <div className="absolute h-[35px] w-[300px] bg-[#C499F4] left-1/2 -translate-x-1/2"
                            style={{ top: `${30 + 40 * index}` }}>
                            <span className="absolute right-3/4 top-1/2 -translate-y-1/2">{element.rank_no}</span>
                            <span className="absolute right-[60px] top-1/2 -translate-y-1/2">{element.price}</span>
                        </div>)
                ))}
            </div>
            <div className="absolute grid top-[357px] h-[105px] w-[294px] left-1/2 -translate-x-1/2">
                {prizeDistribution?.policy.map((element) => (
                    <span className="relative text-left  font-sans text-[12px]">{element.policy}</span>
                ))}
            </div>
        </div>
    )
}
