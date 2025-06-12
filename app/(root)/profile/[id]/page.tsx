import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { getAllVideos } from "@/lib/actions/video";
import React from "react";
import EmptyState from "@/components/EmptyState";



interface SearchParams {
    query?: string;
    filter?: string;
    page?: string;
    video?: string;
    user?: string;
}

interface Video {
    id: string;
    thumbnailUrl: string;
    // add other video properties as needed
}

interface User {
    image?: string;
    name?: string;
    // add other user properties as needed
}

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
    const { query, filter, page } = await searchParams;
    const { videos, pagination }: { videos: { video: Video; user?: User }[]; pagination: any } = await getAllVideos(query, filter, Number(page) || 1);

    return (

        <div className="wrapper page">
            <Header subheader="samellis@domain.com" title="Sam | JS Developer" userImg="/assets/images/dummy.jpg" />
                {videos?.length > 0 ?
                (
                    <section className="video-grid">
                        {videos.map(({video, user }) => (
                            <VideoCard 
                            key={video.id} 
                            {...video} 
                            thumbnail={video.thumbnailUrl} 
                            userImg={user?.image || ''} 
                            username={user?.name || 'Guest'} />
                        ))}
                    </section>
                ) : (
                    <EmptyState icon='/assets/icons/video.svg' title="No videos found" description="Try changing the search query or filter." />
                )}
        </div>
    );
};

export default Page;
