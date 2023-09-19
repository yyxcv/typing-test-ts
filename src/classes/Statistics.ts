import {TestResult, TestResultStats} from "@/src/lib/redux";
import Constants from "./Constants";




class Statistics {

    static singleTestStatistic(r: TestResult, exerciseChar: string) {
        const duration = r.endTime - r.startTime;
        const charsCount = r.charResults.length;
        const errorCount = r.charResults.filter(char => char.error).length;
        const wordsPerMinute = charsCount === 0 ? 0 : Constants.MILLISECONDS_PER_MINUTE / Constants.STANDARD_WORD_LENGTH / (duration / charsCount);
        const typedCorrectlyQuote = charsCount === 0 ? 1 : 1 - (errorCount / charsCount);


        let stats: TestResultStats = {
            duration: duration,
            charsCount: charsCount,
            errorCount: errorCount,
            wordsPerMinute: wordsPerMinute,
            typedCorrectlyQuote: typedCorrectlyQuote,
            exerciseCharStats: null,
        }

        const exStats = r.charResults.filter(char => char.id === exerciseChar);
        if (exStats.length > 0) {

            const eCharCount = exStats.length;
            const eErrorCount = exStats.filter(char => char.error).length;
            const eDuration = exStats.reduce((acc, el) => acc + el.duration, 0);
            const eWordsPerMinute = eCharCount === 0 ? 0 : Constants.MILLISECONDS_PER_MINUTE / Constants.STANDARD_WORD_LENGTH / (eDuration / eCharCount);
            const eTypedCorrectlyQuote = eCharCount === 0 ? 1 : 1 - (eErrorCount / eCharCount);

            stats.exerciseCharStats = {
                exerciseChar: exerciseChar,
                charsCount: eCharCount,
                errorCount: eErrorCount,
                wordsPerMinute: eWordsPerMinute,
                typedCorrectlyQuote: eTypedCorrectlyQuote,
            };
        }

        return stats;
    }

}

export default Statistics;