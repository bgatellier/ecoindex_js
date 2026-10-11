import { expect, describe, it } from "vitest";
import {getQuantiles, computeEcoIndex, getEcoIndexGrade} from "../src/index.js";

/**
 * Test ecoIndex value.
 *
 * The ecoindex is based on quantiles of 3 parameters.
 * If the 3 parameters are based on the same quantile level,
 * the ecoIndex is expected to be equal to 100 - (quantileLevel * 100 / quantileNumber)
 * The same quantile index for each parameters should
 */
describe('Compute ecoIndex', async () => {
  it(`Should give the right ecoIndex according to quantiles boundary`, async () => {
    const quantiles = getQuantiles();
    const quantilesRange = 100 / (quantiles.dom.length - 1);

    for (let i in quantiles.dom) {
      const ecoIndex = computeEcoIndex(quantiles.dom[i], quantiles.req[i], quantiles.size[i]);
      expect(ecoIndex).to.be.a('number').to.be.eq(100 - (i * quantilesRange));
    }
  });
});

/**
 * Test getEcoIndexGrade.
 */
describe('Compute ecoIndex', () => {
  // Correct values.
  it(`Should get ecoIndex grade`, () => {
    [
      {value: 81, grade: 'A'},
      {value: 80, grade: 'B'},
      {value: 71, grade: 'B'},
      {value: 70, grade: 'C'},
      {value: 56, grade: 'C'},
      {value: 55, grade: 'D'},
      {value: 41, grade: 'D'},
      {value: 40, grade: 'E'},
      {value: 26, grade: 'E'},
      {value: 25, grade: 'F'},
      {value: 11, grade: 'F'},
      {value: 10, grade: 'G'},
    ].forEach(fixture => {
      const grade = getEcoIndexGrade(fixture.value);
      expect(grade).to.be.a('string').to.be.eq(fixture.grade);
    })
  });

  // Invalid negative ecoIndex value.
  it(`Should return false for negative ecoIndex`, () => {
    const grade = getEcoIndexGrade(-1);
    expect(grade).to.be.a('boolean').to.be.eq(false);
  })

  // Invalid more than 100 ecoIndex value.
  it(`Should return false for ecoIndex greater than 100 `, () => {
    const grade = getEcoIndexGrade(110);
    expect(grade).to.be.a('boolean').to.be.eq(false);
  })
});
