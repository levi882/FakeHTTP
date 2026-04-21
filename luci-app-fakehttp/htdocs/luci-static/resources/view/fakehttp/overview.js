'use strict';
'require view';
'require form';
'require rpc';
'require uci';
'require poll';
'require dom';

var callServiceList = rpc.declare({
	object: 'service',
	method: 'list',
	params: [ 'name' ],
	expect: { '': {} }
});

function getServiceStatus() {
	return L.resolveDefault(callServiceList('fakehttp'), {}).then(function(res) {
		var service = res.fakehttp;
		var running = false;

		if (service && service.instances) {
			Object.keys(service.instances).forEach(function(name) {
				if (service.instances[name].running)
					running = true;
			});
		}

		return running;
	});
}

function renderStatus(running) {
	return E('span', {
		'style': 'font-weight: bold; color: ' + (running ? '#008a00' : '#b00020')
	}, running ? _('Running') : _('Not running'));
}

return view.extend({
	load: function() {
		return Promise.all([
			uci.load('fakehttp')
		]);
	},

	render: function() {
		var m, s, o;

		m = new form.Map('fakehttp', _('FakeHTTP'),
			_('Configure FakeHTTP from LuCI. Save and apply changes to reload the service.'));

		s = m.section(form.NamedSection, 'main', 'fakehttp', _('Service'));

		o = s.option(form.DummyValue, '_status', _('Current status'));
		o.rawhtml = true;
		o.cfgvalue = function() {
			return '<div id="fakehttp_status">' + _('Collecting data...') + '</div>';
		};

		o = s.option(form.Flag, 'enabled', _('Enable service'));
		o.rmempty = false;

		o = s.option(form.DynamicList, 'http_host', _('HTTP hostnames'));
		o.placeholder = 'www.example.com';
		o.description = _('Adds one -h argument for each hostname.');

		o = s.option(form.DynamicList, 'https_host', _('HTTPS hostnames'));
		o.placeholder = 'www.example.com';
		o.description = _('Adds one -e argument for each hostname.');

		o = s.option(form.DynamicList, 'binary_file', _('Binary payload files'));
		o.placeholder = '/etc/fakehttp/payload.bin';
		o.description = _('Adds one -b argument for each file path.');

		o = s.option(form.Flag, 'alliface', _('Use all interfaces'));
		o.default = '0';

		o = s.option(form.DynamicList, 'interface', _('Interfaces'));
		o.placeholder = 'eth0';
		o.depends('alliface', '0');
		o.description = _('Adds one -i argument for each interface.');

		o = s.option(form.Flag, 'inbound', _('Process inbound traffic'));
		o.default = '1';
		o.rmempty = false;

		o = s.option(form.Flag, 'outbound', _('Process outbound traffic'));
		o.default = '1';
		o.rmempty = false;

		o = s.option(form.Flag, 'ipv4', _('Process IPv4 traffic'));
		o.default = '1';
		o.rmempty = false;

		o = s.option(form.Flag, 'ipv6', _('Process IPv6 traffic'));
		o.default = '1';
		o.rmempty = false;

		o = s.option(form.Value, 'queue_number', _('NFQUEUE number'));
		o.datatype = 'uinteger';
		o.placeholder = '512';

		o = s.option(form.Value, 'repeat', _('Duplicate generated packets'));
		o.datatype = 'uinteger';
		o.placeholder = '2';
		o.description = _('Maps to -r. Valid values in FakeHTTP are 1 to 10.');

		o = s.option(form.Value, 'ttl', _('Generated packet TTL'));
		o.datatype = 'uinteger';
		o.placeholder = '3';
		o.description = _('Maps to -t. Valid values in FakeHTTP are 1 to 255.');

		o = s.option(form.Value, 'fwmark', _('Firewall mark'));
		o.placeholder = '0x8000';
		o.description = _('Maps to -m. Decimal and hexadecimal values are both accepted.');

		o = s.option(form.Value, 'fwmask', _('Firewall mask'));
		o.placeholder = '0x8000';
		o.description = _('Optional -x override. Leave empty to use FakeHTTP defaults.');

		o = s.option(form.Value, 'dynamic_pct', _('Dynamic TTL percentage'));
		o.datatype = 'uinteger';
		o.placeholder = '0';
		o.depends('no_hop_estimation', '0');
		o.description = _('Maps to -y. Set 0 to disable.');

		o = s.option(form.Value, 'log_file', _('Log file'));
		o.placeholder = '/var/log/fakehttp.log';
		o.description = _('Optional -w path. Leave empty to log through procd.');

		o = s.option(form.Flag, 'silent', _('Silent mode'));
		o.default = '0';

		o = s.option(form.Flag, 'skip_firewall', _('Skip firewall rule management'));
		o.default = '0';
		o.description = _('Maps to -f. Use this only if firewall rules are managed elsewhere.');

		o = s.option(form.Flag, 'no_hop_estimation', _('Disable hop count estimation'));
		o.default = '0';

		return m.render().then(function(node) {
			var statusNode = node.querySelector('#fakehttp_status');

			poll.add(function() {
				return getServiceStatus().then(function(running) {
					if (statusNode)
						dom.content(statusNode, renderStatus(running));
				});
			});

			return node;
		});
	}
});
