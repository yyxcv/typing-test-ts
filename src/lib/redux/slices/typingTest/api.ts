/* Core */
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

/* Instruments */
import {CharStat, Lesson, TestResult, TextResponseData, TypingTestState} from "../typingTest";
import Config from "../../../../classes/Config";


export const typingTestApi = createApi({
        reducerPath: 'typingTestApi',
        keepUnusedDataFor: 0,
        refetchOnMountOrArgChange: true,
        baseQuery: fetchBaseQuery({
            baseUrl: Config.get("backendUrl") + '/api/',
            prepareHeaders: (headers) => {
                const queryParameters = new URLSearchParams(window.location.search)
                const token = queryParameters.get("t")
                if (token) {
                    headers.set('authorization', `Bearer ${token}`)
                }
                return headers
            },
        }),
        endpoints: (builder) => ({
            getInitialState: builder.query<TypingTestState, void>({
                query: () => 'initialState',
                forceRefetch: () => true,
            }),
            getText: builder.query<TextResponseData, Lesson['name']>({
                query: (lesson) => `getText?lesson=${lesson}`,
                forceRefetch: () => true,
            }),
            getCharsStatistic: builder.query<Array<CharStat>, void>({
                query: () => 'charStats',
                forceRefetch: () => true,
            }),
            setActiveChars: builder.mutation<object, Array<string>>({
                query: (activeChars) => ({
                    url: 'activeChars',
                    method: 'POST',
                    body: {activeChars},
                }),
            }),
            saveTest: builder.mutation<object, TestResult>({
                query: (testResult) => ({
                    url: 'saveTest',
                    method: 'POST',
                    body: {...testResult}
                }),
            }),
        }),
    }
)

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetInitialStateQuery,
    useLazyGetTextQuery,
} = typingTestApi