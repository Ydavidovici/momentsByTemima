// Placeholder testimonials. Swap for real client quotes (or a CMS feed) later.
const testimonials = [
    {
        id: 1,
        quote: "Temima has a very easy-going and creative nature, which made working with her a pleasure. Our vision truly came alive under her guidance and skill; we will cherish the photos forever!",
        author: "Chaya and Shmueli Cohn",
    },
    {
        id: 4,
        quote: "We had a wonderful experience with Temima for our family photoshoot! She was so patient and great with the kids, and she captured such beautiful moments. We absolutely love how the pictures turned out. Highly recommend her!",
        author: "TGL",
    },
    {
        id: 5, 
        quote: "Temima was a pleasure to work with! She was amazing with the kids and the photos are stunning!", 
        author: "SK"
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
