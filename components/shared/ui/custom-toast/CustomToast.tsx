"use client";
import { useEffect } from "react";
import { addToast } from "@heroui/react";

interface CustomToastProps {
  title: string;
  description?: string;
  timeout?: number;
  hideIcon?: boolean;
  shouldShowTimeoutProgress?: boolean;
  variant?: "flat" | "solid" | "bordered";
  icon?: React.ReactNode;
  endContent?: React.ReactNode;
  promise?: Promise<any>;
}

export const CustomToast: React.FC<CustomToastProps> = ({
  title,
  description,
  variant = "flat",
  icon,
  timeout,
  shouldShowTimeoutProgress,
  endContent,
  promise,
  hideIcon,
}) => {
  const handleAddToast = () => {
    addToast({
      title,
      description,
      icon,
      timeout,
      shouldShowTimeoutProgress,
      endContent,
      promise,
      hideIcon,
      variant,
    });
  };

  useEffect(() => {
    handleAddToast();
  }, []);

  return null;
};
