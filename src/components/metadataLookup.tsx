import * as React from 'react';
import { Stack, IStackItemStyles, IStackStyles } from '@fluentui/react';
import { Image, IImageProps, ImageFit } from '@fluentui/react';
import { setIconOptions, SpinnerSize, Spinner, MessageBar, MessageBarType, DefaultPalette, Label, Dropdown, IDropdown, IDropdownOption } from '@fluentui/react';
import { IMetadataLookupState, IMetadataLookupProps } from '../models/metadataLookupState';
import { dropdownStyles, lookupTypes, stackTokens } from '../constants';
import { ApiService } from '../services/apiservice';
import { ITable } from '../models/table';
import { IEntity } from '../models/entity';

setIconOptions({
    disableWarnings: true,
});

export class MetadataLookup extends React.Component<IMetadataLookupProps, IMetadataLookupState> {

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
            tableTypeSource: props.tableTypeSource,
            staticTableName: props.staticTableName,
            dynamicTableNameSource: props.dynamicTableNameSource,
            // local variables
            //tables: props.tables, //  REMOVE THIS IF IT DOESNT BREAK
            // outputs
            selectedValue: props.selectedValue
        };

        this.onValueSelected = this.onValueSelected.bind(this);
        
        // Table Lookup
        if(props.lookupType == "0") {
            // populate the tables
            this.populateTablesArray()
        }
        // Column Lookup
        else if (props.lookupType == "1") {
            // populate the columns
            this.populateColumnsArray();
        }
    }

    populateTablesArray = () => {
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

        let entityName = "account";

        // dynamic (bound) table name
        if(this.state.tableTypeSource == "1") {
            entityName = this.state.dynamicTableNameSource;
        }
        // static table name
        else {
            entityName = this.state.staticTableName;
        }

        await self._apiService?.getColumns(entityName).then((result: any) => {

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

    public componentWillReceiveProps(newProps: IMetadataLookupProps): void {
        const self = this;
        // update the target value
        const targetValue = this.state.targetField;
        if (targetValue != newProps.targetField) { 
            self.setState({
                targetField: newProps.targetField
            }, this.populateColumnsArray);
        }
        // update the dynamic table name
        const dynamicTableName = this.state.dynamicTableNameSource;
        if (dynamicTableName != newProps.dynamicTableNameSource) { 
            self.setState({
                dynamicTableNameSource: newProps.dynamicTableNameSource
            }, this.populateColumnsArray);
        }
    }

    updateErrorCallback() {
        
    }

    componentDidMount() { 
        // const self = this;

    }

    repopulateDropdown() {
        // Table Lookup
        if(this.state.lookupType == "0") {
            // populate the tables
            this.populateTablesArray()
        }
        // Column Lookup
        else if (this.state.lookupType == "1") {
            // populate the columns
            this.populateColumnsArray();
        }
    }

    
    onValueSelected(event: React.FormEvent<HTMLDivElement>, option? : IDropdownOption ) {
        const self = this;
        if(option)
        {
            self.setState({ selectedValue: option?.key?.toString() || "" });
            
        }
        else console.log("NO OPTION");
        if (self.props.fieldChanged) { 
            self.props.fieldChanged(option?.key.toString() || "");
        }
    }

    public render(): JSX.Element {
        const self = this;

        const dropdownRef = React.createRef<IDropdown>();
        let dropdownOptions = new Array()
        
        const lookupType = this.state.lookupType;

        // Table Lookup
        if(lookupType == "0") {

            // build the options for the table dropdown
            this.state.tables?.forEach((t:ITable) => {
                dropdownOptions.push({ key: t.logicalName, text: t.displayName, title: t.logicalName })
            });

            console.log("defaultSelectedKey", this.state.targetField);

            return (
                <Stack tokens={stackTokens} verticalAlign="end">
                    <Stack horizontal tokens={stackTokens} verticalAlign="end">
                        <Dropdown
                        componentRef={dropdownRef}
                        placeholder="Select a table"
                        options={dropdownOptions}
                        styles={dropdownStyles}
                        onChange={this.onValueSelected}
                        selectedKey={this.state.targetField}
                        />
                    </Stack>
                </Stack>
            )
        }
        // Column Lookup
        else if (lookupType == "1") {

            // build the options for the column dropdown
            this.state.columns?.forEach((c:string) => {
                dropdownOptions.push({ key: c, text: c, title: c })
            });

            return (
                <Stack tokens={stackTokens} verticalAlign="end">
                    <Stack horizontal tokens={stackTokens} verticalAlign="end">
                        <Dropdown
                        componentRef={dropdownRef}
                        placeholder="Select a column"
                        options={dropdownOptions}
                        styles={dropdownStyles}
                        onChange={this.onValueSelected}
                        selectedKey={this.state.targetField}
                        />
                    </Stack>
                </Stack>
            )
        }

        return <p>Could not determine lookup type to render</p>
        
    }
}
export default MetadataLookup;
