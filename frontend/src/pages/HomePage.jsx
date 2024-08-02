import React from "react";

export default function HomePage() {
  return (
    <div className="p-10 bg-cyan-100">
      <div className="rounded-lg bg-white flex items-start justify-start p-4">
        <div className="mr-4 rounded-lg w-[250px] h-[250px] overflow-hidden flex items-center justify-center">
          <img
            className="h-full w-full"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD4xLcjN1Nc3U5V-q-d_r80HMqNKCoiCdPuQ&s"
          />
        </div>
        <div>
          <h3 className="text-3xl font-semibold">Hi, Manik</h3>
          <p className="italic font-semibold text-stone-500"> 14 July, 2024</p>
        </div>
      </div>
    </div>
  );
}
