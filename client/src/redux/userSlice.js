import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    loading: false,
    error: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: state => {
            state.loading = true;
            state.error = false;
        },
        signinSuccess: (state, action) => {
            state.user = action.payload
            state.loading = false
        },
        signInFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
})

export const { signInStart, signinSuccess, signInFailed } = userSlice.actions
export default userSlice.reducer