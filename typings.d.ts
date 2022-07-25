export interface Post {
	_id: string;
	title: string;
	_createdAt: string;
	author: {
		name: string;
		image: string;
	};
	comments:Comments[]
	description: string;
	mainImage: {
		asset: {
			url: string;
		};
	};

	slug: {
		current: String;
	};
	body:  [object] ;
}


export interface Comments {
	approved:'boolean',
	comment:'string',
	_id:'string',
	email:'string',
	name:'string',
	post:{
		_ref:'strin'
		_type:'strin'
	},
	_createdAt:'string',
	_rev:'string',
	_type:'string',
	_updatedAt:'string'
}