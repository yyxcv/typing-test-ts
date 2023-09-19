/* Instruments */
import {typingTestSlice, typingTestApi} from './slices'

export const reducer = {
    [typingTestApi.reducerPath]: typingTestApi.reducer,
    typingTest: typingTestSlice.reducer,
}