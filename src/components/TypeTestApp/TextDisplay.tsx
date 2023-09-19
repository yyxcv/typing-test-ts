import styles from "../../resources/style/TextDisplay.module.css"
import {ErrorBacklog} from "./ErrorBacklog";
import {hsvToRgb, rgbToHex} from "../../classes/Colors";
import useCharLookup from "../../hooks/useCharLookup";

interface TextDisplayProps {
    text: string,
    indexOfNextChar: number,
    errorCharBacklog: string,
    upperCaseTimingErrorArray: Array<number | null>
}

interface TextCharProps {
    char: string,
    isActive: boolean,
    upperCaseTimingDelta: number | null
}

export function TextDisplay({text, indexOfNextChar, errorCharBacklog, upperCaseTimingErrorArray}: TextDisplayProps) {

    const charLookup = useCharLookup();

    function TextChar({char, isActive, upperCaseTimingDelta}: TextCharProps) {
        const displayChar = charLookup.displayStringByChar(char);
        const charRecord = charLookup.recordByChar(char);
        const styleSpace = char === ' ' ? styles.space : '';
        const styleControlChar = charLookup.hasMultiCharStringRepresentation(char) ? styles.controlChar : '';
        const styleNumPadChar = charRecord.class === 'NUMPAD' ? styles.numPadChar : '';

        let upperCaseTimingSpeedColor = null;
        if (Number.isInteger(upperCaseTimingDelta)) {
            const delta = upperCaseTimingDelta as number
            const minLimit = 0;  //  timingDelta near minLimit will be green
            const maxLimit = 50; //  timingDelta > maxLimit will be red
            const range = maxLimit - minLimit;
            //speedFactor between 0 and 1, 1 = good, 0 = bad
            const speedFactor = 1 - Math.min(Math.max(delta - minLimit, 0), range) / range;
            const h = speedFactor * 0.4;
            const hsv = hsvToRgb(h, 0.9, 0.9);
            upperCaseTimingSpeedColor = rgbToHex(...hsv);
        }

        if (isActive) {
            return (<span
                className={`
                    ${styles.active} 
                    ${styles.char} 
                    ${styleSpace} 
                    ${styleControlChar} 
                    ${styleNumPadChar}
                `}>
                {displayChar}
                <ErrorBacklog
                    backlog={errorCharBacklog}
                    styleNumPadChar={styleNumPadChar}
                />
                </span>)

        } else {
            return (<span
                className={`
                    ${styles.char} 
                    ${styleSpace} 
                    ${styleControlChar} 
                    ${styleNumPadChar}
                `}
                style={upperCaseTimingSpeedColor !== null ? {color: upperCaseTimingSpeedColor} : {}}
            >
                {displayChar}
            </span>)
        }
    }

    return (
        <div>
            <p>{text.split('').map((char, i) => (
                <TextChar char={char}
                          key={i}
                          isActive={i === indexOfNextChar}
                          upperCaseTimingDelta={upperCaseTimingErrorArray[i]}
                ></TextChar>))}</p>
        </div>
    );
}