import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    loading: false,
    error: false,
    message: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: state => {
            state.loading = true;
            state.error = false;
            state.message = null
        },
        signinSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.message = null

        },
        signInFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.message = null

        },
        signOut: state => {
            state.currentUser = null;
            state.loading = false
            state.error = false
            state.message = null
        },
        setMsg: (state, action) => {
            state.message = action.payload
        },
        clearMsg: (state, action) => {
            state.message = action.payload
        },
        clearErrMsg: state => {
            state.error = false
        }
    }
})

export const { signInStart, signinSuccess, signInFailed, signOut, setMsg, clearMsg, clearErrMsg } = userSlice.actions
export default userSlice.reducer