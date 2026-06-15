'use client';

import { usePathname } from 'next/navigation';
import { useContext, useEffect } from 'react';

import { SocketContext } from './SocketContext';

type IEventProps = {
  event: string;
  handler: (data: any) => void;
  handleRouterChange?: boolean;
};

export function Event({ event, handler, handleRouterChange = false }: IEventProps) {
  const pathname = usePathname();
  const { getSocket, socketStatus, connected } = useContext(SocketContext);

  const handleOffSocket = () => {
    const socket = getSocket();
    socket?.off(event, handler);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    if (!connected()) {
      handleOffSocket();
      return undefined;
    }

    const socket = getSocket();
    if (handleRouterChange) {
      socket?.on(event, handler);
    } else {
      socket?.on(event, handler);
    }

    return handleOffSocket;
  }, [socketStatus, connected, getSocket, event, handler, handleRouterChange, pathname]);

  if (typeof window === 'undefined') return null;

  return null;
}

export default Event;
