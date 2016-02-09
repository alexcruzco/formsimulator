/*
NATURALWEB.ROCKS
ALEXANDER CRUZ
FORM SIMULATOR EXTENSION
2016
*/

//LIST OF INSTANCES OF FORM SIMULATORS
var FORMSIMULATORS = [];


//FORM SIMULATORS COUNTER
var FORMSIMULATOR_INSTANCES = 0;

//CURRENT CONNECT
var CURRENT_CONNECT = null;

//CURRENT TAB CONNECT
var CURRENT_TAB_CONNECT = null;


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

//OBJECT FORMSIMULATOR
function FORMSIMULATOR()
{
	//TAGS OF ELEMENTS ALLOWED TO BE IMITATED
	this.tags = ["INPUT","BUTTON","SELECT","TEXTAREA","A","FORM"];

	//TYPES OF EVENTS ALLOWED TO BE IMITATED
	this.events = ["KEYUP","KEYDOWN","CLICK","SUBMIT","FOCUS","CHECK","UNCHECK","SELECT"];

	//CAPTURED ELEMENTS
	this.elements = [];
	
	//RECORDING TIMER
	this.interval = null;

	//EMULATING TIMER
	this.emulate_interval = null;

	//CONTINUE RECORDING
	this.recording = false;

	//CONTINUE EMULATING
	this.emulating = false;

	//EMULATE INDEX ELEMENT
	this.emulate_index = 0;
	
	//ADD EVENTS BOOLEAN
	this.add_events = true;

	//STATE 
	this.state = FORMSIMULATOR_STATES.STOPPED;

	//CURRENT REPEAT TIME
	this.repeat_time = 0;

	//CURRENT REPEAT FLAG
	this.repeat = "0";

	//CURRENT REPEAT TIMES MAX
	this.repeat_times = 0;

	//CURRENT LOAD PAGE INDEX
	this.load_index = 0;

}

// listening for an event / one-time requests
// coming from the popup
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case "check_states":
			checkStates(sendResponse);
        break;
    }
    return true;
});


chrome.runtime.onConnect.addListener(function(port) {
	
  if(port.name == "EMULATEFORM")
  {
	  port.onMessage.addListener(function(fso) 
	  {
		if (fso != null)
		{
			chrome.tabs.getSelected(null, function(tab)
			{
				if(fso != null)
				{
					FORMSIMULATORS[tab.id] = fso;
					if(FORMSIMULATORS[tab.id].elements != null && parseInt(FORMSIMULATORS[tab.id].emulate_index) >= FORMSIMULATORS[tab.id].elements.length && (FORMSIMULATORS[tab.id].repeat != "1" || (FORMSIMULATORS[tab.id].repeat == "1" && parseInt(FORMSIMULATORS[tab.id].repeat_time) >= parseInt(FORMSIMULATORS[tab.id].repeat_times)) ))
					{
						port.postMessage({state: FORMSIMULATOR_STATES.SIMULATED});
						
						CURRENT_CONNECT = chrome.runtime.connect({name: "POPUP"});
						
						CURRENT_CONNECT.postMessage({state: FORMSIMULATOR_STATES.SIMULATED,elements:FORMSIMULATORS[tab.id].elements});
						
						chrome.browserAction.setIcon({ path: "images/formsimulator_icon_off.png" });
					}
				}
			});
		}
	  });
  }

  if(port.name == "STARTRECORDING")
  {
	  port.onMessage.addListener(function(fso) 
	  {
		if (fso != null)
		{
			chrome.tabs.getSelected(null, function(tab)
			{
				if(fso != null)
				{
					FORMSIMULATORS[tab.id] = fso;
				}
			});
		}
	  });
  }


  if(port.name == "LOADPAGE")
  {
	  port.onMessage.addListener(function(message) 
	  {
		if (message != null && message.request == "fso")
		{
			chrome.tabs.getSelected(null, function(tab)
			{
				port.postMessage(FORMSIMULATORS[tab.id]);
			});
		}
	  });
  }



  if(port.name == "BACKGROUND")
  {
	  port.onMessage.addListener(function(message) 
	  {
		  
		switch(message.type) {
			case "start_recording":
				startRecording();
			break;
			case "stop_recording":
				stopRecording();
			break;
			case "simulate":
				simulate(message.repeat,message.repeat_times);
			break;
			case "stop_simulation":
				stopSimulation();
			break;
			case "load_simulation":
				loadSimulation(message.simname);
			break;
			case "open_simulation":
				openSimulation(message.elements,message.sessionid,message.sel);
			break;
			
		}
		  
	  });
  }


});


// send a message to the content script
var startRecording = function() 
{
    chrome.tabs.getSelected(null, function(tab)
	{
		if(FORMSIMULATORS[tab.id] == null)
		{
			FORMSIMULATORS[tab.id] = new FORMSIMULATOR();
		}
		FORMSIMULATORS[tab.id].load_index = 0;
		FORMSIMULATORS[tab.id].elements = [];
		
		CURRENT_TAB_CONNECT = chrome.tabs.connect(tab.id,{name: "CONTENT"});
		
		CURRENT_TAB_CONNECT.postMessage({type: "start_recording",id:tab.id,fso: FORMSIMULATORS[tab.id]});
		
		CURRENT_TAB_CONNECT.onMessage.addListener(function(response) {
			
			if(response != null && response.state == FORMSIMULATOR_STATES.RECORDING)
			{
				FORMSIMULATORS[tab.id] = response.fso;
				chrome.browserAction.setIcon({ path: "images/formsimulator_icon_record.png" });
			}
				
			CURRENT_CONNECT = chrome.runtime.connect({name: "POPUP"});
			
			CURRENT_CONNECT.postMessage(response);
				
			
		});		
		
		
    });
};
var stopRecording = function() 
{
    chrome.tabs.getSelected(null, function(tab)
	{
		
		CURRENT_TAB_CONNECT = chrome.tabs.connect(tab.id,{name: "CONTENT"});
		
		CURRENT_TAB_CONNECT.postMessage({type: "stop_recording",id:tab.id,fso: FORMSIMULATORS[tab.id]});
		
		CURRENT_TAB_CONNECT.onMessage.addListener(function(response) {
			
			if(response != null && response.state == FORMSIMULATOR_STATES.STOPPED)
			{
				FORMSIMULATORS[tab.id] = response.fso;
				chrome.browserAction.setIcon({ path: "images/formsimulator_icon_off.png" });
			}
				
			CURRENT_CONNECT = chrome.runtime.connect({name: "POPUP"});
			
			CURRENT_CONNECT.postMessage(response);
				
			
		});		
		
    });
};
var simulate = function(repeat,repeat_times) 
{
    chrome.tabs.getSelected(null, function(tab)
	{
		FORMSIMULATORS[tab.id].repeat = repeat;
		FORMSIMULATORS[tab.id].repeat_time = 0;
		FORMSIMULATORS[tab.id].repeat_times = repeat_times;
		FORMSIMULATORS[tab.id].load_index = 0;
		FORMSIMULATORS[tab.id].emulate_index = 0;
		
		CURRENT_TAB_CONNECT = chrome.tabs.connect(tab.id,{name: "CONTENT"});
		
		CURRENT_TAB_CONNECT.postMessage({type: "simulate",id:tab.id,fso: FORMSIMULATORS[tab.id]});
		
		CURRENT_TAB_CONNECT.onMessage.addListener(function(response) {
			
			if(response != null && response.state == FORMSIMULATOR_STATES.SIMULATING)
			{
				FORMSIMULATORS[tab.id] = response.fso;
				chrome.browserAction.setIcon({ path: "images/formsimulator_icon_simulate.png" });
			}
			if(response != null && response.state == FORMSIMULATOR_STATES.SIMULATED)
			{
				FORMSIMULATORS[tab.id] = response.fso;
				chrome.browserAction.setIcon({ path: "images/formsimulator_icon_off.png" });
			}
			if(response != null && response.state == FORMSIMULATOR_STATES.NO_EVENTS_TO_SIMULATE)
			{
				FORMSIMULATORS[tab.id] = response.fso;
				chrome.browserAction.setIcon({ path: "images/formsimulator_icon_off.png" });
			}
			
			CURRENT_CONNECT = chrome.runtime.connect({name: "POPUP"});
			
			CURRENT_CONNECT.postMessage(response);
				
			
		});		
		
		
		
		
    });
};
var stopSimulation = function() 
{
	
    chrome.tabs.getSelected(null, function(tab)
	{
		
		CURRENT_TAB_CONNECT = chrome.tabs.connect(tab.id,{name: "CONTENT"});
		
		CURRENT_TAB_CONNECT.postMessage({type: "stop_simulation",id:tab.id,fso: FORMSIMULATORS[tab.id]});
		
		
		CURRENT_TAB_CONNECT.onMessage.addListener(function(response) {
			
			if(response != null && response.state == FORMSIMULATOR_STATES.STOPPED)
			{
				FORMSIMULATORS[tab.id] = response.fso;
				chrome.browserAction.setIcon({ path: "images/formsimulator_icon_off.png" });
			}
			
			CURRENT_CONNECT = chrome.runtime.connect({name: "POPUP"});
			
			CURRENT_CONNECT.postMessage(response);
				
			
		});		
		
		
    });
};

var loadSimulation = function(simname) 
{
    chrome.tabs.getSelected(null, function(tab)
	{
		
		CURRENT_TAB_CONNECT = chrome.tabs.connect(tab.id,{name: "CONTENT"});
		
		CURRENT_TAB_CONNECT.postMessage({type: "load_simulation",id:tab.id,fso: FORMSIMULATORS[tab.id]});
		
		
		CURRENT_TAB_CONNECT.onMessage.addListener(function(response) {
			
			if(response != null && response.state == FORMSIMULATOR_STATES.SIMULATION_LOADED)
			{
				FORMSIMULATORS[tab.id] = response.fso;
			}
			
			CURRENT_CONNECT = chrome.runtime.connect({name: "POPUP"});
			
			CURRENT_CONNECT.postMessage({state:FORMSIMULATOR_STATES.SIMULATION_SAVED,elements:response.elements,simname:simname});
				
			
		});		
		
    });
};
var openSimulation = function(elements,sessionid,sel) 
{
    chrome.tabs.getSelected(null, function(tab)
	{
		if(FORMSIMULATORS[tab.id] == null)
		{
			FORMSIMULATORS[tab.id] = new FORMSIMULATOR();
		}
		
		CURRENT_TAB_CONNECT = chrome.tabs.connect(tab.id,{name: "CONTENT"});
		
		CURRENT_TAB_CONNECT.postMessage({type: "open_simulation",id:tab.id,elements:elements,sel:sel,fso: FORMSIMULATORS[tab.id]});
		
		
		CURRENT_TAB_CONNECT.onMessage.addListener(function(response) {
			
			if(response != null && response.state == FORMSIMULATOR_STATES.SIMULATION_LOADED)
			{
				FORMSIMULATORS[tab.id] = response.fso;
			}
			
			CURRENT_CONNECT = chrome.runtime.connect({name: "POPUP"});
			
			CURRENT_CONNECT.postMessage(response);
				
			
		});		
		
    });
};
var checkStates = function(sendResponse) 
{
    chrome.tabs.getSelected(null, function(tab)
	{
		if(FORMSIMULATORS[tab.id] == null)
		{
			FORMSIMULATORS[tab.id] = new FORMSIMULATOR();
		}
		if(sendResponse != null)
		{
			var instance = FORMSIMULATORS[tab.id];
			if(instance != null )
			{
				if(instance.recording == true)
				{
					chrome.browserAction.setIcon({ path: "images/formsimulator_icon_record.png" });
				}
				else
				{
					if(instance.emulating == true)
					{
						chrome.browserAction.setIcon({ path: "images/formsimulator_icon_simulate.png" });
					}
					else
					{
						chrome.browserAction.setIcon({ path: "images/formsimulator_icon_off.png" });
					}
				}
				
				
			}
			sendResponse({recording:instance.recording,emulating:instance.emulating,elements:instance.elements});	
		}
    });
};
