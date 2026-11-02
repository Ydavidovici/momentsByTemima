import {Routes, Route, Navigate} from "react-router-dom";
import Nav, {links} from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";

// The site is a single scrolling page. The old per-page URLs (and /gallery,
// from before it was renamed) redirect to their section's anchor.
const legacyPaths = [...links.slice(1).map(({id}) => [id, id]), ["gallery", "portfolio"]];

export default function App() {
    return (
        <>
            <Nav/>
            <main>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    {legacyPaths.map(([path, id]) => (
                        <Route key={path} path={`/${path}`} element={<Navigate to={`/#${id}`} replace/>}/>
                    ))}
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Routes>
            </main>
            <Footer/>
        </>
    );
}
