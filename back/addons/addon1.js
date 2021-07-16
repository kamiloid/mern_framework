exports.addon1 =
{
	test1: (data)=>{
		return new Promise((resolve, reject)=>
		{
			resolve(data.o);
		})
	},
	test2:(data)=>
	{
		data.o = {
			error: false,
			msg: '',
			asade: 11111
		};
		return new Promise((resolve, reject)=>
		{
			if(0)
				data.o = {error: true, msg: 'Error in test2'};
				
			resolve(data.o);
		});
	},
}