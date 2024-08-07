"use client";

import { useShow } from "@refinedev/core";
import Link from "next/link";
import GeneralInformation from "@components/common/View/GeneralInformation";
import { Permission, Transaction } from "@/types/types";
import ArrowIcon from "@/assets/icons/arrow.svg?icon";
import { TxtActionColor, TxtStatusColor, TxtTypeColor } from "@data/ColorData";
import { Box, Button } from "@mui/material";
import { deleteRefineBtnStyle, editRefineBtnStyle, modalOkBtnStyle, refineBtnStyle, refreshRefineBtnStyle, tagStyle } from "@data/MuiStyles";
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import DatasetOutlinedIcon from '@mui/icons-material/DatasetOutlined';
import {
  Show,
  EditButton,
  DeleteButton,
  RefreshButton,
} from "@refinedev/mui";
import { usePermissions } from "@refinedev/core";
import { useState } from "react";
import { CustomTabPanel, StyledTab, StyledTabs } from "@components/Tab/CustomizedTab";

const TransactionShow = () => {

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { queryResult } = useShow<Transaction>();
  const { data, isLoading } = queryResult;
  const { data: permissionsData } = usePermissions<Permission>({ params: { codename: "transaction" } });

  const transaction = data?.data;

  return (
    <div className="no-padding-card">
      <Show
        goBack={null}
        isLoading={isLoading}
        breadcrumb={false}
        wrapperProps={{ className: "rounded-none bg-[#f2f6fa] shadow-none pt-6 pb-2.5" }}
        title={
          <div className="!font-satoshi text-2xl font-semibold text-[#515f72] flex items-center px-12">
            Transaction {transaction?.transaction_number}
          </div>
        }
        headerButtons={({
          deleteButtonProps,
          editButtonProps,
        }) => (
          <div className="flex gap-2 px-12">
            {permissionsData?.update && <EditButton {...editButtonProps} sx={editRefineBtnStyle} />}
            {permissionsData?.delete && <DeleteButton {...deleteButtonProps} sx={deleteRefineBtnStyle} />}
          </div>
        )}
      >
        <div className="">
          <div className="px-12 pt-4">
            <StyledTabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <StyledTab label="Transaction Information" />
              <StyledTab label="Asset Status" />
            </StyledTabs>
          </div>
        </div>
        <CustomTabPanel value={value} index={0}>
          <GeneralInformation
            singleColumn
            items={[
              {
                label: "Transaction date",
                value: transaction?.transaction_date,
              },
              {
                label: "Transaction source",
                value: transaction?.transaction_source,
              },
              {
                label: "Transaction type",
                value: (
                  <Box component="span" sx={{ backgroundColor: TxtTypeColor[transaction?.transaction_type as string], ...tagStyle }} >
                    {transaction?.transaction_type}
                  </Box>
                )
              },
              {
                label: "Transaction action",
                value: (
                  <Box component="span" sx={{ backgroundColor: TxtActionColor[transaction?.transaction_action as string], ...tagStyle }} >
                    {transaction?.transaction_action}
                  </Box>
                )
              },
              {
                label: "Transaction status",
                value: (
                  <Box component="span" sx={{ backgroundColor: TxtStatusColor[transaction?.transaction_status as string], ...tagStyle }} >
                    {transaction?.transaction_status}
                  </Box>
                )
              },
              {
                label: "Transaction quantity (seats)",
                value: transaction?.quantity,
              },
              {
                label: "UOM (Duration / Each)",
                value: transaction?.osc_product?.duration,
              },
              {
                label: "Source ref number",
                value: transaction?.source_reference_number,
              },
              {
                label: "Source ref date",
                value: transaction?.source_reference_date,
              },
              {
                label: "Notificate date",
                value: transaction?.notification_date,
              },
              {
                label: "Error message",
                value: transaction?.error_message,
              },
              {
                label: "Asset number",
                value: transaction?.asset?.license_key,
              },
              {
                label: "Product part number",
                value: transaction?.osc_product?.osc_part_number,
              },
              {
                label: "Asset type",
                value: transaction?.osc_product?.product_type,
              },
              {
                label: "Vendor name",
                value: transaction?.osc_product?.vendor_name,
              },
              {
                label: "Vendor part number",
                value: transaction?.osc_product?.vendor_part_number,
              },
              {
                label: "Reference code",
                value: transaction?.reference_code,
              },
              {
                label: "Start date",
                value: transaction?.start_date,
              },
              {
                label: "End date",
                value: transaction?.end_date,
              },
            ]}
          ></GeneralInformation>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <GeneralInformation
            singleColumn
            items={[
              {
                label: "Asset ID",
                value: transaction?.asset?.id,
              },
              {
                label: "Asset number (License Key / Serial Number)",
                value: transaction?.asset?.license_key,
              },
              {
                label: "Active",
                value: <div className={`w-4 h-4 rounded-full ${transaction?.asset?.active ? 'bg-active' : 'bg-inactive'}`}></div>
              },
              {
                label: "Product part number",
                value: transaction?.osc_product?.osc_part_number,
              },
              {
                label: "Vendor part number",
                value: transaction?.osc_product?.vendor_part_number,
              },
              {
                label: "Seats",
                value: transaction?.asset?.osc_seat_count,
              },
              {
                label: "Duration",
                value: transaction?.osc_product?.duration,
              },
              {
                label: "Start date",
                value: transaction?.asset?.start_date,
              },
              {
                label: "End date",
                value: transaction?.asset?.end_date,
              },
            ]}
          >
          </GeneralInformation>
        </CustomTabPanel>
      </Show>
    </div>
  );
};

export default TransactionShow;
