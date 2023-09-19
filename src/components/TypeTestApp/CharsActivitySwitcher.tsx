import {useEffect, useState} from "react";
import {selectActiveChars, selectCharactersOfClass, typingTestSlice, useDispatch, useSelector} from "../../lib/redux";

export function CharsActivitySwitcher({charClass}: { charClass: string }) {

    const dispatch = useDispatch();
    const activeChars = useSelector(selectActiveChars);
    const charsOfClass = useSelector(state => selectCharactersOfClass(state, charClass));
    const [isOn, setIsOn] = useState(false);

    useEffect(() => {
        const charIdsOfClass = charsOfClass.map(char => char.id);
        setIsOn(charIdsOfClass.reduce((prev, charId) => prev && activeChars.includes(charId), true));
    }, [activeChars, charClass]);

    function onClickHandler() {
        dispatch(typingTestSlice.actions.setCharActivityOfCharClass({charClass, activate: !isOn}));
    }

    return <div
        className={isOn ? "active" : ''}
        onClick={onClickHandler}
    >{charClass}</div>

}