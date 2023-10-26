import React from 'react'
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux"

const Header = () => {
    const { currentUser } = useSelector(state => state.user)

    if (currentUser !== null) {
        console.log("ache");
        console.log(currentUser);
    } else {
        console.log("nai");
    }

    return (
        <div className='bg-slate-200'>
            <div className=' max-w-6xl mx-auto flex justify-between items-center p-5'>
                <NavLink to='/' className='text-2xl font-bold ' >Auth App </NavLink>

                <ul className='flex gap-6 text-lg hover_state'>
                    <li>
                        <NavLink to='/' className={({ isActive, IsPending }) => isActive && "text-blue-700"}>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to='/about' className={({ isActive, IsPending }) => isActive && "text-blue-700"}>About</NavLink>
                    </li>
                    <li>
                        {currentUser ? (
                            <NavLink to="/profile">
                                <img src={currentUser.profilePicture} className='w-7 h-7 object-contain rounded-full' />
                            </NavLink>
                        ) : (<NavLink to='/signin'
                            className={({ isActive, IsPending }) => isActive && "text-blue-700"}
                        >Sign In</NavLink>)}

                    </li>

                </ul>
            </div>
        </div>
    )
}

export default Header