/* Core */
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {
    ActionPayloadSetActivityOfCharClass,
    Character, CharStat,
    Lesson, TestResultStats,
    TextResponseData,
    TypingTestState
} from "../../../redux";

/* Instruments */


const initialState: TypingTestState = {
    lessons: [],
    activeLesson: "standard",
    activeChars: [],
    charStats: [],
    characters: [],
    settings: {error_threshold: 0.95},
    text: "",
    textTypeMessage: "",
    textExerciseChar: "",
    testResultStats: null,
}

export const typingTestSlice = createSlice({
    name: 'typingTest',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        initialize: (state, action: PayloadAction<TypingTestState>) => {
            return {...state, ...action.payload};
        },
        setTextData: (state, action: PayloadAction<TextResponseData>) => {
            state.text = action.payload.text;
            state.textExerciseChar = action.payload.textExerciseChar;
            state.textTypeMessage = action.payload.textTypeMessage;
        },
        setActiveLesson: (state, action: PayloadAction<Lesson["type"]>) => {
            state.activeLesson = action.payload;
        },
        setCharsStatistic: (state, action: PayloadAction<Array<CharStat>>) => {
            state.charStats = action.payload;
        },
        setTestResultStatistic: (state, action: PayloadAction<TestResultStats>) => {
            state.testResultStats = action.payload;
        },
        toggleCharActivity: (state, action: PayloadAction<Character["id"]>) => {
            if (state.activeChars.includes(action.payload)) {
                state.activeChars = state.activeChars.filter(char => char !== action.payload);
            } else {
                state.activeChars.push(action.payload);
            }
        },
        setCharActivityOfCharClass: (state, action: PayloadAction<ActionPayloadSetActivityOfCharClass>) => {
            let newActiveChars;
            const charIds = state.characters.filter(char => char.class === action.payload.charClass).map(char => char.id);
            if (action.payload.activate) {
                newActiveChars = Array.from(new Set(state.activeChars.concat(charIds)));
            } else {
                const sub = new Set(charIds);
                newActiveChars = state.activeChars.filter(char => !sub.has(char));
            }
            state.activeChars = newActiveChars;
        }
    },
})