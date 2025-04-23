"use client"; // Ensures this runs only on the client side

//import React from "react";
import dynamic from "next/dynamic";

// Dynamically import Excalidraw to avoid SSR issues
const Excalidraw = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw");
    return mod.Excalidraw; // Ensure correct reference
  },
  { ssr: false } // Disable SSR
);

export default function ExcalidrawWrapper() {
  return (
    <div className="h-full w-full">
      <Excalidraw />
    </div>
  );
}
/*
const ExcalidrawWrapper = () => {
  return (
    <div className="h-full w-full">
      <Excalidraw />;
    </div>
  );
};

export default ExcalidrawWrapper;
*/

/*
// Dynamically import the wrapper component
export default dynamic(() => Promise.resolve(ExcalidrawWrapper), {
  ssr: false, // Disable server-side rendering
  loading: () => <p>Loading Excalidraw...</p>, // Optional: Add a loading state
});*/