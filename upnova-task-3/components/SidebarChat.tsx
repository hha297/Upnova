'use client';
import { CopilotSidebar } from '@copilotkit/react-ui';
import React from 'react';

const SidebarChat = () => {
        return (
                <aside className="h-full px-2 py-4 backdrop-blur-lg">
                        <CopilotSidebar
                                defaultOpen={true}
                                instructions="You are a helpful assistant for managing todos. You can add, remove, edit, and list todos."
                        />
                </aside>
        );
};

export default SidebarChat;
