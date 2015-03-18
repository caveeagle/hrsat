//ftlog('user_makeMetaParams',dumpObj(opts,'','	',0)); 	/*DEBUG*/

var hrsat_filter;

var hrsat_visible = 1;
 
var hrsat_list_portion = 10;// default
 
var activeHrsatProduct="hrsat_contour";

var selected_hrsat_scene_update = "";

// Sats for standart color metaproducts (hrsat_img)
var sat2prod={};

sat2prod['hrsat_img'] = { 
					"LANDSAT 4" : "v_color_landsat",
					"LANDSAT 5" : "v_color_landsat",
					"LANDSAT 7" : "v_color_landsat",
					"LANDSAT 8" : "v_color_landsat",
					"RAPIDEYE" : "v_for_color_rapideye,v_color_rapideye",
					"METEOR-M1" : "v_for_color_kmss,v_color_kmss",
					"METEOR-M2" : "v_for_color_kmss,v_color_kmss",
					"METEOR-M1-KMSS" : "color",
					"MONITOR-E-PSA" : "color",
					"METEOR-KMSS_50" : "kmss_full_res",//0 scen
					"METEOR-KMSS_101" : "kmss_full_res",//0 scen
					"METEOR-KMSS_102" : "kmss_full_res",//0 scen
					"RESURS DK-1" : "bw",//0 scen

					"Resurs DK ZAPAS" : "zapas",  // Add by Tolpin for ZAPAS
					"Monitor-E ZAPAS" : "zapas",  // Add by Tolpin for ZAPAS

					"CANOPUS-V" : "v_for_color_canopus,v_color_canopus_v,v_for_bw_canopus,v_pnh_canopus_v",

					"DEIMOS" : "v_color_deimos",

					"ALOS":"color_niitp",//0 scen

					"EO-1":"v_source_hyperion,v_source_hyperion_night_thermo_rock",
					
					"HICO":"v_source_hico",
					
					"BKA":"v_color_bka",
					// "RapydEyeSource":"v_color_rapideye",
					
					"ORBVIEW-3":"v_color_orbview,v_pan_orbview",//"color_orbview",

					"SPOT 5":"color_kosmosnimki",
					"DMC-2":"color_kosmosnimki",

					"RESURS P":"v_color_resursp,v_color_savr,v_color_msah",

					"ENVISAT":"comp_mt_envisat",//0 scen

					"MONITOR-E-RDSA" : "color",//0 scen
					"METEOR-MSU_E" : "color",//0 scen
					
					"WORLDVIEW":"v_pan_worldview",
					"QUICKBIRD":"v_pan_quickbird",					

					"GAZPROM" : "orthophoto",

					"SPOT 2" : "v_for_color_spot_cor",
					"SPOT 4" : "v_for_color_spot_cor"
					
				};

sat2prod['fusion'] = { 
 					"SPOT 2" : "v_for_fusion_spot",
					"SPOT 4" : "v_for_fusion_spot"
				};
				
    
sat2prod['thermo'] = { 
					"LANDSAT 4" : "v_landsat_thermo",
					"LANDSAT 5" : "v_landsat_thermo",
					"LANDSAT 7" : "v_landsat_thermo",
					"LANDSAT 8" : "v_landsat_thermo",
                    "EO-1": "v_source_hyperion_thermo,v_source_hyperion_night_thermo"
				};

sat2prod['thermo_rock'] = { 
					"LANDSAT 4" : "v_landsat_thermo_rock",
					"LANDSAT 5" : "v_landsat_thermo_rock",
					"LANDSAT 7" : "v_landsat_thermo_rock",
					"LANDSAT 8" : "v_landsat_thermo_rock",
                    "EO-1": "v_source_hyperion_thermo_rock,v_source_hyperion_night_thermo_rock"
				};


sat2prod['rgb345'] = { 
					"LANDSAT 4" : "v_rgb345_landsat",
					"LANDSAT 5" : "v_rgb345_landsat",
					"LANDSAT 7" : "v_rgb345_landsat",
					"LANDSAT 8" : "v_rgb345_landsat",
					"SPOT 2" : "v_for_spot_cor_345",
					"SPOT 4" : "v_for_spot_cor_345"
				};

sat2prod['ndvi_hrsat'] = { 
					"LANDSAT 4" : "source_ndvi,ndvi_landsat",
					"LANDSAT 5" : "source_ndvi,ndvi_landsat",
					"LANDSAT 7" : "source_ndvi,ndvi_landsat",
					"LANDSAT 8" : "source_ndvi,ndvi_landsat",
					"DEIMOS" : "source_ndvi"
				};

sat2prod['clouds_landsat'] = { 
					"LANDSAT 4" : "v_fmask_landsat,clouds_landsat",
					"LANDSAT 5" : "v_fmask_landsat,clouds_landsat",
					"LANDSAT 7" : "v_fmask_landsat,clouds_landsat",
					"LANDSAT 8" : "v_fmask_landsat,clouds_landsat"
				};


sat2prod['bw_images'] = { 
					"LANDSAT 7" : "v_pnh_landsat",
					"LANDSAT 8" : "v_pnh_landsat",
					"CANOPUS-V" : "v_for_bw_canopus,v_pnh_canopus_v",
					
					"WORLDVIEW": "v_pan_worldview",
					"QUICKBIRD": "v_pan_quickbird",
                    "RESURS P": "v_pnh_shmsa_vr,v_pnh_shmsa_sr",					

					"ORBVIEW-3": "v_pan_orbview"
				};


function INIT_HRSAT_TAB()
{
        if( typeof( TABS_LIST ) ==	"undefined") { TABS_LIST=[]; }
        TABS_LIST.push('Hrsat');

		init_date_hrsat();
		init_hrsat_products_list();
		
		metaobj_hrsat = new smisMeta({  "NoFlash":1, "debug": 1, "debug_func" : function(msg){	tlog(msg); }, conf: MetaDATA_conf.hrsat2, loadingHTML: _metadata_loadingHTML, nodataHTML: _metadata_nodataHTML });
		metaobj_hrsat.renderMakeParams = hrsat_makeMetaParams;
		metaobj_hrsat.OnMetaUpdate = hrsat_OnMetaUpdate;
		metaobj_hrsat.OnMetaClick = hrsat_OnMetaClick;
		
		metaobj_hrsat.OnGetPointMeta = function(pars)
		{ 
			var t = pars.DATA;
			info_sat_answer(t);
		};
		
		filterObj = getFiltersState();
		
		/* Check config */
		if(typeof(DEVICES_NAMES_TRANSLATION)!="object")
		{
		    alert("CRITICAL ERROR IN PERL CONFIG (DEVICES_NAMES_TRANSLATION)");
		    alert("HRSAT TAB NOT WORKING, SEE WEBSERVER LOGS");
	    }    
}    


var productIsChanged = 0; 

function setActiveHrsatProduct()
{
	 theGroup = document.hrsat_product_filter.hcomp;
	 
	 for (i=0; i< theGroup.options.length; i++) 
	 {
	     var p = theGroup.options[i].value;
	     
	     if(theGroup.options[i].selected) 
	     {
		 	 theGroup.options[i].style.fontWeight = 'bold';
			 activeHrsatProduct = p;

			 if(p=="hrsat_none")
			 {
				clearSelectionHrsat();
			 }
			
         }
         else
         {
		 	 theGroup.options[i].style.fontWeight = 'normal';
         }

   }
     
    productIsChanged=1;

	make_hrsat_params_2();
	
	//ftlog('user',dumpObj(hrsat_params,'','	',0));
	
	metaobj_hrsat.SetDataParams(hrsat_params);
    
	var ans = metaobj_hrsat.get();
	
	if(typeof ans!='undefined')
	{
		if(ans==0) // If 0, productRedraw call there, else - call in hrsat_OnMetaUpdate, after update
		{
			productRedraw();
		}	
	}	
	
	layers["multi_hrsat_set_contour"].params["multi_hrsat_set_contour_filter"] = hrsat_filter;
	layers["multi_hrsat_set"].params["multi_hrsat_set_filter"] = hrsat_filter;
    
    if(document.getElementById('ihmode_none').checked)
    { 
    	mapobj.LayerHide('multi_hrsat_set_contour');
    	mapobj.LayerHide('multi_hrsat_set');
	}	
    if(document.getElementById('ihmode_contour').checked)
    { 
    	mapobj.LayerShow('multi_hrsat_set_contour');
    	mapobj.LayerHide('multi_hrsat_set');
	}	
    if(document.getElementById('ihmode_img').checked)
    { 
    	mapobj.LayerShow('multi_hrsat_set');
    	mapobj.LayerHide('multi_hrsat_set_contour');
	}	
}

function productRedraw() // Special function for redraw if color product changed
{
	//ftlog('productRedraw',productIsChanged);
	if(productIsChanged)
	{
		
		var s = metaobj_hrsat.GetSelectedMetaInfo();
        
		if(s[0])
	    {
		 //var mprod = s[0]['products']['color_landsat'];
		 
		 //var meta_uid = ""+mprod['dt']+"-"+mprod['satellite']+"-"+mprod['station'];
		 
		 //metaobj_hrsat.selectByUID(meta_uid);
		 //metaobj_hrsat.render();
		                
		 hrsat_OnMetaClick();  // for redraw selected scene
	    }
	    productIsChanged=0;
	}
	
}	

function reload_hrsat_parameters() 
{
	make_hrsat_params_2();
	
	metaobj_hrsat.SetDataParams(hrsat_params);
    
	if(active_tab=="tab_hilayers")
	{
		metaobj_hrsat.get();
	}	
    
	layers["multi_hrsat_set_contour"].params["multi_hrsat_set_contour_dt"] = hrsat_params.data_params.dt;
	layers["multi_hrsat_set_contour"].params["multi_hrsat_set_contour_dt_from"] = hrsat_params.data_params.dt_from;

	layers["multi_hrsat_set"].params["multi_hrsat_set_dt"] = hrsat_params.data_params.dt;
	layers["multi_hrsat_set"].params["multi_hrsat_set_dt_from"] = hrsat_params.data_params.dt_from;

    //globalAlert(dumpObj(hrsat_filter,'','	',0));
    
	layers["multi_hrsat_set_contour"].params["multi_hrsat_set_contour_filter"] = hrsat_filter;
	layers["multi_hrsat_set"].params["multi_hrsat_set_filter"] = hrsat_filter;
    
	setHrsatLayers();
}


// #########################################################

function hrsat_makeMetaParams(opts)
{
	//ftlog('user_makeMetaParams',dumpObj(opts,'','	',0)); 	/*DEBUG*/
	var params={};
	
	if(opts.DATA.common.dt) { params.dt = opts.DATA.common.dt; }
	if(opts.DATA.common.station) 
	{ 
		params.station = opts.DATA.common.station; 

		if(typeof planeta_stn_rename == 'function')
		{
						params.station = planeta_stn_rename(opts.DATA.common.station);
		}	
	}

	if(opts.DATA.common.satellite) 
	{ 
    	if(typeof satellite_rename == 'function')
    	{
    		params.satellite = satellite_rename(opts.DATA.common.satellite);
    	}
    	else
    	{
    	    params.satellite = opts.DATA.common.satellite;	
        }

	}

	if(opts.DATA.common.station && opts.INFO.stations && opts.INFO.stations[opts.DATA.common.station])
	{
		var tz = opts.INFO.stations[opts.DATA.common.station].tz;
		if(tz>=0)	{ tz = '+'+tz; }
		else	{ tz = '-'+tz; }
		params.station_tz	= tz;
	}

	var spot_cor	=	'';
	if(opts.DATA.products)
	{
		
		if(opts.DATA.products.color_spot_cor)
		{
				spot_cor='*';
		}
		if(opts.DATA.common.corrected)
		{
				if(opts.DATA.common.corrected==1)
				{
					spot_cor='*';
				}	
		}
		params.spot_cor = spot_cor;
	}

    // *************************************** //
    
    var prod_server;
    var prod_center;
    
    if(opts.DATA.products.color_spot_cor)
    {
    	prod_server = opts.DATA.products.color_spot_cor.server;
    	prod_center = opts.DATA.products.color_spot_cor.center;
	}	
    else
    {
	    for(pkey in opts.DATA.products)
	    {
	    	prod_server = opts.DATA.products[pkey].server;
	    	prod_center = opts.DATA.products[pkey].center;
	    	break;
		}
	}

	if(typeof center_rename == 'function')
	{
		params.center = center_rename(prod_center);
	}
	else
	{
	    params.center = prod_center;	
    }

    // *************************************** //
    
	var local_color = 'color="#000000"';
	var remoute_color = local_color;
	//var remoute_color = 'color="#000099"';
	var error_color = 'color="#FF0000"';
    
    var stn_color = local_color;
    
    if(opts.INFO.servers[prod_server].accessibility==0)
    {
    	stn_color = error_color;
	}	        
    else if(opts.INFO.servers[prod_server].is_local==0)
    {
    	stn_color = remoute_color;
	}	
    
    params.stn_color = stn_color;
    
    if(opts.DATA.common.device)
    {
    	if(typeof center_rename == 'function')
    	{
    		params.device = device_rename(opts.DATA.common.device);
    	}
    	else
    	{
    	    params.device = opts.DATA.common.device;	
        }
    }
    else
    {
     params.device = opts.DATA.common.satellite;
    }
    
    // *************************************** //
    
    if(project_language == 'rus')
    {
        params.scene_title = "Дата: "+params.dt+"\n";
        params.scene_title = params.scene_title+"Спутник: "+params.satellite+"\n";
        params.scene_title = params.scene_title+"Станция: "+opts.DATA.common.station+"\n";
        params.scene_title = params.scene_title+"Прибор: "+opts.DATA.common.device+"\n";
        params.scene_title = params.scene_title+"Центр: "+params.center+"\n";
        if(spot_cor=='*')
        {
            params.scene_title = params.scene_title+"Геокоррекция: есть"+"\n";
        }    
    }
    if(project_language == 'eng')
    {
        params.scene_title = "Date: "+params.dt+"\n";
        params.scene_title = params.scene_title+"Satellite: "+params.satellite+"\n";
        params.scene_title = params.scene_title+"Station: "+opts.DATA.common.station+"\n";
        params.scene_title = params.scene_title+"Device: "+opts.DATA.common.device+"\n";
        params.scene_title = params.scene_title+"Center: "+params.center;
    }




	return params;
}

function hrsat_OnMetaUpdate(opts)
{
	//ftlog('user_OnMetaUpdate',dumpObj(opts,'','	',0)); 	/*DEBUG*/
  
  if(selected_hrsat_scene_update != "")
  {
  	selectedSceneRedraw(selected_hrsat_scene_update);
  }	
  
  productRedraw();
    
	var obj;
	
	if(opts && opts.metadataid && opts.metadataid=='hrsat')
	{
		obj = document.getElementById("_metadata_hrsat_next");
		if(obj)
		{
			if(defined(opts.INFO.query.next) && opts.INFO.query.next!==null)
			{
				if(obj) {obj.disabled="";}
			}
			else
			{
				if(obj) {obj.disabled="disabled";}
			}
		}
			
		obj = document.getElementById("_metadata_hrsat_prev");
		if(obj)
		{
			if(defined(opts.INFO.query.previous) && opts.INFO.query.previous!==null)
			{
				obj.disabled="";
			}			
			else
			{
				obj.disabled="disabled";
			}
		}

		obj = document.getElementById("_metadata_hrsat_portion_info");
		if(obj)
		{
			if(defined(opts.INFO.query.first) && opts.INFO.query.first!==null && defined(opts.INFO.query.last) && opts.INFO.query.last!==null)
			{
					var str_a,str_b;
					if(project_language == 'rus')
					{
						str_a = "Сцены";
						str_b = "всего";
				    }	
					if(project_language == 'eng')
					{
						str_a = "Scenes";
						str_b = "all";
				    }	
					
					obj.innerHTML = str_a+" "+opts.INFO.query.first+"-"+opts.INFO.query.last;
					if(defined(opts.INFO.query.estimated_count) && opts.INFO.query.estimated_count!==null)
					{
						obj.innerHTML += ", "+str_b+" ~ "+opts.INFO.query.estimated_count;
					}
			}
			else
			{
				obj.innerHTML = "&nbsp;";
			}
		}
	}
	
}


function init_date_hrsat()
{
	var date_interval = 3; // In days
	
	var dayObj=new Date();
	var tm = dayObj.getTime();
	tm = tm-(1000*3600*24*date_interval);
	dayObj.setTime(tm);
  
	var ds;
	ds = dayObj.getFullYear()+ '-';
	ds +=(((dayObj.getMonth()+1) < 10) ? "0" : "") + (dayObj.getMonth()+1) + '-';
	ds +=((dayObj.getDate() < 10) ? "0" : "") + dayObj.getDate();

  document.getElementById("start_hrsat_date_field").innerHTML=ds;
  document.getElementById("stop_hrsat_date_field").innerHTML=today();
  
}

function start_dt_disable()
{
	if(document.getElementById('ForThisDateId').checked)
	{
		document.getElementById('start_hrsat_date_field').style.color = "silver";
	}
	else	
	{
		document.getElementById('start_hrsat_date_field').style.color = "black";
	}
}	

function set_hrsat_date_field(id)
{
	reload_hrsat_parameters();
}

function setHrsatVisible(i)
{
	if(i)
	{
		hrsat_visible=1;
		tabVeil("tab_hilayers",0);
	}
	else	
	{
		hrsat_visible=0;
		tabVeil("tab_hilayers",1);
	}
	
	setHrsatVisibleLayers(i);
}

function setHrsatVisibleLayers(i)
{
	if(i)
	{
		hrsat_visible=1;
		document.getElementById('hrsat_visible_control').checked=true;// for external call
	}
	else	
	{
		hrsat_visible=0;
		document.getElementById('hrsat_visible_control').checked=false;
	}
	
	setHrsatLayers();
}


function checkHrsatVisible()
{
	return hrsat_visible;
}



function hrsat_OnMetaClick(opts)
{
	var product_key;
    
	var selected = metaobj_hrsat.GetSelectedMetaInfo( { metadataid : 'hrsat', 'type': 'group_by_products' } );

	ftlog("hrsat_OnMetaClick",dumpObj(selected,'','',0));
	

	// 23.05.2013 Tolpin - disable by date period for VEGA
	var selected_arr = metaobj_hrsat.GetSelectedMetaInfo();

	if(selected_arr && selected_arr[0] && selected_arr[0].disabled)
	{
		if(session.project == 'fap') 
		{ 
			if(typeof(max_demo_date) !=	"undefined")
			{
				//globalAlert('Доступ к данным позднее '+max_demo_date+' в DEMO режиме не возможен!');

				if(typeof(min_demo_date) !=	"undefined")
				{
					globalAlert('Доступ к данным позднее '+max_demo_date+' и ранее '+min_demo_date+' в DEMO режиме не возможен!');
				}
				else
				{
					globalAlert('Доступ к данным в DEMO режиме не возможен!');
				}

			}
			else
			{
				globalAlert('Доступ к данным в DEMO режиме не возможен!');
			}
			clearSelectionHrsat();
			return; 
		}
		else { globalAlert('Доступ к данным не возможен!');clearSelectionHrsat();return; }
	}
	
	if(selected)
	{
		//globalAlert(dumpObj(selected,'','',0));
		
		// Check if this scene not exists in the current product
		
		var is = 0;
		for (var x in selected)
		{
			is = 1;
		}	 
		if(!is)
		{ // Not found
			// (?) metaobj_hrsat.ClearSelection();
			//setHrsatLayers();
			return;
		}	
		
        /////////////////////////////////////////
			
		redrawHrsatProductListPre();

    /* ****************************** */
    // set dominante product (if need, empty str "" if neednt)      
    /* ****************************** */

    var dominante_product = getDominantProduct();
    
		// set params
		for(product_key in selected)
		{
			if((dominante_product!="")&&(product_key!=dominante_product)){continue;}
			
			if(selected.hasOwnProperty(product_key))
			{
				var product_key_new;
				
				product_key_new = "multi_hrsat";
					
				
				if(!layers['hrsat_selected'].params) {layers[product_key_new].params={};}
				layers['hrsat_selected'].params[product_key_new+"_uids"] = selected[product_key][0].id;
				layers['hrsat_selected'].params.server_id = selected[product_key][0].server;

				layers['hrsat_contour_selected'].params[product_key_new+"_contour_uids"] = selected[product_key][0].id;
				layers['hrsat_contour_selected'].params.server_id = selected[product_key][0].server;
			}
		}
		
		if(activeHrsatProduct=='hrsat_contour')
		{
			mapobj.LayerShow('hrsat_contour_selected');
			mapobj.LayerHide('hrsat_selected');
		}
		
		if((activeHrsatProduct!='hrsat_none')&&(activeHrsatProduct!='hrsat_contour'))
		{
			mapobj.LayerShow('hrsat_selected');
			mapobj.LayerHide('hrsat_contour_selected');
		}
		 
		 
		 if(activeHrsatProduct=='hrsat_none')
		 {
		 	activeHrsatProduct="hrsat_contour";

			document.hrsat_product_filter.hcomp.options[1].selected=true;
		 	document.hrsat_product_filter.hcomp.options[1].style.fontWeight = 'bold';
		 	document.hrsat_product_filter.hcomp.options[0].style.fontWeight = 'normal';
		 }	  
		
		
	}
	
	
}




function setHrsatLayers()
{
	if(!hrsat_visible)
	{
		mapobj.LayerHide('multi_hrsat_set');
		mapobj.LayerHide('multi_hrsat_set_contour');
		mapobj.LayerHide('hrsat_selected');
		mapobj.LayerHide('hrsat_contour_selected');
	 }
	 else
	{

        if(document.getElementById('ihmode_none').checked)
        { 
        	mapobj.LayerHide('multi_hrsat_set_contour');
        	mapobj.LayerHide('multi_hrsat_set');
    	}	
        if(document.getElementById('ihmode_contour').checked)
        { 
        	mapobj.LayerShow('multi_hrsat_set_contour');
        	mapobj.LayerHide('multi_hrsat_set');
    	}	
        if(document.getElementById('ihmode_img').checked)
        { 
        	mapobj.LayerShow('multi_hrsat_set');
        	mapobj.LayerHide('multi_hrsat_set_contour');
    	}	

		var s = metaobj_hrsat.GetSelectedMetaInfo();
		if(s[0])
		{
			if(activeHrsatProduct=='hrsat_contour')
			{
				mapobj.LayerShow('hrsat_contour_selected');
				mapobj.LayerHide('hrsat_selected');
			}
			if((activeHrsatProduct!='hrsat_none')&&(activeHrsatProduct!='hrsat_contour'))
			{
				mapobj.LayerShow('hrsat_selected');
				mapobj.LayerHide('hrsat_contour_selected');
			}
		}
		else
		{		
			mapobj.LayerHide('hrsat_selected');
			mapobj.LayerHide('hrsat_contour_selected');
        }
	}

}	


function tab_hilayers_onactive()
{
	make_hrsat_params_2();
	metaobj_hrsat.SetDataParams(hrsat_params);
	metaobj_hrsat.get();
}	


function hrsat2Basket()
{
		var hsat = metaobj_hrsat.GetSelectedMetaInfo();
		
		if(!(hsat[0]))
		{   
			if(project_language == 'rus')
			{
				globalAlert('Нет выбранных данных\nдля добавления в корзину!');
			}
			if(project_language == 'eng')
			{
				globalAlert('There are no scenes to add in basket');
			}
				
			return;
		}	

		hsat[0]['common'] = {};
		hsat[0]['common']['type'] = 'hrsat';
	    
		for (var x in (hsat[0]['products'])) 
		{ 
		   	 if( HashSize(hsat[0]['products'])>1 )
		   	 {
		   	 	if( x == "color_spot") {continue;} // use color_spot_cor
          
          var dominante_product = getDominantProduct();
          if((dominante_product!="")&&(x!=dominante_product)){continue;}
          
		   	 }	
		   	 
		   	 if(activeHrsatProduct=='hrsat_contour')
		   	 {
				  hsat[0]['activeProduct'] = 'contour';
		   	 	hsat[0]['products']=hsat[0]['products'][x];
		   	 	hsat[0]['common']['dataid'] = 'hrsat_contour_selected';
		   	 	break;
	   	 	 }
		   	 else
		   	 {
					  hsat[0]['activeProduct'] = x;
		   	 		hsat[0]['products']=hsat[0]['products'][x];
		   	 		hsat[0]['common']['dataid'] = 'hrsat_selected';
		   	 		break;
		   	 }
		}	

		metaBasket.addData(hsat);
		metaBasket.render();
}	

function init_hrsat_products_list()
{
	var i=0;
	var default_active_product = 1;
	
	if(activeHrsatProduct=="none")
	{
	 default_active_product = 0;
	}    
	
	var row = "<select name='hcomp' onchange='setActiveHrsatProduct();' style='width: 285px;'>\n";
	
	for(key in hrsat_products_list)
	{
		var lname = hrsat_products_list[key];
		if(i!=default_active_product)
		{
	    	if(key.indexOf("label")>-1) // Разделитель строк
	    	{
	    	  row = row+"\n"+"<option disabled=true>"+lname+"</option>";
	    	}
	    	else
	        {
	    	  if(key.length>2)// Skip empty (last element)
	    	  {
	    	    row = row+"\n"+"<option value='"+key+"'>"+lname+"</option>";
	    	  }  
	    	}
		}
		else
		{
	    	row = row+"\n"+"<option value='"+key+"' style='font-weight:bold' selected>"+lname+"</option>";
		}
		i++;
	}	
    row = row+"\n</select>";
    
    document.getElementById("_hrsat_prod_list_div").innerHTML = row;
}	

function sovzond_order_selected_hrsat()
{
	if(hrsat_visible)
	{
		var s = metaobj_hrsat.GetSelectedMetaInfo();
		if (s[0])
		{
			var t = getLayerURLTemplate({layer_id:'hrsat_selected'});
			var l = fillLayerURLParams({layer_id:'hrsat_selected',template:t});
			
			var extent = {};
			extent.x_size = mapobj.width();
			extent.y_size = mapobj.height();
			extent.bbox = mapobj.minLon+","+mapobj.minLat+", "+mapobj.maxLon+","+mapobj.maxLat;
			
			l=l.replace('%minLon%,%minLat%,%maxLon%,%maxLat%',extent.bbox);
			l=l.replace('%image_width%',extent.x_size);
			l=l.replace('%image_height%',extent.y_size);
			l=l.replace('%imagetype%','gif');
			l=l+'&multi_hrsat_full_res=1';
			
			var img = new Image();
			img.onload = function()	{ return 1;};			
			img.src = l;			

			globalAlert('Сцена '+s[0].satellite+' '+s[0].dt+' доступна для просмотра в полном разрешении! Сдвиньте карту для обновления!'); 	/*DEBUG*/
			
			metaobj_hrsat.get();	
		}
	}
	
	return 0;
}

function redrawHrsatProductListPre()
{
	var s1 = metaobj_hrsat.GetSelectedMetaInfo( { metadataid : 'hrsat', 'type': 'group_by_products' } );  
    
    var  t1 = MetaDATA_conf['hrsat']['data_url'];
    var te = new RegExp("(.+)\\?");
    var t2 = t1.match(te);
    var base_url = t2[1];
    
	if(s1)
	{
				var scene;
				for(product_key in s1)
				{
					if(s1.hasOwnProperty(product_key))
					{
						scene = s1[product_key][0];
				    }
				 }
				 
				var dt = scene["dt"]; 
				 
				var product_list_url = base_url+"?REQUEST=GetMetadata&BBOX=-179.999,-89.999,179.999,89.999&dt="+dt+"&dt_from="+dt+"&portion=1&layers=multi_hrsat&satellite="+scene["satellite"]+"&station="+scene["station"]+"&srs=smis:lonlat";
				 
                var sources_str="";
                for (i=0;i<filterObj['sources'].length;i++)
                {
                    var l_name = filterObj['sources'][i];
                    sources_str=sources_str+l_name+",";
                }
				 
				product_list_url = product_list_url+"&sources="+sources_str;

				dojoGet({ url: product_list_url, fn: setHrsatProductList}); // set products list
     }
}

function setHrsatProductList(responseText,params)
{
  	var str = responseText;  

	var re = /.+ERROR.+/;
	var a = str.search(re);
	if (a!=-1)
	{
		globalAlert("Ошибка скрипта");
		return false;
	}
    
	pinfo = jsonParse(str);

    var sat = pinfo['DATA'][0]['common']['satellite'];
    
    prods = pinfo['DATA'][0]['products'];
    
    // ############################################## //
    
	theGroup = document.hrsat_product_filter.hcomp;
	
	 for (i=0; i< theGroup.options.length; i++) 
	 {
				var p = theGroup.options[i].value;
				
				var l1 = theGroup.options[i];
				l1.style.color = '#C1C1C1'; // Light color
				
				var DARK_COLOR = '#020202';
				
				if((p=="hrsat_contour")||(p=="hrsat_none"))
				{
						l1.style.color = DARK_COLOR;
				}	
				else
				{
						for(product_key in prods)
						{
									
									if(prods.hasOwnProperty(product_key))
									{
									
												// ######################################

												if(sat2prod[p])
												{
													if(sat2prod[p][sat]) 
													{
														l1.style.color = DARK_COLOR;
													}
												}
												else
												{
													if(p==product_key)
													{
														l1.style.color = DARK_COLOR;
													}
												}	
												
												if((p=="hrsat_img")&&((product_key=="color_spot_cor")||(product_key=="color_spot")))
												{
													l1.style.color = DARK_COLOR;
												}
												
												// TMP - for virtual products !!!
												if( (p=="v_rgb658_landsat")&&(product_key=="source_landsat") )
												{
													l1.style.color = DARK_COLOR;
												}
												if( (p=="bw_images")&&(product_key=="pnh_landsat") )
												{
													l1.style.color = DARK_COLOR;
												}
												// ######################################
									}
						}
				}     
		 	
	 }
	 
	 
     return true;
}	

function clearSelectionHrsat()
{
			 	metaobj_hrsat.ClearSelection(); 
				mapobj.LayerHide('hrsat_contour_selected');
				mapobj.LayerHide('hrsat_selected');
}	


function getDominantProduct()
{
    var selected = metaobj_hrsat.GetSelectedMetaInfo( { metadataid : 'hrsat', 'type': 'group_by_products' } );
    
    var p_count = HashSize(selected);
    
    if(p_count<2){return "";} // domin. product not need
    
    // find virt and some not_virt products 
		var not_virt_prod = "";
		var is_virt_prod = "";
		
		for(product_key in selected)
		{
		    if ( /^v_/.test(product_key) )
		    {
					is_virt_prod = product_key;    	
      	} 
      	else
		    {
					not_virt_prod = product_key;    	
      	} 
      		
  	}
    
    // SELECTION LOGIC:
    
    // Всегда есть два продукта на этом этапе выполнения.
    // Виртальный и обычные ИЛИ два и более обычных
    
    var dominante_product = "";
    
    if(is_virt_prod!="")
    { 
    	// Если есть виртуальный и обычный - выбрать обычный 
    	dominante_product = not_virt_prod; 
    	
    	// Или всё-таки виртуальный? (закомментировано) 
    	// dominante_product = is_virt_prod;
  	}
  	else
    { // Если только обычные - выбрать любой из них
    	dominante_product = not_virt_prod; 
  	}
  		
	  return dominante_product;
}	



function getHrsatTabState()
{
	var obj = { 'HRSAT_LAYERS_STATE': {} };

	obj['HRSAT_LAYERS_STATE']['IS_ACTIVE'] = checkHrsatVisible();

	obj['HRSAT_LAYERS_STATE']['DATECONTROLS'] = {};

	obj['HRSAT_LAYERS_STATE']['DATECONTROLS']['start_hrsat_date_field'] = dojo.query("#start_hrsat_date_field")[0].innerHTML;

	obj['HRSAT_LAYERS_STATE']['DATECONTROLS']['stop_hrsat_date_field'] = dojo.query("#stop_hrsat_date_field")[0].innerHTML;

	obj['HRSAT_LAYERS_STATE']['DATECONTROLS']['onlyOneDate'] = dojo.query("#ForThisDateId")[0].checked;

  // --------------- //

    obj['HRSAT_LAYERS_STATE']['FILTER'] = getCheckboxesState();

  // --------------- //

	chset = dojo.query("select[name=hcomp]");
	
	obj['HRSAT_LAYERS_STATE']['PRODUCT'] = chset[0].value;
  
	var chset = dojo.query("#group_hrsat_mod  input[type=radio]:checked");

	obj['HRSAT_LAYERS_STATE']['HRSAT_COVER_MODE'] = chset[0].id;

  // --------------- //
 
	var s = metaobj_hrsat.GetSelectedMetaInfo();
        
	if(s[0])
	{
       var s1 = s[0]['dt'];
       var s2 = s[0]['satellite'];
       var s3 = s[0]['station'];
       var sta = ""+s1+"-"+s2+"-"+s3;
   
	   obj['HRSAT_LAYERS_STATE']['SELECTED_SCENE'] = sta;
	}
  
  // --------------- //

	return obj;
}

/* ########################################################### */


function setHrsatTabState(load_obj)
{
    var obj = load_obj['HRSAT_LAYERS_STATE'];

	dojo.query("#start_hrsat_date_field")[0].innerHTML = obj['DATECONTROLS']['start_hrsat_date_field'];

	dojo.query("#stop_hrsat_date_field")[0].innerHTML = obj['DATECONTROLS']['stop_hrsat_date_field'];

    var chset = dojo.query("#ForThisDateId")[0];
	
	chset.checked=obj['DATECONTROLS']['onlyOneDate'];
	
	start_dt_disable();// for onlyOneDate
	
	// --------------- //

	setCheckboxesState(obj['FILTER']);

    newFiltersChanged();
	

  if(typeof hidehrsatcloudfields == 'function')
  { 
  	hidehrsatcloudfields(); // for cloudiness: name=is_cloud
  }	

  // --------------- //

	chset = dojo.query("select[name=hcomp]");
	
	chset[0].value = obj['PRODUCT'];
	
    var chset2 = dojo.query("#"+obj['HRSAT_COVER_MODE']);
	
	if(chset2[0])
	{
					chset2[0].checked=true;
    }
	
	// --------------- //
  
  if(obj['IS_ACTIVE'])
  {
			if(obj['SELECTED_SCENE'])
			{
				selected_hrsat_scene_update = obj['SELECTED_SCENE'];
			}

		  reload_hrsat_parameters();// RELOAD ALL LAYERS

		  setActiveHrsatProduct();
	}

  setHrsatVisible(obj['IS_ACTIVE']);
  
}

function selectedSceneRedraw(sta) 
{
		   	metaobj_hrsat.selectByUID(sta);
		   	metaobj_hrsat.render();
	   	 	metaobj_hrsat.SetDataParams({ data_params: { get_portion_by_id: '' } }); 
			selected_hrsat_scene_update = "";
}

function setUnionDateHrsat(udate)
{
  document.getElementById("start_hrsat_date_field").innerHTML=udate;
  document.getElementById("stop_hrsat_date_field").innerHTML=udate;
	
  reload_hrsat_parameters();
}	


// ======================================================================== //

function make_hrsat_params_2()
{
	var start_hrsat_date = document.getElementById("start_hrsat_date_field").innerHTML;
	var stop_hrsat_date = document.getElementById("stop_hrsat_date_field").innerHTML;

	if(document.getElementById('ForThisDateId').checked)
	{
		 start_hrsat_date = stop_hrsat_date;
	}

	if(start_hrsat_date>stop_hrsat_date)
	{
		 start_hrsat_date = stop_hrsat_date;
		 document.getElementById("start_hrsat_date_field").innerHTML = start_hrsat_date;
	}
	
	
	var fiter_array = new Object();

 	var view_prepaid=document.getElementById('view_prepaid');
	fiter_array.view_prepaid="";
	if (view_prepaid)
	{
		if (view_prepaid.checked)
		{
			fiter_array.view_prepaid	= 1;
		}
		else
		{
			fiter_array.view_prepaid	= 0;			
		}
	}

   var products_array = new Object();
   
   // Make satelites list
   fiter_array.sats = new Array();
   sats_str="";

    for (i=0;i<filterObj['sats'].length;i++) 
    {
             var l_name = filterObj['sats'][i];
      
	         fiter_array.sats[fiter_array.sats.length] = l_name;
	         
	         sats_str=sats_str+l_name+",";
	         
	         // Add product
	         
	         if((activeHrsatProduct!="hrsat_none")&&(activeHrsatProduct!="hrsat_contour")&&(activeHrsatProduct!="hrsat_img"))
	         {
	         		//fusion,rgb345,clouds_landsat,etc
	         		if(sat2prod[activeHrsatProduct])
	         		{
	         			 var prod = sat2prod[activeHrsatProduct][l_name];
				         if(prod)
				         {  
						    if ( /\,/.test(prod) )// if several products in list
						    {
						    	var words = prod.split(/\,/g);
						    		var t = words[0];
						    		products_array[t]=1;

						    	for (var c=0; c<words.length; c++) 
						    	{
						    		var t = words[c];
						    		products_array[t]=1;
						    	}  
						    }	
				            else
				            {	
				            	products_array[prod]=1;
				          	}
				            
				         }
				         else
				         {
		         		    prod = activeHrsatProduct;     
		         		    products_array[prod]=1;
				         }
	         		}	
	              else
	              {
		         		prod = activeHrsatProduct;     
		         		products_array[prod]=1;
	         	  }
	         }
	         else
	         {	
	         		 //hrsat_none, hrsat_contour or hrsat_img
			         var prod = sat2prod['hrsat_img'][l_name];
				         if(prod)
				         {  

								    if ( /\,/.test(prod) )// if several products in list
								    {
								    	var words = prod.split(/\,/g);
								    		var t = words[0];
								    		products_array[t]=1;

								    	for (var c=0; c<words.length; c++) 
								    	{
								    		var t = words[c];
								    		products_array[t]=1;
								    	}  
								    }	
				            else
				            {	
				            	products_array[prod]=1;
				          	}
				            
				         }
			         else
			         {
                        

						
						         	// Added 24/08/2011 by Diego
					         		// show all METEOR products when contour product is selected
						         	if( (activeHrsatProduct=="hrsat_contour")&&((l_name=="METEOR-KMSS_50")||(l_name=="METEOR-KMSS_101")||(l_name=="METEOR-KMSS_102")) )
						         	{
					         			prod = "kmss_full_res";     
					         			products_array[prod]=1;				         	
					         		}
					         		
					         		
						         	if((l_name=="SPOT 2")||(l_name=="SPOT 4"))
						         	{
						         		if((document.getElementById('correction_ch'))&&(document.getElementById('correction_ch').checked))
						         		{
						         			prod = "color_spot_cor";
						         			products_array[prod]=1;
						         		}
						         		else
						         		{
						         			prod = "color_spot_cor";
						         			products_array[prod]=1;
						         			prod = "color_spot";
						         			products_array[prod]=1;
						         		}
						         			
						        	}	
      	
			        	
			         }
     
         		// Added 14.03.2013 by efr
         		// Exclude for Canopus: for obtain ALL contours must set all Canopus products
	         	if( (activeHrsatProduct=="hrsat_contour")&&(l_name=="Canopus-B") )
	         	{
         			prod = "color_canopus";     
         			products_array[prod]=1;	
         			prod = "bw_canopus";     
         			products_array[prod]=1;	
         		}
     
			         
			         
			         		
	         }
	         
	}

     // NIITP EXCLUDE
    for (i=0;i<filterObj['sources'].length;i++)
    {
        var l_name = filterObj['sources'][i];
        if(l_name == "niitp")
        {
         products_array["color_niitp"]=1;
        } 
    }
    
    if( typeof improveProductsChange == 'function')
    {
        products_array = improveProductsChange(products_array);
    }
    
	// Add by Tolpin for ZAPAS
	sats_str=sats_str.replace(/RESURS DK ZAPAS/g,"RESURS DK-1");
	sats_str=sats_str.replace(/MONITOR-E ZAPAS/g,"MONITOR-E");

   fiter_array.products = new Array();
   prods_str="";

	for(key in products_array)
	{
	 fiter_array.products[fiter_array.products.length] = key;
	 prods_str = prods_str+key+",";	
    }


   // Make station list
   fiter_array.station = new Array();
   stn_str="";
   
    for (i=0;i<filterObj['stns'].length;i++)
    {
        var l_name = filterObj['stns'][i];
        fiter_array.station[fiter_array.station.length] = l_name;
        stn_str=stn_str+l_name+",";
    }

   // Make sources list
   fiter_array.sources = new Array();
   sources_str="";
   
    for (i=0;i<filterObj['sources'].length;i++)
    {
        var l_name = filterObj['sources'][i];
        fiter_array.sources[fiter_array.sources.length] = l_name;
        sources_str=sources_str+l_name+",";
    }

   // Make satdevice list
   fiter_array.device = new Array();
   satdevices_str=""; 
   
   for (i=0;i<filterObj['devs'].length;i++)
   {
	         var l_name = filterObj['devs'][i];
	         fiter_array.device[fiter_array.device.length] = l_name;
	         satdevices_str=satdevices_str+l_name+",";
   }
    
   if(satdevices_str=="")
   {
    satdevices_str="none_device";
    fiter_array.device[fiter_array.device.length] = "none_device";
   } 
   
   
    for(var mkey in filterObj['misc']) 
    {
        var filter_key = mkey;
        if(mkey=="cloudiness"){filter_key="max_clouds"};
        if(mkey=="is_corrected"){filter_key="corrected"};
        
        if(mkey=="is_polyfind")
        {
	 		var poly_obj = mapobj.ActivePolygonGet();
	 		
	 		if(!poly_obj)
	 		{
	 			if(project_language == 'rus')
	 			{
	 				globalAlert("Полигон не задан!");
	 			}
	 			if(project_language == 'eng')
	 			{
	 				globalAlert("Polygon not defined");
	 			}
	 		}
	 		else
	 		{
	 		    poly_find_wkt = poly_obj.toWKT({coordOrder: 'yx', useMultiPolygon: 0});
                fiter_array["polyfind"] = poly_find_wkt; 
                continue;
            }
        }

        fiter_array[filter_key] = filterObj['misc'][mkey];  
    }




      
   
   
    
	hrsat_filter = JSON.stringify(fiter_array);

	// Add by Tolpin for ZAPAS
	hrsat_filter=hrsat_filter.replace(/RESURS DK ZAPAS/g,"RESURS DK-1");
	hrsat_filter=hrsat_filter.replace(/MONITOR-E ZAPAS/g,"MONITOR-E");	
	
	var srs_string = "";
    if(typeof(need_reproj)!="undefined")
    { 
    	srs_string=currentProjection;
	}	
	
	hrsat_params = { data_params: 
	{ 
		minLon: mapobj.minLon,// by Efr, for advice by Kashnicky, 26.09.2014  
		minLat: fixLat(mapobj.minLat), 
		maxLon: mapobj.maxLon, // by Efr, for advice by Kashnicky, 26.09.2014 
		//maxLon: fixLon(mapobj.maxLon), 
		maxLat: fixLat(mapobj.maxLat),
		height: mapobj.height(),
		width: mapobj.width(),
		dt: stop_hrsat_date,
		satellite: sats_str,
		station: stn_str,
		sources: sources_str,
		device: satdevices_str,
		dt_from: start_hrsat_date,
		products: prods_str,
		srs: srs_string,
		polyfind: fiter_array.polyfind ? fiter_array.polyfind : "",
		corrected:  fiter_array.corrected ? fiter_array.corrected : "",
		max_cloudiness: fiter_array.max_clouds ? fiter_array.max_clouds : "",
		portion: hrsat_list_portion
	} };

	// add by Tolpin
	if(typeof session!='undefined')
	{
		if(typeof session.id!='undefined')
		{
			hrsat_params.data_params.sid = session.id;
		}
	}

   
}	 

function make_hrsat_params()
{
    make_hrsat_params_2(); // Need for compabilities
}    

function center_rename(center)
{       
    var return_value = center; // default
    
    if(CENTERS_NAMES_TRANSLATION[center])
    {
      if(project_language == 'rus')
      {
        return_value = CENTERS_NAMES_TRANSLATION[center]['name'];
      }
      else
      {
        return_value = CENTERS_NAMES_TRANSLATION[center]['engname'];
      }
          
    }
    return return_value;
}

function device_rename(device)
{       
    var return_value = device; // default
    
    if(DEVICES_NAMES_TRANSLATION[device])
    {
      if(project_language == 'rus')
      {
        return_value = DEVICES_NAMES_TRANSLATION[device]['name'];
      }
      else
      {
        return_value = DEVICES_NAMES_TRANSLATION[device]['engname'];
      }
          
    }
    return return_value;
}

function satellite_rename(sat)
{       
    var return_value = sat; // default
    
    if(SATELLITES_NAMES_TRANSLATION[sat])
    {
      if(project_language == 'rus')
      {
        return_value = SATELLITES_NAMES_TRANSLATION[sat]['name'];
      }
      else
      {
        return_value = SATELLITES_NAMES_TRANSLATION[sat]['engname'];
      }
          
    }
    return return_value;
}

function improveProductsMode()
{
  setActiveHrsatProduct();  
}

function improveProductsChange(products_array)
{
  //if(!dojo.query("#improveProductsCh")){return products_array;}

  if(dojo.query("#improveProductsCh")[0].checked)
  {
	var new_products_array = new Object();
	
	for(key in products_array)
	{
	  if ( /^v_/.test(key) )
	  {
	        new_products_array[key+"_auto"] = 1;
	  }
	  else
	  {
	        new_products_array[key] = 1;
	  }
    }
  
    return new_products_array;

  }
  else
  {
    return products_array;
  }
}

