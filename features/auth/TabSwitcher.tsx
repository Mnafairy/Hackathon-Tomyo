'use client';

type Tab = 'signin' | 'signup';

interface TabSwitcherProps {
  tab: Tab;
  setTab: (tab: Tab) => void;
  setError: (error: string) => void;
}

export const TabSwitcher = ({ tab, setTab, setError }: TabSwitcherProps) => {
  return (
    <div className="mb-6 flex rounded-lg border border-border bg-muted p-1">
      <button
        type="button"
        onClick={() => {
          setTab('signin');
          setError('');
        }}
        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          tab === 'signin'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Нэвтрэх
      </button>
      <button
        type="button"
        onClick={() => {
          setTab('signup');
          setError('');
        }}
        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          tab === 'signup'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Бүртгүүлэх
      </button>
    </div>
  );
};
