import styles from "../../resources/style/CharacterBar.module.css"
import {hsvToRgb, rgbToHex} from "../../classes/Colors";
import Constants from "../../classes/Constants";
import Tooltip from "../Tooltip";
import {useState} from "react";
import {CharStat} from "@/src/lib/redux";


interface CharacterBarCharProps {
    id: string,
    displayString: string,
    charClass: string,
    hasMultiCharStringRepresentation: boolean,
    isActive: boolean,
    onClickHandler: (id: string) => void,
    stats: CharStat | null,
    errorThreshold: number,
}

export function CharacterBarChar({
                                     id,
                                     displayString,
                                     charClass,
                                     hasMultiCharStringRepresentation,
                                     isActive,
                                     onClickHandler,
                                     stats,
                                     errorThreshold
                                 }: CharacterBarCharProps) {
    let innerHtml;
    let styleHighErrorRate = "";
    let styleNumPadChar = "";
    let styleMultiChar = "";
    let speedColor = "rgba(0,0,0,0)";
    let speed = 0;
    const [isHovering, setIsHovering] = useState(false);

    if (hasMultiCharStringRepresentation) {
        styleMultiChar = styles.multiChar;
    }

    if (charClass === 'NUMPAD') {
        styleNumPadChar = styles.numPadChar;
    }

    if (stats !== null) {
        const hitRate = stats.hitRate * 100;
        const speedInWordsPerMinute = 12000 / stats.avgDuration;

        if (hitRate < errorThreshold * 100) {
            styleHighErrorRate = styles.highErrorRate;
        }

        speed = Math.min(speedInWordsPerMinute, Constants.TARGET_SPEED_IN_WORDS_PER_MINUTE);
        const h = (speed / Constants.TARGET_SPEED_IN_WORDS_PER_MINUTE) * 0.4;
        const hsv = hsvToRgb(h, 0.9, 0.9);
        speedColor = rgbToHex(...hsv);

        innerHtml = <>
            <div>Char: {id}</div>
            <div>WPM: {speedInWordsPerMinute.toFixed(2)}</div>
            <div>Hit-Rate: {hitRate.toFixed(2)}%</div>
            <div>Count: {stats.count}</div>
        </>;
    } else {
        innerHtml = <>
            <div>Char: {id}</div>
            <div>no data yet</div>
        </>;
    }

    const elementId = `character-bar-element-${id}`;

    return (
        <span
            id={elementId}
            className={`${styles.char}  ${styleHighErrorRate} ${styleMultiChar}  ${styleNumPadChar} ${isActive ? styles.active : ''}`}
            onClick={() => onClickHandler(id)}
            onMouseOver={() => setIsHovering(true)}
            onMouseOut={() => setIsHovering(false)}

        >{displayString === ' ' ? '␣' : displayString}
            <span className={styles.speedIndicator}
                  style={{backgroundColor: speedColor, width:  Math.min(speed, 100) + '%'}}>
                  <Tooltip
                      innerHtml={innerHtml}
                      isVisible={isHovering}
                  />
            </span>
        </span>
    )

}