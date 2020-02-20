import { NoPanArea } from './NoPanArea';
import { Pressable } from './Pressable';
import { walkElementHierarchyUp } from './utils';

/**
 * A type that describes either `Pressable` or `NoPanArea`. That is it.
 */
export type InteractableComponent = Pressable | NoPanArea;

export const InteractableIdAttributeName = 'x-react-zoomable-ui-interactable-id';

/**
 * Helper function that returns the nearest ancestor element to the passed
 * element that is an interactable (either `Pressable` or `NoPanArea`), or
 * the element itself if it is interactable.
 */
export function getInteractableIdMostApplicableToElement(
  element: HTMLElement,
  outerContainerClassName?: string,
): string | undefined {
  for (const e of walkElementHierarchyUp(element)) {
    if (outerContainerClassName && e.classList.contains(outerContainerClassName)) {
      return undefined;
    }
    const a = e.getAttribute(InteractableIdAttributeName);
    if (a) {
      return a;
    }
  }
  return undefined;
}
