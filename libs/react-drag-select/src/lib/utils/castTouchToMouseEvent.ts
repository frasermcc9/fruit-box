// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import { MouseEvent } from 'react';

const propertiesToNormalize = ['pageX', 'pageY', 'clientX', 'clientY'];

function patchEventProperties(evt: any, touchKey: string) {
  propertiesToNormalize.forEach((key) => {
    if (typeof evt[key] === 'undefined') {
      evt[key] = evt[touchKey][0][key];
    }
  });
}

/**
 * Used to return event object with desktop (non-touch) format of event
 * coordinates, regardless of whether the action is from mobile or desktop.
 */
export function castTouchToMouseEvent(evt: any): MouseEvent<HTMLElement> {
  if (evt.type.includes('mouse')) {
    return evt;
  }

  try {
    if (evt.type === 'touchstart') {
      patchEventProperties(evt, 'targetTouches');
    } else if (evt.type === 'touchmove') {
      patchEventProperties(evt, 'changedTouches');
    }
  } catch (err) {
    console.error(err.message);
  }

  return evt as MouseEvent<HTMLElement>;
}
