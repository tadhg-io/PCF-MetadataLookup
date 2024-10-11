import * as React from 'react';
import { Dropdown, IDropdown, Label, Stack } from '@fluentui/react';
import { IMetadataLookupProps, IMetadataLookupState } from '../models/metadataLookupState';
import { dropdownStyles, lookupTypes, stackTokens } from '../constants';
import { ITable } from '../models/table';
import { ApiService } from '../services/apiservice';
import { IEntity } from '../models/entity';

export interface IHelloWorldProps {
  name?: string;
}

export class MetadataLookupControl extends React.Component<IMetadataLookupProps, IMetadataLookupState> {
  
  private _apiService?: ApiService;
  
  constructor(props: IMetadataLookupProps) { 
    super(props);   
    
    // get the API service from the props
    this._apiService = props.apiService;    
    
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
    // Table Lookup
    if(this.state.lookupType == lookupTypes.table) {
        // populate the tables
        this.populateTablesArray()
    }
    // Column Lookup
    else {
        // populate the columns
        this.populateColumnsArray();
    }
  }

  populateTablesArray = async () => {
    const self = this;
    console.log("populateTablesArray()");

    self._apiService?.getTables().then((result: any) => {
          // an array to build with tables
          let tableArray : Array<ITable> = []
          // loop through the rsults and build the array
          result.entities.forEach((t:IEntity) => {
              // determine the display name
              let displayName = ""
              if(t.originallocalizedname){
                  displayName = t.originallocalizedname;
              }
              else{
                  displayName = t.name
              }
              tableArray.push({ logicalName: t.logicalname, displayName: displayName })
          })

          // set the table array on the component state
          self.setState({
              tables: tableArray
          });

        }, self.errorCallback);
  }

  populateColumnsArray = async () => {
      const self = this;

      await self._apiService?.getColumns(self.state.tableName).then((result: any) => {

          // set the table array on the component state
          self.setState({
              columns: result
          });
          // TO DO: handle no results as an error and render a message

      }, self.errorCallback);
  }

  errorCallback(e: any) {
    console.log("Error retrieving tables", e);
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
