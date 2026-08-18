import { useCallback, useState } from 'react';
import * as Location from 'expo-location';
import type { Coords } from '@arli/core';

/**
 * Permission states we actually have to render differently.
 *
 * 'blocked' is separate from 'denied' on purpose: once a user has permanently
 * refused, asking again silently no-ops, so the UI has to send them to Settings
 * instead of showing a button that does nothing.
 */
export type LocationStatus =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'unavailable';

export interface NearbyLocation {
  status: LocationStatus;
  coords: Coords | null;
  /** i18n key, not a sentence — the caller resolves it. */
  errorKey: 'locDenied' | 'locBlocked' | 'locUnavailable' | null;
  request: () => Promise<void>;
  clear: () => void;
}

export function useNearbyLocation(): NearbyLocation {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [coords, setCoords] = useState<Coords | null>(null);
  const [errorKey, setErrorKey] = useState<NearbyLocation['errorKey']>(null);

  const request = useCallback(async () => {
    setStatus('requesting');
    setErrorKey(null);
    try {
      const services = await Location.hasServicesEnabledAsync();
      if (!services) {
        setStatus('unavailable');
        setErrorKey('locUnavailable');
        return;
      }

      const { status: perm, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      if (perm !== 'granted') {
        // canAskAgain === false means the OS will not show the dialog again.
        const blocked = !canAskAgain;
        setStatus(blocked ? 'blocked' : 'denied');
        setErrorKey(blocked ? 'locBlocked' : 'locDenied');
        return;
      }

      // Balanced accuracy: ranking shops by distance does not need GPS-grade
      // precision, and asking for it costs battery and a slower first fix.
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
      setStatus('granted');
    } catch {
      setStatus('unavailable');
      setErrorKey('locUnavailable');
    }
  }, []);

  const clear = useCallback(() => {
    setCoords(null);
    setStatus('idle');
    setErrorKey(null);
  }, []);

  return { status, coords, errorKey, request, clear };
}
