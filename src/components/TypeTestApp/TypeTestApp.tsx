import {useRef} from "react";
import '../../resources/style/Page.css';
import {CharacterBar} from "./CharacterBar";
import {LessonSelector} from "./LessonSelector";
import {TestResultStats} from "./TestResultStats"
import {TypeTest} from "./TypeTest";
import {TextTypeMessageBar} from "./TextTypeMessageBar";
import {CharsActivitySwitcher} from "./CharsActivitySwitcher";


function TypeTestApp() {

    const inputDetectorRef = useRef<HTMLInputElement>(null);

    return (<>
        <CharacterBar/>
        <CharsActivitySwitcher charClass={'NUMPAD'}/>
        <CharsActivitySwitcher charClass={'MODIFIER'}/>
        <CharsActivitySwitcher charClass={'CONTROL'}/>
        <LessonSelector inputDetectorRef={inputDetectorRef}/>
        <div className={"page-content-center"}>
            <TypeTest inputDetectorRef={inputDetectorRef}/>
            <TextTypeMessageBar/>
            <TestResultStats/>
        </div>
    </>);

}

export default TypeTestApp;