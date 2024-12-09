import { UserInfo } from "@/components/UserInfo";
import { Vote } from "@/components/Vote";
import { db } from "@/db";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export default async function UserPage({ params }) {
  const userId = (await params).userId;
  const response = await db.query(
    "SELECT users.name, users.image FROM users WHERE users.id = $1",
    [userId]
  );
  if (response.rowCount === 0) {
    notFound();
  }
  const userInfo = await response.rows[0];
  const posts = (
    await db.query(
      "SELECT posts.title, posts.id , COALESCE(SUM(votes.vote), 0) AS vote_total FROM posts LEFT JOIN votes ON votes.post_id = posts.id WHERE posts.user_id = $1 GROUP BY posts.title, posts.id",
      [userId]
    )
  ).rows;
  return (
    <div className="max-w-screen-lg mx-auto pt-4 pr-4 gap-5">
      <div className="flex flex-col gap-5 w-4/5 border-2 border-black rounded-2xl mx-auto py-10 mb-5">
        <Image
          className="rounded-full mx-auto"
          src={userInfo.image}
          alt={userInfo.name}
          width={200}
          height={200}
        />
        <h1 className="text-center">{userInfo.name}</h1>
      </div>
      <div className="flex flex-col gap-5 w-4/5 border-2 border-black rounded-2xl mx-auto py-10 px-10 empty:hidden">
        {posts.length !== 0 && (
          <>
            <h1>{userInfo.name}&apos;s Posts:</h1>
            {posts.map((post) => {
              return (
                <li
                  key={post.id}
                  className=" py-4 flex space-x-6 hover:bg-zinc-200 rounded-lg"
                >
                  <Vote postId={post.id} votes={post.vote_total} />
                  <div>
                    <Link
                      href={`/post/${post.id}`}
                      className="text-3xl hover:text-pink-500"
                    >
                      {post.title}
                    </Link>
                  </div>
                </li>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
