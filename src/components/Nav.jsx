import {NavLink} from "react-router-dom";
import Brand from "./Brand.jsx";

const links = [
    {to: "/", label: "Home", end: true},
    {to: "/about", label: "About"},
    {to: "/gallery", label: "Gallery"},
    {to: "/testimonials", label: "Testimonials"},
];

export default function Nav() {
    return (
        <nav className="nav">
            <NavLink to="/" className="nav__brand">
                <Brand/>
            </NavLink>
            <ul className="nav__links">
                {links.map(({to, label, end}) => (
                    <li key={to}>
                        <NavLink
                            to={to}
                            end={end}
                            className={({isActive}) => (isActive ? "is-active" : undefined)}
                        >
                            {label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
