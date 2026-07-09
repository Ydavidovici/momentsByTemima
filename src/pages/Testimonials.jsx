// Placeholder testimonials. Swap for real client quotes (or a CMS feed) later.
const testimonials = [
    {
        id: 1,
        quote: "Temima captured our day exactly as it felt — warm, joyful, and real.",
        author: "A happy client",
    },
    {
        id: 2,
        quote: "Every photo feels like a memory I get to step back into. Simply magic.",
        author: "Another kind soul",
    },
    {
        id: 3,
        quote: "Light, natural, and full of heart. We could not have asked for more.",
        author: "A grateful family",
    },
];

export default function Testimonials() {
    return (
        <section className="page">
            <h1>Client Testimonials</h1>
            <p className="page__intro">A few kind words from the people I've worked with.</p>
            <div className="testimonials">
                {testimonials.map(({id, quote, author}) => (
                    <figure key={id} className="testimonial">
                        <blockquote>“{quote}”</blockquote>
                        <cite>— {author}</cite>
                    </figure>
                ))}
            </div>
        </section>
    );
}
