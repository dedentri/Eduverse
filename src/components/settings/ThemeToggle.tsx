
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Toggle } from '@/components/ui/toggle';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Sun className="h-4 w-4 text-orange-500" />
        <Label htmlFor="theme-toggle">Dark Mode</Label>
        <Moon className="h-4 w-4 text-blue-500" />
      </div>
      <Switch
        id="theme-toggle"
        checked={isDark}
        onCheckedChange={toggleTheme}
      />
    </div>
  );
};
