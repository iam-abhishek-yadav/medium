import { Avatar } from "./BlogCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";

export const Appbar = () => {
	const [user, setUser] = useState<string>("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(`${BACKEND_URL}/api/v1/users`, {
					headers: {
						Authorization: token,
					},
				});
				setUser(response.data.user.name);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className='border-b flex justify-between px-10 py-4'>
			<Link
				to={"/blogs"}
				className='flex flex-col justify-center cursor-pointer'>
				<header className='header'>
					<nav className='navbar container mx-auto py-4'>
						<div className='logo text-xl font-bold'>Medium-Blog</div>
					</nav>
				</header>
			</Link>

			<div>
				<Link to={`/publish`}>
					<button
						type='button'
						className='mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 '>
						New
					</button>
				</Link>

				<Avatar
					size={"big"}
					name={user}
				/>
			</div>
		</div>
	);
};
