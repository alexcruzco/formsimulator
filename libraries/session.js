/*
NATURALWEB.ROCKS
ALEXANDER CRUZ
FORM SIMULATOR EXTENSION
2016
*/

//LANGUAGE SYSTEM

var CURRENT_LANG = {};

var LANG = 
{
	loadLanguage:  function(lang)
	{
		if(lang == null || lang == "")
		{
			lang = "en";
		}
		document.write( '<scr' + 'ipt src="'+ LANG.getLanguageScriptPath() +'languages/' + lang + '.js"><\/scr' + 'ipt>' ) ;
	}
	,
	changeLanguage: function()
	{
		var inputs = document.getElementsByTagName("INPUT");
		for(var i = 0; i < inputs.length; i++)
		{
			if(inputs[i].type.toUpperCase() == "SUBMIT" || inputs[i].type.toUpperCase() == "BUTTON")
			{
				var original_value = jQuery(inputs[i]).data("original_value");
				if(original_value == "" || original_value == null)
				{
					jQuery(inputs[i]).data("original_value",inputs[i].value);
					original_value = inputs[i].value;
				}
				
				inputs[i].value = LANG.replaceWords(original_value);	
			}
		}
		var labels = document.getElementsByTagName("LABEL");
		for(var i = 0; i < labels.length; i++)
		{
			
			var original_value = jQuery(labels[i]).data("original_value");
			if(original_value == "" || original_value == null)
			{
				jQuery(labels[i]).data("original_value",labels[i].innerHTML);
				original_value = labels[i].innerHTML;
			}
			
			labels[i].innerHTML = LANG.replaceWords(original_value);	
			
		}
		var options = document.getElementsByTagName("OPTION");
		for(var i = 0; i < options.length; i++)
		{
			
			var original_value = jQuery(options[i]).data("original_value");
			if(original_value == "" || original_value == null)
			{
				jQuery(options[i]).data("original_value",options[i].text);
				original_value = options[i].text;
			}
			
			options[i].text = LANG.replaceWords(original_value);	
			
		}
	},
	replaceWords: function(string)
	{
		for (var key in CURRENT_LANG) 
		{
		  if (CURRENT_LANG.hasOwnProperty(key)) 
		  {
			while(string.indexOf(key) != -1)  
			{
				string = string.replace(key,CURRENT_LANG[key]);  
			}
		  }
		}		
		return string;
	},
	getWord: function(key)
	{
		return CURRENT_LANG[key];
	},
	getLanguageScriptPath: function()
	{
		var scripts = document.getElementsByTagName("script");
		var regex = /(.*\/)session/i;
		for(var i=0; i<scripts.length; i++)
		{
			var currentScriptSrc = scripts[i].src;
			if (currentScriptSrc.match(regex))
				return currentScriptSrc.match(regex)[1];
		}
		
		return null;
	}	
};

LANG.loadLanguage("es");
LANG.loadLanguage("en");


//SESSION SYSTEM

var CURRENT_SESSION = {};

var SESSION = 
{
	max_forms: 5,
	
	saveSession: function(params,doAfter)
	{
		SESSION.startLoading();
		
		//CHANGE LANGUAGE
		
		if(params.lang != null && params.lang != "")
		{
			switch(params.lang)
			{
				case "en":
					CURRENT_LANG = LANG_EN;
				break;	
				case "es":
					CURRENT_LANG = LANG_ES;
				break;	
				default:
					CURRENT_LANG = LANG_EN;
				break;	
			}
			LANG.changeLanguage();
			
		}
		
		//CHANGE SESSION
		
		for (var key in params) 
		{
		  if (params.hasOwnProperty(key)) 
		  {
			if(key == "simulations")  
			{
				var sims = params[key];
				if(sims != null)
				{
					for(var s = 0; s < sims.length; s++)				
					{
						var find = false;
						var sim = sims[s];
						var sims_session = CURRENT_SESSION["simulations"];	
						if(sims_session != null)
						{
							for(var ss = 0; ss < sims_session.length; ss++)				
							{
								var sim_session = sims_session[ss];
								if(sim.name == sim_session.name)
								{
									find = true;
									sims_session[ss] = sim;
								}
							}
							if(find == false)
							{
								sims_session.push(sim);	
							}
							CURRENT_SESSION["simulations"] = sims_session;
						}
						else
						{
							CURRENT_SESSION["simulations"] = [sim];
						}
					}
				}
			}
			else
			{
				CURRENT_SESSION[key] = params[key];  
			}
		  }
		}		
		
		
		
		chrome.storage.sync.set(CURRENT_SESSION, function() {
			
			try
			{
				  if(doAfter != null)
				  {
				  	doAfter(CURRENT_SESSION);	
				  }
			}
			catch(e)
			{
				
			}
			SESSION.stopLoading();
			
        });		
		
		
		
	},
	loadSession: function(filter,doAfter)
	{
		SESSION.startLoading();
		
		if(filter == null)
		{
			//DEFAULT SESSION
			CURRENT_SESSION = {max_forms: SESSION.max_forms};
			CURRENT_LANG = LANG_EN;
			LANG.changeLanguage();
		}
		
		
		
		
		chrome.storage.sync.get(filter, function(data) {
				
				
				try
				{
					if(data != null)
					{
						if(filter == null)
						{
							CURRENT_SESSION = data;
							
							
							var lang = data.lang;
							
							
							switch(lang)
							{
								case "en":
									CURRENT_LANG = LANG_EN;
								break;	
								case "es":
									CURRENT_LANG = LANG_ES;
								break;	
								default:
									CURRENT_LANG = LANG_EN;
								break;	
							}
						}
						
					}
					else
					{
						if(filter == null)
						{
							CURRENT_LANG = LANG_EN;
						}
					}
				}
				catch(e)
				{
					if(filter == null)
					{
						CURRENT_LANG = LANG_EN;
					}
				}
				
				if(filter == null)
				{
					LANG.changeLanguage();
				}
				
				var data_filtered = {};
				
				if(filter != null)
				{
					for(var f = 0; f < filter.length ; f++)
					{
					  var key = filter[f];	
					  data_filtered[key] = data[key];  
					}		
				}
				else
				{
					data_filtered = data;	
				}
				
				if(doAfter != null)
				{
					doAfter(data_filtered);	
				}
				
				SESSION.stopLoading();
				
				
			
        });	
		
		
				
		
	},
	startLoading : function()
	{
		jQuery(".loading").css("display","block");	
	},
	stopLoading: function()
	{
		jQuery(".loading").css("display","none");	
	}
	
};


window.addEventListener('load', function () {
	
	SESSION.loadSession(null);
	
	
});
