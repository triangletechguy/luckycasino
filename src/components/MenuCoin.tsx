import { ButtonMenu, PlusIcon } from "./ButtonMenu";
import { getAssetUrl, GAME_ASSETS, } from "../config/gameconfig";
import { useGame } from "../hooks/useGameHook";

type MenuCoinProps = {
    onOpenModal: (modal: string) => void;
    current: number | null;
};

function parseBalance(value: unknown): number {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    if (typeof value === "string") {
        const normalized = value.replace(/[^0-9.-]/g, "");
        const parsed = Number.parseFloat(normalized);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
}

export default function MenuCoin({ onOpenModal, current, }: MenuCoinProps) {
    const { playerInfo, } = useGame();
    const balance = current !== null ? current : parseBalance(playerInfo?.balance);

    return (
        <div className="flex h-6 items-center bg-gradient-to-tr from-[#34596A] to-[#66AFD0] p-[2px]">
            <div className="relative flex h-5 w-[114px] items-center bg-[#2D1F76] pr-7">
                <img src={getAssetUrl(GAME_ASSETS.diamond)} className="ml-[2px] h-5 shrink-0" alt="" />
                <span className="min-w-0 flex-1 truncate text-right text-[12px] font-bold leading-5">
                    {balance}
                </span>
                <div className="absolute right-[-12px] top-1/2 -translate-y-1/2">
                    <ButtonMenu
                        icon={<PlusIcon />}
                        background={"#2D1F76"}
                        borderColor="none"
                        borderWidth="0px"
                        onClick={() => onOpenModal("recharge")}
                    />
                </div>
            </div>

        </div >
    )
}
