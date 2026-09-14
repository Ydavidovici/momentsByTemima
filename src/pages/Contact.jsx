export default function Contact() {
    return (
        <section className="page contact-page">
            <h1>Contact</h1>
            <p className="page__intro">
                I would love to hear from you! Please fill out the form below to get in touch.
            </p>
            <form className="contact-form" action="https://formsubmit.co/temimaedgar@gmail.com" method="POST">
                <label>
                    Name
                    <input type="text" name="name" required />
                </label>
                <label>
                    Email
                    <input type="email" name="email" required />
                </label>
                <label>
                    Message
                    <textarea name="message" rows="5" required></textarea>
                </label>
                <button type="submit" className="btn">Send Message</button>
            </form>
        </section>
    );
}
