import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../contexts/auth";
import { loginSchema, type LoginFormValues } from "./utils/loginSchema";
import { useLogin } from "../../../hooks/apis/auth";
import { Path } from "../../../navigations/routes";
import FormInput from "../../../components/formInput";
import Button from "../../../components/button";
import { toast } from "../../../components/toast";

const Login = () => {
  const { handleLoginSuccess } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const { mutateAsync, isPending } = useLogin();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await mutateAsync(data);

      handleLoginSuccess(response?.token);
      navigate(Path.Boards);
    } catch (error: any) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="mb-8 animate-fade-up" style={{ animationDelay: "0ms" }}>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">
          Good to see you again
        </h1>
        <div className="mt-3 h-[3px] w-8 bg-terracotta" />
        <p className="mt-4 text-sm text-clay">
          Enter your email and password to get back to your boards.
        </p>
      </div>

      <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
        <FormInput
          label="Email"
          {...register("email")}
          type="email"
          errorMessage={errors.email?.message}
        />
      </div>
      <div className="animate-fade-up" style={{ animationDelay: "110ms" }}>
        <FormInput
          label="Password"
          {...register("password")}
          type="password"
          errorMessage={errors.password?.message}
        />
      </div>

      <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
        <Button label="Log in" isLoading={isPending} />
      </div>

      <p
        className="animate-fade-up text-sm text-clay"
        style={{ animationDelay: "210ms" }}
      >
        New here?{" "}
        <Link to="/signup" className="text-ink font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
};

export default Login;
