import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../contexts/auth";
import { signupSchema, type SignupFormValues } from "./utils/signupSchema";
import { useSignup } from "../../../hooks/apis/auth";
import { Path } from "../../../navigations/routes";
import FormInput from "../../../components/formInput";
import Button from "../../../components/button";
import { toast } from "../../../components/toast";

const Signup = () => {
  const { handleLoginSuccess } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  const { mutateAsync, isPending } = useSignup();

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const response = await mutateAsync(data);

      handleLoginSuccess(response?.token);
      navigate(Path.Boards);
    } catch (error) {
      toast.error("Couldn't create your account", {
        description: "Something went wrong. Give it another try.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="mb-8 animate-fade-up" style={{ animationDelay: "0ms" }}>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">
          Set up your board
        </h1>
        <div className="mt-3 h-[3px] w-8 bg-terracotta" />
        <p className="mt-4 text-sm text-clay">
          A couple of details and you're moving cards.
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
        <Button label="Create account" isLoading={isPending} />
      </div>

      <p
        className="animate-fade-up text-sm text-clay"
        style={{ animationDelay: "210ms" }}
      >
        Already have one?{" "}
        <Link to={Path.Login} className="text-ink font-medium hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
};

export default Signup;
