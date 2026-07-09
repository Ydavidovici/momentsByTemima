import {Link} from "react-router-dom";

export default function Home() {
    return (
        <>
            <section className="hero">
                <div>
                    <h1>Moments by Temima</h1>
                    <p>
                        Light, airy, and happy photography — celebrating the little moments
                        that make up a life well lived.
                    </p>
                    <Link to="/gallery" className="btn">
                        View the gallery
                    </Link>
                </div>
            </section>

            <section className="page">
                <h2>Hello, and welcome</h2>
                <p className="page__intro">
                    This is a warm, quiet corner of the internet dedicated to capturing
                    moments as they truly feel — soft, honest, and full of light. Take a
                    look around, read a few kind words from past clients, and get to know
                    the person behind the lens.
                </p>
            </section>
        </>
    );
}
