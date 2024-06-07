import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
	const navigate = useNavigate();

	return (
		<div className='bg-yellow-500 flex flex-col min-h-screen'>
			<header className='header bg-yellow-500 shadow'>
				<nav className='navbar container mx-auto py-4'>
					<div className='logo text-xl font-bold'>Medium-Blog</div>
				</nav>
			</header>
			<main className='flex-grow container mx-auto py-8 flex flex-col justify-center'>
				<section
					id='hero'
					className='hero-section bg-yellow-500 rounded-lg shadow-md p-8'>
					<div className='hero-text mb-8'>
						<h1 className='text-7xl font-bold mb-4'>Stay curious.</h1>
						<p className='text-gray-700'>
							Empowering Minds, Inspiring Voices: Where Ideas Flourish and
							Perspectives Collide.
						</p>
					</div>
					<div className='hero-buttons'>
						<button
							className='btn btn-primary bg-black text-white px-10 py-2 rounded-full mr-4'
							onClick={() => {
								navigate("/signup");
							}}>
							Start Reading
						</button>
					</div>
				</section>
			</main>

			<footer className='footer bg-gray-200 py-4 mt-auto'>
				<p className='text-center text-gray-600'>
					&copy; {new Date().getFullYear()} Medium-blog. All rights reserved.
				</p>
			</footer>
		</div>
	);
};
