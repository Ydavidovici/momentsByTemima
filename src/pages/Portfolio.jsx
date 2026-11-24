import { useState, useRef, useEffect } from "react";

const photos = [
    {id: 2, src: "/slide-2.jpg", alt: "First dance"},
    {id: 3, src: "/slide-3.jpg", alt: "Quiet morning"},
    {id: 4, src: "/slide-4.jpg", alt: "Little hands"},
    {id: 5, src: "/slide-5.jfif", alt: "Sun & lace"},
    {id: 6, src: "/slide-6.jpg", alt: "Shlomo photo 1"},
    {id: 7, src: "/slide-7.jpg", alt: "Shlomo photo 2"},
    {id: 9, src: "/slide-9.jpg", alt: "Miscellaneous photo"},
    {id: 10, src: "/autumn-family.jpg", alt: "Family portrait in autumn leaves"},
    {id: 11, src: "/autumn-mother-daughter.jpg", alt: "Mother lifting her daughter by the lake"},
    {id: 12, src: "/autumn-father-daughter.jpg", alt: "Father and daughter in the autumn woods"},
    {id: 13, src: "/first-steps.jpg", alt: "First steps"},
    {id: 14, src: "/autumn-boy.jpg", alt: "Little boy resting by a tree"},
    {id: 15, src: "/bridal-portrait.jpg", alt: "Bridal portrait"},
    {id: 16, src: "/getting-ready.jpg", alt: "Getting ready"},
];

export default function Portfolio() {
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
            <h1>Portfolio</h1>
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
