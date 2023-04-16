import { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useMutation from "@libs/useMutation";
import { useEffect } from "react";
import Layout from "@components/layout";
import { useSWRConfig } from "swr";

interface LogInForm {
  username: string;
  password: string;
}

interface LogInMutationsResult {
  ok: boolean;
  error: string;
}

const LogIn: NextPage = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LogInForm>({ mode: "onChange" });

  const [enter, { loading, data }] =
    useMutation<LogInMutationsResult>("/api/users/enter");

  const onValid = ({ username, password }: LogInForm) => {
    enter({ username, password });
    console.log(username, password);
  };

  useEffect(() => {
    if (!loading) {
      console.log(data);
      if (data?.ok) {
        mutate("/api/users/me");
        router.push("/");
      } else if (data?.error === "Invalid username") {
        setError(
          "username",
          {
            type: "custom",
            message: "아이디를 확인해 주세요.",
          },
          { shouldFocus: true }
        );
      } else if (data?.error === "Invalid password") {
        setError(
          "password",
          {
            type: "custom",
            message: "비밀번호를 확인해 주세요.",
          },
          { shouldFocus: true }
        );
      }
    }
  }, [data]);

  return (
    <Layout title="로그인" hasLeftSideTabBar canGoBack>
      <div className="w-full flex justify-center">
        <form
          onSubmit={handleSubmit(onValid)}
          className="flex flex-col w-80 text-sm"
        >
          <input
            {...register("username", { required: true })}
            required
            name="username"
            type="text"
            className="h-9 w-80 pl-1 my-2 border-[1px] rounded-sm focus:ring-2 appearance-none   focus:border-blue-400 focus:outline-none"
            placeholder="아이디"
          />
          <input
            {...register("password", { required: true })}
            required
            name="password"
            type="password"
            className="h-9 w-80 pl-1 my-2 border-[1px] rounded-sm focus:ring-2 appearance-none   focus:border-blue-400 focus:outline-none"
            placeholder="비밀번호"
          />

          <span className="text-red-600 text-center">
            {errors?.username?.message}
            {errors?.password?.message}
          </span>

          <input
            type="submit"
            value="로그인"
            className="border-2 rounded-full w-80 h-9 bg-black text-white text-sm my-3 cursor-pointer"
          />
        </form>
      </div>
    </Layout>
  );
};

export default LogIn;
