import styles from "../../resources/style/TextTypeMessageBar.module.css"
import {selectTextTypeMessage, useSelector} from "../../lib/redux";

export function TextTypeMessageBar() {
    const textTypeMessage = useSelector(selectTextTypeMessage);

    return (
        <div className={styles.textTypeMessageBar}>
            <div className={styles.message}>{textTypeMessage}</div>
        </div>
    )
}