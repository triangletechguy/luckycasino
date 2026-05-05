import { ButtonMenu, CloseIcon } from "./ButtonMenu";
import { useGame, resolveAssetUrl } from "../hooks/useGameHook";
type HelpMenuProps = {
    onCloseHelpModal: () => void;
};
export default function HelpMenu({ onCloseHelpModal }: HelpMenuProps) {
    const { options, } = useGame()
    return (
        <div className="h-[274px] bg-gradient-to-t from-[#5028C1] to-[#7C00D5] w-[393px] rounded-t-[10px]">
            <span className="absolute flex left-[151px] top-[18px] text-[24px]  font-semibold">Class Slot</span>
            <div className="absolute top-[12px] right-[12px]">
                <ButtonMenu
                    borderColor="none"
                    borderWidth="0px"
                    icon={<CloseIcon />}
                    background={"#2D1F76"}
                    onClick={() => onCloseHelpModal()}
                />
            </div>
            <div className="absolute flex bg-[#000000]/25 top-[11px] left-[15px] h-[74px] w-[122px] rounded-[5px]">
                <svg>
                    <path
                        d="M19 10 L102 65 "
                        stroke="white"
                        strokeWidth="3"
                        fill="transparent"
                    />
                    <path
                        d="M102 10 L19 65 "
                        stroke="white"
                        strokeWidth="3"
                        fill="transparent"
                    />
                    <path
                        d="M18 12 L95 12 "
                        stroke="white"
                        strokeWidth="3"
                        fill="transparent"
                    />
                    <path
                        d="M18 37 L95 37 "
                        stroke="white"
                        strokeWidth="3"
                        fill="transparent"
                    />
                    <path
                        d="M18 62 L95 62 "
                        stroke="white"
                        strokeWidth="3"
                        fill="transparent"
                    />
                </svg>
                <div className="absolute top-[7px] left-[18px] w-[10px] h-[10px] rounded-full bg-[#FFFFFF]"></div>
                <div className="absolute top-[7px] left-[56px] w-[10px] h-[10px] rounded-full bg-[#FFFFFF]"></div>
                <div className="absolute top-[7px] left-[94px] w-[10px] h-[10px] rounded-full bg-[#FFFFFF]"></div>
                <div className="absolute top-[32px] left-[18px] w-[10px] h-[10px] rounded-full bg-[#FFFFFF]"></div>
                <div className="absolute top-[32px] left-[56px] w-[10px] h-[10px] rounded-full bg-[#FFFFFF]"></div>
                <div className="absolute top-[32px] left-[94px] w-[10px] h-[10px] rounded-full bg-[#FFFFFF]"></div>
                <div className="absolute top-[57px] left-[18px] w-[10px] h-[10px] rounded-full bg-[#FFFFFF]"></div>
                <div className="absolute top-[57px] left-[56px] w-[10px] h-[10px] rounded-full bg-[#FFFFFF]"></div>
                <div className="absolute top-[57px] left-[94px] w-[10px] h-[10px] rounded-full bg-[#FFFFFF]"></div>
            </div>
            <div className="absolute top-[91px] left-[12px] grid grid-cols-2 grid-rows-4 gap-[10px]">
                <div className="relative flex bg-[#000000]/25 h-[34px] w-[180px] rounded-[5px] items-center ">
                    <img src={resolveAssetUrl(options[0].logo)} alt="Ring" className="relative  left-[5px] w-[24px] h-[24px]" />
                    <img src={resolveAssetUrl(options[0].logo)} alt="Ring" className="relative left-[5px] w-[24px] h-[24px]" />
                    <img src={resolveAssetUrl(options[0].logo)} alt="Ring" className="relative left-[5px] w-[24px] h-[24px]" />
                    <span className="relative left-[8px] top-[3px] w-[24px] h-[24px]">=</span>
                    <span className="absolute left-[85px] "
                        style={{ fontFamily: "MyBoldFont", letterSpacing: "0px", fontSize: "16px", color: "gold" }}>{1000000}</span>
                </div>
                <div className="relative flex bg-[#000000]/25 h-[34px] w-[180px] rounded-[5px]  items-center">
                    <img src={resolveAssetUrl(options[1].logo)} alt="Seven" className="relative left-[5px] w-[24px] h-[24px]" />
                    <img src={resolveAssetUrl(options[1].logo)} alt="Seven" className="relative left-[5px] w-[24px] h-[24px]" />
                    <img src={resolveAssetUrl(options[1].logo)} alt="Seven" className="relative left-[5px] w-[24px] h-[24px]" />
                    <span className="relative left-[8px] top-[3px] w-[24px] h-[24px]">=</span>
                    <span className="absolute left-[89px] "
                        style={{ fontFamily: "MyBoldFont", letterSpacing: "1px", fontSize: "16px", color: "gold" }}>{300000}</span>
                </div>
                <div className="relative flex bg-[#000000]/25 h-[34px] w-[180px] rounded-[5px] items-center">
                    <img src={resolveAssetUrl(options[2].logo)} alt="Diamond" className="relative left-[5px] w-[24px] h-[24px]" />
                    <img src={resolveAssetUrl(options[2].logo)} alt="Diamond" className="relative left-[5px] w-[24px] h-[24px]" />
                    <img src={resolveAssetUrl(options[2].logo)} alt="Diamond" className="relative left-[5px] w-[24px] h-[24px]" />
                    <span className="relative left-[8px] top-[3px] w-[24px] h-[24px]">=</span>
                    <span className="absolute left-[85px] "
                        style={{ fontFamily: "MyBoldFont", letterSpacing: "2px", fontSize: "16px", color: "gold" }}>{100000}</span>
                </div>
                <div className="relative flex bg-[#000000]/25 h-[34px] w-[180px] rounded-[5px] items-center">
                    <img src={resolveAssetUrl(options[3].logo)} alt="Watermelon" className="relative left-[5px] w-[24px] h-[24px]" />
                    <img src={resolveAssetUrl(options[3].logo)} alt="Watermelon" className="relative left-[5px] w-[24px] h-[24px]" />
                    <img src={resolveAssetUrl(options[3].logo)} alt="Watermelon" className="relative left-[5px] w-[24px] h-[24px]" />
                    <span className="relative left-[8px] top-[3px] w-[24px] h-[24px]">=</span>
                    <span className="absolute left-[90px] "
                        style={{ fontFamily: "MyBoldFont", letterSpacing: "3px", fontSize: "16px", color: "gold" }}>{50000}</span>
                </div>
                <div className="relative flex bg-[#000000]/25 h-[34px] w-[180px] rounded-[5px] items-center">
                    <img src={resolveAssetUrl(options[6].logo)} alt="Grape" className="relative left-[5px] w-[24px] h-[24px]" />
                    <img src={resolveAssetUrl(options[6].logo)} alt="Grape" className="relative left-[5px] w-[24px] h-[24px]" />
                    <img src={resolveAssetUrl(options[6].logo)} alt="Grape" className="relative left-[5px] w-[24px] h-[24px]" />
                    <span className="relative left-[8px] top-[3px] w-[24px] h-[24px]">=</span>
                    <span className="absolute left-[90px] "
                        style={{ fontFamily: "MyBoldFont", letterSpacing: "3px", fontSize: "16px", color: "gold" }}>{30000}</span>
                </div>
                <div className="relative flex bg-[#000000]/25 h-[34px] w-[180px] rounded-[5px] items-center">
                    <img src={resolveAssetUrl(options[5].logo)} alt="Peach" className="relative left-[5px] w-[24px] h-[24px]" />
                    <img src={resolveAssetUrl(options[5].logo)} alt="Peach" className="relative left-[5px] w-[24px] h-[24px]" />
                    <img src={resolveAssetUrl(options[5].logo)} alt="Peach" className="relative left-[5px] w-[24px] h-[24px]" />
                    <span className="relative left-[8px] top-[3px] w-[24px] h-[24px]">=</span>
                    <span className="absolute left-[90px] "
                        style={{ fontFamily: "MyBoldFont", letterSpacing: "3px", fontSize: "16px", color: "gold" }}>{15000}</span>
                </div>
                <div className="relative flex bg-[#000000]/25 h-[34px] w-[180px] rounded-[5px] items-center">
                    <img src={resolveAssetUrl(options[4].logo)} alt="Cherry" className="relative left-[5px] w-[24px] h-[24px]" />
                    <img src={resolveAssetUrl(options[4].logo)} alt="Cherry" className="relative left-[5px] w-[24px] h-[24px]" />
                    <img src={resolveAssetUrl(options[4].logo)} alt="Cherry" className="relative left-[5px] w-[24px] h-[24px]" />
                    <span className="relative left-[8px] top-[3px] w-[24px] h-[24px]">=</span>
                    <span className="absolute left-[95px] "
                        style={{ fontFamily: "MyBoldFont", letterSpacing: "3px", fontSize: "16px", color: "gold" }}>{5000}</span>
                </div>
                <div className="relative flex bg-[#000000]/25 h-[34px] w-[180px] rounded-[5px] items-center">
                    <img src={resolveAssetUrl(options[4].logo)} alt="Cherry" className="relative left-[5px] w-[24px] h-[24px]" />
                    <img src={resolveAssetUrl(options[4].logo)} alt="Cherry" className="relative left-[5px] w-[24px] h-[24px]" />
                    <div className="relative left-[5px] w-[24px] h-[24px] bg-[#FFFFFF]/20 font-[#FFFFFF] text-[7px] text-white pl-[4px] content-center">ANY</div>
                    <span className="relative left-[8px] top-[3px] w-[24px] h-[24px]">=</span>
                    <span className="absolute left-[95px] "
                        style={{ fontFamily: "MyBoldFont", letterSpacing: "3px", fontSize: "16px", color: "gold" }}>{5000}</span>
                </div>
            </div>
        </div >
    )
}