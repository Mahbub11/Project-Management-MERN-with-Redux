import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import {FetchAllProject}from '../redux/slices/task'


const AppLayout = ({ children }) => {
    const {blury}= useSelector((state)=> state.app.common);
    const dispatch= useDispatch();

    useEffect(()=>{
        dispatch(FetchAllProject())
    },[])
    return (
        <div className={`${blury ? 'blur-sm': ''} bg-white dark:bg-[linear-gradient(-20deg,#2b5876_50%,_#4e4376_100%)] h-screen`}>
            <Navbar />
            <div className=' w-screen flex container mx-auto'>
                <div className="w-[220px]">
                    <Sidebar />
                </div>
                <div className="flex-1">
                    <div className="flex">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppLayout