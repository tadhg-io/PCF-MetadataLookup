import { lookupTypes } from "../constants";
import { IInputs } from "../../metadataLookup/generated/ManifestTypes";
import { ApiService } from "../services/apiservice";
import { ITable } from "./table";

export interface IMetadataLookupState {  

    // inputs
    lookupType: lookupTypes,
    targetField: string,
    tableName: string,
    
    // local variables
    tables?: ITable[],
    columns?: string[],

    // outputs
    selectedValue? : string,

    // UX control
    isLoading?: boolean,
    successMessage?: string,
    errorMessage?: string,

}

export interface IMetadataLookupProps extends IMetadataLookupState { 
    context?: ComponentFramework.Context<IInputs>;
    apiService?: ApiService;
    fieldChanged?: (selectedValue?: string) => void;
    stateHandler?: (data: IMetadataLookupState) => void;
}