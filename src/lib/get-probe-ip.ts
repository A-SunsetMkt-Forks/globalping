import requestIp from 'request-ip';
import type { Socket } from 'socket.io';

const getProbeIp = (socket: Socket) => {
	if (process.env['TEST_MODE'] === 'unit') {
		return '1.2.3.4';
	}

	if (process.env['TEST_MODE'] === 'e2e') {
		return '1.2.3.4'; // Uses a fake lookup.
	}

	// Use random ip assigned by the API
	if (process.env['FAKE_PROBE_IP']) {
		// Use fake ip provided by the probe if exists
		if (socket.handshake.query['fakeIp']) {
			return socket.handshake.query['fakeIp'] as string;
		}

		const samples = [
			'131.255.7.26', // Buenos Aires
			'213.136.174.80', // Naples
			'95.155.94.127', // Krakow
			'18.200.0.1', // Dublin, AWS
			'34.140.0.10', // Brussels, GCP
			'65.49.22.66',
			'185.229.226.83',
			'94.214.253.78',
			'79.205.97.254',
			'2a04:4e42:200::485', // San Francisco
		];
		// Choosing ip based on the probe uuid to always return the same ip for the same probe.
		const lastGroup = (socket.handshake.query['uuid'] as string).split('-').pop() || '0';
		const index = parseInt(lastGroup, 16) % samples.length;
		return samples[index];
	}

	const clientIp = requestIp.getClientIp(socket.request);

	if (!clientIp) {
		return null;
	}

	const hasEmptyIpv6Prefix = clientIp.startsWith('::ffff:');
	return hasEmptyIpv6Prefix ? clientIp.slice(7) : clientIp;
};

export default getProbeIp;
