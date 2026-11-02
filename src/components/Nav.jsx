import {useEffect, useRef, useState} from "react";
import Brand from "./Brand.jsx";

// Every link is an anchor to a section on the single scrolling home page.
export const links = [
    {id: "home", label: "Home"},
    {id: "about", label: "About"},
    {id: "portfolio", label: "Portfolio"},
    {id: "testimonials", label: "Testimonials"},
    {id: "contact", label: "Contact"},
];

// Scroll-spy: the active section is the last one whose top has reached the
// bottom of the sticky nav. At the very bottom of the page the last section
// wins, since it is too short to ever scroll up to the nav.
function useActiveSection(navRef) {
    const [active, setActive] = useState(links[0].id);

    useEffect(() => {
        let frame = 0;

        // Anchor jumps stop below the nav (see scroll-padding-top in index.css),
        // and the nav's height changes when its links wrap on small screens.
        const measure = () => {
            const navHeight = navRef.current?.offsetHeight ?? 0;
            document.documentElement.style.setProperty("--nav-height", `${navHeight}px`);
        };

        const update = () => {
            frame = 0;
            const line = (navRef.current?.offsetHeight ?? 0) + 8;
            const atBottom =
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

            let current = links[0].id;
            for (const {id} of links) {
                const section = document.getElementById(id);
                if (section && section.getBoundingClientRect().top <= line) current = id;
            }
            setActive(atBottom ? links[links.length - 1].id : current);
        };

        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        const onResize = () => {
            measure();
            onScroll();
        };

        // The page also changes height without scrolling (a redirect rendering
        // the sections, images loading), which can change the answer.
        const observer = new ResizeObserver(onResize);
        observer.observe(document.body);
        if (navRef.current) observer.observe(navRef.current);

        measure();
        update();
        window.addEventListener("scroll", onScroll, {passive: true});
        window.addEventListener("resize", onResize);
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
        };
    }, [navRef]);

    return active;
}

export default function Nav() {
    const navRef = useRef(null);
    const active = useActiveSection(navRef);

    return (
        <nav className="nav" ref={navRef}>
            <a href="#home" className="nav__brand">
                <Brand/>
            </a>
            <ul className="nav__links">
                {links.map(({id, label}) => (
                    <li key={id}>
                        <a
                            href={`#${id}`}
                            className={id === active ? "is-active" : undefined}
                            aria-current={id === active ? "location" : undefined}
                        >
                            {label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
