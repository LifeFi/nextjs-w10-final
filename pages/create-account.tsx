import { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { User } from "@prisma/client";
import useMutation from "@libs/useMutation";
import { useEffect } from "react";
import Layout from "@components/layout";
import { useSWRConfig } from "swr";

interface CreateAccountForm {
  username: string;
  password: string;
  password2: string;
}

interface CreateAccountMutationsResult {
  ok: boolean;
  user: User;
  error: string;
}

const CreateAccount: NextPage = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<CreateAccountForm>({
    mode: "onChange",
  });

  const [create, { loading, data }] =
    useMutation<CreateAccountMutationsResult>("/api/users/create");

  const onValid = ({ username, password, password2 }: CreateAccountForm) => {
    create({ username, password, password2 });
    console.log(username, password, password2);
  };
  console.log(data);

  useEffect(() => {
    if (!loading) {
      console.log(data);

      if (data?.ok) {
        mutate("/api/users/me");
        router.push("/");
      } else if (data?.error === "username exists") {
        setError(
          "username",
          { type: "isExistUsername", message: "이미 존재하는 아이디입니다." },
          { shouldFocus: true }
        );
      }
    }
  }, [data]);

  return (
    <Layout title="계정 생성" hasLeftSideTabBar canGoBack>
      <div className="w-full flex justify-center">
        <form
          onSubmit={handleSubmit(onValid)}
          className="flex flex-col w-80 text-sm"
        >
          <span className="text-red-600">{errors.username?.message}</span>

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

          <span className="text-red-600">{errors.password2?.message}</span>
          <input
            {...register("password2", {
              required: true,
              validate: {
                confirmPassword: (value) =>
                  value === watch("password") ||
                  "동일한 비밀번호를 입력해주세요.",
              },
            })}
            required
            name="password2"
            type="password"
            className="h-9 w-80 pl-1 my-2 border-[1px] rounded-sm focus:ring-2 appearance-none   focus:border-blue-400 focus:outline-none"
            placeholder="비밀번호 확인"
          />
          <input
            type="submit"
            value="계정 생성"
            className="border-2 rounded-full w-80 h-9 bg-black text-white text-sm my-3 cursor-pointer"
          />
        </form>
      </div>
    </Layout>
  );
};

export default CreateAccount;
