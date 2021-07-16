import React, {useState, useEffect} from "react";
import {Core} from '../Relast/core.js'

export default function Comp2(props)
{
	const [val, setVal] = useState('');


	useEffect(()=>{
		return(()=>{
		});
	}, []);

	return (
	<div>
		<h1>Hello Comp2 - {val}</h1>
		<input type='text' onChange={(e)=>{
			Core.actions([{
				mod: 'Comp1',
				action: 'set_val'
			}], e.target.value);
		}} />
		<input type='text' onChange={(e)=>{Core.set_state('Comp1', 'val', e.target.value)}} />
	</div>
	);
}

Comp2.defaultProps ={
}