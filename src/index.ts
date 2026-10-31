import reference from "ecoindex_reference" with { type: "json" };

/**
 * Return grades list.
 */
export function getEcoIndexGradesList() {
  return reference.grades;
}

/**
 * Return quantiles list.
 */
export function getQuantiles(): {
  dom: number[];
  size: number[];
  req: number[];
} {
  return {
    dom: reference.quantiles.dom_size,
    req: reference.quantiles.nb_request,
    size: reference.quantiles.response_size,
  };
}

/**
 * Compute ecoIndex based on formula from web site www.ecoindex.fr
 * @param {number}  dom     Number of elements in DOM.
 * @param {number}  req     Number of requests.
 * @param {number}  size    Size of request.
 * @returns {number} EcoIndex value.
 */
export function computeEcoIndex(
  dom: number,
  req: number,
  size: number,
): number {
  const quantiles = getQuantiles();
  const q_dom = computeQuantile(quantiles.dom, dom);
  const q_req = computeQuantile(quantiles.req, req);
  const q_size = computeQuantile(quantiles.size, size);

  return 100 - (5 * (3 * q_dom + 2 * q_req + q_size)) / 6;
}

/**
 * Get quantile index for given quantiles list and value.
 *
 * @param {number[]}  quantiles   Quantiles list.
 * @param {number}    value       Value.
 * @returns {number}  Quantile index.
 */
export function computeQuantile(quantiles: number[], value: number): number {
  for (let i = 1; i < quantiles.length; i++) {
    const previous = quantiles[i - 1];
    const current = quantiles[i];
    if (previous === undefined || current === undefined) continue;
    if (value < current) {
      return i - 1 + (value - previous) / (current - previous);
    }
  }
  return quantiles.length - 1;
}

/**
 * Return the grade associated to the ecoIndex value.
 * @param {number}    ecoIndex   The ecoIndex value.
 * @returns {string|false}  The associated grade, or false is none has been found.
 */
export function getEcoIndexGrade(ecoIndex: number): string | false {
  if (ecoIndex < 0 || ecoIndex > 100) {
    return false;
  }

  const ecoIndexGrades = getEcoIndexGradesList();
  for (const grade of ecoIndexGrades) {
    if (ecoIndex > grade.value) {
      return grade.grade;
    }
  }
  return false;
}

/**
 * Get gases emission from EcoIndex value.
 * @param {number} ecoIndex   The ecoIndex value.
 * @returns {string}  The gas emission.
 */
export function computeGreenhouseGasesEmissionfromEcoIndex(
  ecoIndex: number,
): string {
  return (2 + (2 * (50 - ecoIndex)) / 100).toFixed(2);
}

/**
 * Get water consumption from EcoIndex value.
 * @param {number}  ecoIndex  The ecoIndex value.
 * @returns {string}  The water consumption.
 */
export function computeWaterConsumptionfromEcoIndex(ecoIndex: number): string {
  return (3 + (3 * (50 - ecoIndex)) / 100).toFixed(2);
}
