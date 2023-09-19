export interface CharStat {
    id: string,
    count: number,
    misses: number,
    avgDuration: number,
    hits: number,
    hitRate: number,
}

export interface Lesson {
    id: number,
    name: string,
    parameter: string,
    type: string
}

export interface Character {
    id: string,
    characters: string,
    class: string,
    char_effect: string,
    display_string: null | string,
    has_uppercase: number,
    is_dead_key: number,
    modifier_altgr: number,
    modifier_shift: number
}

export interface TypeTestSettings {
    error_threshold: number
}

export interface TypingTestState {
    lessons: Array<Lesson>,
    activeLesson: Lesson["name"],
    activeChars: Array<string>,
    charStats: Array<CharStat>,
    characters: Array<Character>
    settings: TypeTestSettings,
    text: string,
    textTypeMessage: string,
    textExerciseChar: string,
    testResultStats: TestResultStats | null
}

export interface CharResult {
    id: string,
    duration: number,
    isUppercase: boolean
    error: boolean
}

export interface TestResult {
    startTime: number,
    endTime: number,
    charResults: Array<CharResult>
}

export interface TestResultStats {
    duration: number,
    wordsPerMinute: number,
    typedCorrectlyQuote: number,
    charsCount: number,
    errorCount: number,
    exerciseCharStats: ExerciseCharStats | null
}

export interface ExerciseCharStats {
    exerciseChar: string,
    wordsPerMinute: number,
    typedCorrectlyQuote: number,
    charsCount: number,
    errorCount: number,
}

export interface ActionPayloadSetActivityOfCharClass {
    charClass: string,
    activate: boolean
}

export interface TextResponseData {
    text: string,
    textExerciseChar: string,
    textTypeMessage: string,
}