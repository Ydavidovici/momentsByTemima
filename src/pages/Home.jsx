import {useEffect} from "react";
import Brand from "../components/Brand.jsx";
import Slideshow from "../components/Slideshow.jsx";
import About from "./About.jsx";
import Portfolio from "./Portfolio.jsx";
import Testimonials from "./Testimonials.jsx";
import Contact from "./Contact.jsx";

// The whole site is this one scrolling page; the nav links are anchors to
// these section ids.
const sections = [
    {id: "about", Page: About},
    {id: "portfolio", Page: Portfolio},
    {id: "testimonials", Page: Testimonials},
    {id: "contact", Page: Contact},
];

export default function Home() {
    // The browser tries to jump to a #hash before React has rendered the
    // sections, so jump once they exist (direct links and old page URLs).
    useEffect(() => {
        const id = decodeURIComponent(window.location.hash.slice(1));
        if (id) document.getElementById(id)?.scrollIntoView();
    }, []);

    return (
        <>
            <section id="home" className="hero">
                <div>
                    <h1><Brand/></h1>
                    <p>
                        Light, airy, and happy photography — celebrating the little moments
                        that make up a life well lived.
                    </p>
                    <a href="#portfolio" className="btn">
                        View the portfolio
                    </a>
                </div>
            </section>

            <section className="page page--slideshow">
                <Slideshow/>
            </section>

            {sections.map(({id, Page}) => (
                <div key={id} id={id} className="home-section">
                    <Page/>
                </div>
            ))}
        </>
    );
}
