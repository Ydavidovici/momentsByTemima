import {useEffect, useRef, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import Brand from "./Brand.jsx";

// Most links are anchors to sections of the scrolling home page. Portfolio is
// its own page, so scrolling the home page skips it and visitors open it from
// the nav.
export const links = [
    {id: "home", label: "Home"},
    {id: "about", label: "About"},
    {id: "portfolio", label: "Portfolio", path: "/portfolio"},
    {id: "testimonials", label: "Testimonials"},
    {id: "contact", label: "Contact"},
];

const sectionLinks = links.filter((link) => !link.path);

// Scroll-spy for the home page: the active section is the last one whose top
// has reached the bottom of the sticky nav. At the very bottom of the page the
// last section wins, since it is too short to ever scroll up to the nav.
function useActiveSection(navRef, onHome) {
    const [active, setActive] = useState(sectionLinks[0].id);

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
            if (!onHome) return;
            const line = (navRef.current?.offsetHeight ?? 0) + 8;
            const atBottom =
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

            let current = sectionLinks[0].id;
            for (const {id} of sectionLinks) {
                const section = document.getElementById(id);
                if (section && section.getBoundingClientRect().top <= line) current = id;
            }
            setActive(atBottom ? sectionLinks[sectionLinks.length - 1].id : current);
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
    }, [navRef, onHome]);

    return active;
}

// On the home page a section link is a plain anchor, so the browser scrolls to
// it. From another page it goes to "/#id", and Home scrolls there once it has
// rendered.
function NavLink({link, onHome, isActive, children, className}) {
    const props = {
        className: [className, isActive && "is-active"].filter(Boolean).join(" ") || undefined,
        "aria-current": isActive ? (link.path ? "page" : "location") : undefined,
    };
    if (link.path) return <Link to={link.path} {...props}>{children}</Link>;
    if (onHome) return <a href={`#${link.id}`} {...props}>{children}</a>;
    return <Link to={`/#${link.id}`} {...props}>{children}</Link>;
}

export default function Nav() {
    const navRef = useRef(null);
    const {pathname} = useLocation();
    const onHome = pathname === "/";
    const section = useActiveSection(navRef, onHome);
    const active = onHome ? section : links.find((link) => link.path === pathname)?.id;

    return (
        <nav className="nav" ref={navRef}>
            <NavLink link={links[0]} onHome={onHome} className="nav__brand">
                <Brand/>
            </NavLink>
            <ul className="nav__links">
                {links.map((link) => (
                    <li key={link.id}>
                        <NavLink link={link} onHome={onHome} isActive={link.id === active}>
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
