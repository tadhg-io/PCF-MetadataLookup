import * as React from 'react';
import { Dropdown, IDropdown, Label, Stack } from '@fluentui/react';
import { IMetadataLookupProps, IMetadataLookupState } from '../models/metadataLookupState';
import { dropdownStyles, stackTokens } from '../constants';
import { ITable } from '../models/table';

export interface IHelloWorldProps {
  name?: string;
}

export class MetadataLookupControl extends React.Component<IMetadataLookupProps, IMetadataLookupState> {
  
  constructor(props: IMetadataLookupProps) { 
    super(props);   
    
    
    // set the variables in the state
    this.state = {
      // inputs
      lookupType: props.lookupType,
      targetField: props.targetField,
      tableName: props.tableName,
      selectedValue: props.selectedValue
    };
  }

  componentDidMount(): void {

    this.repopulateDropdown();
  }

  
  repopulateDropdown() {
    this.setState({
      tables: [{
        logicalName: "account",
        displayName: "Account"
      }, 
      {
        logicalName: "contact",
        displayName: "Contact"
      }, 
      {
        logicalName: "user",
        displayName: "User"
      }]
    });
  }
  
  public render(): React.ReactNode {
    
    console.log("TABLES", this.state.tables);

    // a reference for this component
    const dropdownRef = React.createRef<IDropdown>();
    
    // array to hold the dropdown option objects
    let dropdownOptions = new Array()
    // build the options for the table dropdown
    this.state.tables?.forEach((t:ITable) => {
      dropdownOptions.push({ key: t.logicalName, text: t.displayName, title: t.logicalName })
    });
    
    return (
      <Stack tokens={stackTokens} verticalAlign="end">
          <Stack horizontal tokens={stackTokens} verticalAlign="end">
              <Dropdown
              componentRef={dropdownRef}
              placeholder="Select a table"
              options={dropdownOptions}
              styles={dropdownStyles}
              //onChange={this.onValueSelected}
              selectedKey={this.state.targetField}
              />
          </Stack>
      </Stack>
  )

  }

}
