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
    hasMultiCharRepresentation: boolean,
    isActive: boolean,
    onClickHandler: (id: string) => void,
    stats: CharStat | null,
    errorThreshold: number,
}

export function CharacterBarChar(
    {
        id,
        displayString,
        charClass,
        hasMultiCharRepresentation,
        isActive,
        onClickHandler,
        stats,
        errorThreshold
    }: CharacterBarCharProps) {

    const elementId = `character-bar-element-${id}`;
    const [isHovering, setIsHovering] = useState(false);

    let tooltipHtml;
    let styleNumPadChar = "";
    let styleMultiChar = "";
    let styleHighErrorRate = "";
    let speedColor = "rgba(0,0,0,0)";
    let displayedSpeed = 0;

    if (hasMultiCharRepresentation) {
        styleMultiChar = styles.multiChar;
    }

    if (charClass === 'NUMPAD') {
        styleNumPadChar = styles.numPadChar;
    }

    if (stats) {

        if (stats.hitRate < errorThreshold) {
            styleHighErrorRate = styles.highErrorRate;
        }

        const speedInWordsPerMinute = Constants.MILLISECONDS_PER_MINUTE / Constants.STANDARD_WORD_LENGTH / stats.avgDuration;
        displayedSpeed = Math.min(speedInWordsPerMinute, Constants.TARGET_SPEED_IN_WORDS_PER_MINUTE) / Constants.TARGET_SPEED_IN_WORDS_PER_MINUTE * 100;
        const h = (displayedSpeed / Constants.TARGET_SPEED_IN_WORDS_PER_MINUTE) * 0.18;
        const hsv = hsvToRgb(h, 0.9, 0.9);
        speedColor = rgbToHex(...hsv);

        tooltipHtml = <>
            <div>Char: {id}</div>
            <div>WPM: {speedInWordsPerMinute.toFixed(2)}</div>
            <div>Hit-Rate: {(stats.hitRate * 100).toFixed(2)}%</div>
            <div>Count: {stats.count}</div>
        </>;

    } else {

        tooltipHtml = <>
            <div>Char: {id}</div>
            <div>no data yet</div>
        </>;

    }

    return (
        <span
            id={elementId}
            className={`${styles.char}  ${styleHighErrorRate} ${styleMultiChar}  ${styleNumPadChar} ${isActive ? styles.active : ''}`}
            onClick={() => onClickHandler(id)}
            onMouseOver={() => setIsHovering(true)}
            onMouseOut={() => setIsHovering(false)}
        >
            {displayString === ' ' ? '␣' : displayString}
            <span className={styles.speedIndicator}
                  style={{backgroundColor: speedColor, width: Math.min(displayedSpeed, 100) + '%'}}>
                  <Tooltip
                      innerHtml={tooltipHtml}
                      isVisible={isHovering}
                  />
            </span>
        </span>
    )

}