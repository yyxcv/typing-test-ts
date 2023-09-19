import styles from '../../resources/style/TypeResult.module.css';
import {selectTestResultStats, useSelector} from "../../lib/redux";

export function TestResultStats() {

    const stats = useSelector(selectTestResultStats);

    return stats ? (
        <div className={`${styles.results}`}>
            <h4 style={{marginBottom: 0}}>All Chars</h4>
            <div>Words per Minute: {stats.wordsPerMinute.toFixed(2)}</div>
            <div>Typed Correctly: {(stats.typedCorrectlyQuote * 100).toFixed(2)}%</div>
            <div>Chars typed: {stats.charsCount}</div>
            <div>Errors: {stats.errorCount}</div>

            {stats.exerciseCharStats && stats.exerciseCharStats.hasOwnProperty('wordsPerMinute') ?
                (<>
                    <h4 style={{marginBottom: 0}}>Exercise Char: '{stats.exerciseCharStats.exerciseChar}'</h4>
                    <div>Words per Minute: {stats.exerciseCharStats.wordsPerMinute.toFixed(2)}</div>
                    <div>Typed Correctly: {(stats.exerciseCharStats.typedCorrectlyQuote * 100).toFixed(2)}%</div>
                    <div>Chars typed: {stats.exerciseCharStats.charsCount}</div>
                    <div>Errors: {stats.exerciseCharStats.errorCount}</div>
                </>)
                : ''
            }
        </div>
    ) : null;
}