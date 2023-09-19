import {FocusEvent, FormEvent, KeyboardEvent, RefObject, useEffect, useRef, useState} from "react";
import {TextDisplay} from "./TextDisplay";
import {InputDetector} from "./InputDetector";
import styles from "../../resources/style/TypeTest.module.css"
import {CharResult, selectActiveChars, selectText, TestResult, useDispatch, useSelector} from "../../lib/redux";
import useCharLookup from "../../hooks/useCharLookup";
import {fetchText, saveTest} from "../../lib/redux/slices/typingTest/thunks";

interface TypeTestProps {
    inputDetectorRef: RefObject<HTMLInputElement>
}

class RunState {
    static readonly INITIALIZED = new RunState('INITIALIZED', 'initialized');
    static readonly RUNNING = new RunState('RUNNING', 'running');
    static readonly PAUSED = new RunState('PAUSED', 'paused');
    static readonly ENDED = new RunState('ENDED', 'ended');

    private constructor(private readonly key: string, public readonly value: any) {
    }

    toString() {
        return this.key;
    }
}


export function TypeTest({inputDetectorRef}: TypeTestProps) {

    const specialModifierIds = ['ShiftLeft', 'ShiftRight', 'Alt', 'ControlLeft', 'AltGraph', 'CapsLock'];

    const dispatch = useDispatch();
    const charLookup = useCharLookup();
    const text = useSelector(selectText);

    //state relevant for results
    const [charStatsArray, setCharStatsArray] = useState<Uint32Array>(new Uint32Array(0));
    const [upperCaseTimingErrorArray, setUpperCaseTimingErrorArray] = useState<Array<null | number>>([]);
    const [startTime, setStartTime] = useState<number>(0);
    const [endTime, setEndTime] = useState<number>(0);
    const [runState, setRunState] = useState<RunState>(RunState.INITIALIZED.value);

    //current runtime state
    const [indexOfNextChar, setIndexOfNextChar] = useState<number>(0);
    const [errorCharBacklog, setErrorCharBacklog] = useState<string>("");
    const [currentCharHadError, setCurrentCharHadError] = useState<boolean>(false);
    const [lastKeyTime, setLastKeyTime] = useState<number>(0)
    const [hasFocus, setFocus] = useState<boolean>(true);
    const testAreaRef = useRef<HTMLDivElement | null>(null);
    const activeChars = useSelector(selectActiveChars);
    const [upperCaseTimer, setUpperCaseTimer] = useState<number>(0);


    const onTestEnded = async function (testResult: TestResult) {
        dispatch(saveTest(testResult)).then(() => {
            dispatch(fetchText());
        });
    }

    useEffect(() => {
        setIndexOfNextChar(0);
        setErrorCharBacklog("");
        setCurrentCharHadError(false);
        setLastKeyTime(0);
        setRunState(RunState.INITIALIZED.value);
        setStartTime(0);
        setEndTime(0);
        setCharStatsArray(new Uint32Array(text.length * 2));
        setUpperCaseTimingErrorArray(new Array(text.length).fill(null));
    }, [text]);

    //pass the result if test has ended
    useEffect(() => {
        if (runState === RunState.ENDED.value) {
            onTestEnded({startTime, endTime, charResults: expandCharStatsArray()})
        }
    }, [runState]);


    function expandCharStatsArray(): Array<CharResult> {
        const charResults = Array(text.length);
        for (let i = 0; i < text.length; i++) {
            //TODO: make that clearer
            charResults[i] = {
                id: charLookup.idByChar(text[i]),
                duration: charStatsArray[i * 2],
                error: (charStatsArray[i * 2 + 1] & 1) === 1,
                isUpperCase: (charStatsArray[i * 2 + 1] & (1 << 1)) === 1,
            }
        }
        return charResults;
    }

    function handleCorrectTypedChar(typedChar: string) {
        const now = Date.now();
        //console.log(`handleCorrectTypedChar (1): correct typed char '${typedChar}'`);
        //console.log(`handleCorrectTypedChar (2): hadError: '${currentCharHadError}`);
        switch (runState) {
            case RunState.INITIALIZED.value:
                setStartTime(now);
                updateCharStatArray(indexOfNextChar, 0, currentCharHadError, charLookup.isUpperCase(typedChar));
                setLastKeyTime(now);
                setRunState(RunState.RUNNING.value)
                break;
            case RunState.RUNNING.value:
                const keyDuration = now - lastKeyTime
                updateCharStatArray(indexOfNextChar, keyDuration, currentCharHadError, charLookup.isUpperCase(typedChar));
                setLastKeyTime(now);
                break;
            case RunState.PAUSED.value:
            case RunState.ENDED.value:
                return;
            default:
                throw new Error(`unknown state '${runState}'`)
        }

        //next char
        setCurrentCharHadError(false);
        setIndexOfNextChar(indexOfNextChar + 1)

        //end the test
        if (indexOfNextChar + 1 >= text.length) {
            setEndTime(now);
            setRunState(RunState.ENDED.value)
        }
    }

    function updateCharStatArray(i: number, duration: number, hasError: boolean, isUppercase: boolean) {
        const newCharStatArray = new Uint32Array(text.length * 2);
        const flags = ((hasError ? 1 : 0) | (isUppercase ? 1 << 1 : 0))
        newCharStatArray.set(charStatsArray);
        newCharStatArray[i * 2] = duration;
        newCharStatArray[i * 2 + 1] = flags;
        setCharStatsArray(newCharStatArray);
    }

    function handleWrongTypedChar(typedChar: string) {
        //console.log(`handleWrongTypedChar (1): wrong typed char '${typedChar}'`)
        setCurrentCharHadError(true);
        setErrorCharBacklog(errorCharBacklog + typedChar)
        //console.log(`handleWrongTypedChar (2): currentCharHadError: ${currentCharHadError}, errorCharBacklog: ${errorCharBacklog}`)
    }

    function inputHandler(e: FormEvent<HTMLInputElement>) {
        const typedChar = e.currentTarget.value;
        e.currentTarget.value = "";
        setCharTyped(typedChar);
    }

    function setCharTyped(typedChar: string) {
        if (indexOfNextChar < text.length) {
            const nextChar = text[indexOfNextChar];
            if (errorCharBacklog.length === 0 && nextChar === typedChar) {
                handleCorrectTypedChar(typedChar);
            } else {
                handleWrongTypedChar(typedChar);
            }
        }
    }

    function keyUpHandler(e: KeyboardEvent<HTMLInputElement>) {

        if (indexOfNextChar < text.length) {
            const curChar = text[indexOfNextChar - 1];
            const nextChar = text[indexOfNextChar];
            // if (
            //     curChar && nextChar &&
            //     charLookup.charIsTypedWithModifierShift(curChar) &&
            //     !charLookup.charIsTypedWithModifierShift(nextChar)
            // ) {
            if (
                curChar && nextChar &&
                charLookup.charIsTypedWithModifierShift(curChar)
            ) {
                const releasedKey = e.key;
                //key was released
                if (curChar === releasedKey) {
                    setUpperCaseTimer(Date.now());
                }
                //shift was released
                if (e.key === "Shift" && upperCaseTimer !== 0) {
                    const delta = Date.now() - upperCaseTimer;
                    console.log(`'${e.code}' was released ${delta}ms after '${curChar}'`)
                    const copy = [...upperCaseTimingErrorArray];
                    copy[indexOfNextChar - 1] = delta;
                    setUpperCaseTimingErrorArray(copy);
                    setUpperCaseTimer(0);
                }
            } else {
                setUpperCaseTimer(0);
            }
        } else {
            setUpperCaseTimer(0);
        }

    }

    //handle error backlog deletion if backspace is pressed
    //handle typing of control, modifier and numpad keys
    //all other chars do not set the local variable 'handleCharTyped' local variable and  are handled in 'inputHandler'
    function keyDownHandler(e: KeyboardEvent<HTMLInputElement>) {

        //in order to detect 'Win' key events and preventing the default action,
        // the user has to map 'WinLeft' key to 'F13' and 'WinRight' to 'F14' using Windows Power Toys
        //after that a 'Win' key down come in here as 'Unidentified'
        let key;
        switch (e.key) {
            case 'F13':
                key = 'WinLeft';
                break;
            case 'F14':
                key = 'WinRight';
                break;
            case 'F15':
                key = 'Alt';
                break;
            case 'F16':
                key = 'PrintScreen';
                break;
            case 'F17':
                key = 'NumLock';
                break;
            case 'Shift':   //'ShiftLeft' or 'ShiftRight'
            case 'Control': //'ControlLeft' or 'ControlRight'
                key = e.code;
                break;
            default:
                if (e.code.startsWith("Numpad")) {
                    key = e.code;
                } else {
                    key = e.key;
                }
        }

        const charRecord = charLookup.recordById(key);
        let handleCharTyped = false;

        if (charRecord && ['CONTROL', 'MODIFIER', 'NUMPAD'].includes(charRecord.class) && !e.repeat && activeChars.includes(key)) {
            //recognise some modifier keys only if the next char is that key
            //otherwise some key combinations are not typeable anymore
            if (specialModifierIds.includes(key)) {
                const char = charLookup.representativeById(key);
                if (indexOfNextChar < text.length && char === text[indexOfNextChar]) {
                    handleCharTyped = true;
                }
            } else {
                handleCharTyped = true;
            }
        } else if (e.key === "Backspace") {
            if (errorCharBacklog.length > 0) {
                setErrorCharBacklog(errorCharBacklog.substring(0, errorCharBacklog.length - 1))
            }
        }

        if (handleCharTyped) {
            e.preventDefault();
            e.stopPropagation();
            setCharTyped(charRecord.characters[0]);
        }
    }

    function handleInputDetectorFocus() {
        setFocus(true);
    }

    function handleInputDetectorBlur(e: FocusEvent<HTMLInputElement>) {
        if (e.relatedTarget && e.relatedTarget === testAreaRef.current) {
            return;
        }
        setFocus(false);
    }

    function clickHandler() {
        if (inputDetectorRef.current) {
            inputDetectorRef.current.focus()
        }
    }

    return (<div
        ref={testAreaRef}
        tabIndex={0}
        className={`${styles.testArea} ${hasFocus ? styles.hasFocus : ''}`}
        onMouseDown={clickHandler}
        onMouseUp={clickHandler}
        onContextMenu={(e) => {
            e.preventDefault()
        }}
    >
        <TextDisplay
            text={text}
            indexOfNextChar={indexOfNextChar}
            errorCharBacklog={errorCharBacklog}
            upperCaseTimingErrorArray={upperCaseTimingErrorArray}
        />
        <InputDetector
            onInput={inputHandler}
            onKeyUp={keyUpHandler}
            onKeyDown={keyDownHandler}
            onFocus={handleInputDetectorFocus}
            onBlur={handleInputDetectorBlur}
            inputDetectorRef={inputDetectorRef}
        />
    </div>);
}