"use client";

import React from "react";
import Link from "next/link";
import { useGetIdentity, useLogin } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import EmailIcon from "@/assets/icons/email.svg?icon";
import PasswordIcon from "@/assets/icons/password.svg?icon";
import { Button } from "@mui/base";
import FormControlWrapper from "@components/Forms/FormControlWrapper";
import GeneralInput from "@components/Input/GeneralInput";
import { User } from "../../../types/types";
import { useNavigation } from "@refinedev/core";
import Loader from "@components/common/Loader";

interface FormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { push } = useNavigation();

  const { data: identity, isLoading } = useGetIdentity<User>();
  if (identity) {
    push("/dashboard");
  }
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    reValidateMode: "onSubmit"
  });
  const { mutate: login, isLoading: isLoginLoading } = useLogin<FormData>();
  const onSubmit = (data: any) => {
    const loginForm = data as FormData;
    login({
      ...loginForm,
    });
  };

  return (
    <div className="bg-[#f7f9fa] flex justify-center items-center min-h-screen py-10">
      {isLoading || isLoginLoading ? (
        <Loader />
      ) : (
        <div className="min-w-[480px] rounded-xl border border-stroke bg-white shadow-default">
          <div className="flex flex-wrap items-center">
            <div className="w-full border-stroke dark:border-strokedark">
              <div className="w-full p-8">
                <div className="flex justify-between items-center mb-9">
                  <h2 className="text-2xl font-bold text-black">Sign In</h2>
                  <Link
                    href={"/auth/signin-superuser"}
                    className="text-sm text-primary font-medium"
                  >
                    Login as super user
                  </Link>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col space-y-4">
                    <FormControlWrapper
                      name="email"
                      control={control}
                      rules={{
                        required: "Please enter your email!",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                          message: "Please enter a valid email address!",
                        },
                      }}
                      error={errors.email?.message?.toString()}
                    >
                      {(field) => (
                        <GeneralInput
                          {...field}
                          type={"text"}
                          label="Email address"
                          placeholder="Enter your email"
                          required={true}
                          disabled={false}
                          icon={<EmailIcon className="fill-current" />}
                        />
                      )}
                    </FormControlWrapper>
                    <FormControlWrapper
                      name="password"
                      control={control}
                      rules={{ required: "Please enter your password!" }}
                      error={errors.password?.message?.toString()}
                    >
                      {(field) => (
                        <GeneralInput
                          {...field}
                          type={"password"}
                          label="Password"
                          placeholder="Enter your password"
                          disabled={false}
                          required={true}
                          icon={<PasswordIcon className="fill-current" />}
                        />
                      )}
                    </FormControlWrapper>
                    <Link
                      href={"/auth/forgot-password"}
                      className="text-sm text-primary font-medium text-right"
                    >
                      Forgot password?
                    </Link>
                    <Button
                      type="submit"
                      className="text-center w-full block mb-5 cursor-pointer rounded-lg border border-primary bg-primary p-2 text-white transition hover:bg-opacity-90"
                    >
                      Sign in
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SignIn;
