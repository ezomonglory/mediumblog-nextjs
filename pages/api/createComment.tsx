// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sanityClient from "@sanity/client"

const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	apiVersion: "2021-10-21", // Learn more: https://www.sanity.io/docs/api-versioning
	/**
	 * Set useCdn to `false` if your application require the freshest possible
	 * data always (potentially slightly slower and a bit more expensive).
	 * Authenticated request (like preview) will always bypass the CDN
	 **/
	useCdn: process.env.NODE_ENV === "production",
    token: process.env.SANITY_API_TOKEN
}



const client = sanityClient(config)

export default async function createComment(req, res) {
    const {_id, name,  comment, email } = JSON.parse(req.body)

    try {
        await client.create({
            _type:"comment",
            post:{
                _type:"reference",
                _ref:_id,
            },
            name,
            email,
            comment,
        })
    } catch (error) {
        console.log("bastard no work oh")
        return res.status(500).json({message: "Couldn't submit comment", error})
    }
    console.log("comment submitted")
    return res.status(200).json({ message: "comment submitted!" })
  }
  