import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ title = "Natours", children }) {
  return (
    <>
      {/* HEAD PART (handled by index.html / React Helmet later) */}

      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <main>
        {children ? children : <h1>This is Placeholder</h1>}
      </main>

      {/* FOOTER */}
      <Footer />

      {/* External scripts (Leaflet) */}
      <script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
      ></script>
    </>
  );
}
