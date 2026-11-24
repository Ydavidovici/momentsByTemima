import {useEffect} from "react";
import {Link} from "react-router-dom";
import Brand from "../components/Brand.jsx";
import Slideshow from "../components/Slideshow.jsx";
import About from "./About.jsx";
import Testimonials from "./Testimonials.jsx";
import Contact from "./Contact.jsx";

// The home page scrolls through these sections; the nav links are anchors to
// their ids. Portfolio is its own page (see App.jsx).
const sections = [
    {id: "about", Page: About},
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
                    <Link to="/portfolio" className="btn">
                        View the portfolio
                    </Link>
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
