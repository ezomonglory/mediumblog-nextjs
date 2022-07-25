export default {
	name: "comment",
	title: "comment",
	type: "document",
	fields: [
		{
			name: "name",
			type: "string",
		},
		{
			name: "approved",
			title: "Approved",
			type: "boolean",
			description: "comment wont show without approval",
		},
		{
			name: "email",
			type: "string",
		},
		{
			name: "comment",
			type: "text",
		},
		{
			name: "post",
			type: "reference",
			to: [{ type: "post" }],
		},
	],
};
