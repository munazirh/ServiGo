import React from "react";
import { useLocation } from "react-router-dom";

const SUPPORT_PHONE = "7970503756";

function FixedCallButton() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) return null;

  return (
    <a className="fixed-call-btn" href={`tel:${SUPPORT_PHONE}`} aria-label="Call customer support now">
      📞 {SUPPORT_PHONE}
    </a>
  );
}

export default FixedCallButton;
