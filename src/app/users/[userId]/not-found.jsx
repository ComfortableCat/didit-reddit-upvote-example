import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col text-center gap-5 mt-5">
      <p className="text-[60px]">This user does not exist</p>
      <Link href="/" className="text-purple-800">
        Back to home
      </Link>
    </div>
  );
}
