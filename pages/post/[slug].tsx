import { GetStaticProps } from "next";
import React from "react";
import { useState } from "react";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props {
	post: Post;
}

interface inpuForm {
	_id: string;
	name: string;
	email: string;
	comment: string;
}

function Post({ post }: Props) {
	const [submitted, setSubmitted] = useState(false);
	console.log(post);
	const onSubmit: SubmitHandler<inpuForm> = async (data) => {
		await fetch("/api/createComment", {
			method: "POST",
			body: JSON.stringify(data),
		})
			.then(() => {
				setSubmitted(true);
				console.log(data);
			})
			.catch((error) => setSubmitted(false));
	};
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<inpuForm>();

	return (
		<main>
			<Header />
			<div>
				<img
					className='h-40 w-full object-cover'
					src={urlFor(post.mainImage).url()}
					alt=''
				/>
			</div>
			<article className='max-w-3xl mx-auto p-5'>
				<h1 className='text-3xl mt-10 mb-3'>{post.title} </h1>
				<h2 className='text-xl font-light text-gray-500 mb-2'>
					{post.description}
				</h2>

				<div className='items-center space-x-2 flex'>
					<img
						className='w-12 h-12 rounded-full'
						src={urlFor(post.author.image).width(40).height(40).url()!}
						alt=''
					/>
					<p className='font-extralight text-sm'>
						Blog Post By{" "}
						<span className='text-green-600'>{post.author.name}</span>{" "}
						-Published at {new Date(post._createdAt).toLocaleString("en-US")}
					</p>
				</div>

				<div className='mt-10'>
					<PortableText
						className=''
						dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
						projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
						content={post.body}
						serializers={{
							h1: (props: any) => {
								<h1 className='text-2xl font-bold my-5' {...props} />;
							},
							h2: (props: any) => {
								<h2 className='text-xl font-bold my-5' {...props} />;
							},
							li: ({ children }: any) => {
								<li className='ml-4 list-disk'>{children}</li>;
							},
							Link: ({ href, children }: any) => {
								<a href={href} className='text-blue-500 hover:underline'>
									{children}
								</a>;
							},
						}}
					/>
				</div>
			</article>
			<hr className='border border-yellow-500 mx-auto my-5 max-w-lg' />
			{submitted ? (
				<div className='flex flex-col p-10 my-10 bg-yellow-500 max-w-2xl mx-auto'>
					<h3 className='text-3xl font-bold'>
						Thank you for submitting your comment!
					</h3>
					<p>once it is approved it will appear below</p>
				</div>
			) : (
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='flex flex-col p-5 max-w-2xl mx-auto '
				>
					<h3 className='text-sm text-yellow-500'>Enjoy the article?</h3>
					<h4 className='font-bold text-3xl'>Leave a commnet bellow!</h4>
					<hr className='py-3 mt-2' />

					<input
						type='hidden'
						{...register("_id")}
						name='_id'
						value={post._id}
					/>

					<label className='block mb-5'>
						<span className='text-gray-700'>Name</span>
						<input
							{...register("name", { required: true })}
							className='block form-input w-full py-2 px-3 shadow border rounded focus:outline-yellow-500'
							placeholder='Name'
							type='text'
						/>
					</label>
					<label className='block mb-5'>
						<span className='text-gray-700'>Email</span>
						<input
							{...register("email", { required: true })}
							className='block form-input w-full py-2 px-3 shadow border rounded focus:outline-yellow-500'
							placeholder='Email'
							type='email'
						/>
					</label>
					<label className='block mb-5'>
						<span className='text-gray-700'>comment</span>
						<textarea
							{...register("comment", { required: true })}
							className='shadow border rounded px-3 form-texarea mt-1 block w-full outline-yellow-500 py-2 '
							placeholder='Name'
							rows={8}
						/>
					</label>

					{/* for errors handling when required value arent picked */}
					<div className='flex flex-col p-5'>
						{errors.name && (
							<span className='text-red-500'>This Name field is required</span>
						)}
						{errors.email && (
							<span className='text-red-500'>This Email field is required</span>
						)}
						{errors.comment && (
							<span className='text-red-500'>
								This Comment field is required
							</span>
						)}
					</div>

					<input
						type='submit'
						className='bg-yellow-500 hover:bg-yellow-400 focus:outline-yellow-500 px-4 py-2 border  cursor-pointer rounded-3xl '
					/>
				</form>
			)}
        	 {/* comments */}
			<div className="flex flex-col p-5 my-10 max-w-2xl mx-auto shadow shadow-yellow-500">
				<h3 className="text-4xl mb-2">Comments</h3>
                <hr className="pb-3"/>
                
                {post.comments.map((comment) => {
                    return (
                        <div key={comment._id}>
                        <p><span className="text-yellow-500">{comment.name}:</span> {"   "}{comment.comment}</p>
                    </div>
                    )
                })}
			</div>
		</main>
	);
}

export default Post;

export const getStaticPaths = async () => {
	const query = `*[_type == "post"]{
        _id,
        slug,       
      }`;

	const posts = await sanityClient.fetch(query);

	const paths = posts.map((post: Post) => ({
		params: {
			slug: post.slug.current,
		},
	}));

	return {
		paths,
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const query = ` *[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        slug,
        'comments': *[
            _type == "comment" &&
            post._ref == ^._id &&
            approved == true]    
        ,
        description,
		mainImage,
        body,
        author -> {
			name, 
			image
 }
}`;

	const post = await sanityClient.fetch(query, {
		slug: params?.slug,
	});

	if (!post) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			post,
		},
		revalidate: 60,
	};
};
