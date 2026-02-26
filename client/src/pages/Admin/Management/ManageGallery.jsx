import React, { useState } from "react";
import "./ManageGallery.css";

export default function ManageGallery() {

  const [images, setImages] = useState([
    { id: 1, url: "/assets/images/csadept.jpeg", caption: "Main Building" },
    { id: 2, url: "/assets/images/csa-giet2.jpeg", caption: "Computer Lab" },
  ]);

  return (
    <div className="manageGalleryPage">

      {/* HEADER */}
      <div className="galleryHeader">
        <div>
          <h2>Manage Gallery</h2>
          <p>Upload and organize department images</p>
        </div>

        <button className="uploadPhotoBtn">
          + Upload Photo
        </button>
      </div>

      {/* GRID */}

      {images.length === 0 ? (
        <div className="emptyBox">
          <h4>No Images Uploaded</h4>
          <p>Upload your first gallery image</p>
        </div>
      ) : (
        <div className="galleryGrid">

          {images.map((img) => (
            <div className="galleryCard" key={img.id}>

              <div className="imgWrapper">

                <img src={img.url} alt={img.caption} />

                <div className="imgOverlay">
                  <button>Delete</button>
                </div>

              </div>

              <div className="caption">
                {img.caption}
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
