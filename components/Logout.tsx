'use client'
import React from 'react'
import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

function Logout() {
    const router = useRouter()
    return (
        <button 
        onClick = {async () => {
            await signOut();
            router.push('/signup')
        }}
        className="px-2 bg-white text-black">
            Signout
        </button>
    )
}

export default Logout