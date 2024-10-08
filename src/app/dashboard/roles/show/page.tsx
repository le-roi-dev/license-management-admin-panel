"use client";

import { Role } from "@/types/types";
import RoleDetailPanel from "@components/Role/RoleDetailPanel";
import Loader from "@components/common/Loader";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useEffect } from "react";

const Item = () => {
  const { params } = useParsed();
  const {
    refineCore: { formLoading, queryResult },
    reset,
    formState: { errors },
  } = useForm<Role>({
    mode: "onChange",
    reValidateMode: "onSubmit",
    refineCoreProps: {
      action: "edit",
      resource: "roles",
      id: params?.id,
    },
  });

  const role: Role = queryResult?.data?.data as Role;

  useEffect(() => {
    if (!formLoading && role) {
      reset({ ...role });
    }
  }, [formLoading, role]);

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-2/3">
        {formLoading ? (
          <Loader />
        ) : (
          <RoleDetailPanel role={role} isShow={true} />
        )}
      </div>
    </div>
  );
};

export default Item;
