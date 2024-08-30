"use client";

import { Lookup, LookupValue } from "@/types/types";
import Loader from "@components/common/Loader";
import ReferenceCodeDetailDrawer from "@components/References/ReferenceCodeDetailDrawer";
import ReferenceDetailDrawer from "@components/References/ReferenceDetailDrawer";
import GenericTable from "@components/Table/GenericTable";
import { editRefineBtnStyle, refreshRefineBtnStyle, tableAddButton, tableCancelButton, tableSaveButton } from "@data/MuiStyles";
import { Button, FormControl, MenuItem, Select, TextField } from "@mui/material";
import { useCreate, useDelete, useNavigation, useParsed, usePermissions, useShow, useTable, useUpdate } from "@refinedev/core";
import { EditButton, RefreshButton, Show } from "@refinedev/mui";
import { MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const Page = () => {

  const { params } = useParsed();

  const { queryResult } = useShow<Lookup>({
    resource: "lookups",
    id: params?.id,
  });

  const { data, isLoading } = queryResult;

  const {
    tableQueryResult: { data: codeData, isLoading: codeIsLoading, refetch },
  } = useTable<LookupValue>({
    resource: `lookups/${params?.id}/values`,
    hasPagination: false,
  });

  const [codes, setCodes] = useState<LookupValue[]>([]);
  useEffect(() => {
    if (codeData) {
      setCodes(codeData.data);
      console.log("working");
    }
  }, [codeData, codeIsLoading]);

  const lookup: Lookup = data?.data as Lookup;

  const [isEditMode, setIsEditMode] = useState(false);

  const { push } = useNavigation();

  const getButtonProps = (editButtonProps: any, refreshButtonProps: any) => {
    return (
      <div className="flex gap-2 px-12">
        <EditButton {...editButtonProps} onClick={() => push(`/dashboard/lookups/edit?id=${params?.id}`)} sx={editRefineBtnStyle} />
        <RefreshButton {...refreshButtonProps} sx={refreshRefineBtnStyle} />
      </div>
    );
  };
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setCodes(codeData?.data as LookupValue[]);
  }
  const handleEditChange = (index: number, id: string, value: any) => {
    setCodes(prevCodes => {
      const newCodes = [...prevCodes];
      newCodes[index] = { ...newCodes[index], [id]: value };
      return newCodes;
    });
  };
  const handleEditAdd = () => {
    if (isEditMode) {
      setCodes(prevCodes => [
        ...prevCodes,
        {
          value: "",
          meaning: "",
          attribute1: "",
          attribute2: "",
          attribute3: "",
          active: true,
        }
      ]);
    } else {
      setIsEditMode(true);
    }
  }
  const { mutate } = useCreate();
  const handleSave = () => {
    mutate(
      {
        resource: `lookups/${lookup.lookup_id}/values`,
        values: codes,
      },
      {
        onError: (error) => { },
        onSuccess: () => {
          setIsEditMode(false);
          refetch();
        },
      }
    );
  }
  const baseColumns = useMemo<MRT_ColumnDef<LookupValue>[]>(
    () => [
      {
        accessorKey: "value",
        header: "Value",
        size: 200,
      },
      {
        accessorKey: "meaning",
        header: "Meaning",
        size: 200,
      },
      {
        accessorKey: "attribute1",
        header: "Attribute 1",
      },
      {
        accessorKey: "attribute2",
        header: "Attribute 2",
      },
      {
        accessorKey: "attribute3",
        header: "Attribute 3",
      },
      {
        accessorKey: "active",
        header: "Active",
      },
    ],
    []
  );

  const columns = useMemo<MRT_ColumnDef<LookupValue>[]>(
    () => baseColumns.map(column => ({
      ...column,
      Cell: ({ renderedCellValue, cell, row, column }) =>
        isEditMode ? (
          column.id == "active" ?
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={renderedCellValue}
                onChange={(e) => handleEditChange(row.index, column.id as string, (e.target.value == "true"))}
                label="Age"
              >
                <MenuItem value={"true"}>True</MenuItem>
                <MenuItem value={"false"}>False</MenuItem>
              </Select>
            </FormControl> :
            <TextField
              variant="standard"
              value={cell.getValue<string>()}
              onChange={(e) => handleEditChange(row.index, column.id as string, e.target.value)}
            />
        ) : (
          column.id == "active" ?
            renderedCellValue ? "True" : "False" :
            renderedCellValue
        ),
    })),
    [isEditMode, baseColumns]
  );

  return (
    <Show
      goBack={null}
      isLoading={isLoading}
      breadcrumb={false}
      wrapperProps={{
        className: "rounded-none bg-[#f2f6fa] shadow-none p-0",
      }}
      contentProps={{
        className: "p-0",
      }}
      title={
        <div className="px-8 pt-4 !font-satoshi text-2xl font-semibold text-[#515f72] gap-2">
          <div className="flex items-center gap-2">
            <div className="">Detailed Lookup</div>
            <span className={`mx-2 px-4 py-1 rounded-full text-xs ${lookup?.active ? "bg-[#11ba82] text-white" : "bg-[#c2c2c2] text-black"}`}>
              {lookup?.active ? "Active" : "Deactive"}
            </span>
          </div>
          <div className="flex">
            <div className="text-base font-normal text-[#808080]">{lookup?.lookup_id}</div>
          </div>
        </div>
      }
      headerButtons={({ editButtonProps, refreshButtonProps }) =>
        getButtonProps(editButtonProps, refreshButtonProps)
      }
    >
      {isLoading ? <Loader /> :
        <div>
          <div className="px-12 grid grid-cols-3 gap-4 pb-8">
            <div className="">
              <div className="text-base font-semibold">Lookup Name</div>
              <div className="text-sm font-normal text-[#808080]">{lookup?.lookup_name}</div>
            </div>
            <div className="col-span-2">
              <div className="text-base font-semibold">Lookup Description</div>
              <div className="text-sm font-normal text-[#808080]">{lookup?.description}</div>
            </div>
          </div>
          <div className="bg-white">
            <GenericTable
              title="Lookup Codes"
              columns={columns}
              handleCreate={handleEditAdd}
              data={codes}
              addText={<div className="flex gap-2"><EditOutlinedIcon fontSize="small" /> {isEditMode ? "Add" : "Edit"}</div>}
              noSearchNeed={true}
              canCreate={true}
            />
            {isEditMode && (
              <div className="flex justify-end px-12 py-4 gap-2">
                <Button onClick={handleSave} variant="contained" sx={tableSaveButton}> Save</Button>
                <Button onClick={handleCancelEdit} variant="contained" sx={tableCancelButton}> Cancel</Button>
              </div>
            )}
          </div>
        </div>
      }
    </Show>
  );
};

export default Page;
