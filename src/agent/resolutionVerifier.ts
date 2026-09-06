import { VerificationResult } from '../types';
import { NORMAL_THRESHOLDS } from '../data/mockMachines';

/**
 * Module 6: Resolution Verifier
 * Validates post-maintenance sensor readings against baseline thresholds
 * to objectively certify problem resolution.
 */
export function verifyResolution(
  before: { temperature: number; vibration: number; pressure: number },
  after: { temperature: number; vibration: number; pressure: number }
): VerificationResult {
  const tempNormal = after.temperature <= NORMAL_THRESHOLDS.temperature.normalMax;
  const vibNormal = after.vibration <= NORMAL_THRESHOLDS.vibration.normalMax;
  const pressNormal =
    after.pressure >= NORMAL_THRESHOLDS.pressure.min &&
    after.pressure <= NORMAL_THRESHOLDS.pressure.normalMax;

  const isResolved = tempNormal && vibNormal && pressNormal;

  const reason = isResolved
    ? `Temperature returned close to normal (${after.temperature}°C ≤ ${NORMAL_THRESHOLDS.temperature.normalMax}°C). Vibration returned to normal range (${after.vibration} mm/s ≤ ${NORMAL_THRESHOLDS.vibration.normalMax} mm/s). Pressure remains nominal at ${after.pressure} bar. Therefore the simulated incident is considered resolved.`
    : `One or more sensors remain outside allowable operating thresholds (Temp: ${after.temperature}°C, Vib: ${after.vibration} mm/s). Further physical inspection required.`;

  return {
    status: isResolved ? 'RESOLVED' : 'UNRESOLVED',
    beforeReadings: before,
    afterReadings: after,
    reason,
    verifiedAt: new Date().toLocaleTimeString(),
  };
}
