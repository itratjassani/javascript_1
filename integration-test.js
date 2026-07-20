/**
 * Integration Test
 * Tests that ESLint configs can be loaded and work together
 */

import fs from 'fs';
import path from 'path';

// Test 1: Load base config
console.log('Test 1: Loading eslint-config-airbnb-base...');
try {
  const baseConfig = require('./packages/eslint-config-airbnb-base');
  console.log('✓ Base config loaded successfully');
  console.log('  - Rules count:', Object.keys(baseConfig.rules || {}).length);
  console.log('  - Plugins:', baseConfig.plugins || []);
} catch (error) {
  console.error('✗ Failed to load base config:', error.message);
  process.exit(1);
}

// Test 2: Load React config
console.log('\nTest 2: Loading eslint-config-airbnb...');
try {
  const reactConfig = require('./packages/eslint-config-airbnb');
  console.log('✓ React config loaded successfully');
  console.log('  - Rules count:', Object.keys(reactConfig.rules || {}).length);
  console.log('  - Plugins:', reactConfig.plugins || []);
} catch (error) {
  console.error('✗ Failed to load React config:', error.message);
  process.exit(1);
}

// Test 3: Verify legacy configs exist
console.log('\nTest 3: Checking legacy configs...');
try {
  const baseLegacy = require('./packages/eslint-config-airbnb-base/legacy');
  const reactLegacy = require('./packages/eslint-config-airbnb/legacy');
  console.log('✓ Legacy configs loaded successfully');
  console.log('  - Base legacy rules:', Object.keys(baseLegacy.rules || {}).length);
  console.log('  - React legacy rules:', Object.keys(reactLegacy.rules || {}).length);
} catch (error) {
  console.error('✗ Failed to load legacy configs:', error.message);
  process.exit(1);
}

// Test 4: Verify individual rule files exist
console.log('\nTest 4: Verifying rule files...');
const rulesPath = path.join(__dirname, 'packages/eslint-config-airbnb-base/rules');
const expectedRules = [
  'best-practices.js',
  'errors.js',
  'es6.js',
  'imports.js',
  'node.js',
  'strict.js',
  'style.js',
  'variables.js',
];

let rulesFailed = false;
expectedRules.forEach((rule) => {
  const rulePath = path.join(rulesPath, rule);
  if (fs.existsSync(rulePath)) {
    console.log(`✓ ${rule} exists`);
  } else {
    console.log(`✗ ${rule} missing`);
    rulesFailed = true;
  }
});

if (rulesFailed) {
  process.exit(1);
}

// Test 5: Verify React-specific rules
console.log('\nTest 5: Verifying React-specific rules...');
const reactRulesPath = path.join(__dirname, 'packages/eslint-config-airbnb/rules');
const expectedReactRules = ['react.js', 'react-a11y.js', 'react-hooks.js'];

let reactRulesFailed = false;
expectedReactRules.forEach((rule) => {
  const rulePath = path.join(reactRulesPath, rule);
  if (fs.existsSync(rulePath)) {
    console.log(`✓ ${rule} exists`);
  } else {
    console.log(`✗ ${rule} missing`);
    reactRulesFailed = true;
  }
});

if (reactRulesFailed) {
  process.exit(1);
}

// Test 6: Validate config structure
console.log('\nTest 6: Validating config structure...');
try {
  const baseConfig = require('./packages/eslint-config-airbnb-base');
  const hasRules = baseConfig.rules && typeof baseConfig.rules === 'object';
  const hasEnv = baseConfig.env && typeof baseConfig.env === 'object';
  const hasParserOptions = baseConfig.parserOptions && typeof baseConfig.parserOptions === 'object';

  if (hasRules && hasEnv && hasParserOptions) {
    console.log('✓ Base config has required properties (rules, env, parserOptions)');
  } else {
    console.log('✗ Base config missing required properties');
    process.exit(1);
  }
} catch (error) {
  console.error('✗ Failed to validate config structure:', error.message);
  process.exit(1);
}

console.log('\n✓ All integration tests passed!');
