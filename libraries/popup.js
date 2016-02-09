/*
NATURALWEB.ROCKS
ALEXANDER CRUZ
FORM SIMULATOR EXTENSION
2016
*/

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

var CURRENT_FILTER_SESSION_DATA = {};

var CURRENT_WINDOW_OPEN = false;

//CURRENT CONNECT
var CURRENT_CONNECT = null;


window.onload = function() {
    document.getElementById("start_recording_button").onclick = function() {
		
		CURRENT_CONNECT = chrome.runtime.connect({name: "BACKGROUND"});
		
		CURRENT_CONNECT.postMessage({type: "start_recording"});
		
    }
    document.getElementById("stop_recording_button").onclick = function() {
		
		
		CURRENT_CONNECT = chrome.runtime.connect({name: "BACKGROUND"});
		
		CURRENT_CONNECT.postMessage({type: "stop_recording"});
		
		
    }


    document.getElementById("simulate_button").onclick = function() {
		
		openSimulationOptions();		
    }
	
	
    document.getElementById("simulate_button_do").onclick = function() {
		
		var r_times = jQuery("#repeat_times_simulation").val();
		
		CURRENT_CONNECT = chrome.runtime.connect({name: "BACKGROUND"});
		
		CURRENT_CONNECT.postMessage({type: "simulate",repeat: jQuery("#repeat_simulation").val(),repeat_times: jQuery("#repeat_times_simulation").val()});
		
		
		
    }
		
    document.getElementById("stop_simulation_button").onclick = function() {
		
		CURRENT_CONNECT = chrome.runtime.connect({name: "BACKGROUND"});
		
		CURRENT_CONNECT.postMessage({type: "stop_simulation"});
		
		
		
    }
	

    document.getElementById("es_language_link").onclick = function() {

		SESSION.saveSession({lang:"es"});		
    }

    document.getElementById("en_language_link").onclick = function() {
		
		SESSION.saveSession({lang:"en"});		
		
    }
	
    document.getElementById("save_simulation_button").onclick = function() {
		
		openSaveSimulation();

		
    }


    document.getElementById("save_simulation_button_do").onclick = function() {
		
		var simname = jQuery("#name_simulation").val();
		
		if(simname != "")
		{
			
			CURRENT_CONNECT = chrome.runtime.connect({name: "BACKGROUND"});
			
			CURRENT_CONNECT.postMessage({type: "load_simulation",simname:simname});
			
		}
		else
		{
			openAlert(LANG.getWord("enter_name"));
		}
		
    }


    document.getElementById("load_simulation_button").onclick = function() {
		
		SESSION.loadSession(["simulations"],function(session)
		{
			CURRENT_FILTER_SESSION_DATA = session;
			var elements = null;
			var simulations = session.simulations;
			if(simulations != null)
			{
				openSimulation(simulations);
				
			}
		});
		
		
		
		
    }
	


    document.getElementById("load_simulation_button_do").onclick = function() {
		
		SESSION.startLoading();

		
		var simulations = CURRENT_FILTER_SESSION_DATA.simulations;
		
		var sel = jQuery("#select_simulation").val();
		
		if(sel != "")
		{
			var elements = [];
			
			for(var s = 0; s < simulations.length ; s++)	
			{
				var sm = simulations[s];
				if(sm != null && sm.name == sel)
				{
					elements = sm.elements;
					break;
				}
			}
			
			CURRENT_CONNECT = chrome.runtime.connect({name: "BACKGROUND"});
			
			CURRENT_CONNECT.postMessage({type: "open_simulation",elements: elements,sessionid: CURRENT_FILTER_SESSION_DATA.id,sel:sel});
			
			
			
		}
    }



    document.getElementById("alert_ok").onclick = function() {
		
		closeAlert();

    }
	
	
document.getElementById("save_gray_wolf_button").onclick = function() {
		
		
		  var newURL = "https://secure.defenders.org/site/SPageServer?pagename=wagc_graywolf&s_src=3WEW1600XXXXX&s_subsrc=013016_adopt_body_gray-wolf/what-you-can-do";
	      chrome.tabs.create({ url: newURL });		
		
    }	
	
	jQuery(document).click(function(e)
	{
		if(e.target.className == "open_simulation_window_bg")
		{
			closeSimulation();	
		}
		if(e.target.className == "save_simulation_window_bg")
		{
			closeSaveSimulation();	
		}
		if(e.target.className == "simulation_options_window_bg")
		{
			closeSimulationOptions();
		}
	});

}

function openSimulation(simulations)
{
	CURRENT_WINDOW_OPEN = true;
	jQuery("#select_simulation option").remove();
	for(var s = 0; s < simulations.length ; s++)	
	{
		var sm = simulations[s];
		jQuery("#select_simulation").append('<option value="'+sm.name+'">'+sm.name+'</option>');
	}
	jQuery(".open_simulation_bg, .open_simulation_window_bg").fadeIn(200);
}

function closeSimulation()
{
	CURRENT_WINDOW_OPEN = false;
	jQuery(".open_simulation_bg, .open_simulation_window_bg").fadeOut(200,null,function()
	{
		jQuery(this).css("display","none");
	});
}
function openSaveSimulation()
{
	CURRENT_WINDOW_OPEN = true;
	jQuery(".save_simulation_bg, .save_simulation_window_bg").fadeIn(200);
}

function closeSaveSimulation()
{
	CURRENT_WINDOW_OPEN = false;
	jQuery(".save_simulation_bg, .save_simulation_window_bg").fadeOut(200,null,function()
	{
		jQuery(this).css("display","none");
	});
}
function openSimulationOptions()
{
	CURRENT_WINDOW_OPEN = true;
	jQuery(".simulation_options_bg, .simulation_options_window_bg").fadeIn(200);
}

function closeSimulationOptions()
{
	CURRENT_WINDOW_OPEN = false;
	jQuery(".simulation_options_bg, .simulation_options_window_bg").fadeOut(200,null,function()
	{
		jQuery(this).css("display","none");
	});
}


function openAlert(message)
{
	CURRENT_WINDOW_OPEN = true;
	jQuery(".alert_bg, .alert_window_bg").fadeIn(200);
	jQuery(".alert_window label").html(message);
}

function closeAlert()
{
	CURRENT_WINDOW_OPEN = false;
	jQuery(".alert_bg, .alert_window_bg").fadeOut(200,null,function()
	{
		jQuery(this).css("display","none");
	});
}


function checkInterface()
{
	chrome.extension.sendMessage({
				type: "check_states"
			},
			function(response)
			{
				if(response != null )
				{
					if(response.recording == true)
					{
						jQuery("#start_recording_button").css("display","none");
						jQuery("#stop_recording_button").css("display","block");
						jQuery("#simulate_button").css("display","none");
						jQuery("#stop_simulation_button").css("display","none");
						
					}
					else
					{
						if(response.emulating == false)
						{
							jQuery("#start_recording_button").css("display","block");
							jQuery("#stop_recording_button").css("display","none");
							if(response.elements != null && response.elements.length > 0)
							{
								jQuery("#simulate_button").css("display","block");
								jQuery("#save_simulation_button").css("display","block");
							}
							else
							{
								jQuery("#simulate_button").css("display","none");
								jQuery("#save_simulation_button").css("display","none");
							}
							jQuery("#stop_simulation_button").css("display","none");
							
						}
						else
						{
							jQuery("#start_recording_button").css("display","none");
							jQuery("#stop_recording_button").css("display","none");
							jQuery("#simulate_button").css("display","none");
							jQuery("#save_simulation_button").css("display","none");
							jQuery("#stop_simulation_button").css("display","block");
							
						}
					}
				}
			});		
					
}

window.addEventListener('load', function () {
	
	checkInterface();
	
});

chrome.runtime.onConnect.addListener(function(port) {
	
  if(port.name == "POPUP")
  {
	  port.onMessage.addListener(function(fso) 
	  {
		if (fso != null)
		{
			if(fso.state == FORMSIMULATOR_STATES.SIMULATED)
			{
				jQuery("#start_recording_button").css("display","block");
				jQuery("#stop_recording_button").css("display","none");
				if(fso.elements != null && fso.elements.length > 0)
				{
					jQuery("#simulate_button").css("display","block");
					jQuery("#save_simulation_button").css("display","block");
				}
				else
				{
					jQuery("#simulate_button").css("display","none");
					jQuery("#save_simulation_button").css("display","none");
				}
				jQuery("#stop_simulation_button").css("display","none");
				
				return;
			}
			if(fso.state == FORMSIMULATOR_STATES.RECORDING)
			{
				jQuery("#start_recording_button").css("display","none");
				jQuery("#stop_recording_button").css("display","block");
				jQuery("#simulate_button").css("display","none");
				jQuery("#save_simulation_button").css("display","none");
				jQuery("#stop_simulation_button").css("display","none");
				
				return;
				
			}
			if(fso.state == FORMSIMULATOR_STATES.STOPPED)
			{
				
				jQuery("#start_recording_button").css("display","block");
				jQuery("#stop_recording_button").css("display","none");
				if(fso.elements != null && fso.elements.length > 0)
				{
					jQuery("#simulate_button").css("display","block");
					jQuery("#save_simulation_button").css("display","block");
				}
				else
				{
					jQuery("#simulate_button").css("display","none");
					jQuery("#save_simulation_button").css("display","none");
				}
				jQuery("#stop_simulation_button").css("display","none");

				return;
				
			}
			if(fso.state == FORMSIMULATOR_STATES.SIMULATING)
			{
				closeSimulationOptions();
				
				jQuery("#start_recording_button").css("display","none");
				jQuery("#stop_recording_button").css("display","none");
				jQuery("#simulate_button").css("display","none");
				jQuery("#save_simulation_button").css("display","none");
				jQuery("#stop_simulation_button").css("display","block");
				
				return;
				
			}
			if(fso.state == FORMSIMULATOR_STATES.NO_EVENTS_TO_SIMULATE)
			{
				jQuery("#stop_simulation_button").css("display","none");
				
				openAlert(LANG.getWord("no_events"));
				
				return;
				
			}
			if(fso.state == FORMSIMULATOR_STATES.STOPPED)
			{
				
				jQuery("#start_recording_button").css("display","block");
				jQuery("#stop_recording_button").css("display","none");
				if(fso.elements != null && fso.elements.length > 0)
				{
					jQuery("#simulate_button").css("display","block");
					jQuery("#save_simulation_button").css("display","block");
				}
				else
				{
					jQuery("#simulate_button").css("display","none");
					jQuery("#save_simulation_button").css("display","none");
				}
				jQuery("#stop_simulation_button").css("display","none");
				
				return;
				
			}
			if(fso.state == FORMSIMULATOR_STATES.SIMULATION_SAVED)
			{
				var elements = fso.elements;
				if(elements != null && elements.length > 0)
				{
					SESSION.saveSession({simulations:[{name:fso.simname,elements:elements}]},function(session)
					{
						CURRENT_FILTER_SESSION_DATA = session;
						openAlert(LANG.getWord("simulation_saved"));
					});		
				}
				else
				{
					openAlert(LANG.getWord("no_events"));
				}
				closeSaveSimulation();				
				
				return;
				
			}
			if(fso.state == FORMSIMULATOR_STATES.SIMULATION_LOADED)
			{
				var simulations = CURRENT_FILTER_SESSION_DATA.simulations;
				
				var elements = [];
				
				for(var s = 0; s < simulations.length ; s++)	
				{
					var sm = simulations[s];
					if(sm != null && sm.name == fso.sel)
					{
						elements = sm.elements;
						break;
					}
				}
				
				
				SESSION.stopLoading();

				if(elements != null && elements.length > 0)
				{
					jQuery("#simulate_button").css("display","block");
					jQuery("#save_simulation_button").css("display","block");
				}
				else
				{
					jQuery("#simulate_button").css("display","none");
					jQuery("#save_simulation_button").css("display","none");
				}
				openAlert(LANG.getWord("simulation_loaded"));
				
				closeSimulation();
				
				return;
				
			}
			
		}
	  });
  }


});

