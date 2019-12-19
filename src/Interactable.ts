import { NoPanArea } from './NoPanArea';
import { Pressable } from './Pressable';
import { walkElementHierarchyUp } from './utils';

export type InteractableComponent = Pressable | NoPanArea;

export const InteractableIdAttributeName = 'x-react-zoomable-ui-interactable-id';

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
