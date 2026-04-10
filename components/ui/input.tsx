"use client";

import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 border rounded-lg outline-none ${className}`}
    />
  );
}