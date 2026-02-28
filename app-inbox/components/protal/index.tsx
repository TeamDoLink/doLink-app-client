import { useFocusEffect } from '@react-navigation/native';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';

interface PortalContextType {
  rootKey: string;
  components: Record<string, React.ReactNode>;
  register: (key: string, component: React.ReactNode) => void;
  unregister: (key: string) => void;
}
const PortalContext = createContext<PortalContextType>({
  rootKey: '',
  components: {},
  register: () => {},
  unregister: () => {},
});

export const PortalProvider = ({
  children,
  rootKey,
}: PropsWithChildren<{ rootKey: string }>) => {
  const [components, setComponents] = useState<Record<string, React.ReactNode>>(
    {},
  );
  const register = (key: string, component: React.ReactNode) => {
    setComponents((prev) => {
      return { ...prev, [key]: component };
    });
  };
  const unregister = (key: string) => {
    setComponents((prev) => {
      const { [key]: _, ...rest } = prev;
      return { ...rest };
    });
  };
  return (
    <PortalContext.Provider
      value={{ rootKey, components, register, unregister }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const PortalIn = ({
  portalKey,
  children,
}: {
  portalKey: string;
  children: React.ReactNode;
}) => {
  const { register, rootKey } = useContext(PortalContext);

  useFocusEffect(
    useCallback(() => {
      register(getPortalKey(rootKey, portalKey), children);
    }, [portalKey, children]),
  );

  return null;
};

export const PortalOut = ({ portalKey }: { portalKey: string }) => {
  const { components, rootKey } = useContext(PortalContext);

  return components[getPortalKey(rootKey, portalKey)];
};

const getPortalKey = (rootKey: string, key: string) => {
  return `${rootKey}:${key}`;
};
