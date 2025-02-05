import React from "react";
import styles from "./styles.module.scss"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <div className={`${styles.inputContainer} ${className}`}>
        {props.title && <label className={styles.label}>{props.title}</label>}
        <input ref={ref} className={styles.input} {...props} />
      </div>
    );
  }
);


export default Input;
