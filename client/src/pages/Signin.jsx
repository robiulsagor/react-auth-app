import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux"
import { signInFailed, signInStart, signinSuccess } from "../redux/userSlice"

const Signin = () => {
    const [user, setUser] = useState(
        {
            email: '',
            password: '',
        }
    )
    // const [loading, setLoading] = useState(false)
    // const [error, setError] = useState(false)
    const { loading, error } = useSelector(state => state.user)


    const navigate = useNavigate()
    const dispatch = useDispatch()

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

                <button type='submit' className='form_btn_1'>SIGN IN</button>
                <button type='button' className='form_btn_2'>CONTINUE WITH GOOGLE</button>
            </form>

            <p className='mt-5 text-lg'>Don't have an account? <Link to='/signup' className='link_blue'>Sign Up</Link> Now  </p>
            <Toaster position="top-right" id='notification' />
        </div>
    )
}

export default Signin