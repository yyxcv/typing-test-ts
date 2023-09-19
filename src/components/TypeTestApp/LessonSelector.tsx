import styles from '../../resources/style/LessonSelector.module.css'
import {FormEvent, RefObject} from "react";
import {selectActiveLesson, selectLessons, typingTestSlice, useDispatch, useSelector} from "../../lib/redux";
import {fetchText} from "../../lib/redux/slices/typingTest/thunks";

interface LessonSelectorProps {
    inputDetectorRef: RefObject<HTMLInputElement>
}

export function LessonSelector({inputDetectorRef}: LessonSelectorProps) {

    const dispatch = useDispatch();
    const lessons = useSelector(selectLessons);
    const activeLesson = useSelector(selectActiveLesson);

    function onLessonChange(e: FormEvent<HTMLSelectElement>) {
        dispatch(typingTestSlice.actions.setActiveLesson(e.currentTarget.value));
        dispatch(fetchText());
        if (inputDetectorRef.current) {
            inputDetectorRef.current.focus();
        }
    }

    return (
        <div className={styles.lessonSelector}>
            <div>
                <span>Lesson</span>
                <select onChange={onLessonChange} value={activeLesson}>
                    {lessons.map(lesson => {
                        return <option value={lesson.name} key={lesson.name}>{lesson.name}</option>;
                    })}
                </select>
            </div>
        </div>
    )

}