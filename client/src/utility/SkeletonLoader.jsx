import React from "react";

import "./SkeletonLoader.css";

const SkeletonLoader = () => {
  return (
    <main className="">
      <ul className="o-vertical-spacing o-vertical-spacing--l">
        <li className="blog-post o-media">
          <div className="o-media__figure">
            <span
              className="skeleton-box"
              style={{ width: "100px", height: "80px" }}
            ></span>
          </div>
          <div className="o-media__body">
            <div className="o-vertical-spacing">
              <h3 className="blog-post__headline">
                <span className="skeleton-box" style={{ width: "55%" }}></span>
              </h3>
              <p>
                <span className="skeleton-box" style={{ width: "80%" }}></span>
                <span className="skeleton-box" style={{ width: "90%" }}></span>
                <span className="skeleton-box" style={{ width: "83%" }}></span>
                <span className="skeleton-box" style={{ width: "80%" }}></span>
              </p>
              <div className="blog-post__meta">
                <span className="skeleton-box" style={{ width: "70px" }}></span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </main>
  );
};

export default SkeletonLoader;
