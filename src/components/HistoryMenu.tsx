import { ButtonMenu, CloseIcon } from "./ButtonMenu";
import { RectangleIcon } from "./Assets";
import { GAME_ASSETS, getAssetUrl } from "../config/gameconfig";
import { useGame } from "../hooks/useGameHook";
type HistoryMenuProps = {
    onCloseHistory: () => void;
};
const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const year = String(date.getFullYear()).slice(-2); // last two digits
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};
export default function HistoryMenu({ onCloseHistory }: HistoryMenuProps) {
    const { history } = useGame()


    return (
        <div className="h-[428px] bg-gradient-to-t from-[#120D25] to-[#43308B] w-[343px] rounded-t-[20px]">
            <div className="absolute left-1/2 transform -translate-x-1/2" >
                <RectangleIcon />
            </div>
            <span className="absolute top-[4px] left-1/2 transform -translate-x-1/2 text-[16px] font-bold mt-1">Game Records</span>
            <div className="absolute top-[12px] right-[12px]">
                <ButtonMenu
                    borderColor="none"
                    borderWidth="0px"
                    icon={<CloseIcon />}
                    background={"#2D1F76"}
                    onClick={() => onCloseHistory()}
                />
            </div>
            <div className="absolute w-[302px] h-[371px] top-[57px] left-1/2 -translate-x-1/2 scrollbar-hidden overflow-x-hidden overflow-y-auto">
                {history?.data?.map((element) => (
                    <div key={`history-${element.id}`} className="relative mb-[8px] h-[141px] w-[302px] rounded-[5px]">
                        <div className="absolute h-[22px] w-[302px] bg-[#000000]/25 rounded-t-[5px] px-[6px] flex justify-between">
                            <span className="text-[#c6b6ff]">{element.id}</span>
                            <span className="text-[#c6b6ff]">{formatDateTime(element.created_at)}</span>
                        </div>
                        <div className="absolute top-[23px] h-[117px] w-[302px] bg-[#000000]/25 rounded-b-[5px] px-[6px] ">
                            <div className="flex items-center">
                                <span className="text-[#c6b6ff]">winning pattern : </span>
                                {element.round_result.set_A[0].option_id === element.round_result.set_B[1].option_id
                                    && element.round_result.set_A[0].option_id === element.round_result.set_C[2].option_id
                                    && <hr className="h-[5px] bg-gradient-to-t from-[#fadc58] via-[#ffffff] to-[#fadc58] border-0 w-[35px]  ml-[5px]" />}
                                {element.round_result.set_C[0].option_id === element.round_result.set_B[1].option_id
                                    && element.round_result.set_C[0].option_id === element.round_result.set_A[2].option_id
                                    && <hr className="h-[5px] bg-gradient-to-t from-[#cf68ff] via-[#ffffff] to-[#cf68ff] border-0 w-[35px]  ml-[5px]" />}
                                {element.round_result.set_A[0].option_id === element.round_result.set_A[1].option_id
                                    && element.round_result.set_A[0].option_id === element.round_result.set_A[2].option_id
                                    && <hr className="h-[5px] bg-gradient-to-t from-[#357ec4] via-[#ffffff] to-[#357ec4] border-0 w-[35px]  ml-[5px]" />}
                                {element.round_result.set_B[0].option_id === element.round_result.set_B[1].option_id
                                    && element.round_result.set_B[0].option_id === element.round_result.set_B[2].option_id
                                    && <hr className="h-[5px] bg-gradient-to-t from-[#e63b3b] via-[#ffffff] to-[#e63b3b] border-0 w-[35px]  ml-[5px]" />}
                                {element.round_result.set_C[0].option_id === element.round_result.set_C[1].option_id
                                    && element.round_result.set_C[0].option_id === element.round_result.set_C[2].option_id
                                    && <hr className="h-[5px] bg-gradient-to-t from-[#4bdf64] via-[#ffffff] to-[#4bdf64] border-0 w-[35px]  ml-[5px]" />}
                            </div>
                            <div className="flex text-[#c6b6ff]">
                                <span className="text-[#c6b6ff]">Bet : </span>
                                <img src={getAssetUrl(GAME_ASSETS.diamond)} alt="coin" className="mt-[2px] w-[15px] h-[15px]" />
                                <span className="text-[#c6b6ff]">{Number(element.bet_amount)}</span>
                            </div>
                            <div className="flex ">
                                <span className="text-[#c6b6ff]">Win Diamonds : </span>
                                <img src={getAssetUrl(GAME_ASSETS.diamond)} alt="coin" className="mt-[2px] w-[15px] h-[15px]" />
                                <span className="text-[#c6b6ff]">{Number(element.win_amount)}</span>
                            </div>
                            <div>
                                <span className="text-[#c6b6ff]">Diamond Balance : </span>
                            </div>
                            <div className="m-[10px] flex">
                                <img src={getAssetUrl(GAME_ASSETS.diamond)} alt="coin" className="mt-[2px] w-[15px] h-[15px]" />
                                <span className="text-[#c6b6ff]">{`${Number(element.post_balance)} => ${Number(element.current_balance)}`}</span>
                            </div>
                        </div >
                    </div >
                ))}
            </div>
        </div >
    )
}