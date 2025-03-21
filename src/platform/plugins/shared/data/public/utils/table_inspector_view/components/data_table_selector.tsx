/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { Component } from 'react';
import { FormattedMessage } from '@kbn/i18n-react';
import {
  EuiButtonEmpty,
  EuiContextMenuPanel,
  EuiContextMenuItem,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPopover,
} from '@elastic/eui';
import { Datatable } from '@kbn/expressions-plugin/public';

interface TableSelectorState {
  isPopoverOpen: boolean;
}

interface TableSelectorProps {
  tables: Datatable[];
  selectedTable: Datatable;
  onTableChanged: (table: Datatable) => void;
}

export class TableSelector extends Component<TableSelectorProps, TableSelectorState> {
  state = {
    isPopoverOpen: false,
  };

  togglePopover = () => {
    this.setState((prevState: TableSelectorState) => ({
      isPopoverOpen: !prevState.isPopoverOpen,
    }));
  };

  closePopover = () => {
    this.setState({
      isPopoverOpen: false,
    });
  };

  renderTableDropdownItem = (table: Datatable, index: number) => {
    return (
      <EuiContextMenuItem
        key={index}
        icon={table === this.props.selectedTable ? 'check' : 'empty'}
        onClick={() => {
          this.props.onTableChanged(table);
          this.closePopover();
        }}
        data-test-subj={`inspectorTableChooser${index}`}
      >
        <FormattedMessage
          id="data.inspector.table.tableLabel"
          defaultMessage="Table {index}"
          values={{ index: index + 1 }}
        />
      </EuiContextMenuItem>
    );
  };

  render() {
    const currentIndex = this.props.tables.findIndex((table) => table === this.props.selectedTable);
    return (
      <EuiFlexGroup alignItems="center" gutterSize="xs">
        <EuiFlexItem grow={false}>
          <strong>
            <FormattedMessage
              id="data.inspector.table.tableSelectorLabel"
              defaultMessage="Selected:"
            />
          </strong>
        </EuiFlexItem>
        <EuiFlexItem>
          <div>
            <EuiPopover
              id="inspectorTableChooser"
              button={
                <EuiButtonEmpty
                  iconType="arrowDown"
                  iconSide="right"
                  size="s"
                  onClick={this.togglePopover}
                  data-test-subj="inspectorTableChooser"
                >
                  <FormattedMessage
                    id="data.inspector.table.inspectorTableChooserButton"
                    defaultMessage="Table {index}"
                    values={{ index: currentIndex + 1 }}
                  />
                </EuiButtonEmpty>
              }
              isOpen={this.state.isPopoverOpen}
              closePopover={this.closePopover}
              panelPaddingSize="none"
              anchorPosition="downLeft"
              repositionOnScroll
            >
              <EuiContextMenuPanel
                items={this.props.tables.map(this.renderTableDropdownItem)}
                data-test-subj="inspectorTableChooserMenuPanel"
              />
            </EuiPopover>
          </div>
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }
}
