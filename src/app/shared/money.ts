export function formatMinor(minor: number, withSign = false): string {
  const rupees = minor / 100;
  const abs = Math.abs(rupees).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  if (!withSign) {
    return `₹${abs}`;
  }
  if (rupees > 0) return `+₹${abs}`;
  if (rupees < 0) return `−₹${abs}`;
  return `₹${abs}`;
}

export function balanceCaption(netMinor: number): string {
  if (netMinor > 0) return 'you are owed';
  if (netMinor < 0) return 'you owe';
  return 'settled up';
}

export function balanceTone(netMinor: number): 'positive' | 'negative' | 'neutral' {
  if (netMinor > 0) return 'positive';
  if (netMinor < 0) return 'negative';
  return 'neutral';
}
