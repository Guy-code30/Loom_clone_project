import Image from "next/image";

interface FileInputProps {
    id: string;
    label: string;
    accept: string;
    file: File | null;
    previewUrl: string | null;
    inputRef: React.RefObject<HTMLInputElement>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onReset: () => void;
    type: 'video' | 'thumbnail';
}



const FileInput = ({ id, label, accept, file, previewUrl, inputRef, onChange, onReset, type }: FileInputProps) => {
    return (
        <section className="file-input">
            <label htmlFor={id}>{label}</label>
            <input
                type="file"
                id={id}
                accept={accept}
                ref={inputRef}
                hidden
                onChange={onChange}

            />
            {!previewUrl ? (
                <figure onClick={() => inputRef.current?.click()}>
                    <Image src='/assets/icons/upload.svg' alt="Upload" width={24} height={24} />
                    <p>Click to upload your {id}</p>
                </figure>

            ) : (
                <div>
                    {type === 'video'
                        ?
                        <video src={previewUrl} controls className="video-preview" />
                        :
                        <Image src={previewUrl} alt="Image" fill />
                    }
                    <button type='button' onClick={onReset}>
                        <Image src='/assets/icons/close.svg' alt="close" width={16} height={16} />
                        <p>{file?.name}</p>
                    </button>
                </div>

            )}

        </section>

    )
}

export default FileInput;
