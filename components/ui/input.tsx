"use client";

import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  const previousValue = React.useRef<unknown>(props.value);
  const inputId = props.id ?? "(no id)";

  React.useEffect(() => {
    if (
      previousValue.current !== undefined &&
      props.value === undefined
    ) {
      console.error(
        `[INPUT DIAGNOSIS] "${inputId}" changed from a defined value to undefined.`,
        { previousValue: previousValue.current, currentValue: props.value }
      );
    }

    if (
      previousValue.current === undefined &&
      props.value !== undefined
    ) {
      console.error(
        `[INPUT DIAGNOSIS] "${inputId}" changed from undefined to a defined value.`,
        { currentValue: props.value }
      );
    }

    previousValue.current = props.value;
  }, [props.value, inputId]);

  return (
    <input
      {...props}
      className={`box-border w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );
}