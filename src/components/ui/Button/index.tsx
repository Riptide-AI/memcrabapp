import React from "react";
import styles from "./styles.module.scss";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <button ref={ref} className={`${styles.button} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);


export default Button;