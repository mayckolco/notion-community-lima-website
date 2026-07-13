interface CommunityLogoutButtonProps {
  className?: string;
}

export function CommunityLogoutButton({ className }: CommunityLogoutButtonProps) {
  return (
    <form action="/api/comunidad/auth/logout" method="POST">
      <button
        type="submit"
        className={
          className ??
          "inline-flex min-h-[44px] items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        }
      >
        Cerrar sesión
      </button>
    </form>
  );
}
