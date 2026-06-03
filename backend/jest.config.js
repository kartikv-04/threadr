
export default {
  preset:"ts-jest",
  rootDir:"./",
  clearMocks:true,
  testEnvironment:"node",
  extensionsToTreatAsEsm:[".ts"],
  moduleNameMapper:{
    "^(\\.{1,2}/.*)\\.js$":"$1",
  },
  roots:["<rootDir>/tests"],
  transform:{
    "^.+\\.ts?$":[
      "ts-jest",
      {
        // useESM:true,
        tsconfig: {
          // Force TypeScript to compile to CommonJS for tests.
          // This removes the need for --experimental-vm-modules flag.
          module: 'commonjs',
          esModuleInterop: true
        }
      },
    ],
  },
  testMatch:["**/*.test.ts"],
  moduleFileExtensions:["ts","js"],
};

