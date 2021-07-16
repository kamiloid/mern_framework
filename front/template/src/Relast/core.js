////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//CORE
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
export const Core =
{
	_mods: {},
	//CREATE_MOD
	//mod[string]: name of component
	create_mod:function(mod)
	{
		if(!mod) return;
		if(mod.replace(/\s/g) === '') return;
		this._mods[mod] = {
			states:{},
			actions: {}
		};
	},
	//CREATE_MODS
	//mods[array]: names of components
	create_mods:function(mods)
	{
		if(!mods) return;
		for(let m of mods)
			this.create_mod(m);
	},
	add_state:function(mod, k, f, v)
	{
		let m = mod;
		if(!m) return;
		if(typeof(m) == 'string')
		{
			if(!this._mods[mod])
				this.create_mod(mod);
			m = this._mods[mod];
		}
		let state_f = `set${k.substr(0, 1).toUpperCase() + k.substr(1, k.length - 1)}`;
		m.states[k] = v;
		m.states[state_f] = f;
	},
	set_state: function(mod, k, v)
	{
		let m = mod;
		if(!m) return;
		if(typeof(m) == 'string') m = this._mods[mod];
		if(!m) return;
		let state_f = `set${k.substr(0, 1).toUpperCase() + k.substr(1, k.length - 1)}`;
		if(!m.states[state_f]) return;
		m.states[state_f](v);
	},
	add_action:function(mod, k, action)
	{
		let m = mod;
		if(!m) return;
		if(typeof(m) == 'string')
		{
			if(!this._mods[mod])
				this.create_mod(mod);
			m = this._mods[mod];
		}
		m.actions[k] = action;
	},
	action:function(mod, action, args)
	{
		let m = mod;
		if(!m) return;
		if(typeof(m) == 'string') m = this._mods[mod];
		if(!m) return;
		if(!m.actions[action]) return;
		if(typeof(m.actions[action]) != 'function') return;

		m.actions[action](args);
	},
	actions: function(actions, args)
	{
		if(!actions) return;
		if(!Array.isArray(actions)) return;

		for(let a of actions)
			this.action(a.mod, a.action, args);
	}
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//DATE
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
export const Math =
{
	int:(num)=>{return parseInt(num);}
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//DATE
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
export const DATE =
{
	_months:{
		full:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Dicember'],
		pref:['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dic']
	},
	_days: {
		full:['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		pref:['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Frid', 'Sat']
	},
	now:()=>{ return new Date(); },
	ms2secs:(ms)=>{ return ms / 1000; },
	sec2mins:(secs)=>{ return secs / 60; },
	mins2hours:(mins)=>{ return mins / 60; },
	human_timer:(timer_data)=>
	{
		let human_time = '';
		if(timer_data.h !== null || timer_data.h !== undefined)
			human_time += timer_data.h < 10 ? `0${timer_data.h}:` : `${timer_data.h}:`;
		if(timer_data.m !== null || timer_data.m !== undefined)
			human_time += timer_data.m < 10 ? `0${timer_data.m}:` : `${timer_data.m}:`;
		if(timer_data.s !== null || timer_data.s !== undefined)
			human_time += timer_data.s < 10 ? `0${timer_data.s}` : `${timer_data.s}`;
		return human_time;
	},
	human_date:function(date=null)
	{
		if(date == null) date = this.now();
		return `${this._days.pref[date.getDay()]} ${date.getDate()} of ${this._months.pref[date.getMonth()]} ${date.getFullYear()}`;
	}
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//HTTP APIs
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
export const Net =
{
	_uri: '',
	_cmds: {},
	set_uri: function(uri){this._uri = uri;},
	add_cmd: function(k, cmd, method=Net.methods.post, type=Net.content_type.json)
	{
		this._cmds[k] = {cmd: cmd, method: method, type:type };
	},
	net_hint:(addon, cmd, args)=>
	{
		if(!addon || !cmd || !args) return;
		if(typeof(args) !== 'object') return;
		return {
			addon: addon,
			cmd: cmd,
			args: args
		};
	},
	send:function(k, args, callback = null, success_actions = null, error_actions = null, error_server_actions = null)
	{
		let cmd = this._cmds[k];
		if(cmd === null) return;
		const data = {
			method: cmd.method,
			headers: { 'Content-Type': cmd.type }
		};
		if(cmd.method === Net.methods.post)
			data['body'] = JSON.stringify(args);

		fetch(`${this._uri}/${cmd.cmd}`, data).then(res=>
			{
				if(res.status !== 200)
				{
					if(error_server_actions)
					{
						if(Array.isArray(error_server_actions))
							Core.actions(error_server_actions);
						else
							Core.action(error_server_actions);
					}
					return;
				}
				res.json().then((o)=>
					{
						if(o.error)
						{
							if(error_actions)
							{
								if(Array.isArray(error_actions))
									Core.actions(error_actions, o);
								else
									Core.action(error_actions, o);
							}
							return;
						}else{
							if(success_actions)
							{
								if(Array.isArray(success_actions))
									Core.actions(success_actions, o);
								else
									Core.action(success_actions, o);
							}

							if(callback)
								callback(o);
						}
					});
			});
	}
}
Net.methods ={
	post: 'POST',
	get: 'GET',
	put: 'PUT',
	delete: 'DELETE'
}
Net.content_type ={
	json: 'application/json'
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//APP NAVIGATION
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

export const Nav =
{
	_sections:[],
	get_sections:function(){return this._sections; },
	add_section:function(section_name, section_label, mod_name, section_parent = '')
	{
		let sec = this.get_section(section_name);
		if(sec !== null) return;
		let section =
		{
			name: section_name,
			label: section_label,
			mod: mod_name,
			parent: section_parent,
			active: true
		}
		this._sections.push(section);
	},
	//ADD_SECTIONS
	//data[objects array]:
	//	-name[string]: section name
	//	-label[string]: section label
	//	-mod[string]: module/component name
	//	-parent[string]: parent section name
	add_sections:function(data = [])
	{
		if(data === null) return;
		if(!Array.isArray(data)) return;
		for(let sec of data)
		{
			if(!sec.name) continue;
			if(!sec.label) sec['label'] = sec.name;
			this.add_section(
				sec.name, sec.label, 
				sec.mod ? sec.mod : null, 
				sec.parent ? sec.parent : null);
		}
	},
	get_section: function(section_name)
	{
		for(let sec of this._sections)
			if(sec.name === section_name)
				return sec;
		return null;
	},
	get_childs:function(section_name)
	{
		let childs = [];
		for(let sec of this._sections)
			if(sec.parent === section_name)
				childs.push(sec);
		return childs;
	},
	get_parent:function(section_name)
	{
		let sec = this.get_section(section_name);
		return this.get_section(sec.parent);
	},
	enable_section: function(section_name)
	{
		let sec = this.get_section(section_name);
		if(sec) sec.active = true;
	},
	disable_section: function(section_name)
	{
		let sec = this.get_section(section_name);
		if(sec) sec.active = false;
	},
	enable_all: function()
	{
		for(let sec of this._sections)
			this.enable_section(sec.name);
	},
	disable_all: function()
	{
		for(let sec of this._sections)
			this.disable_section(sec.name);
	}
}