import { ButtonMenu, HistoryIcon, SpeakerHighIcon, SpeakerMuteIcon, QuestionMarkIcon, CloseIcon } from "./ButtonMenu";
import { closeCurrentView } from "../utils/closeCurrentView";

type TopMenuProps = {
    onOpenModal: (modal: string) => void;
    onToggleMusic: () => void;
    isMusicPlaying: boolean;
};

const TopMenu: React.FC<TopMenuProps> = ({ onOpenModal, onToggleMusic, isMusicPlaying }) => {


    return (
        <div className="relative flex gap-[5px]">
            <ButtonMenu
                icon={<HistoryIcon />}
                background={"#2D1F76"}
                borderColor="none"
                borderWidth="0px"
                onClick={() => onOpenModal("history")}
            />

            <ButtonMenu
                borderColor="none"
                borderWidth="0px"
                icon={isMusicPlaying ? <SpeakerHighIcon /> : <SpeakerMuteIcon />}
                background={"#2D1F76"}
                onClick={onToggleMusic}
            />

            <ButtonMenu
                borderColor="none"
                borderWidth="0px"
                icon={<QuestionMarkIcon />}
                background={"#2D1F76"}
                onClick={() => onOpenModal("help")}
            />
            <ButtonMenu
                borderColor="none"
                borderWidth="0px"
                icon={<CloseIcon />}
                background={"#2D1F76"}
                onClick={closeCurrentView}
            />
        </div >
    );
};

export default TopMenu;
