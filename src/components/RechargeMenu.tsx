import { useGame } from "../hooks/useGameHook";

type RechargeMenuProps = {
    onCloseRechargeModal: () => void;
};

export default function RechargeMenu({ onCloseRechargeModal }: RechargeMenuProps) {
    const { handleRechargeRedirect, rechargeUrl } = useGame();
    return (
        <div className="h-[146px] z-50 bg-gradient-to-t from-[#7C00D5] to-[#5028C1] w-[393px] rounded-t-[20px]">
            <span className="absolute flex left-[94px] top-[30px] text-[15px] font-bold">Are you want to Recharge now?</span>
            <div className="absolute top-[79px] h-fit w-full justify-center flex gap-[20px]">
                <button className="w-[157px] h-[31px] rounded-[6px]  bg-gradient-to-t from-[#b87036]  via-[#fdd03c] to-[#fdf3ba]  text-[#A04800] font-bold"
                    onClick={rechargeUrl ? () => { window.location.href = rechargeUrl; } : () => { handleRechargeRedirect(); }}>
                    Confirm
                </button>
                <button className="w-[157px] h-[31px] rounded-[6px]  bg-gradient-to-t from-[#891ac1]  to-[#fdf3ba]  text-[#27598e] font-bold"
                    onClick={onCloseRechargeModal}>
                    Cancel
                </button>
            </div>
        </div>
    )
}