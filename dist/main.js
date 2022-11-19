function scale(num, len) {
	return Math.round(num / 255 * (len - 1));
}

var charset = {};
charset.upalpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
charset.lowalpha = 'abcdefghijklmnopqrstuvwxyz';
charset.digit = '0123456789';
charset.symbol = '!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~'; // all the ASCII special characters
charset.all = charset.lowalpha + charset.upalpha + charset.digit + charset.symbol;

var prior = '';

function generate(len) {
	var needs = ['lowalpha', 'upalpha', 'digit'];

	// cause it could be 0, and you  would get a missing digit in the output
	if(charset.symbol.length > 0) {
		needs.push('symbol');
	}

	// in case there is no input
	len = parseInt(len) || needs.length;

	var password = new Array(len);
	var indices = [...password.keys()];

	var random = new Uint8Array(len * 2);
	crypto.getRandomValues(random);
	random = [...random];

	while (indices.length > 0) {
		var choices = 'all';
		if(indices.length === needs.length) {
			choices = needs.shift();
		}

		var id = scale(random.shift(), indices.length);
		var pos = indices.splice(id, 1)[0];

		var pick = [...charset[choices]];
		var ix = scale(random.shift(), pick.length);
		var val = pick[ix];

		for (var i = 0; i < needs.length; i++) {
			if(charset[needs[i]].includes(val)) {
				needs.splice(i, 1);
				break;
			}
		}

		password[pos] = val;
	}

	return password.join('');
}

function highlight(element) {
	const string = element.innerText;
	const pattern = /(\d+)|([^a-zA-Z\d]+)/g;

	function replacer(match, p1, p2) {
		if(p1 !== undefined) {
			return `<span class="number">${match}</span>`;
		}
		if (p2 !== undefined) {
			return `<span class="punctuation">${match}</span>`;
		}
	}

	element.innerHTML = string.replace(pattern, replacer);
}

function regen() {
	var len = parseInt(document.getElementById('length').value);
	document.getElementById('res').textContent = generate(len);
	highlight(document.getElementById('res'));
}

window.addEventListener('load', function() {
	document.getElementById('allow').addEventListener('change', function() {
		charset.symbol = this.value;
		charset.all = charset.lowalpha + charset.upalpha + charset.digit + charset.symbol;
		regen();
	});

	document.getElementById('url').addEventListener('change', function() {
		if(this.checked) {
			// save the old value temporarily
			prior = document.getElementById('allow').value;
			document.getElementById('allow').value = '-._~';
			document.getElementById('allow').disabled = true;
		} else {
			document.getElementById('allow').value = prior;
			document.getElementById('allow').disabled = false;
		}
		document.getElementById('allow').dispatchEvent(new Event('change'));
		document.getElementById('url').blur();
	});

	document.getElementById('length').addEventListener('change', function() {
		regen();
	});

	document.getElementById('gen').addEventListener('click', function() {
		regen();
		document.getElementById('gen').blur();
	});

	document.getElementById('copy').addEventListener('click', function() {
		// this is a promise, but I don't care to handle it
		navigator.clipboard.writeText(document.getElementById('res').textContent);
		document.getElementById('copy').blur();
	});

	document.getElementById('allow').value = charset.symbol;
	document.getElementById('url').checked = false;
	document.getElementById('length').value = 16;
	regen();

	document.getElementById('light-sw').addEventListener('click', function() {
		document.documentElement.className = 'light';
		if (window.localStorage) {
			localStorage.setItem('theme', 'light');
		}
	});

	document.getElementById('dark-sw').addEventListener('click', function() {
		document.documentElement.className = 'dark';
		if (window.localStorage) {
			localStorage.setItem('theme', 'dark');
		}
	});
});
