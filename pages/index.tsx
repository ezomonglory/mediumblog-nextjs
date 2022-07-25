import Head from "next/head";
import Link from "next/link";
import React from "react";
import Header from "../components/Header";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";

interface Props {
	posts: [Post];
}
export default function Home({ posts }: Props) {
	console.log(posts)
	
	return (
		<div className='max-w-7xl mx-auto'>
			<Head>
				<title>Medium Blog</title>
				<link rel='icon' href='/favicon.io' />
			</Head>

			<Header />

			<div className='flex py-10 lg:py-0 bg-yellow-400 border-black border-y items-center  '>
				<div className='px-10 space-y-5'>
					<h1 className='text-4xl sm:text-6xl font-serif max-w-xl'>
						<span className='underline decoration-black decoration-4'>
							Medium
						</span>{" "}
						is a place to write, read and connect
					</h1>
					<h2>
						Its easy and free to post your thinking on any topic and connect
						with millions of readers
					</h2>
				</div>

				<img
					className='hidden md:inline-flex h-32 lg:h-full'
					src='https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png'
					alt=''
				/>
			</div>

			{/* Posts brought from sanity Cms */}
			<div className="grid grid-cols-1 gap-3 sm:gap:6 md:gap-6 md:p-2 sm:grid-cols-2 md:grid-cols-3 p-5">
				{posts.map(post => {
					return(
						<Link key={post._id} href={`/post/${post.slug.current}`}>
							<div className="group cursor-pointer border rounded-lg overflow-hidden">
								<img className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out" src={urlFor(post.mainImage).url()!} alt=""/>
								<div className="p-5 bg-white flex justify-between">
									<div >
										<p className="text-lg font-bold">{post.title}</p>	
										<p className="text-sm">{post.description} by {post.author.name}</p>
									</div>									
										<img className="w-12 h-12 rounded-full" src={urlFor(post.author.image).width(40).height(40).url()!} alt="" />									
								</div>
							</div>
						</Link>
					)
				})}
			</div>
		</div>
	);
}

export const getServerSideProps = async () => {
	const query = `
    *[_type == "post"]{
        _id,
        title,
        slug,
        description,
		mainImage,
        author -> {
			name, 
			image
		}
      }
    `;

	const posts = await sanityClient.fetch(query);


	return {
		props: {
			posts,
		},
	};
};
