// export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

let idSuffix = 0;
/**
 * This id should be safe to use as a class name. So don't use any special
 * characters that CSS might get confused by.
 */
export const generateRandomId = () =>
  Math.random()
    .toString(36)
    .slice(2) +
  '_' +
  ++idSuffix;

// export function logElapsedMs<X>(callback: () => X, context: string): X {
//   const start = new Date();
//   const result = callback();
//   const elapsedMs = new Date().getTime() - start.getTime();
//   console.log(`${context} took ${elapsedMs}ms`);
//   return result;
// }

// export async function logElapsedMsAsync<X>(
//   callback: () => Promise<X>,
//   context: string,
// ): Promise<X> {
//   const start = new Date();
//   const result = await callback();
//   const elapsedMs = new Date().getTime() - start.getTime();
//   console.log(`${context} took ${elapsedMs}ms`);
//   return result;
// }

// export function createMap<X>(
//   array: ReadonlyArray<X>,
//   keySelector: (element: X) => string,
// ): Map<string, X>;
// export function createMap<X extends { readonly id: string }>(
//   array: ReadonlyArray<X>,
// ): Map<string, X>;
// export function createMap<X>(
//   array: ReadonlyArray<X>,
//   keySelector?: (element: X) => string,
// ) {
//   if (keySelector) {
//     return new Map(array.map(e => [keySelector(e), e] as any));
//   }
//   return new Map(array.map(e => [(e as any).id, e] as any));
// }

// export function updateMap<K, V>(map: ReadonlyMap<K, V>, key: K, value: V) {
//   const newMap = new Map(map);
//   newMap.set(key, value);
//   return newMap;
// }

// export function removeFromMap<K, V>(map: ReadonlyMap<K, V>, key: K) {
//   const newMap = new Map(map);
//   newMap.delete(key);
//   return newMap;
// }

// export function mapMapValuesToArray<K, V, V2>(
//   map: ReadonlyMap<K, V>,
//   mapFn: (value: V) => V2,
// ) {
//   return Array.from(map.values()).map(mapFn);
// }

// export function lookup<X>(
//   ids: ReadonlyArray<string>,
//   map: ReadonlyMap<string, X>,
// ): ReadonlyArray<X> {
//   // tslint:disable-next-line:readonly-array
//   const result = [];
//   for (const id of ids) {
//     if (map.has(id)) {
//       result.push(map.get(id)!);
//     }
//   }
//   return result;
// }

export function clampNormally(value: number, bounds?: readonly [number | undefined, number | undefined]): number {
  if (bounds) {
    const [min, max] = bounds;
    if (min !== undefined && value < min) {
      return min;
    }
    if (max !== undefined && value > max) {
      return max;
    }
  }
  return value;
}

export function clampFromTo(
  from: number,
  to: number,
  bounds?: readonly [number | undefined, number | undefined],
): number {
  if (bounds) {
    const [min, max] = bounds;
    if (min !== undefined && to < from && to < min) {
      return min;
    }
    if (max !== undefined && to > from && to > max) {
      return max;
    }
  }
  return to;
}

export function clampWithSpace(
  value: number,
  space: number,
  bounds?: readonly [number | undefined, number | undefined],
): number {
  if (bounds) {
    const [min, max] = bounds;
    // if (min !== undefined && max !== undefined && centerTo - space/2 < min && centerTo + space/2 > max) {
    //   return centerFrom;
    // }
    // if (min !== undefined && centerTo < centerFrom && centerTo - space / 2 < min) {
    //   return min + space / 2;
    // }
    // if (max !== undefined && centerTo > centerFrom && centerTo + space / 2 > max) {
    //   return max - space / 2;
    // }

    // v2
    // if (min !== undefined && max !== undefined && centerTo - space/2 < min && centerTo + space/2 > max) {
    //   return centerFrom;
    // }
    // if (min !== undefined && centerTo - space / 2 < min) {
    //   return centerFrom;
    // }
    // if (max !== undefined && centerTo + space / 2 > max) {
    //   return centerFrom;
    // }

    // v3
    if (min !== undefined && max !== undefined && value - space / 2 < min && value + space / 2 > max) {
      // Return center of space
      return min + (max - min) / 2;
    }
    if (min !== undefined && value - space / 2 < min) {
      return min + space / 2;
    }
    if (max !== undefined && value + space / 2 > max) {
      return max - space / 2;
    }
  }
  return value;
}

export function rectContainsPoint(clientRect: ClientRect, x: number, y: number) {
  return clientRect.left < x && clientRect.right > x && clientRect.top < y && clientRect.bottom > y;
}

export function* walkElementHierarchyUp(leafElement: HTMLElement): Iterable<HTMLElement> {
  let e: HTMLElement | null = leafElement;
  while (e) {
    yield e;
    e = e.parentElement;
  }
}

// export function sleep(ms: number): Promise<{}> {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export const browserIsAndroid = navigator.userAgent.match(/Android/);
export const browserIsSafari = navigator.vendor.match(/Apple/);
export const browserIsSafariDesktop = browserIsSafari && typeof Touch === 'undefined';

export function isMouseEvent(e: MouseEvent | TouchEvent): e is MouseEvent {
  return (e as any).touches === undefined;
}
