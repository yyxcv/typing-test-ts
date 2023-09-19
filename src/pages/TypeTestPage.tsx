import TypeTestApp from "../components/TypeTestApp/TypeTestApp";
import '../resources/style/Page.css';
import {useEffect, useState} from "react";
import LoadingIndicator from "../components/LoadingIndicator";
import {typingTestSlice, useDispatch, useGetInitialStateQuery} from "../lib/redux";

function TypeTestPage() {

    const dispatch = useDispatch()
    const {data: initialState, error, isLoading, isSuccess} = useGetInitialStateQuery()
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (isSuccess) {
            dispatch(typingTestSlice.actions.initialize(initialState))
            setInitialized(true)
        }
    }, [isSuccess]);

    return (
        <div className="page">
            {!initialized ?
                <LoadingIndicator/> :
                <TypeTestApp/>
            }
        </div>
    );
}

export default TypeTestPage;