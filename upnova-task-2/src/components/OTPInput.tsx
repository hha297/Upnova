import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LockIcon } from 'lucide-react';

const OTP_LENGTH = 6;

interface OTPInputProps {
        validateOTP?: (otp: string) => boolean;
        onComplete?: (otp: string) => void;
}

const OTPInput = ({ validateOTP, onComplete }: OTPInputProps) => {
        const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(''));
        const [activeIndex, setActiveIndex] = useState<number>(0);
        const [status, setStatus] = useState<'typing' | 'error' | 'success'>('typing');

        const inputRef = useRef<(HTMLInputElement | null)[]>([]);

        // Validation handler using useEffectEvent (React 19.2 best practice)
        // This ensures we always have the latest props without including them in dependencies
        const checkOTP = useEffectEvent((currentCode: string[]) => {
                // Only validate when all digits are filled
                if (!currentCode.every((digit) => digit !== '')) return;

                const otp = currentCode.join('');
                const isValid = validateOTP ? validateOTP(otp) : true;

                if (isValid) {
                        // Success: update status and call callback
                        setStatus('success');
                        onComplete?.(otp);
                } else {
                        // Error: trigger shake animation and reset after delay
                        setStatus('error');
                }
        });

        // Trigger validation when code changes
        useEffect(() => {
                checkOTP(code);
        }, [code]);

        // Reset handler for failed validation
        const resetInput = useEffectEvent(() => {
                setCode(Array(OTP_LENGTH).fill(''));
                setActiveIndex(0);
                setStatus('typing');
                // Focus first input after reset
                setTimeout(() => {
                        inputRef.current[0]?.focus();
                }, 100);
        });

        // Handle error state reset after animation
        useEffect(() => {
                if (status === 'error') {
                        const timer = setTimeout(() => {
                                resetInput();
                        }, 1000);
                        return () => clearTimeout(timer);
                }
        }, [status]);

        // Handle keyboard input
        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
                const value = e.key;

                // Handle numeric input
                if (/^[0-9]$/.test(value)) {
                        e.preventDefault();
                        const newCode = [...code];
                        newCode[idx] = value;
                        setCode(newCode);

                        // Move to next input if available
                        if (idx < OTP_LENGTH - 1) {
                                const nextIdx = idx + 1;
                                setActiveIndex(nextIdx);
                                // Use setTimeout to ensure state update completes before focusing
                                setTimeout(() => {
                                        inputRef.current[nextIdx]?.focus();
                                }, 0);
                        } else {
                                // Last input filled, blur to show completion
                                inputRef.current[idx]?.blur();
                        }
                        return;
                }

                // Handle backspace
                if (value === 'Backspace') {
                        e.preventDefault();
                        const newCode = [...code];

                        if (newCode[idx] !== '') {
                                // Clear current input
                                newCode[idx] = '';
                                setCode(newCode);
                        } else if (idx > 0) {
                                // Move to previous input and clear it
                                const prevIdx = idx - 1;
                                newCode[prevIdx] = '';
                                setCode(newCode);
                                setActiveIndex(prevIdx);
                                setTimeout(() => {
                                        inputRef.current[prevIdx]?.focus();
                                }, 0);
                        }
                        return;
                }

                // Handle arrow keys for navigation
                if (value === 'ArrowLeft' && idx > 0) {
                        e.preventDefault();
                        const prevIdx = idx - 1;
                        setActiveIndex(prevIdx);
                        inputRef.current[prevIdx]?.focus();
                        return;
                }

                if (value === 'ArrowRight' && idx < OTP_LENGTH - 1) {
                        e.preventDefault();
                        const nextIdx = idx + 1;
                        setActiveIndex(nextIdx);
                        inputRef.current[nextIdx]?.focus();
                        return;
                }

                // Prevent other keys
                if (!/^[0-9]$/.test(value) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(value)) {
                        e.preventDefault();
                }
        };

        // Handle input focus
        const handleFocus = (idx: number) => {
                setActiveIndex(idx);
        };

        // Handle paste event
        const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
                e.preventDefault();
                const pastedData = e.clipboardData.getData('text').slice(0, OTP_LENGTH);
                const digits = pastedData.match(/\d/g) || [];

                if (digits.length > 0) {
                        const newCode = [...code];
                        digits.forEach((digit, i) => {
                                if (i < OTP_LENGTH) {
                                        newCode[i] = digit;
                                }
                        });
                        setCode(newCode);

                        // Focus the last filled input or the last input
                        const lastFilledIdx = Math.min(digits.length - 1, OTP_LENGTH - 1);
                        setActiveIndex(lastFilledIdx);
                        setTimeout(() => {
                                inputRef.current[lastFilledIdx]?.focus();
                        }, 0);
                }
        };

        return (
                <div className="relative inline-block">
                        <AnimatePresence mode="wait">
                                {status !== 'success' ? (
                                        <motion.div
                                                key="otp-input"
                                                initial={{ opacity: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.3 }}
                                                className="relative"
                                        >
                                                {/* Digit input boxes */}
                                                <div className="flex gap-2">
                                                        {code.map((digit, idx) => (
                                                                <motion.div
                                                                        key={idx}
                                                                        className="relative w-12 h-16 rounded-lg border-2 flex items-center justify-center overflow-hidden "
                                                                        animate={{
                                                                                borderColor:
                                                                                        status === 'error'
                                                                                                ? '#ef4444'
                                                                                                : idx === activeIndex
                                                                                                ? '#3b82f6'
                                                                                                : '#e5e7eb',
                                                                                x:
                                                                                        status === 'error'
                                                                                                ? [0, -6, 6, -6, 6, 0]
                                                                                                : 0,
                                                                        }}
                                                                        transition={{
                                                                                borderColor: { duration: 0.2 },
                                                                                x: { duration: 0.3 },
                                                                        }}
                                                                >
                                                                        {/* Placeholder "0" - shown when input is empty */}
                                                                        {!digit && (
                                                                                <span className="absolute text-2xl opacity-10 pointer-events-none select-none">
                                                                                        0
                                                                                </span>
                                                                        )}

                                                                        {/* Actual digit with fade-in animation */}
                                                                        <AnimatePresence mode="wait">
                                                                                {digit && (
                                                                                        <motion.span
                                                                                                key={digit}
                                                                                                className="relative text-2xl font-bold3 z-10"
                                                                                                initial={{
                                                                                                        opacity: 0,
                                                                                                        y: 12,
                                                                                                }}
                                                                                                animate={{
                                                                                                        opacity: 1,
                                                                                                        y: 0,
                                                                                                }}
                                                                                                exit={{
                                                                                                        opacity: 0,
                                                                                                        y: -12,
                                                                                                }}
                                                                                                transition={{
                                                                                                        duration: 0.2,
                                                                                                }}
                                                                                        >
                                                                                                {digit}
                                                                                        </motion.span>
                                                                                )}
                                                                        </AnimatePresence>

                                                                        {/* Hidden input for keyboard events */}
                                                                        <input
                                                                                ref={(el) => {
                                                                                        inputRef.current[idx] = el;
                                                                                }}
                                                                                type="text"
                                                                                inputMode="numeric"
                                                                                maxLength={1}
                                                                                value={digit}
                                                                                className="absolute inset-0 w-full h-full opacity-0 outline-none caret-transparent cursor-pointer"
                                                                                onKeyDown={(e) => handleKeyDown(e, idx)}
                                                                                onFocus={() => handleFocus(idx)}
                                                                                onPaste={handlePaste}
                                                                                autoComplete="off"
                                                                                autoFocus={
                                                                                        idx === 0 &&
                                                                                        code.every((d) => d === '')
                                                                                }
                                                                        />
                                                                </motion.div>
                                                        ))}
                                                </div>

                                                {/* Moving outline indicator */}
                                                <motion.div
                                                        className="absolute top-0 pointer-events-none w-12 h-16 rounded-lg border-2 border-blue-500"
                                                        animate={{
                                                                x: activeIndex * (48 + 8),
                                                                opacity: status === 'error' ? 0 : 1,
                                                        }}
                                                        transition={{
                                                                x: { type: 'spring', stiffness: 300, damping: 30 },
                                                                opacity: { duration: 0.2 },
                                                        }}
                                                />
                                        </motion.div>
                                ) : (
                                        <motion.div
                                                key="otp-success"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.4 }}
                                                className="flex items-center justify-center"
                                        >
                                                {/* Success lock icon with bounce animation */}
                                                <motion.div
                                                        className="rounded-full bg-green-500 text-white w-16 h-16 flex items-center justify-center shadow-lg"
                                                        animate={{
                                                                scale: [1, 1.1, 1],
                                                                rotate: [0, 5, -5, 0],
                                                        }}
                                                        transition={{
                                                                scale: {
                                                                        duration: 0.6,
                                                                        repeat: Infinity,
                                                                        repeatType: 'reverse',
                                                                        ease: 'easeInOut',
                                                                },
                                                                rotate: {
                                                                        duration: 0.6,
                                                                        repeat: Infinity,
                                                                        repeatType: 'reverse',
                                                                        ease: 'easeInOut',
                                                                },
                                                        }}
                                                >
                                                        <LockIcon size={28} />
                                                </motion.div>
                                        </motion.div>
                                )}
                        </AnimatePresence>
                </div>
        );
};

export default OTPInput;
