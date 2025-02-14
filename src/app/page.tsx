"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

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

const createPost = async (newPost: Post): Promise<Post> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });
  if (!response.ok) {
    throw new Error("게시글 등록 실패");
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

  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [localPosts, setLocalPosts] = useState<Post[]>([]);

  const { mutate, isLoading: isMutating } = useMutation(createPost, {
    onSuccess: (newPost) => {
      setLocalPosts((prev) => [newPost, ...prev]);
      setNewTitle("");
      setNewBody("");
    },
    onError: (error) => {
      console.error("게시글 등록 실패:", error);
    },
  });

  const handleRefetch = () => {
    console.log("새로고침 시작");
    refetch()
      .then(() => console.log("데이터 새로 고침 완료"))
      .catch((err) => console.error("새로 고침 실패:", err));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: Post = {
      userId: 1,
      id: Math.floor(Math.random() * 10000),
      title: newTitle,
      body: newBody,
    };

    mutate(newPost);
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

      <h2>새로운 게시글 등록</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="body">내용</label>
          <textarea
            id="body"
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isMutating}>
          {isMutating ? "등록 중.." : "게시글 등록"}
        </button>
      </form>

      <ul>
        {[...localPosts, ...(data || [])].map((post) => (
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
