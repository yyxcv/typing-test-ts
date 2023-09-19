import styles from "../../resources/style/TextDisplay.module.css";
import useCharLookup from "../../hooks/useCharLookup";

interface ErrorBacklogProps {
    backlog: string,
    styleNumPadChar: string,
}

export function ErrorBacklog({backlog, styleNumPadChar}: ErrorBacklogProps) {
    const charLookup = useCharLookup();

    if (backlog.length === 0) {
        return null;
    }

    return (
        <span className={`${styles.errorBacklog} ${styleNumPadChar}`}>
            {backlog.split('').map((char, i) => {
                const displayChar = charLookup.displayStringByChar(char).replaceAll(" ", "␣");
                const styleControlChar = charLookup.hasMultiCharRepresentation(char) ? styles.controlCharErrorBacklog : '';

                return <span className={styleControlChar} key={i}>{displayChar}</span>
            })
            }
        </span>
    )

}