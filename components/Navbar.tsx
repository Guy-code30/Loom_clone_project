'use client';

import { redirect, useRouter } from 'next/navigation';
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';

const user = {};


const Navbar = () => {
    const router = useRouter();

    return (
        <header className="navbar">
            <nav>
                <Link href="/">
                    <Image src="/assets/icons/logo.svg" alt="Logo" width={32} height={32} />
                    <h1>SnapCast</h1>
                </Link>
                {user && (
                    <figure>
                        <button onClick={() => router.push('/profile/123456')} className='cursor-pointer'>
                            <Image src="/assets/images/dummy.jpg" alt="User" width={36} height={36} className="rounded-full aspect-square" />
                        </button>
                        <button onClick={async () => {
                            return await authClient.signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        redirect('/sign-in');
                                    }
                                }
                            })
                        }} className='cursor-pointer'>
                            <Image src="/assets/icons/logout.svg" alt="Logout" width={24} height={24} className='rotate-180' />
                        </button>
                    </figure>
                )}
            </nav>
        </header>
    )
}

export default Navbar; 