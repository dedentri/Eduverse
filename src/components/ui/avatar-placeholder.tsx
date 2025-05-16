
import React from "react";

interface AvatarPlaceholderProps {
  name: string;
  className?: string;
}

export function AvatarPlaceholder({ name, className = "" }: AvatarPlaceholderProps) {
  // Get initials from name
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  // Generate a consistent pastel color based on the name
  const hue = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
  
  const backgroundColor = `hsl(${hue}, 70%, 85%)`;
  const textColor = `hsl(${hue}, 70%, 30%)`;

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gray-100 ${className}`}
      style={{ backgroundColor }}
    >
      <span style={{ color: textColor }} className="font-medium">
        {initials}
      </span>
    </div>
  );
}
