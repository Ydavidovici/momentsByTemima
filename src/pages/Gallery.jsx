// Placeholder gallery. Swap this hardcoded list for a CMS/JSON feed later
// (see designDoc.md — "Future Considerations").
const placeholders = [
  { id: 1, tint: 'var(--blush)' },
  { id: 2, tint: 'var(--sky)' },
  { id: 3, tint: 'var(--sage)' },
  { id: 4, tint: 'var(--cream-deep)' },
  { id: 5, tint: 'var(--sky)' },
  { id: 6, tint: 'var(--blush)' },
  { id: 7, tint: 'var(--sage)' },
  { id: 8, tint: 'var(--cream-deep)' },
]

export default function Gallery() {
  return (
    <section className="page">
      <h1>Gallery</h1>
      <p className="page__intro">
        A collection of favorite moments. (Placeholder tiles for now — real
        images drop straight in here.)
      </p>
      <div className="gallery-grid">
        {placeholders.map(({ id, tint }) => (
          <div
            key={id}
            className="gallery-grid__item"
            style={{ background: tint }}
          >
            {id}
          </div>
        ))}
      </div>
    </section>
  )
}
