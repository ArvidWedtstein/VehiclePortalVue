import { vehicleManufacturersCodes } from './vehicleManufacturerCodes';

export const vinCountryCodes = new Map<string, string>([
  ['AA-AH', 'South Africa'],
  ['AJ-AN', 'Ivory Coast'],
  ['AP-A0', 'not assigned'],
  ['BA-BE', 'Angola'],
  ['BF-BK', 'Kenya'],
  ['BL-BR', 'Tanzania'],
  ['BS-B0', 'not assigned'],
  ['CA-CE', 'Benin'],
  ['CF-CK', 'Malagasy'],
  ['CL-CR', 'Tunisia'],
  ['CS-C0', 'not assigned'],
  ['DA-DE', 'Egypt'],
  ['DF-DK', 'Morocco'],
  ['DL-DR', 'Zambia'],
  ['DS-D0', 'not assigned'],
  ['EA-EE', 'Ethiopia'],
  ['EF-EK', 'Mozambique'],
  ['EL-E0', 'not assigned'],
  ['FA-FE', 'Ghana'],
  ['FF-FK', 'Nigeria'],
  ['FF-FK', 'Madagascar'],
  ['FL-F0', 'not assigned'],
  ['GA-G0', 'not assigned'],
  ['HA-H0', 'not assigned'],
  ['JA-J0', 'Japan'],
  ['KA-KE', 'Sri Lanka'],
  ['KF-KK', 'Israel'],
  ['KL-KR', 'Korea (South)'],
  ['KS-K0', 'not assigned'],
  ['LA-L0', 'China'],
  ['MA-ME', 'India'],
  ['MF-MK', 'Indonesia'],
  ['ML-MR', 'Thailand'],
  ['MS-M0', 'not assigned'],
  ['NF-NK', 'Pakistan'],
  ['NL-NR', 'Turkey'],
  ['NS-N0', 'not assigned'],
  ['PA-PE', 'Philipines'],
  ['PF-PK', 'Singapore'],
  ['PL-PR', 'Malaysia'],
  ['PS-P0', 'not assigned'],
  ['RA-RE', 'United Arab Emirates'],
  ['RF-RK', 'Taiwan'],
  ['RL-RR', 'Vietnam'],
  ['RS-R0', 'not assigned'],
  ['SA-SM', 'Great Britain'],
  ['SN-ST', 'Germany'],
  ['SU-SZ', 'Poland'],
  ['S1-S0', 'not assigned'],
  ['TA-TH', 'Switzerland'],
  ['TJ-TP', 'Czechoslovakia'],
  ['TR-TV', 'Hungary'],
  ['TW-T1', 'Portugal'],
  ['T2-T0', 'not assigned'],
  ['UA-UG', 'not assigned'],
  ['UH-UM', 'Denmark'],
  ['UN-UT', 'Ireland'],
  ['UU-UZ', 'Romania'],
  ['U1-U4', 'not assigned'],
  ['U5-U7', 'Slovakia'],
  ['U8-U0', 'not assigned'],
  ['VA-VE', 'Austria'],
  ['VF-VR', 'France'],
  ['VS-VW', 'Spain'],
  ['VX-V2', 'Yugoslavia'],
  ['V3-V5', 'Croatia'],
  ['V6-V0', 'Estonia'],
  ['WA-W0', 'Germany'],
  ['XA-XE', 'Bulgaria'],
  ['XF-XK', 'Greece'],
  ['XL-XR', 'Netherlands'],
  ['XS-XW', 'U.S.S.R.'],
  ['XX-X2', 'Luxembourg'],
  ['X3-X0', 'Russia'],
  ['YA-YE', 'Belgium'],
  ['YF-YK', 'Finland'],
  ['YL-YR', 'Malta'],
  ['YS-YW', 'Sweden'],
  ['YX-Y2', 'Norway'],
  ['Y3-Y5', 'Belarus'],
  ['Y6-Y0', 'Ukraine'],
  ['ZA-ZR', 'Italy'],
  ['ZS-ZW', 'not assigned'],
  ['ZX-Z2', 'Slovenia'],
  ['Z3-Z5', 'Lithuania'],
  ['Z6-Z0', 'not assigned'],
  ['1A-10', 'United States'],
  ['2A-20', 'Canada'],
  ['3A-3W', 'Mexico'],
  ['3X-37', 'Costa Rica'],
  ['38-30', 'not assigned'],
  ['4A-40', 'United States'],
  ['5A-50', 'United States'],
  ['6A-6W', 'Australia'],
  ['6X-60', 'not assigned'],
  ['7A-7E', 'New Zealand'],
  ['7F-70', 'not assigned'],
  ['8A-8E', 'Argentina'],
  ['8F-8K', 'Chile'],
  ['8L-8R', 'Ecuador'],
  ['8S-8W', 'Peru'],
  ['8X-82', 'Venezuela'],
  ['83-80', 'not assigned'],
  ['9A-9E', 'Brazil'],
  ['9F-9K', 'Colombia'],
  ['9L-9R', 'Paraguay'],
  ['9S-9W', 'Uruguay'],
  ['9X-92', 'Trinidad & Tobago'],
  ['93-99', 'Brazil'],
  ['90', 'not assigned'],
]);

type VINData = {
  country: string;
  manufacturer: string;
  vehicleType: string;
  modelYear: number;
  plantCode: string;
  sequentialNumber: string;
};

export const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;

/**
 * Decodes a Vehicle Identification Number (VIN) and returns the data.
 *
 * | name     | WMI     |  Desc |
 * | :------- | :---------- | :------------------ |
 * | Position1| 	1    | Shows where the vehicle was built (1 - means United States) |
 * | 2-3      | FT     | Designated the vehicle manufacturer (F - means Ford Inc.)
 * | 4-8      | GHDLZ  | Denotes the vehicle's brand, engine size, and type
 * | 9        | B      | Vehicle Security Code
 * | 10       | G      | Shows Vehicle Year
 * | 11       | K      | Indicates which plant assembled the vehicle
 * | 12-17    | 456923 | Displays the serial number of the vehicle
 *
 * @param vin The VIN to decode.
 * @returns The decoded VIN data.
 */
export const decodeVIN = (vin: string): VINData | null => {
  if (!vinRegex.test(vin)) {
    console.error('Invalid VIN format.');
    return null;
  }

  const worldManufacturerCode = vin.slice(0, 3);
  const vehicleDescriptorSection = vin.slice(3, 9);
  // const vehicleIdentifierSection = vin.slice(9, 17);

  const countryCode = vin.slice(0, 2);
  const yearCode = vin[9];
  const plantCode = vin[10];
  const sequentialNumber = vin.slice(11);

  const vehicleManufacturer = vehicleManufacturersCodes
    .get(worldManufacturerCode)
    ?.split(' ')[0];

  const years: Record<string, number> = {
    A: 1980,
    B: 1981,
    C: 1982,
    D: 1983,
    E: 1984,
    F: 1985,
    G: 1986,
    H: 1987,
    J: 1988,
    K: 1989,
    L: 1990,
    M: 1991,
    N: 1992,
    P: 1993,
    R: 1994,
    S: 1995,
    T: 1996,
    V: 1997,
    W: 1998,
    X: 1999,
    Y: 2000,
    1: 2001,
    2: 2002,
    3: 2003,
    4: 2004,
    5: 2005,
    6: 2006,
    7: 2007,
    8: 2008,
    9: 2009,
    0: 1980,
  };

  const alternativeYears: Record<string, number> = {
    A: 2010,
    B: 2011,
    C: 2012,
    D: 2013,
    E: 2014,
    F: 2015,
    G: 2016,
    H: 2017,
    J: 2018,
    K: 2019,
    L: 2020,
    M: 2021,
    N: 2022,
    P: 2023,
    R: 2024,
    S: 2025,
    T: 2026,
    V: 2027,
    W: 2028,
    X: 2029,
    Y: 2030,
  };

  const adjustedYears: Record<string, number> = Object.fromEntries(
    Object.entries(years).filter(
      ([key], index, arr) => arr.findIndex(([k]) => k === key) === index,
    ),
  );

  const [country] = getCountryFromCode(countryCode);

  return {
    country: country || 'Unknown',
    manufacturer: vehicleManufacturer || worldManufacturerCode,
    vehicleType: vehicleDescriptorSection,
    modelYear: alternativeYears[yearCode] || adjustedYears[yearCode] || 0,
    plantCode: plantCode,
    sequentialNumber: sequentialNumber,
  };
};

const isInRange = (range: string, code: string): boolean => {
  const sequence = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

  const [start, end = ''] = range.split('-');

  if (start.length !== 2 || end.length !== 2 || code.length !== 2) {
    return false;
  }

  const getIndices = (indCode: string): [number, number] => {
    return [sequence.indexOf(indCode[0]), sequence.indexOf(indCode[1])];
  };

  const [startFirst, startSecond] = getIndices(start);
  const [endFirst, endSecond] = getIndices(end);
  const [codeFirst, codeSecond] = getIndices(code);

  if (codeFirst < startFirst || codeFirst > endFirst) {
    return false;
  }

  if (codeFirst === startFirst && codeSecond < startSecond) {
    return false;
  }
  if (codeFirst === endFirst && codeSecond > endSecond) {
    return false;
  }

  return true;
};

const getCountryFromCode = (code: string) => {
  const matches = Array.from(vinCountryCodes.entries()).filter(([range]) =>
    isInRange(range, code),
  );

  return matches.map(([, country]) => country);
};
