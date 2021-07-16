import React, {useState, useEffect} from "react";
import {Core} from '../Relast/core.js';

export default function Comp3(props)
{
	////////////////////////////////////////////
	////////////////////////////////////////////
	//COMPONENT STATES
	////////////////////////////////////////////
	////////////////////////////////////////////
	const [val, setVal] = useState('');


	////////////////////////////////////////////
	////////////////////////////////////////////
	//COMPONENT MODULE STATES
	// you can add states of this component
	// to manipulate from others components
	// Setter usage: Core.add_state('Comp3', '[compnent's state]', [component set state], [state value]);
	// Modify usage: Core.set_state('[component name]', '[state name]', [value]);
	// Getter usage: Core._mods.[Component name].states.[state name]; 
	////////////////////////////////////////////
	////////////////////////////////////////////
	Core.set_state('Comp3', 'val', setVal, val);


	////////////////////////////////////////////
	////////////////////////////////////////////
	//ACTIONS
	// you can add custom methods or functions as
	// actions to allow be called from others
	// components 
	// Add usage: Core.add_action('[Comp3 / name of other component]', '[action name]', ()=>{});
	// Call usage: Core.action('[component name]', 'action name', [args]);
	// Call array actions usage: Core.actions([{mod:'[component name]', action: 'action name'}, ...], [args]);
	////////////////////////////////////////////
	////////////////////////////////////////////

	useEffect(()=>{
		//effect
		return(()=>{
			//cleanup
		});
	}, []);

	return (
	<div>
		<h1>Hello Comp3 - {val}</h1>
	</div>
	);
}

Comp3.defaultProps ={
}