import { RegisterTodoActions } from './copilotkit/action';
import TodoList from '@/components/TodoList';
import SidebarChat from '@/components/SidebarChat';

export default function Home() {
        return (
                <div className="flex h-screen overflow-hidden bg-black text-white">
                        <RegisterTodoActions />

                        <main className="flex-1 overflow-auto px-6 py-8 sm:px-12 sm:py-10">
                                <TodoList />
                        </main>

                        <SidebarChat />
                </div>
        );
}
