"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!response.ok) {
    throw new Error("데이터 불러오기 실패");
  }
  return response.json();
};

const Page = () => {
  const { data, isLoading, isError, error, refetch } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });

  const handleRefetch = () => {
    console.log("새로고침 시작");
    refetch()
      .then(() => console.log("데이터 새로 고침 완료"))
      .catch((err) => console.error("새로 고침 실패:", err));
  };

  if (isLoading) {
    return <div>로딩 중..</div>;
  }

  if (isError) {
    return (
      <div>{error instanceof Error ? error.message : "알 수 없는 에러"}</div>
    );
  }

  return (
    <div>
      <h1>전체 게시글 목록</h1>
      <button onClick={handleRefetch}>refetch</button>
      <ul>
        {data?.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
