import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate()
    return (
        <>
            <div className='bg-white w-screen h-screen'>
                <div className='bg-linear-to-r from-qual to-qualend h-4/6 flex items-center '>
                
                    <div className='mb-10 w-1/2 p-30'>
                        <h1 className='text-[13vh]'>
                            QVigil
                        </h1>
                        <h3 className='text-[3vh]'>Your private and vigilant companion</h3>
                        <div className='py-3 w-full'>
                            <button className='cursor-pointer p-2 rounded-full w-[45%] bg-qualmain font-semibold' onClick={() => navigate("/home")}>
                                Get Started
                            </button>
                            <button className='p-2 ml-2 rounded-full w-[45%] bg-transparent border-2 font-semibold'>
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div className='h-full '>
                        <div className='flex p-5 pt-10 h-1/2 '>
                        <img className='h-full rounded-xl' src="assets/thumbnail.jpeg" />
                        <img className='h-full ml-5 rounded-xl' src="assets/download (1).jpg" />
                        <img className='h-full ml-5 rounded-xl' src="assets/Dawning_OptionalPool-Dusk.webp" />
                        </div>
                        <div className='flex p-5 h-1/2 pb-10'>
                        <img className='h-full rounded-xl' src="assets/download.jpg" />
                        <img className='h-full ml-5 rounded-xl' src="assets/download (2).jpg" />

                        <img className='h-full ml-5 rounded-xl' src="assets/download (3).jpg    " />

                        </div>

                    </div>
                </div>
                <div className='flex justify-center text-black  p-10'>
                    <div>
                    <h3 className='text-[6vh]'>Your Secure Ecosystem</h3>
                    <div className='w-full text-center text-2xl'>
                        Deploy security models on edge. Ensure privacy - video never leaves the end device.
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}