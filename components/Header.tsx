import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ICONS } from '@/constants/index';

interface SharedHeaderProps {
    subheader: string;
    title: string;
    userImg?: string;
}

const Header = ({ subheader, title, userImg }: SharedHeaderProps) => {
    return (
        <header className="header">

            <section className="header-container">
                <div className="details">
                    {userImg && (
                        <Image src={userImg || "/assets/images/dummy.jpg"} alt="User" width={66} height={66} className="rounded-full" />
                    )}

                    <article>
                        <p>{subheader}</p>
                        <h1>{title}</h1>
                    </article>
                </div>
                <aside>
                    <Link href="upload">
                        <Image src='/assets/icons/upload.svg' alt="upload" width={16} height={16} />
                        <span>Upload a video</span>
                    </Link>
                    <div className="record">
                        <button className="primary-btn">
                            <Image src={ICONS.record} alt="record" width={16} height={16} />
                            <span>Record a video</span>
                        </button>
                    </div>

                </aside>
            </section>
        </header>
    )
}

export default Header;
