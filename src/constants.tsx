import { DefaultPalette, IChoiceGroupOption, IDropdownStyles, IStackItemStyles } from "@fluentui/react";
import { IStackTokens } from '@fluentui/react';
import * as React from "react";

// ENUMS FOR INPUTS

 export enum lookupTypes { 
    table = "0",
    column = "1"
}

export enum tableTypeSources {
    static = "0",
    dynamic = "1"
}


// STYLES

export const dropdownStyles = {
    root: {
        dropdown: {
            width: 300
        },
        align: "left",
        minWidth: "100%"
    }
};


// TOKENS

export const stackTokens: IStackTokens = { 
    childrenGap: 20
};

