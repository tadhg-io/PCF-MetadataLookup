import { } from "../constants";
import { IInputs } from "../../metadataLookup/generated/ManifestTypes";
import { resolve } from "url";

export class ApiService {
    private _context: ComponentFramework.Context<IInputs>;

    constructor(context: ComponentFramework.Context<IInputs>) {
        this._context = context;
    }

    public getTables = async (): Promise<any> => { 

        
        var fetchXml = [
            "<fetch>",
            "  <entity name='entity'>",
            "    <attribute name='logicalname' />",
            "    <attribute name='originallocalizedname' />",
            "    <attribute name='name' />",
            "    <order attribute='logicalname' />",
            "  </entity>",
            "</fetch>",
        ].join("");

        let odataUrl = `?fetchXml=${fetchXml}`;
        let results = this._context.webAPI.retrieveMultipleRecords("entity", odataUrl);    
-       console.log('RESULTS', results);
        
        // TEMP for local testing
        return [{
            logicalname: "account",
            originallocalizedname: "account",
            name: "Account"
        }, 
        {
            logicalname: "contact",
            originallocalizedname: "contact",
            name: "Contact"
        }, 
        {
            logicalname: "user",
            originallocalizedname: "user",
            name: "User"
        }]

    };

    public getColumns = async (entity: string): Promise<any> => { 

        // fetch query to get 1 record of the given entity
        let fetchXml = [
            "<fetch top='1'>",
            "  <entity name='" + entity + "'>",
            "    <attribute name='" + entity + "id' />",
            "  </entity>",
            "</fetch>",
        ].join("");
        let odataUrl = `?fetchXml=${fetchXml}`;
        // execute the query
        return await this._context.webAPI.retrieveMultipleRecords(entity, odataUrl).then(
            async (result) => {
                if(result.entities[0]) {
                    let record = result.entities[0];
                    // retrieve the full record
                    return await this._context.webAPI.retrieveRecord(entity, record[entity + "id"]).then((singleResult) => {
                            // regex to filter unwanted columns
                            const regex = new RegExp('^_*[A-Za-z0-9]((?!@).)*$');
                            // create an array with unwanted columns removed
                            let matchedColumns = Object.keys(singleResult).filter((c) => c.match(regex));
                            // format lookup fields correctly
                            matchedColumns.forEach((column, index, arr) => {
                                // if this is formatted like a WebAPI lookup
                                if( column[0] == '_' && column.substr(column.length - 6) == '_value') {
                                        // format it as the logicalname of the lookup
                                        arr[index] = column.substring(1, column.length - 6)
                                    }
                            })
                            // return the list of columns
                            return matchedColumns;
                        },
                        (error) => {
                            console.log(error.message);
                        }
                    );
                }
                else {
                    console.log("No record found for entity " + entity)
                }
            },
            (error) => {
                console.log(error.message);
            }
        );


        // var req = new XMLHttpRequest();
        // var url = "/api/data/v9.0/EntityDefinitions";
        // req.open("POST", url, true);
        // req.setRequestHeader('Content-Type', 'application/json');
        // req.send();
        
        //return this._context.utils.getEntityMetadata(entity, []);  
    };
}