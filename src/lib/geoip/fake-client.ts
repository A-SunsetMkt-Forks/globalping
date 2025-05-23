import type { LocationInfo } from './client.js';

export const fakeLookup = (): LocationInfo => {
	return {
		continent: 'SA',
		country: 'AR',
		state: null,
		city: 'Buenos Aires',
		region: 'South America',
		normalizedCity: 'buenos aires',
		asn: 61003,
		latitude: -34.61,
		longitude: -58.38,
		network: 'InterBS S.R.L. (BAEHOST)',
		normalizedNetwork: 'interbs s.r.l. (baehost)',
		isProxy: false,
		isHosting: null,
		isAnycast: false,
		allowedCountries: [ 'AR' ],
	};
};
