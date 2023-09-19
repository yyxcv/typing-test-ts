import styles from '../../resources/style/LessonSelector.module.css'
import {selectActiveLesson, selectLessons, typingTestSlice, useDispatch, useSelector} from "../../lib/redux";
import {FormEvent, RefObject} from "react";
import {fetchText} from "../../lib/redux/slices/typingTest/thunks";

interface LessonSelectorProps {
    inputDetectorRef: RefObject<HTMLInputElement>
}

export function LessonSelector({inputDetectorRef}: LessonSelectorProps) {

    const dispatch = useDispatch();
    const lessons = useSelector(selectLessons);
    const activeLesson = useSelector(selectActiveLesson);


    const onLessonChange = async function (newLessonName: string) {
        dispatch(typingTestSlice.actions.setActiveLesson(newLessonName));
        dispatch(fetchText());
        if (inputDetectorRef.current) {
            inputDetectorRef.current.focus();
        }
    }

    function onChangeHandler(e: FormEvent<HTMLSelectElement>) {
        onLessonChange(e.currentTarget.value)
    }

    return (
        <div className={styles.lessonSelector}>
            <div>
                <span>Lesson</span>
                <select onChange={onChangeHandler} value={activeLesson}>
                    {lessons.map(lesson => {
                        return <option value={lesson.name} key={lesson.name}>{lesson.name}</option>;
                    })}
                </select>
            </div>
        </div>
    )

}