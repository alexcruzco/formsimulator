/*
NATURALWEB.ROCKS
ALEXANDER CRUZ
FORM SIMULATOR EXTENSION
2016
*/

//CURRENT FORM SIMULATOR OBJECT

var CURRENT_FSO = null;

//CURRENT CONNECT

var CURRENT_CONNECT = null;

//CURRENT ELEMENTS ADDED EVENTS BOOLEAN

var CURRENT_ELEMENTS_EVENTS_ADDED = false;


//FORM SIMULATOR STATES

var FORMSIMULATOR_STATES = 
{
	NO_EVENTS_TO_SIMULATE : -1,
	
	RECORDING : 1,

	STOPPED : 2,

	RECORDED : 3,

	SIMULATING : 4,

	SIMULATED : 5,
	
	SIMULATION_SAVED: 6,
	
	NO_SIMULATION_TO_SAVE: 7,
	
	SIMULATION_LOADED: 8
	

}

//OBJECT FORMSIMULATOR THAT SAVE EVENT
function FORMSIMULATOR_EVENT()
{
	//TYPE OF EVENT STRING: 
	//KEYUP, KEYDOWN, CLICK, SUBMIT, FOCUS
	this.type = null;

	//TAG OF ELEMENT
	this.tag = null;
	
	//NAME OF ELEMENT
	this.name = null;

	//INDEX OF ELEMENT (INDEX PREVENTS REPEATED NAMES OR IDS)
	this.index = null;

	//ID OF ELEMENT
	this.id = null;
	
	//EVENT CURRENT STRING
	this.string = null;

	//EVENT KEY
	this.key = null;

	//EVENT X CURSOR
	this.x = 0;

	//EVENT Y CURSOR
	this.y = 0;
	
	//FORM NAME 
	this.form_name = null;

	//FORM ID
	this.form_id = null;
	
	//LOAD INDEX
	this.load_index = 0;
	
}



//OBJECT FORMSIMULATOR
var FORMSIMULATOR_CONTENT =
{
	startRecording : function(fso)
	{
		
		if(fso.load_index == 0)
		{
			fso.load_index = 1;
		}
		
		CURRENT_FSO = fso;
		
		fso.recording = true;
		
		//CREATE REFERENCE TO OBJECT
		var that = fso;
		
		FORMSIMULATOR_CONTENT.closeSimulationTimesBox(that);			
		
		
		CURRENT_CONNECT = chrome.runtime.connect({name: "STARTRECORDING"});
		
		//BIND EVENTS OF ELEMENTS
		if(CURRENT_ELEMENTS_EVENTS_ADDED == false)
		{
			
			CURRENT_ELEMENTS_EVENTS_ADDED = true;
			
			//INDIVIDUAL INPUT EVENTS
			
			var inputs = document.getElementsByTagName("INPUT");
			
			for(var i = 0; i < inputs.length; i++)
			{
				var input = inputs[i];
				
				//EXCLUDE INPUTS TYPE FILE
				if(input.type.toUpperCase() == "FILE")
				{
					continue;	
				}
				
				var att = document.createAttribute("formsimulatoritem");
				att.value = i;
				input.setAttributeNode(att);				
				input.addEventListener("focus",function(ev)
				{
					if(CURRENT_FSO.recording == true)
					{
						var fe = new FORMSIMULATOR_EVENT();
						fe.type = "FOCUS";
						fe.tag = "INPUT";
						fe.name = ev.target.name;
						fe.id = ev.target.id;
						
						var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
						
					    if(form != null && form.getAttribute("name") != "")
						{
							fe.form_name = form.getAttribute("name")
						}
						if( form != null && form.getAttribute("id") != "")
						{
							fe.form_id = form.getAttribute("id");
						}
						
						fe.index = ev.target.getAttribute("formsimulatoritem");
						
						fe.load_index = CURRENT_FSO.load_index;
						
						CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;

						CURRENT_CONNECT.postMessage(CURRENT_FSO);
						
					}
				},false);
				
				input.addEventListener("keydown",function(ev)
				{
					if(CURRENT_FSO.recording == true)
					{
						var fe = new FORMSIMULATOR_EVENT();
						fe.type = "KEYDOWN";
						fe.tag = "INPUT";
						fe.name = ev.target.name;
						fe.id = ev.target.id;
						fe.string = ev.target.value;
						fe.key = String.fromCharCode(ev.keyCode);
						
						var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
						
					    if(form != null && form.getAttribute("name") != "")
						{
							fe.form_name = form.getAttribute("name")
						}
						if( form != null && form.getAttribute("id") != "")
						{
							fe.form_id = form.getAttribute("id");
						}

						fe.index = ev.target.getAttribute("formsimulatoritem");
						fe.load_index = CURRENT_FSO.load_index;
						
						CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;
						
						CURRENT_CONNECT.postMessage(CURRENT_FSO);
						
					}
				},false);
		
				input.addEventListener("keyup",function(ev)
				{
					if(CURRENT_FSO.recording == true)
					{
						var fe = new FORMSIMULATOR_EVENT();
						fe.type = "KEYUP";

						fe.tag = "INPUT";
						fe.name = ev.target.name;
						fe.id = ev.target.id;
						fe.string = ev.target.value;
						fe.key = String.fromCharCode(ev.keyCode);
						
						var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
						
					    if(form != null && form.getAttribute("name") != "")
						{
							fe.form_name = form.getAttribute("name")
						}
						if( form != null && form.getAttribute("id") != "")
						{
							fe.form_id = form.getAttribute("id");
						}

						fe.index = ev.target.getAttribute("formsimulatoritem");
						fe.load_index = CURRENT_FSO.load_index;
						
						CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;
						
						CURRENT_CONNECT.postMessage(CURRENT_FSO);
						
					}
				},false);


				input.addEventListener("click",function(ev)
				{
					if(CURRENT_FSO.recording == true && ev.target.type.toUpperCase() != "CHECKBOX" && ev.target.type.toUpperCase() != "RADIO")
					{
						var fe = new FORMSIMULATOR_EVENT();
						fe.type = "CLICK";
						fe.tag = "INPUT";
						fe.name = ev.target.name;
						fe.id = ev.target.id;
						
						var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
						
					    if(form != null && form.getAttribute("name") != "")
						{
							fe.form_name = form.getAttribute("name")
						}
						if( form != null && form.getAttribute("id") != "")
						{
							fe.form_id = form.getAttribute("id");
						}

						fe.index = ev.target.getAttribute("formsimulatoritem");
						fe.load_index = CURRENT_FSO.load_index;
						
						CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;
						
						CURRENT_CONNECT.postMessage(CURRENT_FSO);
						
					}
				},false);
				
				
				input.addEventListener("change",function(ev)
				{
					if(CURRENT_FSO.recording == true)
					{
						var fe = new FORMSIMULATOR_EVENT();
						
						if( ev.target.type.toUpperCase() == "CHECKBOX" || ev.target.type.toUpperCase() == "RADIO")
						{
							if( ev.target.checked == true )
							{
								fe.type = "CHECK";
							}
							else
							{
								fe.type = "UNCHECK";
							}
						}
						else
						{
							fe.type = "CHANGE";
						}
						fe.tag = "INPUT";
						fe.name = ev.target.name;
						fe.string = ev.target.value;
						fe.id = ev.target.id;
						var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
						
					    if(form != null && form.getAttribute("name") != "")
						{
							fe.form_name = form.getAttribute("name")
						}
						if( form != null && form.getAttribute("id") != "")
						{
							fe.form_id = form.getAttribute("id");
						}
						
						fe.index = ev.target.getAttribute("formsimulatoritem");
						
						fe.load_index = CURRENT_FSO.load_index;
						
						CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;

						CURRENT_CONNECT.postMessage(CURRENT_FSO);
						
					}
				},false);
				
				
				
			}





			//INDIVIDUAL SELECT EVENTS
			
			var selects = document.getElementsByTagName("SELECT");
			
			for(var i = 0; i < selects.length; i++)
			{
				var select = selects[i];
				var att = document.createAttribute("formsimulatoritem");
				att.value = i;
				select.setAttributeNode(att);				
				select.addEventListener("focus",function(ev)
				{
					if(CURRENT_FSO.recording == true)
					{
						var fe = new FORMSIMULATOR_EVENT();
						fe.type = "FOCUS";
						fe.tag = "SELECT";
						fe.name = ev.target.name;
						fe.id = ev.target.id;
						
						var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
						
					    if(form != null && form.getAttribute("name") != "")
						{
							fe.form_name = form.getAttribute("name")
						}
						if( form != null && form.getAttribute("id") != "")
						{
							fe.form_id = form.getAttribute("id");
						}

						fe.index = ev.target.getAttribute("formsimulatoritem");
						fe.load_index = CURRENT_FSO.load_index;
						
						CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;
						
						CURRENT_CONNECT.postMessage(CURRENT_FSO);
						
					}
				},false);
				
				select.addEventListener("keydown",function(ev)
				{
					if(CURRENT_FSO.recording == true)
					{
						var fe = new FORMSIMULATOR_EVENT();
						fe.type = "KEYDOWN";
						fe.tag = "SELECT";
						fe.name = ev.target.name;
						fe.id = ev.target.id;
						fe.string = ev.target.value;
						fe.key = String.fromCharCode(ev.keyCode);
						
						var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
						
					    if(form != null && form.getAttribute("name") != "")
						{
							fe.form_name = form.getAttribute("name")
						}
						if( form != null && form.getAttribute("id") != "")
						{
							fe.form_id = form.getAttribute("id");
						}

						fe.index = ev.target.getAttribute("formsimulatoritem");
						fe.load_index = CURRENT_FSO.load_index;
						
						CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;
						
						CURRENT_CONNECT.postMessage(CURRENT_FSO);
						
					}
				},false);
		
				select.addEventListener("keyup",function(ev)
				{
					if(CURRENT_FSO.recording == true)
					{
						var fe = new FORMSIMULATOR_EVENT();
						fe.type = "KEYUP";
						fe.tag = "SELECT";
						fe.name = ev.target.name;
						fe.id = ev.target.id;
						fe.string = ev.target.value;
						fe.key = String.fromCharCode(ev.keyCode);
						
						var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
						
					    if(form != null && form.getAttribute("name") != "")
						{
							fe.form_name = form.getAttribute("name")
						}
						if( form != null && form.getAttribute("id") != "")
						{
							fe.form_id = form.getAttribute("id");
						}

						fe.index = ev.target.getAttribute("formsimulatoritem");
						fe.load_index = CURRENT_FSO.load_index;
						CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;
						
						CURRENT_CONNECT.postMessage(CURRENT_FSO);
						
					}
				},false);
				
				
				select.addEventListener("click",function(ev)
				{
					if(CURRENT_FSO.recording == true)
					{
						//ev.preventDefault();
						var fe = new FORMSIMULATOR_EVENT();
						fe.type = "CLICK";
						fe.tag = "SELECT";
						fe.name = ev.target.name;
						fe.string = ev.target.value;
						fe.id = ev.target.id;
						
						var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
						
					    if(form != null && form.getAttribute("name") != "")
						{
							fe.form_name = form.getAttribute("name")
						}
						if( form != null && form.getAttribute("id") != "")
						{
							fe.form_id = form.getAttribute("id");
						}

						fe.index = ev.target.getAttribute("formsimulatoritem");
						fe.load_index = CURRENT_FSO.load_index;
						
						CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;
						
						CURRENT_CONNECT.postMessage(CURRENT_FSO);
						
					}
				},false);
				
				
				select.addEventListener("change",function(ev)
				{
					if(CURRENT_FSO.recording == true)
					{
						var fe = new FORMSIMULATOR_EVENT();
						
						fe.type = "SELECT";
						fe.tag = "SELECT";
						fe.name = ev.target.name;
						fe.string = ev.target.value;
						fe.id = ev.target.id;
						var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
						
					    if(form != null && form.getAttribute("name") != "")
						{
							fe.form_name = form.getAttribute("name")
						}
						if( form != null && form.getAttribute("id") != "")
						{
							fe.form_id = form.getAttribute("id");
						}
						
						fe.index = ev.target.getAttribute("formsimulatoritem");
						
						fe.load_index = CURRENT_FSO.load_index;
						
						CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;

						CURRENT_CONNECT.postMessage(CURRENT_FSO);
						
					}
				},false);
				
				
			}
			
			
			//INDIVIDUAL TEXTAREA EVENTS
			
			var areas = document.getElementsByTagName("TEXTAREA");
			
			for(var i = 0; i < areas.length; i++)
			{
				var area = areas[i];
				var att = document.createAttribute("formsimulatoritem");
				att.value = i;
				area.setAttributeNode(att);				
				area.addEventListener("focus",function(ev)
				{
					if(CURRENT_FSO.recording == true)
					{
						var fe = new FORMSIMULATOR_EVENT();
						fe.type = "FOCUS";
						fe.tag = "TEXTAREA";
						fe.name = ev.target.name;
						fe.id = ev.target.id;
						
						var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
						
					    if(form != null && form.getAttribute("name") != "")
						{
							fe.form_name = form.getAttribute("name")
						}
						if( form != null && form.getAttribute("id") != "")
						{
							fe.form_id = form.getAttribute("id");
						}

						fe.index = ev.target.getAttribute("formsimulatoritem");
						fe.load_index = CURRENT_FSO.load_index;
						CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;
						
						CURRENT_CONNECT.postMessage(CURRENT_FSO);
						
					}
				},false);
				
				area.addEventListener("keydown",function(ev)
				{
					if(CURRENT_FSO.recording == true)
					{
						var fe = new FORMSIMULATOR_EVENT();
						fe.type = "KEYDOWN";
						fe.tag = "TEXTAREA";
						fe.name = ev.target.name;
						fe.id = ev.target.id;
						fe.string = ev.target.value;
						fe.key = String.fromCharCode(ev.keyCode);
						
						var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
						
					    if(form != null && form.getAttribute("name") != "")
						{
							fe.form_name = form.getAttribute("name")
						}
						if( form != null && form.getAttribute("id") != "")
						{
							fe.form_id = form.getAttribute("id");
						}

						fe.index = ev.target.getAttribute("formsimulatoritem");
						fe.load_index = CURRENT_FSO.load_index;
						CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;
						
						CURRENT_CONNECT.postMessage(CURRENT_FSO);
						
					}
				},false);
		
				area.addEventListener("keyup",function(ev)
				{
					if(CURRENT_FSO.recording == true)
					{
						var fe = new FORMSIMULATOR_EVENT();
						fe.type = "KEYUP";
						fe.tag = "TEXTAREA";
						fe.name = ev.target.name;
						fe.id = ev.target.id;
						fe.string = ev.target.value;
						fe.key = String.fromCharCode(ev.keyCode);
						
						var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
						
					    if(form != null && form.getAttribute("name") != "")
						{
							fe.form_name = form.getAttribute("name")
						}
						if( form != null && form.getAttribute("id") != "")
						{
							fe.form_id = form.getAttribute("id");
						}

						fe.index = ev.target.getAttribute("formsimulatoritem");
						fe.load_index = CURRENT_FSO.load_index;
						CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;
						
						
						CURRENT_CONNECT.postMessage(CURRENT_FSO);
						
						
					}
				},false);
				
				
			}
			
			
			//INDIVIDUAL BUTTON EVENTS
			
			var buttons = document.getElementsByTagName("BUTTON");
			
			for(var i = 0; i < buttons.length; i++)
			{
				var button = buttons[i];
				
				var att = document.createAttribute("formsimulatoritem");
				att.value = i;
				button.setAttributeNode(att);				
				button.addEventListener("focus",function(ev)
				{
					if(CURRENT_FSO.recording == true)
					{
						var fe = new FORMSIMULATOR_EVENT();
						fe.type = "FOCUS";
						fe.tag = "INPUT";
						fe.name = ev.target.name;
						fe.id = ev.target.id;
						
						var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
						
					    if(form != null && form.getAttribute("name") != "")
						{
							fe.form_name = form.getAttribute("name")
						}
						if( form != null && form.getAttribute("id") != "")
						{
							fe.form_id = form.getAttribute("id");
						}

						fe.index = ev.target.getAttribute("formsimulatoritem");
						
						fe.load_index = CURRENT_FSO.load_index;
						
						CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;

						CURRENT_CONNECT.postMessage(CURRENT_FSO);
						
					}
				},false);
				
				button.addEventListener("keydown",function(ev)
				{
					if(CURRENT_FSO.recording == true)
					{
						var fe = new FORMSIMULATOR_EVENT();
						fe.type = "KEYDOWN";
						fe.tag = "INPUT";
						fe.name = ev.target.name;
						fe.id = ev.target.id;
						fe.string = ev.target.value;
						fe.key = String.fromCharCode(ev.keyCode);
						
						var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
						
					    if(form != null && form.getAttribute("name") != "")
						{
							fe.form_name = form.getAttribute("name")
						}
						if( form != null && form.getAttribute("id") != "")
						{
							fe.form_id = form.getAttribute("id");
						}

						fe.index = ev.target.getAttribute("formsimulatoritem");
						fe.load_index = CURRENT_FSO.load_index;
						
						CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;
						
						CURRENT_CONNECT.postMessage(CURRENT_FSO);
						
					}
				},false);
		
				button.addEventListener("keyup",function(ev)
				{
					if(CURRENT_FSO.recording == true)
					{
						var fe = new FORMSIMULATOR_EVENT();
						fe.type = "KEYUP";

						fe.tag = "INPUT";
						fe.name = ev.target.name;
						fe.id = ev.target.id;
						fe.string = ev.target.value;
						fe.key = String.fromCharCode(ev.keyCode);
						
						var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
						
					    if(form != null && form.getAttribute("name") != "")
						{
							fe.form_name = form.getAttribute("name")
						}
						if( form != null && form.getAttribute("id") != "")
						{
							fe.form_id = form.getAttribute("id");
						}

						fe.index = ev.target.getAttribute("formsimulatoritem");
						fe.load_index = CURRENT_FSO.load_index;
						
						CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;
						
						CURRENT_CONNECT.postMessage(CURRENT_FSO);
						
					}
				},false);


				button.addEventListener("click",function(ev)
				{
					if(CURRENT_FSO.recording == true)
					{
						//ev.preventDefault();
						var fe = new FORMSIMULATOR_EVENT();
						fe.type = "CLICK";
						fe.tag = "INPUT";
						fe.name = ev.target.name;
						fe.id = ev.target.id;
						
						var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
						
					    if(form != null && form.getAttribute("name") != "")
						{
							fe.form_name = form.getAttribute("name")
						}
						if( form != null && form.getAttribute("id") != "")
						{
							fe.form_id = form.getAttribute("id");
						}

						fe.index = ev.target.getAttribute("formsimulatoritem");
						fe.load_index = CURRENT_FSO.load_index;
						
						CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;
						
						CURRENT_CONNECT.postMessage(CURRENT_FSO);
						
					}
				},false);
				
				
			}
			

	
			document.addEventListener("click",function(ev)
			{
				if(CURRENT_FSO.recording == true && (ev.target.type == null || ( ev.target.type != null && ev.target.type.toUpperCase() != "CHECKBOX" && ev.target.type.toUpperCase() != "RADIO" )))
				{
					var fe = new FORMSIMULATOR_EVENT();
					fe.type = "CLICK";
					fe.tag = ev.target.tagName;
					fe.name = ev.target.name;
					fe.id = ev.target.id;
					fe.x = ev.clientX;
					fe.y = ev.clientY;				
					
					var form = FORMSIMULATOR_CONTENT.getFormFromElement(CURRENT_FSO,ev.target);
					
					if(form != null && form.getAttribute("name") != "")
					{
						fe.form_name = form.getAttribute("name")
					}
					if( form != null && form.getAttribute("id") != "")
					{
						fe.form_id = form.getAttribute("id");
					}

					fe.index = ev.target.getAttribute("formsimulatoritem");
					fe.load_index = CURRENT_FSO.load_index;
					CURRENT_FSO.elements[CURRENT_FSO.elements.length] = fe;
					
					CURRENT_CONNECT.postMessage(CURRENT_FSO);
					
				}
			},false);
			
			
			
		}
		
		fso.interval = setInterval(function()
		{
			if(that.emulate_index >= that.elements.length)
			{
				clearInterval(that.emulate_interval);
				that.emulate_interval = null;
			}
						
		},5000);	
		
		return FORMSIMULATOR_STATES.RECORDING;
		
	},
	stopRecording : function()
	{
		if( CURRENT_FSO != null)
		{
		
			CURRENT_FSO.recording = false;
			
			clearInterval(CURRENT_FSO.interval);
			CURRENT_FSO.interval = null;
	
			clearInterval(CURRENT_FSO.emulate_interval);
			CURRENT_FSO.emulate_interval = null;
			
			CURRENT_FSO.load_index = 0;
			
			
		}
		
		CURRENT_FSO.state = FORMSIMULATOR_STATES.STOPPED;
		

		return CURRENT_FSO;

		
	},
	getFormFromElement: function(fso,object)
	{
		while(object != null && ( object.tagName == null || (  object.tagName != null &&  object.tagName.toUpperCase() != "FORM" )))
		{
			object = object.parentNode;
		}
		if(object != null && object.tagName != null && object.tagName.toUpperCase() == "FORM")
		{
			return object;
		}
		else
		{
			return null;	
		}
	},
	findElementInDocument : function(fso,element)
	{
		var source = null;
		if(element.index != null && element.index != "")
		{
			var els = document.getElementsByTagName(element.tag);
			source = els[element.index];
		}
		else
		{
			if(element.id != null && element.id != "")
			{
				source = document.getElementById(element.id);
			}
			else
			{
				if(element.name != null && element.name != "")
				{
					var els = document.getElementsByName(element.name);
					if(element.form_name != null && element.form_name != "")
					{
						for(var e = 0; e < els.length ; e++)
						{
							var el = els[e];	
							if(el.form != null && el.form.name != null && el.form.name == element.form_name)
							{
								source = el;
							}
						}
					}
					else
					{
						if(element.form_id != null && element.form_id != "")
						{
							for(var e = 0; e < els.length ; e++)
							{
								var el = els[e];	
								if(el.form != null && el.form.id != null && el.form.id == element.form_id)
								{
									source = el;
								}
							}
						}
						else
						{
							source = els[0];
						}
					}
				}
			}
		}
		return source;
	},
	clearForm : function(fso)
	{
		for(var e = 0; e < fso.elements.length; e++)	
		{
			var source = FORMSIMULATOR_CONTENT.findElementInDocument(fso,fso.elements[e]);
			
			if(source == null)
			{
				continue;
			}
			
			if( source.tagName != null && ( source.tagName.toUpperCase() == "INPUT" && source.type != null && source.type.toUpperCase() != "COLOR" && source.type.toUpperCase() != "BUTTON" && source.type.toUpperCase() != "SUBMIT"  && source.type.toUpperCase() != "CHECKBOX"   && source.type.toUpperCase() != "RADIO" && source.type.toUpperCase() != "RESET" )  || source.tagName.toUpperCase() == "SELECT" || source.tagName.toUpperCase() == "TEXTAREA")
			{
				source.value = "";
			}
			if( source.type != null && source.type.toUpperCase() == "COLOR")
			{
				source.value = "#ffffff";
			}
			if( source.type != null &&  (source.type.toUpperCase() == "CHECKBOX" || source.type.toUpperCase() == "RADIO"))
			{
				source.checked = false;
			}
			
		}
	},
	emulateForm : function(fso,sendResponse)
	{
		
		if(fso.load_index == 0)
		{
			fso.load_index = 1;
		}
		
		if(fso.repeat_times == null || fso.repeat_times == "" || fso.repeat_times == 0)
		{
			fso.repeat_times = 1;
		}
		
		clearInterval(fso.emulate_interval);

		fso.emulate_interval = null;
		
		fso.recording = false;
		
		fso.emulating = false;
		
		CURRENT_FSO = fso;
		
		CURRENT_CONNECT = chrome.runtime.connect({name: "EMULATEFORM"});
		
		CURRENT_CONNECT.onMessage.addListener(function(msg) 
		{
		  if (msg.state == FORMSIMULATOR_STATES.SIMULATED)
		  {
			clearInterval(CURRENT_FSO.emulate_interval);

			CURRENT_FSO.emulate_interval = null;
			
			CURRENT_FSO.recording = false;
			
			CURRENT_FSO.emulating = false;
			
			CURRENT_FSO.emulate_index = 0;
			
			CURRENT_FSO.load_index = 1;
			
			CURRENT_CONNECT.postMessage(CURRENT_FSO);			
			
			FORMSIMULATOR_CONTENT.closeSimulationTimesBox(that);
			
			
			
		  }
		});		
		
		var that = fso;
		
		if(fso.elements.length == 0)
		{
			if(sendResponse != null)
			{
				sendResponse({state:FORMSIMULATOR_STATES.NO_EVENTS_TO_SIMULATE});
			}
			
			return FORMSIMULATOR_STATES.NO_EVENTS_TO_SIMULATE;
		}
		else
		{
			
			fso.recording = false;
			
			fso.emulating = true;
			
			fso.emulate_interval = setInterval(function()
			{
				if(that.emulate_index < that.elements.length && that.emulating == true)
				{
					
					FORMSIMULATOR_CONTENT.showSimulationTimesBox(that);	
										
					var e = that.emulate_index;
					
					if(that.elements[e] != null && (that.elements[e].load_index == that.load_index || that.elements[e].load_index == null || that.elements[e].load_index == 0 || that.elements[e].load_index == ""))
					{
						var source = FORMSIMULATOR_CONTENT.findElementInDocument(that,that.elements[e]);
						
						var string = that.elements[e].string;
						
						if(source != null )
						{
							switch(that.elements[e].type)
							{
								case "KEYDOWN":
									if(source.tagName == "INPUT" || source.tagName == "SELECT" || source.tagName == "TEXTAREA")
									{
										source.focus();
										source.value = string;
									}
								break;	
								case "KEYUP":
									if(source.tagName == "INPUT" || source.tagName == "SELECT" || source.tagName == "TEXTAREA")
									{
										source.focus();
										source.value = string;
									}
								break;	
								case "CHECK":
									if(source.type.toUpperCase() == "CHECKBOX" || source.type.toUpperCase() == "RADIO")
									{
										source.checked = true;
									}
								break;	
								case "UNCHECK":
									if(source.type.toUpperCase() == "CHECKBOX" || source.type.toUpperCase() == "RADIO")
									{
										source.checked = false;
									}
								break;	
								case "SELECT":
									if(source.tagName == "SELECT")
									{
										source.focus();
										source.value = string;
									}
								break;	
								case "CHANGE":
									source.value = string;
								break;	
								case "CLICK":
									source.click();						
								break;	
								case "SUBMIT":
								break;	
								case "FOCUS":
									source.focus();
								break;	
								
							}
						}
						
						that.emulate_index++;
						
						CURRENT_FSO = that;
						
						CURRENT_CONNECT.postMessage(that);
						
					}
					else
					{
						if(that.elements[e] == null)
						{
							that.emulate_interval = null;
							
							that.recording = false;
							
							that.emulating = false;
							
							that.load_index = 1;
							
							CURRENT_FSO = that;
							
							CURRENT_CONNECT.postMessage(that);
							
							
						}
					}
					
				}
				else
				{
					
					if(that.emulating == true)
					{
						that.repeat_time++;
						
						FORMSIMULATOR_CONTENT.showSimulationTimesBox(that);	
						
						
						if(that.repeat == "1" && parseInt(that.repeat_time) < parseInt(that.repeat_times))
						{
							FORMSIMULATOR_CONTENT.clearForm(that);
							
							that.emulate_index = 0;
							
							that.load_index = 1;
							
							CURRENT_FSO = that;
							
							CURRENT_CONNECT.postMessage(that);
							
						}
						else
						{
							that.recording = false;
							
							that.emulating = false;
							
							that.load_index = 1;
							
							CURRENT_FSO = that;
							
							CURRENT_CONNECT.postMessage(that);
							
							
							
						}
						
					}
					else
					{
							that.recording = false;
							
							that.emulating = false;
							
							that.load_index = 1;
							
							CURRENT_FSO = that;
							
							CURRENT_CONNECT.postMessage(that);
							
							
					}
				}
				
				
			},100);
			
			
			return FORMSIMULATOR_STATES.SIMULATING;
			
			
		}
	},
	showSimulationTimesBox: function(fso)
	{
		var div = document.getElementById("simulation_times_box");
		if(div == null)
		{
			div = document.createElement("DIV");
		}
		div.id = "simulation_times_box";
		div.style.position = "fixed";
		div.style.border = "solid 2px #999999";
		div.style.width = "150px";
		div.style.height = "auto";
		div.style.bottom = "20px";
		div.style.right = "20px";
		div.style.display = "block";
		div.style.padding = "10px";
		div.style.textAlign= "center";
		div.style.zIndex=100000;
		div.style.borderRadius="10px";
		div.style.fontSize="14px";
		div.style.fontFamily="Arial";
		div.style.color="black";
		div.style.fontWeight="bold";
		div.style.backgroundColor="white";
		div.innerHTML = fso.repeat_time+" / "+fso.repeat_times;
		if(document.getElementById("simulation_times_box") == null)
		{
			document.body.appendChild(div);
		}
	},
	closeSimulationTimesBox: function(fso)
	{
		var div = document.getElementById("simulation_times_box");
		if(div != null)
		{
			div.style.display = "none";	
		}
	},
	stopSimulation : function(fso)
	{
		if( fso != null)
		{
			
			CURRENT_FSO = fso;
			
			CURRENT_CONNECT = chrome.runtime.connect({name: "EMULATEFORM"});
			
			clearInterval(CURRENT_FSO.emulate_interval);

			CURRENT_FSO.emulate_interval = null;
			
			CURRENT_FSO.recording = false;
			
			CURRENT_FSO.emulating = false;
			
			CURRENT_FSO.emulate_index = 0;

			CURRENT_FSO.load_index = 1;
			
			CURRENT_FSO.state = FORMSIMULATOR_STATES.STOPPED;
			
			CURRENT_CONNECT.postMessage(CURRENT_FSO);			
			
			FORMSIMULATOR_CONTENT.closeSimulationTimesBox(CURRENT_FSO);			
			
			
		}
		
		

		return CURRENT_FSO;

		
	},
	loadSimulation : function(fso)
	{
		if(fso.elements.length == 0)
		{
			return null;
		}
		else
		{
			return fso.elements;
		}
		return null;
	},
	openSimulation : function(fso,elements)
	{
		if(elements != null && elements.length > 0)
		{
			fso.elements = elements;
			return true;
		}
		else
		{
			return false;
		}
			
	}
}


window.addEventListener('load', function () {
	
	CURRENT_CONNECT = chrome.runtime.connect({name: "LOADPAGE"});
	CURRENT_CONNECT.postMessage({request:"fso"});
	CURRENT_CONNECT.onMessage.addListener(function(fso) 
	{
	  if (fso != null)
	  {
		CURRENT_FSO = fso;
		
		if(CURRENT_FSO.recording == true)
		{
			CURRENT_FSO.load_index = parseInt(CURRENT_FSO.load_index) + 1;
			
			var resp = FORMSIMULATOR_CONTENT.startRecording(CURRENT_FSO);
			CURRENT_CONNECT.postMessage({state:resp,fso:CURRENT_FSO});			
		}
		else
		{
			if(CURRENT_FSO.emulating == true)
			{
				
				CURRENT_FSO.load_index = parseInt(CURRENT_FSO.load_index) + 1;
				
				FORMSIMULATOR_CONTENT.clearForm(CURRENT_FSO);
				var resp = FORMSIMULATOR_CONTENT.emulateForm(CURRENT_FSO,null);
				CURRENT_CONNECT.postMessage({state:resp,fso:CURRENT_FSO});			
			}
		}
	  }
	});		
	
	
	
});


chrome.runtime.onConnect.addListener(function(port) {
	
  if(port.name == "CONTENT")
  {
	  port.onMessage.addListener(function(message) 
	  {
		if (message != null)
		{
			var fso = message.fso;  
			if(fso != null && message.type == "start_recording")
			{
				fso.elements = [];
				var resp = FORMSIMULATOR_CONTENT.startRecording(fso);
				port.postMessage({state:resp,fso:fso});
			}
			if(fso != null && message.type == "stop_recording")
			{
				fso = FORMSIMULATOR_CONTENT.stopRecording();
				port.postMessage({state:fso.state,elements:fso.elements,fso:fso});
			}
			if(fso != null && message.type == "simulate")
			{
				FORMSIMULATOR_CONTENT.clearForm(fso);
				var resp = FORMSIMULATOR_CONTENT.emulateForm(fso,port);
				port.postMessage({state:resp,fso:fso});
				
			}
			if(fso != null && message.type == "stop_simulation")
			{
				fso = FORMSIMULATOR_CONTENT.stopSimulation(fso);
				port.postMessage({state:fso.state,fso:fso,elements:fso.elements});
			}
			if(fso != null && message.type == "load_simulation")
			{
				var simulation = FORMSIMULATOR_CONTENT.loadSimulation(fso);
				port.postMessage({state:fso.state,fso:fso,elements:simulation});
			}
			if(fso != null && message.type == "open_simulation")
			{
				var resp = FORMSIMULATOR_CONTENT.openSimulation(fso,message.elements);
				if(resp == true)
				{
					port.postMessage({state:FORMSIMULATOR_STATES.SIMULATION_LOADED,fso:fso,sel:message.sel});
				}
			}
			
			
		}
	  });
  }

  

});



window.addEventListener('unload', function () {
	if(CURRENT_FSO != null && CURRENT_FSO.emulating == true)
	{
		clearInterval(CURRENT_FSO.emulate_interval);
	}
	
});

