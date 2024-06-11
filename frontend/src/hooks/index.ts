import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Blog {
	content: string;
	title: string;
	id: number;
	createdAt: Date;
	updatedAt: Date | null;
	author: {
		name: string;
	};
}

export interface Author {
	id: number;
	name: string;
	username: string;
	blogs: Blog[];
}

export const useBlog = ({ id }: { id: string }) => {
	const [loading, setLoading] = useState(true);
	const [blog, setBlog] = useState<Blog>();
	const [author, setAuthor] = useState<Author>();

	useEffect(() => {
		axios
			.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
				headers: {
					Authorization: localStorage.getItem("token"),
				},
			})
			.then((response) => {
				setBlog(response.data.blog);
				setAuthor(response.data.author);
				setLoading(false);
			});
	}, [id]);

	return {
		loading,
		blog,
		author,
	};
};

export const useBlogs = () => {
	const [loading, setLoading] = useState(true);
	const [blogs, setBlogs] = useState<Blog[]>([]);

	useEffect(() => {
		axios
			.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
				headers: {
					Authorization: localStorage.getItem("token"),
				},
			})
			.then((response) => {
				setBlogs(response.data.blogs);
				setLoading(false);
			});
	}, []);

	return {
		loading,
		blogs,
	};
};
