import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import ProfileIcon from "./../avatar.png"

const Profile = () => {
    const { loading, error, currentUser } = useSelector(state => state.user)
    const navigate = useNavigate()

    const [user, setUser] = useState(
        {
            username: '',
            email: '',
            password: '',
        }
    )

    useEffect(() => {
        if (!currentUser) {
            navigate("/signin")
        }
    }, [])

    console.log(currentUser);

    const handleSubmit = async e => {

    }

    return (
        <div className=' max-w-xl mx-auto text-center px-5'>
            <h2 className='text-center text-3xl font-bold max-sm:text-xl'>Profile</h2>

            <div className='  flex items-center justify-center my-6'>
                <img src={currentUser?.profilePicture || ProfileIcon} alt="profile pic" className='w-20 h-20 rounded-full bg-red-900 ' />
            </div>

            <form onSubmit={handleSubmit} className=' flex flex-col mt-10 form max-sm:mt-4'>

                {error && (<div className='mb-5'>
                    <p className='text-red-400'>{error} </p>
                </div>)}

                <input type="text" value={currentUser.username} name="username"
                    onChange={e => setUser({ ...user, username: e.target.value })}
                    placeholder='Username'
                />
                <input type="email" value={currentUser.email} name="email"
                    onChange={e => setUser({ ...user, email: e.target.value })}
                    placeholder='Email'
                />
                <input type="password" value={currentUser.password}
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
                    ) : "UPDATE"}
                </button>
            </form>

            <div className='text-red-600 flex items-center justify-between mt-4'>
                <p>Delete Account</p>
                <p>Sign Out</p>
            </div>
        </div>
    )
}

export default Profile