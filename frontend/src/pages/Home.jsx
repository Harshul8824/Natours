import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetch("/api/v1/tours")
      .then(res => res.json())
      .then(data => {
        setTours(data.data.doc);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <main className="main">
      <div className="card-container">
        {tours.map(tour => (
          <div className="card" key={tour._id}>
            {/* CARD HEADER */}
            <div className="card__header">
              <div className="card__picture">
                <div className="card__picture-overlay">&nbsp;</div>
                <img
                  className="card__picture-img"
                  src={`/img/tours/${tour.imageCover}`}
                  alt={tour.name}
                  onError={e => {
                    e.target.src = "/img/users/default.jpg";
                  }}
                />
              </div>

              <h3 className="heading-tertirary">
                <span>{tour.name}</span>
              </h3>
            </div>

            {/* CARD DETAILS */}
            <div className="card__details">
              <h4 className="card__sub-heading">
                {tour.difficulty} {tour.duration}
              </h4>

              <p className="card__text">{tour.summary}</p>

              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-map-pin" />
                </svg>
                <span>{tour.startLocation.description}</span>
              </div>

              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-calendar" />
                </svg>
                <span>
                  {new Date(tour.startDates[0]).toLocaleString("en-us", {
                    month: "long",
                    year: "numeric"
                  })}
                </span>
              </div>

              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-flag" />
                </svg>
                <span>{tour.locations.length} stops</span>
              </div>

              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-user" />
                </svg>
                <span>{tour.maxGroupSize} people</span>
              </div>
            </div>

            {/* CARD FOOTER */}
            <div className="card__footer">
              <p>
                <span className="card__footer-value">${tour.price}</span>{" "}
                <span className="card__footer-text">per person</span>
              </p>

              <p className="card__ratings">
                <span className="card__footer-value">
                  {tour.ratingsAverage.toFixed(2)}
                </span>{" "}
                <span className="card__footer-text">
                  rating ({tour.ratingsQuantity})
                </span>
              </p>

              <Link
                className="btn btn--green btn--small"
                to={`/tour/${tour.slug}`}
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
