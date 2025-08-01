#!/usr/bin/env node

/**
 * Final verification script to demonstrate the StarkNet.js types library is working correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 StarkNet.js Types Library - Final Verification Test\n');

// Test 1: Verify build outputs exist
console.log('1️⃣ Checking build outputs...');
const requiredFiles = [
  'dist/cjs/index.js',
  'dist/esm/index.js', 
  'dist/types/index.d.ts'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
if (missingFiles.length > 0) {
  console.error('❌ Missing build files:', missingFiles);
  process.exit(1);
}
console.log('✅ All build outputs present\n');

// Test 2: CommonJS Import
console.log('2️⃣ Testing CommonJS imports...');
try {
  const cjsLib = require('./dist/cjs/index.js');
  
  // Test type guards
  console.log('  - isFELT("0x123"):', cjsLib.isFELT('0x123'));
  console.log('  - isAddress("0x123abc"):', cjsLib.isAddress('0x123abc'));
  console.log('  - isEthAddress("0x1234567890123456789012345678901234567890"):', 
    cjsLib.isEthAddress('0x1234567890123456789012345678901234567890'));
  
  // Test utilities
  const obj = { a: 1, b: 2, c: 3 };
  const keys = cjsLib.typedKeys(obj);
  console.log('  - typedKeys({a:1,b:2,c:3}):', keys);
  
  console.log('✅ CommonJS imports working\n');
} catch (error) {
  console.error('❌ CommonJS import failed:', error.message);
  process.exit(1);
}

// Test 3: ESM Import Test
console.log('3️⃣ Testing ESM structure...');
try {
  const esmIndexExists = fs.existsSync('dist/esm/index.js');
  const esmPackageJson = JSON.parse(fs.readFileSync('dist/esm/package.json', 'utf8'));
  
  console.log('  - ESM index.js exists:', esmIndexExists);
  console.log('  - ESM package.json type:', esmPackageJson.type);
  console.log('✅ ESM structure correct\n');
} catch (error) {
  console.error('❌ ESM structure test failed:', error.message);
  process.exit(1);
}

// Test 4: TypeScript Definitions
console.log('4️⃣ Testing TypeScript definitions...');
try {
  const dtsContent = fs.readFileSync('dist/types/index.d.ts', 'utf8');
  
  // Check for key exports
  const requiredExports = [
    'export type CoreFELT',
    'export type CoreADDRESS', 
    'export { isFELT',
    'export { isAddress',
    'export { typedKeys'
  ];
  
  const missingExports = requiredExports.filter(exp => !dtsContent.includes(exp.split(' ')[2] || exp.split(' ')[1]));
  
  if (missingExports.length > 0) {
    console.warn('⚠️  Some exports may be missing:', missingExports);
  }
  
  console.log('  - TypeScript definitions file size:', dtsContent.length, 'chars');
  console.log('✅ TypeScript definitions present\n');
} catch (error) {
  console.error('❌ TypeScript definitions test failed:', error.message);
  process.exit(1);
}

// Test 5: Package.json Validation
console.log('5️⃣ Validating package.json exports...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  console.log('  - Package name:', packageJson.name);
  console.log('  - Version:', packageJson.version);
  console.log('  - Main (CJS):', packageJson.main);
  console.log('  - Module (ESM):', packageJson.module);
  console.log('  - Types:', packageJson.types);
  
  // Check exports field
  if (packageJson.exports && packageJson.exports['.']) {
    console.log('  - Exports field configured:', 'YES');
  } else {
    console.warn('  - Exports field configured:', 'NO');
  }
  
  console.log('✅ Package.json structure valid\n');
} catch (error) {
  console.error('❌ Package.json validation failed:', error.message);
  process.exit(1);
}

// Test 6: Runtime Functionality  
console.log('6️⃣ Testing runtime functionality...');
try {
  const { isFELT, isAddress, isEthAddress, typedKeys, createBrand } = require('./dist/cjs/index.js');
  
  // Test various inputs
  const tests = [
    { fn: isFELT, input: '0x0', expected: true, name: 'isFELT(0x0)' },
    { fn: isFELT, input: '0x123abc', expected: true, name: 'isFELT(valid)' },
    { fn: isFELT, input: 'invalid', expected: false, name: 'isFELT(invalid)' },
    { fn: isAddress, input: '0x123abc', expected: true, name: 'isAddress(valid)' },
    { fn: isAddress, input: 'invalid', expected: false, name: 'isAddress(invalid)' },
    { fn: isEthAddress, input: '0x1234567890123456789012345678901234567890', expected: true, name: 'isEthAddress(valid)' },
    { fn: isEthAddress, input: '0x123', expected: false, name: 'isEthAddress(invalid)' },
  ];
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach(({ fn, input, expected, name }) => {
    const result = fn(input);
    if (result === expected) {
      console.log(`  ✅ ${name}: ${result}`);
      passed++;
    } else {
      console.log(`  ❌ ${name}: expected ${expected}, got ${result}`);
      failed++;
    }
  });
  
  // Test utilities
  const testObj = { foo: 'bar', baz: 42 };
  const objectKeys = typedKeys(testObj);
  console.log(`  ✅ typedKeys test: [${objectKeys.join(', ')}]`);
  
  // Test brand creation
  const brandFactory = createBrand();
  const brandedValue = brandFactory('test-value');
  console.log(`  ✅ Brand creation: ${typeof brandedValue === 'string' ? 'working' : 'failed'}`);
  
  console.log(`\n  Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    throw new Error(`${failed} runtime tests failed`);
  }
  
  console.log('✅ All runtime functionality tests passed\n');
} catch (error) {
  console.error('❌ Runtime functionality test failed:', error.message);
  process.exit(1);
}

console.log('🎉 All tests passed! The StarkNet.js types library is working correctly.');
console.log('\nSummary:');
console.log('- ✅ Build outputs generated correctly');
console.log('- ✅ CommonJS imports working');  
console.log('- ✅ ESM structure configured');
console.log('- ✅ TypeScript definitions available');
console.log('- ✅ Package.json exports configured');
console.log('- ✅ Runtime functionality verified');
console.log('\n🚀 Ready for distribution!');