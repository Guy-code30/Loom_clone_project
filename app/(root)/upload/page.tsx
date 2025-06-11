"use client"


import FileInput from "@/components/FileInput";
import FormField from "@/components/FormField";
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from "@/constants";
import { getThumbnailUploadUrl, getVideoUploadUrl, saveVideoDetails } from "@/lib/actions/video";
import { useFileInputs } from "@/lib/hooks/userFileInputs";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

const uploaedFileToBunny = async (file: File, uploadUrl: string, accessKey: string) => {
    return fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
            'AccessKey': accessKey,
        },
        body: file,
    }).then((response) => {
        if (!response.ok) throw new Error('Upload failed');
    })
}


const Page = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(() => false)
    const [videoDuration, setVideoDuration] = useState(() => 0)



    const [formData, setFormData] = useState(() => ({
        title: '',
        description: '',
        visibility: 'public',
    }))
    const video = useFileInputs(MAX_VIDEO_SIZE)
    const thumbnail = useFileInputs(MAX_THUMBNAIL_SIZE);

    useEffect(() => {
        if (video.durations !== 0 && video.durations !== null) {
            setVideoDuration(video.durations);
        }
    }, [video.durations]);


    const [error, setError] = useState<string | null>('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!video.file || !thumbnail.file) {
                setError('Please upload both video and thumbnail files.');
                return;
            }
            if (!formData.title || !formData.description) {
                setError('Please fill in all fields.');
                return;
            }
            // 0 get upload URLs
            const {
                videoId,
                uploadUrl: videoUploadUrl,
                accessKey: videoAccessKey,
            } = await getVideoUploadUrl();

            if (!videoUploadUrl || !videoAccessKey) {
                throw new Error('Failed to get video upload URL.');
            }
            await uploaedFileToBunny(video.file, videoUploadUrl, videoAccessKey);
            const {
                uploadUrl: thumbnailUploadUrl,
                accessKey: thumbnailAccessKey,
                cdnUrl: thumbnailCdnUrl,
            } = await getThumbnailUploadUrl(videoId);

            if (!thumbnailUploadUrl || !thumbnailAccessKey) {
                throw new Error('Failed to get thumbnail upload URL.');
            }
            await uploaedFileToBunny(thumbnail.file, thumbnailUploadUrl, thumbnailAccessKey);


            await saveVideoDetails({
                videoId,
                thumbnailCdnUrl,
                ...formData,
                duration: videoDuration,
            });
            router.push(`/video/${videoId}`);
        }
        catch (error) {
            console.error('Error submitting video:', error);

        }
        finally {
            setIsSubmitting(false);
        }

    }

    return (
        <div className="wrapper-md upload-page">
            <h1>Upload a video</h1>
            {error && <div className="error-field">{error}</div>}

            <form className="rounded-20 shadow-10 gap-6 w-full flex flex-col px-5 py-7.5" onSubmit={handleSubmit}>
                <FormField
                    id="title"
                    label="Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a title for your video"
                />
                <FormField
                    id="description"
                    label="Description"
                    placeholder="Enter a description for your video"
                    value={formData.description}
                    as="textarea"
                    onChange={handleInputChange}
                />


                <FileInput
                    id='video'
                    label='Video'
                    accept="video/*"
                    file={video.file}
                    previewUrl={video.previewUrl}
                    inputRef={video.inputRef}
                    onChange={video.handleFileChange}
                    onReset={video.resetFile}
                    type="video"
                />

                <FileInput
                    id='thumbnail'
                    label='Thumbnail'
                    accept="image/*"
                    file={thumbnail.file}
                    previewUrl={thumbnail.previewUrl}
                    inputRef={thumbnail.inputRef}
                    onChange={thumbnail.handleFileChange}
                    onReset={thumbnail.resetFile}
                    type="image"
                />

                <FormField
                    id="visibility"
                    label="Visibility"
                    value={formData.visibility}
                    as="select"
                    options={[
                        { value: 'public', label: 'Public' },
                        { value: 'private', label: 'Private' },
                    ]}
                    onChange={handleInputChange}
                />

                <button type="submit" disabled={isSubmitting} className="submit-button">
                    {isSubmitting ? 'Uploading...' : 'Upload Video'}

                </button>
            </form>
        </div>
    );
}

export default Page;