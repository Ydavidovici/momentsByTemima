// The brand wordmark is the supplied logo (public/moments-by-temima.png),
// trimmed to its bounding box and given a transparent background (its original
// solid gray backdrop was keyed out via luminance-to-alpha). Shared by the nav
// and the hero.
export default function Brand() {
    return (
        <img
            className="brand__logo"
            src="/moments-by-temima.png"
            alt="Moments by Temima"
        />
    );
}
