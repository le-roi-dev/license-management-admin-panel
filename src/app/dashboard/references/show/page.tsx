"use client";

import { Reference, ReferenceCode } from "@/types/types";
import Loader from "@components/common/Loader";
import ReferenceCodeDetailDrawer from "@components/References/ReferenceCodeDetailDrawer";
import ReferenceDetailDrawer from "@components/References/ReferenceDetailDrawer";
import GenericTable from "@components/Table/GenericTable";
import { editRefineBtnStyle, refreshRefineBtnStyle } from "@data/MuiStyles";
import {
  useDelete,
  useNavigation,
  useParsed,
  usePermissions,
  useShow,
  useTable,
} from "@refinedev/core";
import { EditButton, RefreshButton, Show } from "@refinedev/mui";
import {
  convertSortingStateToCrudSort,
  getFormattedDate,
} from "@utils/utilFunctions";
import { MRT_ColumnDef, MRT_SortingState } from "material-react-table";
import { useMemo, useState } from "react";

const Page = () => {
  const { params } = useParsed();

  const { queryResult } = useShow<Reference>({
    resource: "references",
    id: params?.id,
  });
  const { data, isLoading } = queryResult;

  const {
    tableQueryResult: { data: codeData, isLoading: codeIsLoading, refetch },
    setCurrent,
    setFilters,
    setSorters,
  } = useTable<ReferenceCode>({
    resource: `references/${params?.id}/codes`,
  });
  const reference: Reference = data?.data as Reference;

  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [clickedReferenceCode, setClickedReferenceCode] =
    useState<ReferenceCode | null>(null);

  const handleCreate = () => {
    // setOpenDrawer(true);
    push(
      `/dashboard/references/codes/create?id=${params?.id}&reference_name=${reference?.reference_name}`
    );
  };

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleEditClick = (row: ReferenceCode) => {
    // setClickedReferenceCode(row);
    // setOpenDrawer(true);
    push(
      `/dashboard/references/codes/edit?reference_id=${params?.id}&code_id=${row.reference_code_id}`
    );
  };

  const handleClose = () => {
    refetch();
    setClickedReferenceCode(null);
    setOpenDrawer(false);
  };

  const handleSearch = (value: string) =>
    setFilters([{ field: "searchKey", operator: "contains", value: value }]);

  const handleSorting = (sorting: MRT_SortingState) =>
    setSorters(convertSortingStateToCrudSort(sorting));

  const handlePage = (value: number) => setCurrent(value);

  const { push } = useNavigation();

  const getButtonProps = (editButtonProps: any, refreshButtonProps: any) => {
    return (
      <div className="flex gap-2 px-12">
        <EditButton
          {...editButtonProps}
          onClick={() => push(`/dashboard/references/edit?id=${params?.id}`)}
          sx={editRefineBtnStyle}
        />
        <RefreshButton {...refreshButtonProps} sx={refreshRefineBtnStyle} />
      </div>
    );
  };

  // const { mutate: deleteReferenceCode } = useDelete();

  // const handleDeleteBtn = (ReferenceCode: ReferenceCode) => {
  //   handleOpenDeleteModal();
  //   setClickedReferenceCode(ReferenceCode);
  // }

  // const handleDelete = () => {
  //   deleteReferenceCode(
  //     { resource: "ReferenceCodes", id: `${(clickedReferenceCode?.ReferenceCode_id)}` },
  //     {
  //       onError: (error) => { console.log(error); },
  //       onSuccess: () => { console.log("Success"); },
  //     }
  //   )
  //   handleCloseDeleteModal();
  // }

  const columns = useMemo<MRT_ColumnDef<ReferenceCode>[]>(
    () => [
      {
        accessorKey: "reference_code",
        header: "Code",
        size: 200,
      },
      {
        accessorKey: "product_part_number",
        header: "Product Part Number",
        size: 200,
      },
      {
        accessorKey: "product_part_id",
        header: "Product Part ID",
      },
      {
        accessorKey: "osc_product.product_part_number",
        header: "Software Part",
      },
      {
        accessorKey: "osc_product.vendor_part_number",
        header: "Vender Part",
      },
      {
        accessorKey: "osc_product.vendor_name",
        header: "Vender Name",
      },
      {
        accessorKey: "transaction_line_id",
        header: "Transaction Line ID",
      },
      {
        accessorKey: "transaction.transaction_date",
        header: "Transaction Date",
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 50,
        Cell: ({ renderedCellValue }) => {
          return (
            <div
              className={`mx-2 px-4 py-1 rounded-full text-xs ${renderedCellValue == "Active" ? "bg-[#11ba82] text-white" : "bg-[#c2c2c2] text-black"}`}
            >
              {renderedCellValue}
            </div>
          );
        },
      },
      {
        accessorKey: "active",
        header: "Active",
        size: 50,
        Cell: ({ renderedCellValue }) => {
          return (
            <div
              className={`mx-2 px-4 py-1 rounded-full text-xs ${renderedCellValue ? "bg-[#11ba82] text-white" : "bg-[#c2c2c2] text-black"}`}
            >
              {renderedCellValue ? "Active" : "Inactive"}
            </div>
          );
        },
      },
    ],
    []
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
        <div className="px-8 pt-6 !font-satoshi text-2xl font-semibold text-[#1f325c] gap-2">
          <div className="flex gap-2 items-end gap-6">
            <div className="">Reference </div>
            <div className="text-lg font-normal">
              {reference?.reference_name}
            </div>

            <span
              className={`mx-2 px-4 py-1 rounded-full text-xs text-white ${reference?.reference_type == "Unique" ? "bg-[#fac107]" : "bg-[#11ba82]"}`}
            >
              {reference?.reference_type}
            </span>
            <span
              className={`mx-2 px-4 py-1 rounded-full text-xs ${reference?.active ? "bg-[#11ba82] text-white" : "bg-[#c2c2c2] text-black"}`}
            >
              {reference?.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      }
      headerButtons={({ editButtonProps, refreshButtonProps }) =>
        getButtonProps(editButtonProps, refreshButtonProps)
      }
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="px-12 flex gap-8 pt-4 pb-12">
            <div className="">
              <div className="text-[#778599]">Reference Name</div>
              <div className="text-[#515f72] text-xl font-semibold">
                {reference?.reference_name}
              </div>
            </div>
            <div className="">
              <div className="text-[#778599]">Start Date</div>
              <div className="text-[#515f72] text-xl font-semibold">
                {getFormattedDate(reference?.start_date)}
              </div>
            </div>
            <div className="">
              <div className="text-[#778599]">End Date</div>
              <div className="text-[#515f72] text-xl font-semibold">
                {getFormattedDate(reference?.end_date)}
              </div>
            </div>

            <div className="">
              <div className="text-[#778599]">Reference Description</div>
              <div className="text-[#515f72] text-xl font-semibold">
                {reference?.reference_description}
              </div>
            </div>
          </div>
          <div className="bg-white">
            <GenericTable
              title={
                <div className="!font-satoshi px-12 py-4 text-2xl font-semibold text-[#1f325c] flex items-center gap-2">
                  Reference Codes
                </div>
              }
              columns={columns}
              handleCreate={handleCreate}
              data={codeData?.data}
              totalCount={codeData?.total}
              onRowClick={handleEditClick}
              handlePage={handlePage}
              handleSorting={handleSorting}
              handleSearch={handleSearch}
              canCreate={true}
            />
          </div>
        </div>
      )}
    </Show>
  );
};

export default Page;
