import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { dummyCards } from "@/constants";
import React from "react";


// ...existing code...
interface ParamsWithSearch {
    params: {
        search?: string;
        id: string;
        // add other properties if needed
    };
}
// ...existing code...


const Page = async ({ params }: ParamsWithSearch) => {
    const { id } = await params;

    return (

        <div className="wrapper page">
            <Header subheader="samellis@domain.com" title="Sam | JS Developer" userImg="/assets/images/dummy.jpg" />
            <section className="video-grid">
                {dummyCards.map((card) => (
        <VideoCard key={card.id} {...card} />
      ))}
            </section>
        </div>
    );
};

export default Page;
