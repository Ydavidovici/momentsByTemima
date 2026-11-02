import {useEffect, useState} from "react";

const slides = [
    {src: "/slide-2.jpg", alt: "First dance", ratio: "3219 / 4009"},
    {src: "/slide-4.jpg", alt: "Little hands", ratio: "5387 / 3783"},
    {src: "/slide-5.jfif", alt: "Sun & lace", ratio: "1920 / 2617"},
    {src: "/slide-8.jpg", alt: "Shlomo photo 3", ratio: "4000 / 6000"},
    {src: "/slide-9.jpg", alt: "Miscellaneous photo", ratio: "905 / 1357"},
];

const INTERVAL_MS = 4000;

const aspect = (ratio) => {
    const [w, h] = ratio.split("/").map(Number);
    return w / h;
};

// The stage keeps one height for every slide, so the sections below it never
// shift as it rotates; only its width follows each photo's shape. That height
// lets the most portrait photo fill the width. A photo too wide for the box
// (landscape ones on phones) is shown whole over a blurred copy of itself.
const STAGE_HEIGHT = `min(85vh, 100cqw / ${Math.min(...slides.map((s) => aspect(s.ratio)))})`;

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
            <div 
                className="slideshow__stage" 
                style={{
                    height: STAGE_HEIGHT,
                    width: `min(100cqw, ${STAGE_HEIGHT} * ${aspect(slides[current].ratio)})`,
                    margin: "0 auto"
                }}
            >
                {slides.map((slide, i) => (
                    <figure
                        key={i}
                        className={`slideshow__slide${i === current ? " is-active" : ""}`}
                        style={slide.src ? undefined : {background: slide.tint}}
                        aria-hidden={i === current ? undefined : true}
                    >
                        {slide.src && <img className="slideshow__backdrop" src={slide.src} alt=""/>}
                        {slide.src ? (
                            <img
                                src={slide.src}
                                alt={slide.alt ?? ""}
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    ...(slide.position ? {objectPosition: slide.position} : {}),
                                }}
                            />
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
