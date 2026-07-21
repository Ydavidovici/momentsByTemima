// The wordmark: "Moments" renders in the curly script face (--font-script),
// "by Temima" stays in the serif face. Shared by the nav and the hero so the
// two never drift apart.
export default function Brand() {
    return (
        <>
            <span className="brand__script">Moments</span> by Temima
        </>
    );
}
