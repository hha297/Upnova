'use client';

import { useTodoStore } from '@/app/lib/todoStore';
import { useMemo, useState } from 'react';

const TodoList = () => {
        const { todos, addTodo, removeTodo, editTodo, toggleTodo } = useTodoStore();
        const [text, setText] = useState('');

        const sortedTodos = useMemo(
                () =>
                        [...todos].sort((a, b) => {
                                if (a.completed === b.completed) {
                                        return (b.createdAt ?? 0) - (a.createdAt ?? 0);
                                }
                                return Number(a.completed) - Number(b.completed);
                        }),
                [todos],
        );

        const handleAdd = () => {
                if (!text.trim()) return;
                addTodo(text.trim());
                setText('');
        };

        return (
                <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 text-white">
                        <header className="space-y-2">
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">Today</p>
                                <h1 className="text-3xl font-semibold text-white">Workspace Tasks</h1>
                                <p className="text-base text-white/60">
                                        Capture your next actions, track progress, and let Copilot keep you moving
                                        forward.
                                </p>
                        </header>

                        <div className="rounded-3xl border border-white/10 bg-white/5/5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                                {/* Add Todo */}
                                <div className="space-y-4 border-b border-white/10 p-6">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                                <div className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 shadow-inner shadow-black/20 transition focus-within:border-blue-400/60 focus-within:shadow-blue-500/20">
                                                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/60">
                                                                Add Task
                                                        </label>
                                                        <input
                                                                type="text"
                                                                value={text}
                                                                onChange={(e) => setText(e.target.value)}
                                                                placeholder="Describe what you want to accomplish..."
                                                                className="w-full border-none bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none focus:ring-0"
                                                        />
                                                </div>
                                                <button
                                                        onClick={handleAdd}
                                                        disabled={!text.trim()}
                                                        className="h-14 rounded-2xl bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 px-8 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:translate-y-px hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                        Add Todo
                                                </button>
                                        </div>
                                </div>

                                {/* Todo Items */}
                                <div className="max-h-[calc(100vh-280px)] overflow-auto px-4 py-6 sm:px-6">
                                        {sortedTodos.length === 0 ? (
                                                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center">
                                                        <p className="text-lg font-semibold text-white">No todos yet</p>
                                                        <p className="mt-2 text-sm text-white/60">
                                                                Start by adding a task above or ask Copilot to generate
                                                                one for you.
                                                        </p>
                                                </div>
                                        ) : (
                                                <ul className="space-y-3">
                                                        {sortedTodos.map((todo) => {
                                                                const isDone = todo.completed;
                                                                return (
                                                                        <li
                                                                                key={todo.id}
                                                                                className={`group flex items-center gap-4 rounded-2xl border px-4 py-4 shadow-inner shadow-black/30 transition duration-300 ${
                                                                                        isDone
                                                                                                ? 'border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-400/70 hover:bg-emerald-500/10 scale-[0.99]'
                                                                                                : 'border-white/10 bg-black/40 hover:border-blue-400/40 hover:bg-black/30'
                                                                                }`}
                                                                        >
                                                                                <input
                                                                                        type="checkbox"
                                                                                        checked={isDone}
                                                                                        onChange={() =>
                                                                                                toggleTodo(todo.id)
                                                                                        }
                                                                                        className={`h-5 w-5 rounded-lg border text-blue-500 transition focus:ring-2 focus:ring-blue-500/40 ${
                                                                                                isDone
                                                                                                        ? 'border-emerald-400 bg-emerald-500/40'
                                                                                                        : 'border-white/30 bg-black/70'
                                                                                        }`}
                                                                                />
                                                                                <input
                                                                                        type="text"
                                                                                        value={todo.text}
                                                                                        onChange={(e) =>
                                                                                                editTodo(
                                                                                                        todo.id,
                                                                                                        e.target.value,
                                                                                                )
                                                                                        }
                                                                                        disabled={isDone}
                                                                                        className={`flex-1 rounded-xl border border-transparent bg-transparent px-3 py-2 text-base font-medium text-white placeholder:text-white/40 transition duration-300 focus:border-blue-400 focus:bg-white/5 focus:outline-none ${
                                                                                                isDone
                                                                                                        ? 'pointer-events-none cursor-not-allowed text-white/40 line-through'
                                                                                                        : ''
                                                                                        }`}
                                                                                />
                                                                                <button
                                                                                        onClick={() =>
                                                                                                removeTodo(todo.id)
                                                                                        }
                                                                                        disabled={isDone}
                                                                                        className={`rounded-xl border px-4 py-2 text-sm font-medium transition duration-300 ${
                                                                                                isDone
                                                                                                        ? 'cursor-not-allowed border-white/10 bg-white/5 text-white/30'
                                                                                                        : 'border-red-500/40 bg-red-500/20 text-red-100 hover:bg-red-500/30 hover:text-white'
                                                                                        }`}
                                                                                >
                                                                                        Remove
                                                                                </button>
                                                                        </li>
                                                                );
                                                        })}
                                                </ul>
                                        )}
                                </div>
                        </div>
                </section>
        );
};

export default TodoList;
