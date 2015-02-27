
/*  *************************************************** */

/*                   TAB V2 functions                   */

/* **************************************************** */

var filterObj = {}; // Global, for hrsat1.js

function newFiltersChanged()
{
    filterObj = getFiltersState();
    reload_hrsat_parameters();
    
    if(qs_param['debug'])
    {
        //debugHrsatFilterOutput();
    }     
}    

function getFiltersState()
{
    var filterSats = new Array();
    var filterDevs = new Array();
    var filterStns = new Array();
    var MiscFilters = new Object();
    var filterSources = new Array();
    
    // **************************************************** //
    
    var collect  = document.forms["satform"].elements;
    var elements = Array.prototype.slice.call(collect);
    elements.forEach( function (element) 
    {
      if (element.type == "checkbox") 
      {
          var checkboxWidget = dijit.getEnclosingWidget( element );
          var chbox = checkboxWidget.item;
          if(chbox.checked)
          {
                if(chbox.stype=="sats")
                { 
                      if(chbox.sats)
                      { 
                        filterSats.push(chbox.sats); 
                      }
                      else
                      { 
                        filterSats.push(chbox.id); 
                      }
                }
                
                if(chbox.stype=="devices") 
                { 
                      if(chbox.devices)
                      { 
                        filterDevs.push(chbox.devices); 
                      }
                      else
                      { 
                        filterDevs.push(chbox.id); 
                      }
                }
                
                if(chbox.stype=="satdevs")
                {
                      if(chbox.sats)
                      { 
                        filterSats.push(chbox.sats); 
                      }
                      else
                      { 
                        filterSats.push(chbox.id); 
                      }
    
                      if(chbox.devices)
                      { 
                        filterDevs.push(chbox.devices); 
                      }
                      else
                      { 
                        filterDevs.push(chbox.id); 
                      }
                }
                
          }
      }
    });
    
    
    
    var collect2  = document.forms["stnform"].elements;
    var elements2 = Array.prototype.slice.call(collect2);
    elements2.forEach( function (element) 
    {
      if (element.type == "checkbox") 
      {
          var checkboxWidget = dijit.getEnclosingWidget( element );
          var chbox = checkboxWidget.item;
          if(chbox.checked)
          {
                if(chbox.stype!="group")
                {
                    if(chbox.stations)
                    {
                        filterStns.push(chbox.stations);
                    }
                    else
                    {
                        filterStns.push(chbox.id);
                    }
                    
                    var sourse = "isdm";//default source  
                    if(chbox.sources)
                    {
                      sourse = chbox.sources;
                        
                    }
                    if( ! in_array(sourse,filterSources) )
                    {
                        filterSources.push(sourse);
                    }    
                    
                }    
          }
      }
    });


    for(i=0; i<(document.miscfilterform.length); i++)
    {
      var chbox = document.miscfilterform.elements[i];
      if(chbox.checked && chbox.value!="is_cloud")
      {
          MiscFilters[chbox.value] = 1;
      }
    }   

	if(document.miscfilterform.is_cloud)
	{
	    if(document.miscfilterform.is_cloud.checked)
	    {
	    	clouds_val = document.miscfilterform.max_cloud.value;
	    	if(isNaN(parseInt(clouds_val,10)))
	    	{
	    		alert("Ошибка - значение облачности задано неверно");
	    	}
	    	else
	    	{
	    	  var max_clouds = parseInt(clouds_val,10);
	    	  MiscFilters["cloudiness"] = clouds_val;  
	    	}
		}
	}
    
    if(filterDevs.length==0)
    {
      filterDevs.push("none");  
    }    
    if(filterStns.length==0)
    {
      filterStns.push("none");  
    }    
    
    // **************************************************** //
    
    filterStns = mySplitArray(filterStns);
    filterSats = mySplitArray(filterSats);
    filterDevs = mySplitArray(filterDevs);
    
    // **************************************
    
    var filterOBJ = new Object();
    
    filterOBJ['sats'] = filterSats;
    filterOBJ['devs'] = filterDevs;
    filterOBJ['stns'] = filterStns;
    filterOBJ['misc'] = MiscFilters;
    filterOBJ['sources'] = filterSources;
    
    return filterOBJ;
}    


function debugHrsatFilterOutput()
{
    for (i=0;i<filterObj['sources'].length;i++)
    { 
        console.info("SOURCE: "+filterObj['sources'][i]);
    }
    for (i=0;i<filterObj['stns'].length;i++)
    { 
        console.info("STN: "+filterObj['stns'][i]);
    }
    for (i=0;i<filterObj['sats'].length;i++)
    { 
        console.info("SAT: "+filterObj['sats'][i]);
    }
    for(var mkey in filterObj['misc']) 
    {
        console.info(mkey+"="+filterObj['misc'][mkey]);
    }
}

function mySplitArray(myArray)
{ 
    var filterAdd = new Array();
    for (i = 0; i < myArray.length; i++) 
    {
      var tarr = myArray[i].split(',');
      if(tarr.length>1)
      {
            for(var j=0;j<tarr.length;j++)
            {
                  if(j===0)
                  {
                      tstr = tarr[j];
                      tstr=tstr.replace(/^\s*/,'').replace(/\s*$/,''); // Удаление концевых пробелов
                      myArray[i] = tstr;
                  }
                  else
                  {
                      tstr = tarr[j];
                      tstr=tstr.replace(/^\s*/,'').replace(/\s*$/,''); // Удаление концевых пробелов
                      filterAdd.push(tstr);
                  }
            }
      }    
    }    
    myArray = myArray.concat(filterAdd);

    return myArray;
}    

function in_array(value, array) 
{
    for(var i = 0; i < array.length; i++) 
    {
        if(array[i] == value) return true;
    }
    return false;
}    

function setALLSatsInFilter()
{
    var model = getSatModelHrsat();
    var collect  = document.forms["satform"].elements;
    var elements = Array.prototype.slice.call(collect);
    elements.forEach( function (element) 
    {
      if (element.type == "checkbox") 
      {
          var checkboxWidget = dijit.getEnclosingWidget( element );
          var chbox = checkboxWidget.item;
          
          if(chbox.id=="Devs")
          {
                model.setChecked(chbox,true);
          }
      }
    });

    if(dijit.byId("is_cloud"))
    {
        dijit.byId("is_cloud").set("checked",false);
    }
}    

function setCheckboxesState(statesObj)
{
    var model = getSatModelHrsat();
    var collect  = document.forms["satform"].elements;
    var elements = Array.prototype.slice.call(collect);
    elements.forEach( function (element) 
    {
      if (element.type == "checkbox") 
      {
          var checkboxWidget = dijit.getEnclosingWidget( element );
          var chbox = checkboxWidget.item;
          
          var is_found = 0;
          for (var i = 0; i < statesObj['SAT_FILTERS_ID'].length; i++)
          {
                var el = statesObj['SAT_FILTERS_ID'][i];
                if(el == chbox.id)
                {
                    is_found=1;
                }
          }
          if(is_found)
          {
           model.setChecked(chbox,true);
          }
          else
          {
           model.setChecked(chbox,false);
          }
            
 
      }
    });

    model = getStnModelHrsat();
    collect  = document.forms["stnform"].elements;
    elements = Array.prototype.slice.call(collect);
    elements.forEach( function (element) 
    {
      if (element.type == "checkbox") 
      {
          var checkboxWidget = dijit.getEnclosingWidget( element );
          var chbox = checkboxWidget.item;
          
          var is_found = 0;
          for (var i = 0; i < statesObj['STN_FILTERS_ID'].length; i++)
          {
                var el = statesObj['STN_FILTERS_ID'][i];
                if(el == chbox.id)
                {
                    is_found=1;
                }
          }
          if(is_found)
          {
           model.setChecked(chbox,true);
          }
          else
          {
           model.setChecked(chbox,false);
          }
            
 
      }
    });

	if(document.miscfilterform.is_cloud)
	{
	    if('cloudiness' in statesObj['MISC_FILTERS'])
	    {
	     document.miscfilterform.max_cloud.value = statesObj['MISC_FILTERS']['cloudiness'];
	     dijit.byId("is_cloud").set("checked",true);
	    }
	    else
	    {
	     dijit.byId("is_cloud").set("checked",false);   
	    }
	}

    for(i=0; i<(document.miscfilterform.length); i++)
    {
      var chbox = document.miscfilterform.elements[i];
      if(chbox.type=="checkbox" && chbox.id!="is_cloud")
      {
    	    var chId = chbox.id;

    	    if(chId in statesObj['MISC_FILTERS'])
    	    {
    	        if(dijit.byId(chId))
    	        {
    	            dijit.byId(chId).set("checked",true);
    	        }
    	    }
    	    else
    	    {
    	        if(dijit.byId(chId))
    	        {
    	            dijit.byId(chId).set("checked",false);   
    	        }
    	    }
      }
    }   



}

function getCheckboxesState()
{
    var results = new Object();
    
    // ============================= //
    
    var chSatStates = new Array();
    var chStnStates = new Array();
    
    var model = getSatModelHrsat();
    var collect  = document.forms["satform"].elements;
    var elements = Array.prototype.slice.call(collect);
    
    elements.forEach( function (element) 
    {
      if (element.type == "checkbox") 
      {
          var checkboxWidget = dijit.getEnclosingWidget( element );
          var chbox = checkboxWidget.item;
          if(chbox.checked)
          {
               if(model.getChecked(chbox)===true)
               {
                    chSatStates.push(chbox.id);
               }
          }
      }
    } );

    model = getStnModelHrsat();
    collect  = document.forms["stnform"].elements;
    elements = Array.prototype.slice.call(collect);
    
    elements.forEach( function (element) 
    {
      if (element.type == "checkbox") 
      {
          var checkboxWidget = dijit.getEnclosingWidget( element );
          var chbox = checkboxWidget.item;
          if(chbox.checked)
          {
               if(model.getChecked(chbox)===true)
               {
                    chStnStates.push(chbox.id);
               }
          }
      }
    } );

    
    results['SAT_FILTERS_ID'] = chSatStates;

    results['STN_FILTERS_ID'] = chStnStates;

    results['MISC_FILTERS'] = filterObj['misc'];
    
    // ============================= //
    
    return results;
} 

