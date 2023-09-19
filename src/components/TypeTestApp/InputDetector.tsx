import styles from "../../resources/style/InputDetector.module.css"
import {FocusEvent, FormEvent, KeyboardEvent, RefObject} from "react";

interface InputDetectorProps {
    onInput: (e: FormEvent<HTMLInputElement>) => void,
    onKeyUp: (e: KeyboardEvent<HTMLInputElement>) => void,
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void,
    onBlur: (e: FocusEvent<HTMLInputElement>) => void,
    onFocus: () => void,
    inputDetectorRef: RefObject<HTMLInputElement>,
}

export function InputDetector({onInput, onKeyDown, onKeyUp, onBlur, onFocus, inputDetectorRef}: InputDetectorProps) {

    return (
        <input type="text"
               onInput={onInput}
               onKeyUp={onKeyUp}
               onKeyDown={onKeyDown}
               onBlur={onBlur}
               onFocus={onFocus}
               className={styles.hidden}
               ref={inputDetectorRef}
               autoFocus
        />
    );
}