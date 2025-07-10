import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = (props) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="top-right"
      richColors
      visibleToasts={1} // Limit to 1 toast visible at a time
      toastOptions={{
        style: { margin: "12px 0" }, // Adds spacing between toasts
        classNames: {
          toast:
            "group group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border shadow-xl rounded-lg px-4 py-3 transition-all duration-300",
          description:
            "group-[.toast]:text-muted-foreground text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium hover:opacity-90 transition",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground hover:opacity-80 transition",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
