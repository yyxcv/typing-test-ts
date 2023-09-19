/* Instruments */
import type {Character, ReduxState} from '../../../redux'
import {createSelector} from "reselect";

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
//export const selectCount = (state: ReduxState) => state.counter.value


const getCharClass = (_: any, charClass: string) => charClass;

export const selectActiveChars = (state: ReduxState) => state.typingTest.activeChars;
export const selectActiveLesson = (state: ReduxState) => state.typingTest.activeLesson;
export const selectLessons = (state: ReduxState) => state.typingTest.lessons;
export const selectCharacters = (state: ReduxState) => state.typingTest.characters;
export const selectCharStats = (state: ReduxState) => state.typingTest.charStats;
export const selectText = (state: ReduxState) => state.typingTest.text;
export const selectTextTypeMessage = (state: ReduxState) => state.typingTest.textTypeMessage;
export const selectTextExerciseChar = (state: ReduxState) => state.typingTest.textExerciseChar;
export const selectTestResultStats = (state: ReduxState) => state.typingTest.testResultStats;
export const selectErrorThreshold = (state: ReduxState) => state.typingTest.settings.error_threshold;
export const selectCharactersOfClass = createSelector(
    selectCharacters,
    getCharClass,
    (characters: Array<Character>, charClass: string) => characters.filter(char => char.class === charClass)
);