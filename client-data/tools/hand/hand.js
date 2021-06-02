/**
 *                        WHITEBOPHIR
 *********************************************************
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2013  Ophir LOJKINE
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend
 */

(function () { //Code isolation

	var orig = { x: 0, y: 0 };
	var pressed = false;
	function clientCoords(evt) {
		if(evt.touches) {
			return evt.touches[0];
		} else {
			return evt;
		}
	}
	function press(x, y, evt, isTouchEvent) {
		pressed = true;
		orig.x = scrollX + clientCoords(evt).clientX;
		orig.y = scrollY + clientCoords(evt).clientY;
	}
	function move(x, y, evt, isTouchEvent) {
		if (pressed && !pinching) {
			window.scrollTo(orig.x - clientCoords(evt).clientX, orig.y - clientCoords(evt).clientY);
		}
	}
	function release() {
		pressed = false;
	}

	function zoom(scale, x, y) {
		var pageX = window.scrollX + x
		var pageY = window.scrollY + y
		var x = pageX / scale;
		var y = pageY / scale;
		var oldScale = Tools.getScale();
		var newScale = Tools.setScale(scale);
		window.scrollTo(
			window.scrollX + x * (newScale - oldScale),
			window.scrollY + y * (newScale - oldScale)
		);
	}

	var mc = new Hammer.Manager(document.getElementById("board"));
	mc.add(new Hammer.Pinch());
	mc.get('pinch').set({ enable: false });

	var pinchStart = {}
	var pinching = false
	mc.on("pinchstart", event => {
		pinching = true
		gtag('event', 'click', { 'event_category': 'pinch' });
		pinchStart = {
			scale: Tools.getScale(),
			scrollX: window.scrollX,
			scrollY: window.scrollY,
			centerX: event.center.x,
			centerY: event.center.y,
		}
	});

	mc.on("pinch", event => {
		zoom(pinchStart.scale * event.scale,
			event.center.x,
			event.center.y);
	});

	mc.on("pinchend", event => {
		pinching = false
	});


	function onStart() {
		gtag('event', 'click', { 'event_category': 'pan' });
		mc.get('pinch').set({ enable: true });
	}

	function onQuit() {
		mc.get('pinch').set({ enable: false });
	}

	Tools.add({ //The new tool
		// "name": "Hand",
		"iconHTML": '<i class="far fa-hand-paper"></i>',
        "name": "Hand",
		"title": "Pan / Zoom (pinch) / Fullscreen (double-click)",
		//"icon": "",
		"shortcuts": {
            "changeTool":"8"
        },
		"listeners": {
			"press": press,
			"move": move,
			"release": release
		},
		"onstart": onStart,
		"onquit": onQuit,
		"mouseCursor": "move"
	});

	document.getElementById("toolID-Hand").addEventListener('dblclick', (evt) => {
		if (document.fullscreenElement) {
			document.exitFullscreen()
		} else {
			document.documentElement.requestFullscreen()
		}
	});

})(); //End of code isolation
