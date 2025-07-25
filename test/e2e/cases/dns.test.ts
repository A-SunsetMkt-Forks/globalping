import got from 'got';
import { expect } from 'chai';
import { waitMeasurementFinish } from '../utils.js';

describe('dns measurement', () => {
	const resolver = '1.1.1.1';

	it('should finish successfully', async () => {
		const { id } = await got.post('http://localhost:80/v1/measurements', {
			json: {
				type: 'dns',
				target: 'www.jsdelivr.com',
				measurementOptions: { resolver },
			},
		}).json<any>();

		const response = await waitMeasurementFinish(id);

		expect(response.body.status).to.equal('finished');
		expect(response.body.results[0].result.status).to.equal('finished');
		expect(response.body.results[0].result.answers.length).to.be.above(0);
		expect(response.body.results[0].result.hops).to.not.exist;
		expect(response).to.matchApiSchema();
	});

	it('should finish successfully in case of "traced": true', async () => {
		const { id } = await got.post('http://localhost:80/v1/measurements', {
			json: {
				type: 'dns',
				target: 'www.jsdelivr.com',
				measurementOptions: {
					resolver,
					trace: true,
				},
			},
		}).json<any>();

		const response = await waitMeasurementFinish(id);

		expect(response.body.status).to.equal('finished');
		expect(response.body.results[0].result.status).to.equal('finished');
		expect(response.body.results[0].result.hops.length).to.be.above(0);
		expect(response).to.matchApiSchema();
	});

	it('should finish successfully in case of IPv6 resolver', async () => {
		const { id } = await got.post('http://localhost:80/v1/measurements', {
			json: {
				type: 'dns',
				target: 'www.jsdelivr.com',
				measurementOptions: {
					resolver: '2606:4700:4700::1111',
				},
			},
		}).json<any>();

		const response = await waitMeasurementFinish(id);

		expect(response.body.status).to.equal('finished');
		expect(response.body.results[0].result.status).to.equal('finished');
		expect(response.body.results[0].result.answers.length).to.be.above(0);
		expect(response.body.results[0].result.hops).to.not.exist;
		expect(response).to.matchApiSchema();
	});

	it('should return 400 for blacklisted target', async () => {
		const response = await got.post('http://localhost:80/v1/measurements', {
			json: {
				type: 'dns',
				target: 'google-ads.xyz',
				measurementOptions: { resolver },
			},
			throwHttpErrors: false,
		});

		expect(response.statusCode).to.equal(400);
	});

	it('should return 400 for blacklisted resolver', async () => {
		const response = await got.post('http://localhost:80/v1/measurements', {
			json: {
				type: 'dns',
				target: 'www.jsdelivr.com',
				measurementOptions: {
					resolver: '101.109.234.248',
				},
			},
			throwHttpErrors: false,
		});

		expect(response.statusCode).to.equal(400);
	});

	it('should finish successfully in case of root domain target', async () => {
		const { id } = await got.post('http://localhost:80/v1/measurements', {
			json: {
				type: 'dns',
				target: '.',
				measurementOptions: {
					resolver,
					query: {
						type: 'ANY',
					},
				},
			},
		}).json<any>();

		const response = await waitMeasurementFinish(id);

		expect(response.body.status).to.equal('finished');
		expect(response.body.results[0].result.status).to.equal('finished');
		expect(response).to.matchApiSchema();
	});

	it('should finish successfully in case of tld target', async () => {
		const { id } = await got.post('http://localhost:80/v1/measurements', {
			json: {
				type: 'dns',
				target: 'com',
				measurementOptions: {
					resolver,
					query: {
						type: 'ANY',
					},
				},
			},
		}).json<any>();

		const response = await waitMeasurementFinish(id);

		expect(response.body.status).to.equal('finished');
		expect(response.body.results[0].result.status).to.equal('finished');
		expect(response).to.matchApiSchema();
	});
});
