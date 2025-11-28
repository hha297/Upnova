'use client';

import { CopilotKit } from '@copilotkit/react-core';
import { ReactNode } from 'react';

interface CopilotProviderProps {
        children: ReactNode;
}

export function CopilotProvider({ children }: CopilotProviderProps) {
        return <CopilotKit publicApiKey="ck_pub_b29545ff8aacdb944debe2c17dff9c2c">{children}</CopilotKit>;
}
