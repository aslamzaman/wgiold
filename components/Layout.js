"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const Layout = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        const user = sessionStorage.getItem('log');
        if (!user) {
            router.push('/');
        }
    }, [router]);


    const logOutHandler = () => {
        sessionStorage.clear();
        router.push('/');
    }


    return (
        <>
            <header id="top" className="fixed top-0 left-0 right-0 px-4 lg:px-6 bg-gray-100 border-b-2 border-white grid grid-cols-4 gap-1 md:gap-4 items-center shadow-lg z-20">
                <Link className='px-2 py-1 md:py-3 text-center leading-5 hover:border-x-2 border-gray-300 cursor-pointer font-bold' href="/dashboard">Home</Link>
                <Link className='px-2 py-1 md:py-3 text-center leading-5 hover:border-x-2 border-gray-300 cursor-pointer' href="/dues">Dues @ Payment</Link>
                <Link className='px-2 py-1 md:py-3 text-center leading-5 hover:border-x-2 border-gray-300 cursor-pointer' href="/receipt">Money Receipt</Link>
                <button onClick={logOutHandler} className='px-2 py-1 md:py-3 text-center leading-5 hover:border-x-2 border-gray-300  cursor-pointer'>Log Out</button>

            </header>


            <main className="w-full mt-[60px] bg-white overflow-auto">
                {children}
                <div className='my-40'></div>
            </main>


            <footer className="w-full py-10 text-center text-sm bg-gray-100 border-t-2 border-white">
                <p className='text-center'>Copyright @ 2024 Aslam Zaman. Email: aslamcmes@gmail.com</p>
            </footer>
        </>
    )
}

export default Layout



