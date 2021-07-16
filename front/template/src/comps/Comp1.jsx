import React, {useState, useEffect} from "react";
import {Core} from '../Relast/core.js'

export default function Comp1(props)
{
	const [val, setVal] = useState('aaa');

	Core.add_state(Core._mods.Comp1, 'val', setVal, val);
	Core.add_action('Comp1', 'set_val', (data)=>
		{
			setVal(data);
			Core.mod_state('App', '_flag', 3);
		});

	useEffect(()=>{
	}, []);

	return (
	<div>
		<h1>Hello Comp1 - {val}</h1>
	</div>
	);
}

Comp1.defaultProps ={
}