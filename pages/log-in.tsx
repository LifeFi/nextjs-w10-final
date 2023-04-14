import { NextPage } from "next";
import Link from "next/link";
import { cls } from "../lib/util";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useMutation from "../lib/useMutation";
import { useEffect } from "react";

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
  const [logout] = useMutation("/api/users/logout");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LogInForm>();

  const [enter, { loading, data, error }] =
    useMutation<LogInMutationsResult>("/api/users/enter");

  const onValid = ({ username, password }: LogInForm) => {
    enter({ username, password });
    console.log(username, password);
  };

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
      <h1>Log-In</h1>
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

        <input type="submit" value="Log-In" className="border-2 " />
      </form>
    </div>
  );
};

export default LogIn;
