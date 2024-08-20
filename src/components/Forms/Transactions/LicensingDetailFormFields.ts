import { getSecondRealFormFields } from "@utils/utilFunctions";
import { SecondInitialFieldConfig } from "../InitialFieldConfig";

const InitialCreateField: SecondInitialFieldConfig[] = [
    {
        name: "osc_part_number",
        type: "dropdown",
        size: 2,
        required: 'text',
        resource: "products",
        valueKey: "product_part_number",
        labelKey: "product_part_number",
    },
    {
        name: "license_type",
        type: "dropdown",
        size: 1,
        required: 'text',
        options: [
            { value: "Eval", label: "Eval" },
            { value: "Subscription", label: "Subscription" },
            { value: "NFR", label: "NFR" },
            { value: "Promotion", label: "Promotion" },
        ],
    },
    {
        name: "quantity",
        type: "number",
        required: 'text',
    },
    {
        name: "start_date",
        required: 'text',
        type: "date",
    },
    {
        name: "end_date",
        type: "date",
        required: 'text',
        disabled: true
    },
];

const InitialReActionField: SecondInitialFieldConfig[] = [
    {
        name: "osc_part_number",
        type: "dropdown",
        size: 2,
        required: 'text',
        disabled: true,
        resource: "products",
        valueKey: "product_part_number",
        labelKey: "product_part_number",
    },
    {
        name: "license_type",
        type: "dropdown",
        disabled: true,
        size: 1,
        required: 'text',
        options: [
            { value: "Eval", label: "Eval" },
            { value: "Subscription", label: "Subscription" },
            { value: "NFR", label: "NFR" },
            { value: "Promotion", label: "Promotion" },
        ],
    },
    {
        name: "quantity",
        type: "number",
        required: 'text',
    },
    {
        name: "start_date",
        required: 'text',
        disabled: true,
        type: "date",
    },
    {
        name: "end_date",
        type: "date",
        required: 'text',
        disabled: true
    },
];

export const LicensingDetailFormFields = {
    newAction: getSecondRealFormFields(InitialCreateField),
    notNewAction: getSecondRealFormFields(InitialReActionField),
}
