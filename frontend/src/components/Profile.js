import React, { useEffect, useState } from "react";
import "./components.css";
import { BASE_URL } from "../services/api.js";

function Profile() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${BASE_URL}/customer/profile`, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });

        const result = await response.json();
        if (!response.ok) {
          setError(result.message || "Unable to fetch profile");
          return;
        }

        setData(result);
      } catch {
        setError("Server error while loading profile");
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-page">
      <section className="profile-card">
        <p className="profile-badge">👤 Customer Profile</p>
        <h2>Account Overview</h2>
        {error && <p className="auth-error">⚠ {error}</p>}

        {data ? (
          <div className="profile-grid">
            <article>
              <h4>📣 Message</h4>
              <p>{data.message}</p>
            </article>
            <article>
              <h4>🆔 User ID</h4>
              <p>{data.userId}</p>
            </article>
          </div>
        ) : (
          !error && <p className="panel-message">Loading profile...</p>
        )}
      </section>
    </div>
  );
}

export default Profile;
