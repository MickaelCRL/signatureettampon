import React, { useEffect, useRef } from "react";

const UserPopup = ({
  isPopupOpen,
  setIsPopupOpen: setIsPopupOpen,
}: {
  isPopupOpen: boolean;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const closePopup = (e: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      setIsPopupOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closePopup);
    return () => {
      document.removeEventListener("mousedown", closePopup);
    };
  }, []);

  return (
    <div ref={popupRef} className="user-popup">
      <p>Se déconnecter</p>
    </div>
  );
};

export default UserPopup;
