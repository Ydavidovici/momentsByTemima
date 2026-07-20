// The wordmark: "Moments" stays in the serif face, "by Temima" renders in
// the curly script face (--font-script). Shared by the nav and the hero so
// the two never drift apart.
export default function Brand() {
    return (
        <>
            Moments <span className="brand__script">by Temima</span>
        </>
    );
}
