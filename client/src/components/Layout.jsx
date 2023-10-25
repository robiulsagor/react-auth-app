import React from 'react'
import Header from './Header'
import { Link, Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <>
            <Header />
            <div className='max-w-6xl mx-auto mt-14'>
                <Outlet />
            </div>
        </>
    )
}

export default Layout