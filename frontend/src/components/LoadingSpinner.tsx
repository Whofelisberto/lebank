interface Props {
  fullPage?: boolean;
}

export default function LoadingSpinner({ fullPage }: Props) {
  const spinner = (
    <div className="flex items-center justify-center gap-2">
      <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      <span className="text-slate-500 text-sm">Carregando...</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
