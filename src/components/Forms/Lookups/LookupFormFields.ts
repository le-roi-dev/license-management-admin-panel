import { InitialFieldConfig } from "../InitialFieldConfig";
import { getRealFormFields } from "@utils/utilFunctions";

const InitialField: InitialFieldConfig[] = [
  { name: "lookup_name", size: 2, required: "text" },
  { name: "lookup_code", size: 2, required: "text" },
  { name: "description", size: 2 },
  {
    name: "type",
    type: "dropdown",
    size: 2,
    required: "text",
    options: [
      { value: "Text", label: "Text" },
      { value: "Duration", label: "Duration" },
      { value: "Number", label: "Number" },
      { value: "Date", label: "Date" },
    ],
  },
];

export const LookupFormFields = {
  create: getRealFormFields(InitialField),
  edit: getRealFormFields([
    ...InitialField,
    { name: "active", type: "switch" },
  ]),
};
// export default getRealFormFields(InitialField);
