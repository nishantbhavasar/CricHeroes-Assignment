// Overs To Ball covertor 2.3 Overs = 15 balls
export function oversToBalls(oversStrOrNum:string|number) {
  const s = String(oversStrOrNum);
  if (!s.includes(".")) return Number(s) * 6;
  const [o, b] = s.split(".");
  return Number(o) * 6 + Number(b || 0);
}

// Balls to over convertor 15 balls = 2.3 Overs
export function ballsToOvers(balls:number) {
  const overs = Math.floor(balls / 6);
  const rem = balls % 6;
  return rem === 0 ? String(overs) : `${overs}.${rem}`;
}