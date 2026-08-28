import {useEffect, useState} from "react";

const slides = [
    {src: "/slide-1.png", alt: "Golden hour"},
    {src: "/slide-2.jpg", alt: "First dance"},
    {src: "/slide-4.jpg", alt: "Little hands"},
    {src: "/slide-5.jfif", alt: "Sun & lace"},
    {src: "/slide-8.jpg", alt: "Shlomo photo 3"},
    {src: "/slide-9.jpg", alt: "Miscellaneous photo"},
];

const INTERVAL_MS = 4000;

export default function Slideshow() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setCurrent((i) => (i + 1) % slides.length);
        }, INTERVAL_MS);

        return () => clearInterval(id);
    }, []);

    return (
        <div className="slideshow" role="region" aria-label="Photo slideshow" aria-roledescription="carousel">
            <div className="slideshow__stage">
                {slides.map((slide, i) => (
                    <figure
                        key={i}
                        className={`slideshow__slide${i === current ? " is-active" : ""}`}
                        style={slide.src ? undefined : {background: slide.tint}}
                        aria-hidden={i === current ? undefined : true}
                    >
                        {slide.src ? (
                            <img src={slide.src} alt={slide.alt ?? ""} style={slide.position ? {objectPosition: slide.position} : undefined}/>
                        ) : (
                            <figcaption className="slideshow__label">{slide.label}</figcaption>
                        )}
                    </figure>
                ))}
            </div>

            <div className="slideshow__dots">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        className={`slideshow__dot${i === current ? " is-active" : ""}`}
                        aria-label={`Go to slide ${i + 1}`}
                        aria-current={i === current ? "true" : undefined}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>
        </div>
    );
}
