'use client';

import { Ultra } from "next/font/google";
import Image from "next/image";
import { useState } from "react";

const DropdownList = () => {
    const [isOpen, setIsOpen] = useState(false); //put initialState: false when its need
    return (
        <div className="relative">
            <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <div className="filter-trigger">
                    <figure>
                        <Image src="/assets/icons/hamburger.svg" alt="menu" width={14} height={14} />
                        Most recent
                    </figure>
                    <Image src="/assets/icons/arrow-down.svg" alt="arrow" width={20} height={20} />
                </div>
            </div>
            {isOpen && (
                <ul className="dropdown">
                    {["Most recent", "Most liked"].map((option, index) => (
                        <li key={option} className="list-item">

                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownList;
