export function interpolate(
  from: Record<string, string | number>,
  to: Record<string, string | number>,
  progress: number
): Record<string, string | number> {
  const result: Record<string, string | number> = {};

  for (const key in to) {
    if (Object.prototype.hasOwnProperty.call(to, key)) {
      const fromVal = from[key];
      const toVal = to[key];

      if (typeof fromVal === "number" && typeof toVal === "number") {
        result[key] = fromVal + (toVal - fromVal) * progress;
      } else if (typeof fromVal === "string" && typeof toVal === "string") {
        const fromNum = parseFloat(fromVal);
        const toNum = parseFloat(toVal);
        if (!isNaN(fromNum) && !isNaN(toNum)) {
          const unit = fromVal.replace(/[0-9.-]/g, "");
          result[key] = `${fromNum + (toNum - fromNum) * progress}${unit}`;
        } else {
          result[key] = progress >= 0.5 ? toVal : fromVal;
        }
      } else {
        result[key] = toVal !== undefined ? toVal : fromVal;
      }
    }
  }

  return result;
}
