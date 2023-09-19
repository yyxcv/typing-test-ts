import {CharacterBarChar} from "./CharacterBarChar";
import styles from "../../resources/style/CharacterBar.module.css";
import {selectActiveChars, selectCharStats, selectErrorThreshold, useDispatch, useSelector} from "../../lib/redux";
import {toggleCharActivityAndPushToServer} from "../../lib/redux/slices/typingTest/thunks";
import useCharLookup from "../../hooks/useCharLookup";

export function CharacterBar() {

    const charLookup = useCharLookup();
    const dispatch = useDispatch();
    const charStats = useSelector(selectCharStats);
    const errorThreshold = useSelector(selectErrorThreshold);
    const activeChars = useSelector(selectActiveChars);

    function toggleCharActivity(id: string) {
        dispatch(toggleCharActivityAndPushToServer(id));
    }


    return (
        <div className={styles.characterBar}>
            {charLookup.records().map(item => {
                const statsArray = charStats.filter(it => it.id === item.id);
                const stats = statsArray.length > 0 ? statsArray[0] : null;
                const displayString = charLookup.displayStringByChar(item.characters[0]);

                return (
                    <CharacterBarChar
                        id={item.id}
                        key={item.id}
                        charClass={item.class}
                        isActive={activeChars.includes(item.id)}
                        hasMultiCharStringRepresentation={charLookup.hasMultiCharStringRepresentation(item.characters[0])}
                        displayString={displayString}
                        onClickHandler={toggleCharActivity}
                        stats={stats}
                        errorThreshold={errorThreshold}
                    />
                )
            })}
        </div>
    )
}