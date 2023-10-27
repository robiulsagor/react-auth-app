import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux"
import { clearErrMsg, clearMsg, signInFailed, signInStart, signinSuccess } from "../redux/userSlice"
import OAuth from '../components/OAuth';

const Signin = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [user, setUser] = useState(
        {
            email: '',
            password: '',
        }
    )

    const { loading, error, currentUser, message } = useSelector(state => state.user)

    // if any notifications, show them as a toast msg
    useEffect(() => {
        if (message) {
            console.log(message);
            toast.success(message, { id: 'notification' })

            setTimeout(() => {
                console.log("out");
                dispatch(clearMsg())
            }, 4000);
        }

        if (error) {
            console.log(error);

            setTimeout(() => {
                console.log("error out");
                dispatch(clearErrMsg())
            }, 6000);
        }
    }, [message, error])

    useEffect(() => {
        if (currentUser) {
            navigate("/")
        }
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()

        dispatch(signInStart())

        toast.dismiss();

        if (!user.email || !user.password) {
            dispatch(signInFailed("All fields are required!"))
            return
        }

        try {
            const data = await axios.post('/api/auth/login', user)
            dispatch(signinSuccess(data.data.userData))

            toast.success('User found!', {
                id: 'notificaion'
            });
            console.log(data);

            navigate("/")
        } catch (error) {
            dispatch(signInFailed(error?.response?.data?.message || error?.message || "Something went Wrong!"))
            console.log(error);

            toast.error(error?.response?.data?.message || error?.message, {
                id: 'notificaion'
            });
        }
    }

    return (
        <div className=' max-w-[500px] mx-auto'>
            <h2 className='text-4xl font-bold text-center'>Sign In</h2>


            <form onSubmit={handleSubmit} className=' flex flex-col mt-10 form'>
                {error && (<div className='mb-5'>
                    <p className='text-red-400'>{error} </p>
                </div>)}

                <input type="email" value={user.email} name="email"
                    onChange={e => setUser({ ...user, email: e.target.value })}
                    placeholder='Email'
                />
                <input type="password" value={user.password}
                    onChange={e => setUser({ ...user, password: e.target.value })}
                    placeholder='Password'
                />

                <button type='submit' className='form_btn_1  hover:bg-slate-600 transition-all flex items-center justify-center disabled:opacity-40'>
                    {loading ? (
                        <>
                            <p
                                className="animate-spin h-5 w-5 mr-3 text-white border-2 border-white border-r-0 rounded-full">
                            </p>
                            Loading
                        </>
                    ) : "SIGN IN"}
                </button>
                <OAuth />
            </form>

            <p className='mt-5 text-lg'>Don't have an account? <Link to='/signup' className='link_blue'>Sign Up</Link> Now  </p>
            <Toaster position="top-right" id='notification' />
        </div>
    )
}

export default Signin