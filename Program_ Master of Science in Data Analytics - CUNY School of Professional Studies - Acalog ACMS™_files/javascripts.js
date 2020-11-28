/* Javascript functions for all of public acalog site. */

/* GENERAL pup up window function */
function acalogPopup(URL, NAME, WIDTH, HEIGHT, SCROLL) {
	//	Get width and height for IE.
	if (screen.height) {
		LEFT = (screen.width - WIDTH) / 2;
		TOP = (screen.height - HEIGHT) / 2;
	} else {
		LEFT = (screen.availWidth - WIDTH) / 2;
		TOP = (screen.availHeight - HEIGHT) / 2;
	}
	popupWindow = window.open(URL,NAME,'height='+HEIGHT+',width='+WIDTH+',resizable=yes,scrollbars='+SCROLL+',menubar=no,toolbar=no,personalbar=no,statusbar=no,locationbar=no,screenX='+LEFT+',screenY='+TOP+',left='+LEFT+',top='+TOP);
	popupWindow.focus();
}

/* PRINT LINK capability testing and window pop function for popup print links. */
function print_link_popup(URL, NAME, WIDTH, HEIGHT, SCROLL) {
	if (!window.print) {
		URL ="help.php#print_link";
	}
	acalogPopup(URL,NAME,WIDTH,HEIGHT,SCROLL);
}

/* PRINT LINK capability testing and window pop function for non-popup print links. */
function print_link_nopop() {
	if (window.print) {
		window.print();
	} else {
		acalogPopup('help.php#print_link','help',600,470,'yes');
	}
}

//	Validate N2 search options.
function validateSearchOptions() {
	if ($('location').selectedIndex == 0) {
		alert('You must select a search location.');
		return false;
	}
	if (document.getElementById('keyword').value == 'Enter Keyword  ' || document.getElementById('keyword').value.replace(/(^ +| +$)/, '') == '') {
		alert('You have not entered a search term.');
		return false;
	}
	
	return true;
}

/* Close popup and change location of popup opener. */
function redirect_opener(LOCATION) {
	window.close();
	window.opener.location = LOCATION;
}

/* Fix links within description data. */
function fix_link(URL) {
	document.location.href=URL;
}
function fix_link_popup(URL) {
	acalogPopup(URL, 'temp', 770, 530, 'yes');
}

/*	The following functions are used to show/hide information in complex filter links.	*/

//	Display the formatted Display/Hide link.
//	@param	id_name		- The ID name of the DIV to display/hide must always start with "data".
//	@param	link_copy	- The information to be displayed/hidden such as "Programs" or "Courses".
//	@return	nothing
function showlink(id_name, link_copy) {
	if (document.getElementById) {
		document.write("<a href=\"javascript:hideshow('"+id_name+"')\"><span id=\"link"+id_name.substring(4)+"\">Display</span> "+link_copy+"</a>");
	}
}

//	Displays or hides the selected DIV and changes the Display/Hide link to say "Display" or "Hide" as appropriate.
//	@param	div_id	- The DIV id to display/hide.
//	@return	nothing
function hideshow(div_id) {
	if (document.getElementById) {
		dataobj = document.getElementById(div_id);
		linkobj = document.getElementById("link"+div_id.substring(4));
		if (dataobj.style.display=="none") {
			dataobj.style.display="";
			linkobj.innerHTML = "Hide";
		} else {
			dataobj.style.display="none";
			linkobj.innerHTML = "Display";
		}
	}
}

/*	in_portfolio is actually the current catalog oid and, if present, denotes that the course is being displayed in the portfolio
	is_archive denotes if the catalog is an archived catalog when showing courses in the portfolio.
	if show_program_display_field is 1, then display the program display text after a course (usually credits) */
function hideCourse(catalog, course, activator, display_options)
{
	params = "catoid=" +catalog+ "&coid=" +course+ "&display_options=" +display_options+ "&hide";
	window.ajax = new Ajax.Request('/ajax/preview_course.php', {method: 'get', parameters: params, onComplete: showData} );
	node = activator.parentNode;
	activator.parentNode.innerHTML = activator.parentNode.innerHTML + '<p style="text-align: center;"><img src="/loading.gif" alt="Loading" style="width: 16px; height: 16px;" /></p>';
	window.ajax.activator = node;
}

/*	in_portfolio is actually the current catalog oid and, if present, denotes that the course is being displayed in the portfolio
	is_archive denotes if the catalog is an archived catalog when showing courses in the portfolio.
	if show_program_display_field is 1, then display the program display text after a course (usually credits) */
function showCourse(catalog, course, activator, display_options)
{
	var node = '';
	var comp = function() {
			Tooltip.setup();
			socialMediaActivate();
			courseAjaxCallback();
			if ($('search_keyword_field') != null) {
				highlight.process($('search_keyword_field').getValue(), node);
			} else {
				var ref = window.location + "";
				if (ref.indexOf('?') == -1) return;
				var qs = ref.substr(ref.indexOf('?')+1);
				var qsa = qs.split('&');
				for (var i=0;i<qsa.length;i++) {
					var qsip = qsa[i].split('=');
				  if (qsip.length == 1) continue;
				  if (qsip[0] == 'hl') {
						var wordstring = unescape(qsip[1].replace(/\+/g,' '));
						highlight.process(wordstring, node);
				  }
				}
			}
		};
	
	try {
		node = activator.parentNode;
		showHideAjaxCallbackClass(node);
		
		params = "catoid=" +catalog+ "&coid=" +course+ "&display_options=" +display_options+ "&show";
		window.ajax = new Ajax.Updater(activator.parentNode, '/ajax/preview_course.php', {method: 'get', parameters: params, onComplete: comp} );

		activator.parentNode.innerHTML = activator.parentNode.innerHTML + '<p style="text-align: center;"><img src="/loading.gif" alt="Loading" style="width: 16px; height: 16px;" /></p>';
		window.ajax.activator = node;
	} catch (e) {
		acalogPopup('preview_course.php?catoid=' +catalog+ '&coid=' +course,'preview_course',600,325,'yes');
	}
}

/*	Use AJAX to show the courses that exist underneath an entity in filters 10 and 15.
	Created for ticekt #2174.	*/
function showHideFilterData(activator, show_hide, cat_oid, nav_oid, ent_oid, type, link_text)
{
	try {
		params = "&show_hide=" + show_hide + "&cat_oid=" + cat_oid + "&nav_oid=" + nav_oid + "&ent_oid=" + ent_oid + "&type=" + type + "&link_text=" + link_text;
		window.ajax = new Ajax.Updater(activator.parentNode, '/ajax/preview_filter_show_hide_data.php', {method: 'get', parameters: params, onComplete: function() {Tooltip.setup();socialMediaActivate();}} );
		node = activator.parentNode;
		
		activator.parentNode.innerHTML = activator.parentNode.innerHTML + '<p><img src="/loading.gif" alt="Loading" style="width: 16px; height: 16px;" /> Loading ... </p>';
		window.ajax.activator = node;
	} catch (e) {
		if ( $(nav_oid + "_" + ent_oid + "_" + type).value != 1 ) {
		acalogPopup('/ajax/preview_filter_show_hide_data.php?limit=' + limit,'preview_course',600,325,'yes');
		}
	}
}

//	This function is used to hide catalog data shown via a placeholder.
function hideCatalogData(catalog, data_type, data_id, link_text, activator, display_options)
{
	switch (data_type)
	{
		case '20': // Hierarchy Items
			params = "catoid=" + catalog + "&ent_oid=" + data_id + "&link_text=" + link_text + "&display_options=" + display_options + "&hide";
			ajax_page = '/ajax/preview_entity.php';
			break;
		case '1': // Programs
			params = "catoid=" + catalog + "&poid=" + data_id + "&link_text=" + link_text + "&display_options=" + display_options + "&hide";
			ajax_page = '/ajax/preview_program.php';
			break;
		case '3': // Courses
			params = "catoid=" + catalog + "&coid=" + data_id + "&link_text=" + link_text + "&display_options=" + display_options + "&hide";
			ajax_page = '/ajax/preview_course.php';
			break;
		case '14':	//	Filters
			params = "catoid=" + catalog + "&nav_oid=" + data_id + "&link_text=" + link_text  + "&display_options=" + display_options + "&hide";
			ajax_page = '/ajax/preview_filter.php';
			ajax_catch = "acalogPopup('preview_content.php?catoid=" + catalog + "&nav_oid=" + data_id + "','preview_content',770,530,'yes');";
			break;
		case '107': // Images
			params = "catoid=" + catalog + "&id=" + data_id + "&link_text=" + link_text + "&display_options=" + display_options + "&hide";
			ajax_page = '/ajax/preview_image.php';
			break;
		case '16':
			params = "catoid=" + catalog + "&id=" + data_id + "&link_text=" + link_text  + "&display_options=" + display_options + "&hide";
			ajax_page = '/ajax/preview_page.php';
			break;
	}
	node = activator.parentNode;
	showHideAjaxCallbackClass(node);
	window.ajax = new Ajax.Request(ajax_page, {method: 'get', parameters: params, onComplete: showData} );
	node = activator.parentNode;
//	activator.parentNode.innerHTML = activator.parentNode.innerHTML + '<p style="text-align: center;"><img src="/loading.gif" alt="Loading" style="width: 16px; height: 16px;" /></p>';
	activator.parentNode.innerHTML = activator.parentNode.innerHTML + ' [<img src="/loading.gif" alt="Loading" style="width: 16px; height: 16px;" /> Loading ...]';
	window.ajax.activator = node;
}

//	This function is used to show catalog data shown via a placeholder.
function showCatalogData(catalog, data_type, data_id, link_text, activator, display_options)
{
	switch (data_type)
	{
		case '20':
			params = "catoid=" + catalog + "&ent_oid=" + data_id + "&link_text=" + link_text  + "&display_options=" + display_options + "&show";
			ajax_page = '/ajax/preview_entity.php';
			ajax_catch = "acalogPopup('preview_entity.php?catoid=" + catalog + "&ent_oid=" + data_id + "','preview_entity',770,530,'yes');";
			break;
		case '1':
			params = "catoid=" + catalog + "&poid=" + data_id + "&link_text=" + link_text  + "&display_options=" + display_options + "&show";
			ajax_page = '/ajax/preview_program.php';
			ajax_catch = "acalogPopup('preview_program.php?catoid=" + catalog + "&poid=" + data_id + "','preview_program',770,530,'yes');";
			break;
		case '3':
			params = "catoid=" + catalog + "&coid=" + data_id + "&link_text=" + link_text  + "&display_options=" + display_options + "&show";
			ajax_page = '/ajax/preview_course.php';
			ajax_catch = "acalogPopup('preview_course.php?catoid=" + catalog + "&coid=" + data_id + "','preview_course',770,530,'yes');";
			break;
		case '14':
			params = "catoid=" + catalog + "&nav_oid=" + data_id + "&link_text=" + link_text  + "&display_options=" + display_options + "&show";
			ajax_page = '/ajax/preview_filter.php';
			ajax_catch = "acalogPopup('preview_content.php?catoid=" + catalog + "&nav_oid=" + data_id + "','preview_content',770,530,'yes');";
			break;
		case '107':
			params = "catoid=" + catalog + "&id=" + data_id + "&link_text=" + link_text  + "&display_options=" + display_options + "&show";
			ajax_page = '/ajax/preview_image.php';
			ajax_catch = "acalogPopup('preview_image.php?catoid=" + catalog + "&id=" + data_id + "','preview_image',770,530,'yes');";
			break;
		case '16':
			params = "catoid=" + catalog + "&id=" + data_id + "&link_text=" + link_text  + "&display_options=" + display_options + "&show";
			ajax_page = '/ajax/preview_page.php';
			ajax_catch = "acalogPopup('content.php?catoid=" + catalog + "&navoid=" + data_id + "','preview_page',770,530,'yes');";
			break;
	}
	
	try {
		window.ajax = new Ajax.Request(	ajax_page,{method: 'get',parameters: params,onComplete: showData} );

		//window.ajax = new Ajax.Updater(activator.parentNode, ajax_page, { method: 'get', parameters: params, onComplete: function() {  }} );
		node = activator.parentNode;
		showHideAjaxCallbackClass(node);
//		activator.parentNode.innerHTML = activator.parentNode.innerHTML + '<p style="text-align: center;"><img src="/loading.gif" alt="Loading" style="width: 16px; height: 16px;" /></p>';
		activator.parentNode.innerHTML = activator.parentNode.innerHTML + ' [<img src="/loading.gif" alt="Loading" style="width: 16px; height: 16px;" /> Loading ...]';
		window.ajax.activator = node;
	} catch (e) {
		eval(ajax_catch);
		//acalogPopup('preview_course.php?catoid=' +catalog+ '&coid=' +course,'preview_course',770, 530,'yes');
	}
}

function showData(request)
{
//	node = window.ajax.activator.innerHTML = request.responseText;	//	Old code.

	Tooltip.setup();
	socialMediaActivate();
	
	try {
		if (typeof(request) != 'undefined') {
			//	New code to replace the entire parent of the AJAX activator.
			window.ajax.activator.innerHTML = request.responseText;
			var parent = window.ajax.activator.parentNode;
			//text = parent.innerHTML;
			//parent.innerHTML = '';
			//node = parent.innerHTML = text;
		}
	} catch(e){	}

	Tooltip.setup();
	socialMediaActivate();
	courseAjaxCallback();
	
	try {
		if ( $('search_keyword_field') != null ) {
			highlight.process($('search_keyword_field').getValue(), parent);
		} else {
			var ref = window.location + "";
			if (ref.indexOf('?') == -1) return;
			var qs = ref.substr(ref.indexOf('?')+1);
			var qsa = qs.split('&');
			for (var i=0;i<qsa.length;i++) {
				var qsip = qsa[i].split('=');
				if (qsip.length == 1) continue;
				if (qsip[0] == 'hl') {
					var wordstring = unescape(qsip[1].replace(/\+/g,' '));
					highlight.process(wordstring, parent);
				}
			}
		}
	} catch(e){	}
}

function select_ie_fix() {
	$$('select').each(function(select) {
		var div = document.createElement('div');
		div.setAttribute('class', 'selectWrapper');

		select.parentNode.insertBefore(div, select);
		div.appendChild(select);

		div.style.width = select.offsetWidth + 'px';
		div.style.height = select.offsetHeight + 'px';

		div.style.zIndex = '8888';
		div.style.textAlign = 'left';
		div.style.display='inline';
		select.originalWidth = select.offsetWidth;
		select.style.position = 'relative';
		div.style.position = 'relative';

Event.observe(select, 'mousedown', expandbox);
		Event.observe(select, 'change', shrink);
		Event.observe(select, 'blur', shrink);
	});
}

function expandbox(selector) {
	try {
		var select = Event.element(selector);
		selectorWidth = select.cloneNode(true);
		select.parentNode.appendChild(selectorWidth);

		selectorWidth.style.width = 'auto';
		var widthFull = selectorWidth.offsetWidth;
		select.parentNode.removeChild(selectorWidth);
		if ( widthFull >= select.originalWidth ) {
			select.style.width = 'auto';
		}
		select.style.position = 'absolute';
		select.style.zIndex = '9999';
	} catch(e) { }
}

function shrink(selector) {
	try {
		var select = Event.element(selector);
		select.style.width = select.originalWidth;
		select.style.position = 'none';
	} catch (e) { }
}

function showPrintLinks() {
		var printLinks = $$('.print_link');
		for(var i=0; i < printLinks.length; i++){
			printLinks[i].style.display = 'inline';
		}
	}

// Prevent Callback to non existing function
function showHideAjaxCallbackClass(showHideObj) {}
function courseAjaxCallback() {}

if(typeof $$ === 'function'){
if ( typeof window.attachEvent != "undefined" ) {
	window.attachEvent("onload", select_ie_fix);
	window.attachEvent("onload", showPrintLinks);
} else if ( typeof window.addEventListener != "undefined" ) {
	window.addEventListener("load", showPrintLinks, false);
}
}