import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { cls } from "../lib/util";
import { useForm } from "react-hook-form";
import { User } from "@prisma/client";
import useMutation from "../lib/useMutation";
import { useEffect } from "react";

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
  const [logout] = useMutation("/api/users/logout");

  const { register, handleSubmit } = useForm<CreateAccountForm>();

  const [create, { loading, data, error }] =
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
        router.push("/");
      }
    }
  }, [data]);

  return (
    <div>
      <h1>Create-Account</h1>
      <div className="flex">
        <div
          className={cls(
            router.pathname === "/log-in" ? "text-blue-500 font-bold" : ""
          )}
        >
          <Link href="/log-in">Log-In</Link>
        </div>
        <div
          className={cls(
            router.pathname === "/create-account"
              ? "text-blue-500 font-bold"
              : ""
          )}
        >
          <Link href="/create-account">Create-Account</Link>
        </div>
        <div
          className={cls(
            router.pathname === "/" ? "text-blue-500 font-bold" : ""
          )}
        >
          <Link href="/">Home</Link>
        </div>
        <button
          onClick={() => {
            logout({});
            console.log("Log-Out!");
            router.push("/log-in");
          }}
          type="button"
        >
          Log-Out
        </button>
      </div>
      <form onSubmit={handleSubmit(onValid)} className="flex flex-col w-60">
        <input
          {...register("username", { required: true })}
          required
          name="username"
          type="text"
          className="w-60 bg-slate-200"
          placeholder="username"
        />
        <input
          {...register("password", { required: true })}
          required
          name="password"
          type="password"
          className="w-60 bg-slate-200"
          placeholder="password"
        />
        <input
          {...register("password2", { required: true })}
          required
          name="password2"
          type="password"
          className="w-60 bg-slate-200"
          placeholder="Confirm Password"
        />
        <input type="submit" value="계정 생성" className="border-2 " />
      </form>
    </div>
  );
};

export default CreateAccount;
