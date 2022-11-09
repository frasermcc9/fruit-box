// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import { Component, ComponentType } from 'react';

import { TSelectableItemProps, TSelectableItemState } from './Selectable.types';
import { SelectableGroupContext } from './SelectableGroup.context';
import {
  getBoundsForNode,
  TComputedBounds,
  TGetBoundsForNodeArgs,
} from './utils';

type TAddedProps = Partial<Pick<TSelectableItemProps, 'isSelected'>>;

export const createSelectable = <T,>(
  WrappedComponent: ComponentType<TSelectableItemProps & T>,
): ComponentType<T & TAddedProps> =>
  class SelectableItem extends Component<
    T & TAddedProps,
    TSelectableItemState
  > {
    static override contextType = SelectableGroupContext;

    static defaultProps = {
      isSelected: false,
    };

    override state = {
      isSelected: this.props.isSelected,
      isSelecting: false,
    };

    node: HTMLElement | null = null;

    bounds: TComputedBounds[] | null = null;

    override componentDidMount() {
      this.updateBounds();
      this.context.selectable.register(this);
    }

    override componentWillUnmount() {
      this.context.selectable.unregister(this);
    }

    updateBounds = (containerScroll?: TGetBoundsForNodeArgs) => {
      this.bounds = getBoundsForNode(this.node!, containerScroll);
    };

    getSelectableRef = (ref: HTMLElement | null) => {
      this.node = ref;
    };

    override render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          selectableRef={this.getSelectableRef}
        />
      );
    }
  };
