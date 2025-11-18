import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { type URLParams, urlParams } from '../config';
import { baseConfig, type Key, Piano, type Scale } from '../core/piano';

export const useParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse build as scale degrees (supports decimals like 1.5 for chord qualities)
  const buildScaleDegrees: number[] =
    searchParams
      ?.get(urlParams.build)
      ?.split(',')
      .filter(Boolean)
      .map((s) => parseFloat(s))
      .filter((n) => !Number.isNaN(n)) ?? [];

  const query = searchParams?.get(urlParams.query) ?? '';

  const key: Key = (searchParams?.get(urlParams.key) as Key) ?? baseConfig.key;
  const scale: Scale =
    (searchParams?.get(urlParams.scale) as Scale) ?? baseConfig.scale;
  const selectedScale = new Piano({ key, scale });
  const color =
    (searchParams?.get(urlParams.color) as string) ?? baseConfig.color;

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const pushParams = (
    name: keyof URLParams,
    value: string | number | string[],
  ) => {
    const queryString = createQueryString(name.toString(), value.toString());

    router.push(`${pathname}?${queryString}`);
  };

  const deleteParam = (name: keyof URLParams) => {
    if (!pathname) return;
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.delete(name);
    router.push(`${pathname}?${params.toString()}`);
  };

  return {
    key,
    scale,
    buildScaleDegrees,
    selectedScale,
    color,
    chords: selectedScale.getChords().slice(0, -1), // Get first 7 chords
    notes: selectedScale.getNotes(),
    pushParams,
    query,
    deleteParam,
  };
};

export default useParams;
