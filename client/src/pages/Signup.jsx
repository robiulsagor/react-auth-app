import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
    const [user, setUser] = useState(
        {
            username: '',
            email: '',
            password: '',
        }
    )

    const handleSubmit = e => {
        e.preventDefault()
        console.log(user);
    }

    return (
        <div className=' max-w-[500px] mx-auto'>
            <h2 className='text-4xl font-bold text-center'>Sign Up</h2>

            <form onSubmit={handleSubmit} className=' flex flex-col mt-10 form'>
                <input type="text" value={user.username}
                    onChange={e => setUser({ ...user, username: e.target.value })}
                    placeholder='Username'
                />
                <input type="email" value={user.email}
                    onChange={e => setUser({ ...user, email: e.target.value })}
                    placeholder='Email'
                />
                <input type="password" value={user.password}
                    onChange={e => setUser({ ...user, password: e.target.value })}
                    placeholder='Password'
                />

            </form>

            <button type='submit' className='form_btn_1  hover:bg-slate-600 transition-all'>SIGN UP</button>
            <button type='submit' className='form_btn_2'>CONTINUE WITH GOOGLE</button>

            <p className='mt-5 text-lg'>Already have an account? <Link to='/signin' className='link_blue'>Sign In</Link> Now  </p>
        </div>
    )
}

export default Signup