import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TourDetails() {
  const { slug } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/v1/tours?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.data.doc && data.data.doc.length > 0) {
          setTour(data.data.doc[0]);
        } else {
          setError("Tour not found");
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="loader"><div className="loader-spinner"></div></div>;
  if (error) return <div className="error glass"><h2>Error</h2><p>{error}</p></div>;
  if (!tour) return <div className="error glass"><h2>No Tour found!</h2></div>;

  return (
    <main className="tour-details">
      <section className="section-header glass">
        <div className="header__hero">
          <div className="header__hero-overlay">&nbsp;</div>
          <img
            className="header__hero-img"
            src={`/img/tours/${tour.imageCover}`}
            alt={tour.name}
            onError={e => {
              e.target.src = "/img/users/default.jpg";
            }}
          />
        </div>
        <div className="heading-box">
          <h1 className="heading-primary title-gradient">
            <span>{tour.name}</span>
          </h1>
          <div className="heading-box__group">
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/img/icons.svg#icon-clock" />
              </svg>
              <span className="heading-box__text">{tour.duration} days</span>
            </div>
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/img/icons.svg#icon-map-pin" />
              </svg>
              <span className="heading-box__text">{tour.startLocation.description}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-description glass">
        <div className="overview-box">
          <div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg title-gradient">Quick facts</h2>
              <div className="overview-box__detail">
                <svg className="overview-box__icon"><use xlinkHref="/img/icons.svg#icon-calendar" /></svg>
                <span className="overview-box__label">Next date</span>
                <span className="overview-box__text">{new Date(tour.startDates[0]).toLocaleString("en-us", { month: "long", year: "numeric" })}</span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon"><use xlinkHref="/img/icons.svg#icon-trending-up" /></svg>
                <span className="overview-box__label">Difficulty</span>
                <span className="overview-box__text">{tour.difficulty}</span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon"><use xlinkHref="/img/icons.svg#icon-user" /></svg>
                <span className="overview-box__label">Participants</span>
                <span className="overview-box__text">{tour.maxGroupSize} people</span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon"><use xlinkHref="/img/icons.svg#icon-star" /></svg>
                <span className="overview-box__label">Rating</span>
                <span className="overview-box__text">{tour.ratingsAverage} / 5</span>
              </div>
            </div>

            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg title-gradient">Your tour guides</h2>
              {tour.guides && tour.guides.map(guide => (
                <div className="overview-box__detail" key={guide._id}>
                  <img src={`/img/users/${guide.photo}`} alt={guide.name} className="overview-box__img" onError={e => e.target.src = "/img/users/default.jpg"}/>
                  <span className="overview-box__label">{guide.role === 'lead-guide' ? 'Lead guide' : 'Tour guide'}</span>
                  <span className="overview-box__text">{guide.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="description-box">
          <h2 className="heading-secondary ma-bt-lg title-gradient">About {tour.name} tour</h2>
          {tour.description && tour.description.split('\n').map((p, i) => (
            <p key={i} className="description__text">{p}</p>
          ))}
        </div>
      </section>

      <section className="section-pictures">
        {tour.images && tour.images.map((img, i) => (
          <div className="picture-box" key={i}>
            <img className={`picture-box__img picture-box__img--${i + 1}`} src={`/img/tours/${img}`} alt={`${tour.name} ${i + 1}`} onError={e => e.target.src = "/img/users/default.jpg"}/>
          </div>
        ))}
      </section>

      <section className="section-cta glass">
        <div className="cta">
          <div className="cta__img cta__img--logo">
            <img src="/img/logo-white.png" alt="Natours logo" />
          </div>
          {tour.images && tour.images.slice(0, 2).map((img, i) => (
            <img key={i} className={`cta__img cta__img--${i + 1}`} src={`/img/tours/${img}`} alt="Tour pic" onError={e => e.target.src = "/img/users/default.jpg"}/>
          ))}
          <div className="cta__content">
            <h2 className="heading-secondary title-gradient">What are you waiting for?</h2>
            <p className="cta__text">{tour.duration} days. 1 adventure. Infinite memories. Make it yours today!</p>
            <button className="btn btn--green span-all-rows">Book tour now!</button>
          </div>
        </div>
      </section>
    </main>
  );
}
