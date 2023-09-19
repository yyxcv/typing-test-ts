import {
    ReduxThunkAction,
    selectActiveChars,
    selectActiveLesson, selectTextExerciseChar,
    TestResult,
    typingTestApi,
    typingTestSlice
} from "../../";
import Statistics from "../../../../../src/classes/Statistics";


export const toggleCharActivityAndPushToServer =
    (charId: string): ReduxThunkAction =>
        (dispatch, getState) => {
            dispatch(typingTestSlice.actions.toggleCharActivity(charId));
            const activeChars = selectActiveChars(getState());
            dispatch(typingTestApi.endpoints.setActiveChars.initiate(activeChars));
        }


export const saveTest =
    (testResult: TestResult): ReduxThunkAction<Promise<any>> =>
        async (dispatch, getState) => {
            await dispatch(typingTestApi.endpoints.saveTest.initiate(testResult));
            return dispatch(typingTestApi.endpoints.getCharsStatistic.initiate())
                .unwrap()
                .then(async (stats) => {
                    dispatch(typingTestSlice.actions.setCharsStatistic(stats));
                    const exerciseChar = selectTextExerciseChar(getState());
                    dispatch(typingTestSlice.actions.setTestResultStatistic(Statistics.singleTestStatistic(testResult, exerciseChar)));
                });
        }

export const fetchText =
    (): ReduxThunkAction =>
        (dispatch, getState) => {
            const activeLesson = selectActiveLesson(getState());
            dispatch(typingTestApi.endpoints.getText.initiate(activeLesson))
                .unwrap()
                .then((testData) => {
                    dispatch(typingTestSlice.actions.setTextData(testData));
                });
        }