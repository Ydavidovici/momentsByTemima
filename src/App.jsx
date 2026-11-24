import {useEffect} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import Nav, {links} from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Portfolio from "./pages/Portfolio.jsx";

// The home page scrolls through its sections. The old per-page URLs redirect
// to their section's anchor; Portfolio is its own page (/gallery is its name
// from before the rename).
const legacyPaths = links.slice(1).filter((link) => !link.path).map(({id}) => [id, `/#${id}`]);
legacyPaths.push(["gallery", "/portfolio"]);

function PortfolioPage() {
    // Opening the page from partway down the home page should start at its top.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return <Portfolio/>;
}

export default function App() {
    return (
        <>
            <Nav/>
            <main>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/portfolio" element={<PortfolioPage/>}/>
                    {legacyPaths.map(([path, to]) => (
                        <Route key={path} path={`/${path}`} element={<Navigate to={to} replace/>}/>
                    ))}
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Routes>
            </main>
            <Footer/>
        </>
    );
}
