import React from "react";
import { useNavigate } from "react-router-dom";
import { parseStoredUser } from "../utils/session";

const AdminTopbar = () => {
  const navigate = useNavigate();
  const user = parseStoredUser() || {};
  const isSupport = user.role === "support";

  return (
    <div className="topbar">
      <span>{isSupport ? "🎧 Customer Service Portal" : "🛡 Admin Control Panel"}</span>
      {isSupport && (
        <button type="button" className="update-btn" onClick={() => navigate("/support/customers")}>
          👤 Customer 360
        </button>
      )}
    </div>
  );
};

export default AdminTopbar;
