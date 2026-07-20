import {useEffect, useState} from "react";

// Auto-advancing, cross-fading slideshow for the home page.
//
// Each slide is either a real photo ({src, alt}) or a tinted placeholder
// ({tint, label}) — same pattern as the Gallery page, so real images drop
// straight in once they exist. Swap this list for a CMS/JSON feed later
// (see designDoc.md — "Future Considerations").
const slides = [
    {tint: "var(--blush)", label: "Golden hour"},
    {tint: "var(--sky)", label: "First dance"},
    {tint: "var(--sage)", label: "Quiet morning"},
    {tint: "var(--cream-deep)", label: "Little hands"},
    {tint: "var(--sky)", label: "Sun & lace"},
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
                            <img src={slide.src} alt={slide.alt ?? ""}/>
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
