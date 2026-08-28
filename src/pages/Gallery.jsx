import { useState, useRef, useEffect } from "react";

const photos = [
    {id: 1, src: "/slide-1.png", alt: "Golden hour"},
    {id: 2, src: "/slide-2.jpg", alt: "First dance"},
    {id: 3, src: "/slide-3.jpg", alt: "Quiet morning"},
    {id: 4, src: "/slide-4.jpg", alt: "Little hands"},
    {id: 5, src: "/slide-5.jfif", alt: "Sun & lace"},
    {id: 6, src: "/slide-6.jpg", alt: "Shlomo photo 1"},
    {id: 7, src: "/slide-7.jpg", alt: "Shlomo photo 2"},
    {id: 8, src: "/slide-8.jpg", alt: "Shlomo photo 3"},
    {id: 9, src: "/slide-9.jpg", alt: "Miscellaneous photo"},
];

export default function Gallery() {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const dialogRef = useRef(null);

    useEffect(() => {
        if (selectedPhoto) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [selectedPhoto]);

    const closeDialog = () => setSelectedPhoto(null);

    return (
        <section className="page">
            <h1>Gallery</h1>
            <p className="page__intro">
                A collection of favorite moments.
            </p>
            <div className="gallery-grid">
                {photos.map((photo) => (
                    <button 
                        key={photo.id} 
                        className="gallery-grid__item"
                        onClick={() => setSelectedPhoto(photo)}
                        aria-label={`View ${photo.alt} larger`}
                    >
                        <img src={photo.src} alt={photo.alt} style={{width: "100%", height: "100%", objectFit: "cover"}} />
                    </button>
                ))}
            </div>

            <dialog 
                ref={dialogRef} 
                className="gallery-modal" 
                onClose={closeDialog}
                onClick={(e) => {
                    if (e.target === dialogRef.current) closeDialog();
                }}
            >
                {selectedPhoto && (
                    <div className="gallery-modal__content">
                        <button className="gallery-modal__close" onClick={closeDialog} aria-label="Close photo">
                            &times;
                        </button>
                        <img src={selectedPhoto.src} alt={selectedPhoto.alt} />
                    </div>
                )}
            </dialog>
        </section>
    );
}
