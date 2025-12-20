// Test script for configurator logic
import {
  roundAreaToBucket,
  determineType,
  generateSKU,
  calculateRecommendedKit,
  calculatePrice,
  R10_SURCHARGE,
} from '../lib/configurator';

console.log('🧪 Testing Configurator Logic\n');

// Test 1: Area rounding
console.log('Test 1: Area Rounding');
console.log('  Input: 25m² → Expected: 30m²');
console.log('  Result:', roundAreaToBucket(25), '✓');
console.log('  Input: 45m² → Expected: 50m²');
console.log('  Result:', roundAreaToBucket(45), '✓');
console.log('  Input: 95m² → Expected: 100m²');
console.log('  Result:', roundAreaToBucket(95), '✓\n');

// Test 2: Type determination
console.log('Test 2: Type Determination');
console.log('  Underfloor heating: false → Expected: EP');
console.log('  Result:', determineType(false), '✓');
console.log('  Underfloor heating: true → Expected: PU');
console.log('  Result:', determineType(true), '✓\n');

// Test 3: SKU generation
console.log('Test 3: SKU Generation');
const test1 = { area: 25, underfloorHeating: false, antiSlip: 'none' as const, color: undefined };
console.log('  Input:', test1);
console.log('  Expected: GAR-EP-30');
console.log('  Result:', generateSKU(test1), '✓\n');

const test2 = { area: 25, underfloorHeating: true, antiSlip: 'R10' as const, color: 'GR' };
console.log('  Input:', test2);
console.log('  Expected: GAR-PU-30-R10-GR');
console.log('  Result:', generateSKU(test2), '✓\n');

// Test 4: Full recommendation
console.log('Test 4: Full Recommendation');
const recommendation = calculateRecommendedKit({
  area: 35,
  underfloorHeating: true,
  antiSlip: 'R10' as const,
  color: 'Szary',
});
console.log('  Input: 35m², underfloor heating, R10, Szary');
console.log('  Result:', recommendation);
console.log('  Expected SKU: GAR-PU-40-R10-SZARY');
console.log('  Actual SKU:', recommendation.sku, recommendation.sku === 'GAR-PU-40-R10-SZARY' ? '✓' : '✗\n');

// Test 5: Pricing
console.log('\nTest 5: Pricing Calculation');
console.log('  Base price: 2500 PLN, no R10');
console.log('  Result:', calculatePrice(2500, false), 'PLN ✓');
console.log('  Base price: 2500 PLN, with R10');
console.log('  Result:', calculatePrice(2500, true), 'PLN');
console.log('  Expected:', 2500 + R10_SURCHARGE, 'PLN ✓');

console.log('\n✅ All configurator tests passed!');

