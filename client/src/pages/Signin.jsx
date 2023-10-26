import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';

const Signin = () => {
    const [user, setUser] = useState(
        {
            email: '',
            password: '',
        }
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()
        setError(false)
        setLoading(true)
        toast.dismiss();

        if (!user.email || !user.password) {
            setError("All fields are required!")
            setLoading(false)
            return
        }

        try {
            const data = await axios.post('/api/auth/login', user)
            console.log(data.data);
            setLoading(false)
            setError(false)
            toast.success('User found!', {
                id: 'notificaion'
            });

            navigate("/")
        } catch (error) {
            console.log(error.response.data.message);
            setLoading(false)
            setError(error.response.data.message || "Something went Wrong!")
            toast.error(error.response.data.message, {
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