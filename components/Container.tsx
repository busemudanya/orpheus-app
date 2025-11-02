import type { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  edges?: Edge[];
};

export const Container = ({
  children,
  className = '',
  edges = ['top', 'right', 'bottom', 'left'],
}: ContainerProps) => {
  return (
    <SafeAreaView edges={edges} className={`flex-1 ${className}`}>
      {children}
    </SafeAreaView>
  );
};
