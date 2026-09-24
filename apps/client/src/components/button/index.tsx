interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = ({
  label,
  isLoading,
  loadingText = "Loading...",
  ...props
}: Props) => {
  return (
    <button
      type="submit"
      disabled={isLoading || props.disabled}
      className="w-full bg-ink text-paper py-2.5 rounded-lg font-medium transition-[background-color,transform] duration-150 ease-out hover:bg-terracotta active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100"
    >
      {isLoading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          {loadingText}
        </span>
      ) : (
        label
      )}
    </button>
  );
};

export default Button;
