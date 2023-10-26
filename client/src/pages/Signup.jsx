import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import OAuth from '../components/OAuth'
import { useSelector } from 'react-redux'

const Signup = () => {
    const [user, setUser] = useState(
        {
            username: '',
            email: '',
            password: '',
        }
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const navigate = useNavigate()

    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        if (currentUser) {
            navigate("/")
        }
    }, [])

    const handleSubmit = async e => {
        console.log(user.email);
        e.preventDefault()
        setLoading(true)
        setError(false)

        if (!user.username || !user.email || !user.password) {
            setError("All fields are required!")
            setLoading(false)
            return
        }

        if (user.username.length <= 5) {
            setError("Username must be at least 6 characters!")
            setLoading(false)
            return
        }

        // Validate email address
        const validateEmailRegex = /^\S+@\S+\.\S+$/;

        if (!validateEmailRegex.test(user.email)) {
            setError("Please provide a valid email!")
            setLoading(false)
            return
        }

        if (user.password.length <= 5) {
            setError("Password must be at least 6 characters!")
            setLoading(false)
            return
        }

        // passed all authentication tests

        try {
            const data = await axios.post('/api/auth/register', user)
            console.log(data);
            setLoading(false)
            setError(false)
            navigate('/signin')
        } catch (error) {
            console.log(error.response.data.message);
            setLoading(false)
            setError(error.response.data.message || "Something went Wrong!")
        }
    }

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h2 className='text-4xl font-bold text-center'>Sign Up</h2>

            <form onSubmit={handleSubmit} className=' flex flex-col mt-10 form'>
                {error && (<div className='mb-5'>
                    <p className='text-red-400'>{error} </p>
                </div>)}

                <input type="text" value={user.username} name="username"
                    onChange={e => setUser({ ...user, username: e.target.value })}
                    placeholder='Username'
                />
                <input type="email" value={user.email} name="email"
                    onChange={e => setUser({ ...user, email: e.target.value })}
                    placeholder='Email'
                />
                <input type="password" value={user.password}
                    onChange={e => setUser({ ...user, password: e.target.value })}
                    placeholder='Password'
                />

                <button disabled={loading} type='submit' className='form_btn_1  hover:bg-slate-600 transition-all flex items-center justify-center disabled:opacity-40'>
                    {loading ? (
                        <>
                            <p
                                className="animate-spin h-5 w-5 mr-3 text-white border-2 border-white border-r-0 rounded-full">
                            </p>
                            Loading
                        </>
                    ) : "SIGN UP"}
                </button>

                <OAuth />
            </form>


            <p className='mt-5 text-lg'>Already have an account? <Link to='/signin' className='link_blue'>Sign In</Link> Now  </p>


        </div>
    )
}

export default Signup