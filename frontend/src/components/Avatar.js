import React from "react";
import styles from "../styles/Avatar.module.css";

const Avatar = ({ src, height = 45, text }) => {
  // Use the provided src, or fallback to the default image if src is not provided
  const imageSrc = src;

  return (
    <span>
      <img
        className={styles.Avatar}
        src={imageSrc}
        height={height}
        width={height}
        alt="avatar"
      />
      {text}
    </span>
  );
};

export default Avatar;
